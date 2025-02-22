#!/bin/bash
tsc $1
NODE_TLS_REJECT_UNAUTHORIZED=0 NODE_ENV=development node "${1%.ts}.js"

