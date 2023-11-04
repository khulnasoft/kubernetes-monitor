#! /bin/bash
set -e

trap "git checkout --force master" EXIT

NEW_TAG=$1
echo About to update the gh-pages branch with new tag ${NEW_TAG}

echo configuring git
git config --global user.email "egg@khulnasoft.com"
git config --global user.name "Runtime CI & CD"
git remote add origin-pages https://${GH_TOKEN}@github.com/khulnasoft/kubernetes-monitor.git > /dev/null 2>&1
git checkout -f gh-pages

if grep -Fxq "  tag: ${NEW_TAG}" ./khulnasoft-monitor/values.yaml
then
  echo not publishing a new gh-pages commit since this version is already published
  ./scripts/slack/notify_success_no_publish.py
  exit 0
fi

echo overriding new yaml / chart files from master branch
git checkout origin/master -- khulnasoft-monitor khulnasoft-monitor-cluster-permissions.yaml khulnasoft-monitor-deployment.yaml khulnasoft-monitor-namespaced-permissions.yaml
git reset ./khulnasoft-monitor/README.md

echo overriding tag placeholders with latest semantic version
sed -i "s/IMAGE_TAG_OVERRIDE_WHEN_PUBLISHING/${NEW_TAG}/g" ./khulnasoft-monitor/values.yaml
sed -i "s/IMAGE_TAG_OVERRIDE_WHEN_PUBLISHING/${NEW_TAG}/g" ./khulnasoft-monitor-deployment.yaml

echo building new helm release
helm package khulnasoft-monitor --version ${NEW_TAG}
helm repo index .

echo publishing to gh-pages
git add index.yaml
git add khulnasoft-monitor-${NEW_TAG}.tgz
git add ./khulnasoft-monitor/values.yaml
git add ./khulnasoft-monitor-deployment.yaml
git add ./khulnasoft-monitor-cluster-permissions.yaml
git add ./khulnasoft-monitor-namespaced-permissions.yaml
COMMIT_MESSAGE='fix: :egg: Automatic Publish '${NEW_TAG}' :egg:'
git commit -m "${COMMIT_MESSAGE}"
git push --quiet --set-upstream origin-pages gh-pages

# Wait up to 10 minutes for the new GH pages
echo "waiting for the new release to appear in github"
attempts=6
sleep_time=10
for (( i=0; i<${attempts}; i++ )); do
  # Notice we must use "|| :" at the end of grep because when it doesn't find a match
  # it returns an exit code 1, which trips this script (it has "set -e").
  curl_response=$(curl -s --connect-timeout 10 --max-time 10 https://khulnasoft.github.io/kubernetes-monitor/khulnasoft-monitor/values.yaml)
  count=$(echo "$curl_response" | grep --line-buffered -c "tag: ${NEW_TAG}" || :)
  if [[ "$count" == "1" ]]; then
    echo "ok, tag is updated, made $(( $i + 1 )) attempt(s)"
    break
  fi
  echo "attempt ${i}: did not find the expected tag ${NEW_TAG}, here is what curl returned"
  echo "$curl_response"
  sleep $sleep_time
done

./scripts/slack/notify_push.py "gh-pages"