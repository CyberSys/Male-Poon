#!/bin/bash
if [[ ! -z "${GTK}" ]]; then
  sudo apt-get update && sudo apt-get upgrade -y
  sudo apt-get install ccache -y
  if [ $GTK == "GTK3" ]; then
    sudo apt-get install build-essential libgtk2.0-dev libdbus-glib-1-dev autoconf2.13 \
    yasm libegl1-mesa-dev libasound2-dev libxt-dev zlib1g-dev libssl-dev \
    libsqlite3-dev libbz2-dev libpulse-dev libgconf2-dev libx11-xcb-dev \
    zip python2.7 python-dbus libgtk-3-dev -y
  elif [ $GTK == "GTK2" ]; then
    sudo apt-get install build-essential libgtk2.0-dev libdbus-glib-1-dev autoconf2.13 \
    yasm libegl1-mesa-dev libasound2-dev libxt-dev zlib1g-dev libssl-dev \
    libsqlite3-dev libbz2-dev libpulse-dev libgconf2-dev libx11-xcb-dev \
    zip python2.7 python-dbus -y
  fi
fi
