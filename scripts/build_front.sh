#!/bin/sh -e
cd "$(dirname "$0")/../ui"
yarn
PUBLIC_URL=. GENERATE_SOURCEMAP=false yarn build
rm -rf ../server/webroot
mv dist ../server/webroot