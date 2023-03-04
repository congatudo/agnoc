#!/usr/bin/env sh

set -e

mkdir -p ./coverage/tmp

find packages \
  -name 'coverage-final.json' \
  -exec sh -c 'name="$1"; cp -f "$name" coverage/tmp/$(echo "$name" | awk -F"/" "{ print \$2 }").json' shell {} \;

nyc merge coverage/tmp coverage/coverage-final.json
nyc report --temp-dir coverage/tmp
