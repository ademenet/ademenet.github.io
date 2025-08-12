#!/bin/sh

FILE_NAME=$(date +"%Y-%m-%d-%H-%M")

touch content/microposts/$FILE_NAME.md

echo "---
date: $(date +"%Y-%m-%d %H:%M:%S%z")
---
" > content/microposts/$FILE_NAME.md
