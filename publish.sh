#!/bin/bash

git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

MAJOR=$(cat extra-plugin/src/extra/extra.go | grep Major | awk '{print $2}' | tr -d ,)
MINOR=$(cat extra-plugin/src/extra/extra.go | grep Minor | awk '{print $2}' | tr -d ,)
BUILD=$(cat extra-plugin/src/extra/extra.go | grep Build | awk '{print $2}' | tr -d ,)
export VERSION=${MAJOR}.${MINOR}.${BUILD}

export CHECKSUM_windows_amd64=$(shasum extra-plugin/src/extra/build/extra-windows-amd64-${VERSION} | awk '{print $1}')
export CHECKSUM_linux_amd64=$(shasum extra-plugin/src/extra/build/extra-linux-amd64-${VERSION} | awk '{print $1}')
export CHECKSUM_darwin_amd64=$(shasum extra-plugin/src/extra/build/extra-darwin-amd64-${VERSION} | awk '{print $1}')
export RELEASE_DATE=$(date --utc +%Y-%m-%dT%H:%M:%SZ)

git clone https://github.com/l2fprod/extra gh-pages
cd gh-pages
git checkout gh-pages
rm -rf .git

cat bx/list.template.json | envsubst
