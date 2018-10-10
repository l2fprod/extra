# Little plugin experiment

too early to say

# Build ui

```
yarn
yarn build
```

# Build plugin

```
brew install go
brew install govendor
cd extra-plugin
export GOPATH=$PWD
go get -u github.com/gobuffalo/packr/...
./build.sh
```

# Install plugin

```
ibmcloud plugin install ./src/extra/build/extra-linux-amd64 -f
```

# Use plugin

```
EXTRA_PORT=8080 ibmcloud extra
```
