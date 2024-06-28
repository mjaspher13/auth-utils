#!/bin/bash

# Jenkins details
JENKINS_URL="http://your-jenkins-server"
JOB_NAME="your-job-name"
JENKINS_USER="your-username"
JENKINS_TOKEN="your-api-token"
TOKEN="your-token"

# Get the CSRF crumb
CRUMB=$(curl -u "$JENKINS_USER:$JENKINS_TOKEN" -s "$JENKINS_URL/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,\":\",//crumb)")

# Trigger the Jenkins build
curl -u "$JENKINS_USER:$JENKINS_TOKEN" -H "$CRUMB" -X POST "$JENKINS_URL/job/$JOB_NAME/build?token=$TOKEN"
