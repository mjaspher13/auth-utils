#!/bin/bash

# Jenkins webhook URL
JENKINS_URL="http://your-jenkins-server/job/your-job-name/buildWithParameters"

# Optional: Add authentication if required
JENKINS_USER="your-username"
JENKINS_TOKEN="your-api-token"

# Parameters (if any)
PARAM1_NAME="param1"
PARAM1_VALUE="value1"

# Trigger the Jenkins build
curl -X POST "${JENKINS_URL}" --user "${JENKINS_USER}:${JENKINS_TOKEN}" \
--data-urlencode "${PARAM1_NAME}=${PARAM1_VALUE}"
