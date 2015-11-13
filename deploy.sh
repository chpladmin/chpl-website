#!/bin/bash

if [ -z ${1+x} ];
then
    echo "Usage: ./deploy.sh branch-name"
else
    git checkout -- .
    git fetch
    git checkout $1

    cd app/common
    sed -e s#http://localhost:8080/chpl-service#/rest#g commonModule.js > commonModule.js.tmp && mv commonModule.js.tmp commonModule.js
fi
