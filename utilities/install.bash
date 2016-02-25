#!/bin/bash


sudo apt-get update
sudo easy_install -U distribute

sudo apt-get install ipython python-serial python-opencv python-picamera python-scipy python-numpy python-setuptools python-pip -y
sudo apt-get install nginx arduino -y

sudo pip install https://github.com/sightmachine/SimpleCV/zipball/master
sudo pip install tornado
sudo pip install RPi.GPIO

sudo mv -r ../www /var/www
