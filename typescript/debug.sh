#!/bin/sh
NODE_TLS_REJECT_UNAUTHORIZED=0 NODE_ENV=development node --inspect-brk=localhost:9999 $1

