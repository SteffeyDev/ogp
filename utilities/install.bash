#!/bin/bash

echo "* Getting Updates..."
# sudo apt-get update
sudo easy_install -U distribute

echo "\n* Installing needed python libraries..."
sudo apt-get install ipython python-serial python-opencv python-picamera python-scipy python-numpy python-setuptools python-pip -y

echo "\n* Installing NGINX web server and arduino libraries..."
sudo apt-get install nginx arduino -y

echo "\n* Installing SimpleCV, tornado, and GPIO connections..."
sudo pip install https://github.com/sightmachine/SimpleCV/zipball/master
sudo pip install tornado
sudo pip install RPi.GPIO
sudo pip install svgwrite

sudo mkdir -p /var/www/
sudo mkdir -p /var/www/images
sudo cp -R ../www /var/www

echo "\n* Testing pi camera..."
raspistill -v -o test.jpg

echo "\n* If you did not see the image, please run 'sudo raspi-config' and enable the camera module."

sudo cp start_ogp /usr/bin/start_ogp
sudo chmod +x /usr/bin/start_ogp

sudo cp update /usr/bin/update
sudo chmod +x /usr/bin/update

echo "\n* Type the command start_ogp to start the backend server"
