#!/bin/sh

# ENV to JS OBJECT
body=$(env | awk -F= '/^VITE/ {printf "\"%s\": \"%s\",", $1, $2}')
json='window.config = {'${body::${#body}-1}'}'
echo "$json" > /app/dist/config.js
