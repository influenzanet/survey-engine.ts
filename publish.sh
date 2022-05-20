#!/bin/bash
set -e
yarn version

yarn build

cd build
npm publish "$@"
cd ..
