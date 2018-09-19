#!/bin/bash
export GOPATH=$PWD
cd src/extra
govendor sync

function build {
  echo "Building extra-$1-$2"
  GOOS=$1 GOARCH=$2 ../../bin/packr build -o build/extra-$1-$2
#  GOOS=$1 GOARCH=$2 go build -o build/extra-$1-$2
}

# https://www.digitalocean.com/community/tutorials/how-to-build-go-executables-for-multiple-platforms-on-ubuntu-16-04
# build darwin amd64
# build windows amd64
# build windows 386
build linux amd64
# build linux 386
# build linux ppc64
