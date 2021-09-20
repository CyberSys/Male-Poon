#!/bin/bash
git submodule init && git submodule update

if [ $GTK == "GTK3" ]; then
  cp scripts/mozconfig-gtk3 .mozconfig
elif [ $GTK == "GTK2" ]; then
  cp scripts/mozconfig-gtk2 .mozconfig
elif [ $WIN == "WIN32"]; then
  cp scripts/mozconfig-win32 .mozconfig
else
  cp scripts/mozconfig-win64 .mozconfig
fi
