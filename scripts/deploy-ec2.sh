#!/usr/bin/env bash
# Run on the primary EC2 instance during CI/CD (or manually after SSH).
# Syncs Study Planner app files to this host and all healthy ALB targets.
set -euo pipefail

REGION="${AWS_REGION:-us-east-1}"
TARGET_GROUP_NAME="${TARGET_GROUP_NAME:-capstone-web-tg}"
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-E17IY3DHLJ70BV}"
REPO_DIR="${REPO_DIR:-/home/ec2-user/aws-capstone-project}"
WEB_ROOT="${WEB_ROOT:-/var/www/study-planner}"

deploy_instance() {
  cd "$REPO_DIR"
  git pull origin main
  sudo cp -r app/* "$WEB_ROOT/"
  sudo cp nginx/study-planner.conf /etc/nginx/conf.d/study-planner.conf
  sudo chown -R nginx:nginx "$WEB_ROOT"
  sudo nginx -t
  sudo systemctl reload nginx
}

echo "Deploying Study Planner to local instance..."
deploy_instance

MY_ID="$(curl -sf http://169.254.169.254/latest/meta-data/instance-id || true)"
TG_ARN="$(aws elbv2 describe-target-groups \
  --region "$REGION" \
  --names "$TARGET_GROUP_NAME" \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text 2>/dev/null || true)"

if [ -n "${TG_ARN:-}" ] && [ "$TG_ARN" != "None" ]; then
  TARGETS="$(aws elbv2 describe-target-health \
    --region "$REGION" \
    --target-group-arn "$TG_ARN" \
    --query 'TargetHealthDescriptions[?TargetHealth.State==`healthy`].Target.Id' \
    --output text 2>/dev/null || true)"

  for INSTANCE_ID in $TARGETS; do
    if [ "$INSTANCE_ID" = "$MY_ID" ]; then
      continue
    fi
    echo "Sending deploy to peer instance $INSTANCE_ID via SSM..."
    if aws ssm send-command \
      --region "$REGION" \
      --instance-ids "$INSTANCE_ID" \
      --document-name "AWS-RunShellScript" \
      --comment "Study Planner deploy" \
      --parameters commands="[
        \"cd $REPO_DIR && git pull origin main\",
        \"sudo cp -r $REPO_DIR/app/* $WEB_ROOT/\",
        \"sudo cp $REPO_DIR/nginx/study-planner.conf /etc/nginx/conf.d/study-planner.conf\",
        \"sudo chown -R nginx:nginx $WEB_ROOT\",
        \"sudo nginx -t && sudo systemctl reload nginx\"
      ]" \
      --output text --query 'Command.CommandId' >/dev/null 2>&1; then
      echo "SSM deploy queued for $INSTANCE_ID"
    else
      echo "Warning: SSM deploy failed for $INSTANCE_ID (check instance profile / SSM agent)"
    fi
  done
else
  echo "Warning: Could not resolve target group $TARGET_GROUP_NAME — local deploy only"
fi

echo "Invalidating CloudFront cache..."
if aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/js/*" "/css/*" "/index.html" "/" \
  --output text --query 'Invalidation.Id' >/dev/null 2>&1; then
  echo "CloudFront invalidation started"
else
  echo "Warning: CloudFront invalidation failed — purge cache manually if needed"
fi

echo "Deployment complete — Study Planner synced"
