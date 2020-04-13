#!/usr/bin/env bash

docker-compose run --rm node npm run test:local $1-module $2-task
