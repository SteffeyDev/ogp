#!/bin/bash

printf "* Getting Updates...\n"
# sudo apt-get update
sudo easy_install -U distribute

printf "\n* Installing needed python libraries...\n"
printf "\n* Installing NGINX web server and arduino libraries...\n"
sudo apt-get install vsftpd nginx arduino ipython python-serial python-opencv python-picamera python-scipy python-numpy python-setuptools python-pip -y

printf "\n* Installing SimpleCV, tornado, and GPIO connections...\n"
sudo pip install https://github.com/sightmachine/SimpleCV/zipball/master
sudo pip install tornado
sudo pip install RPi.GPIO
sudo pip install svgwrite

sudo rm -rf /var/www/
sudo cp -R ../www /var/www
sudo mkdir -p /var/www/images

printf "\n* Testing pi camera...\n"
raspistill -v -o test.jpg

printf "\n* If you did not see the image, please run 'sudo raspi-config' and enable the camera module."

sudo cp start_ogp /usr/bin/start_ogp
sudo chmod +x /usr/bin/start_ogp

sudo cp update /usr/bin/update
sudo chmod +x /usr/bin/update

printf "\n* Type the command start_ogp to start the backend server\n"
