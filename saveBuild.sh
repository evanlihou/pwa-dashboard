#!/bin/sh
npm run build
(cd dist && zip -FSr ../newDist.zip *)
md5 newDist.zip
