#!/bin/bash
export GOPATH=$PWD
export PATH=$GOPATH/bin:$PATH

if [ ! -f ./bin/packr ]; then
  echo "Installing packr"
  go get -u github.com/gobuffalo/packr/...
fi
if [ ! -f ./bin/govendor ]; then
  echo "Installing govendor"
  go get -u github.com/kardianos/govendor
fi

echo "Synchronizing dependencies"
cd src/extra
govendor sync

MAJOR=$(cat extra.go | grep Major | awk '{print $2}' | tr -d ,)
MINOR=$(cat extra.go | grep Minor | awk '{print $2}' | tr -d ,)
BUILD=$(cat extra.go | grep Build | awk '{print $2}' | tr -d ,)

function build {
  FILENAME=extra-$1-$2-$MAJOR.$MINOR.$BUILD
  echo "Building ${FILENAME}"
  GOOS=$1 GOARCH=$2 packr build -o build/$FILENAME
}

# https://www.digitalocean.com/community/tutorials/how-to-build-go-executables-for-multiple-platforms-on-ubuntu-16-04
build linux amd64
build darwin amd64
build windows amd64
#build windows 386
#build linux 386
#build linux ppc64
