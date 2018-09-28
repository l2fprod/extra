#!/bin/bash
export GOPATH=$PWD
cd src/extra
govendor sync

# MAJOR=$(cat extra.go | grep Major | awk '{print $2}' | tr -d ,)
# MINOR=$(cat extra.go | grep Minor | awk '{print $2}' | tr -d ,)
# BUILD=$(cat extra.go | grep Build | awk '{print $2}' | tr -d ,)

function build {
  FILENAME=extra-$1-$2
  echo "Building ${FILENAME}"
  GOOS=$1 GOARCH=$2 ../../bin/packr build -o build/$FILENAME
#  GOOS=$1 GOARCH=$2 go build -o build/extra-$1-$2
}

# https://www.digitalocean.com/community/tutorials/how-to-build-go-executables-for-multiple-platforms-on-ubuntu-16-04
build linux amd64
build darwin amd64
# build windows amd64
# build windows 386
# build linux 386
# build linux ppc64
