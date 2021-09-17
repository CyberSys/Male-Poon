#!/bin/bash
BASH="bash"
if [[ ! -z $WIN ]]; then
    BASH=/c/mozilla-build/start-shell.bat
fi
$BASH mach build
$BASH mach package
