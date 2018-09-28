#!/bin/bash
(cd extra-ui && npm install && yarn build)

rm -rf extra-plugin/src/extra/public/css
rm -rf extra-plugin/src/extra/public/js
rm -f extra-plugin/src/extra/public/index.html

cp -R extra-ui/dist/* extra-plugin/src/extra/public
(cd extra-plugin && ./build.sh)