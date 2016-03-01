#!/bin/bash

echo "* Getting Updates...\n"
sudo apt-get update
sudo easy_install -U distribute

echo "* Installing needed python libraries...\n"
sudo apt-get install ipython python-serial python-opencv python-picamera python-scipy python-numpy python-setuptools python-pip -y

echo "* Installing NGINX web server and arduino libraries...\n"
sudo apt-get install nginx arduino -y

echo "* Installing SimpleCV, tornado, and GPIO connections...\n"
sudo pip install https://github.com/sightmachine/SimpleCV/zipball/master
sudo pip install tornado
sudo pip install RPi.GPIO

sudo rm -rf /var/www
sudo mv ../www /var/www

echo "* Testing pi camera..."
raspistill -v -o test.jpg

echo "* If you did not see the image, please run 'sudo raspi-config' and enable the camera module."

cd ~
touch start_ogp
echo '#!/bin/bash\nsudo python ~/ogp/python/newsocket.py' > /usr/bin/start_ogp
chmod +x start_ogp
sudo mv start_ogp /usr/bin/

echo "* Type the command start_ogp to start the backend server"
