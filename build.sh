#!/bin/bash
(cd extra-ui && yarn && yarn build)

rm -rf extra-plugin/src/extra/public/css
rm -rf extra-plugin/src/extra/public/js
rm -f extra-plugin/src/extra/public/index.html
rm -f extra-plugin/src/extra/public/resources.json

cp -R extra-ui/dist/* extra-plugin/src/extra/public
(cd extra-plugin && ./build.sh)
