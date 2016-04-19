
##!/usr/bin/env python2
## newsocket.py

## uncomment above for autorun at boot------

## OGP Telescope  --  Main Module

## LIBRARIES

print "Loading modules..."

from time import sleep
import threading

def animateLoading:
    def animation(counter, length):
        stage = counter % (length * 2 + 2)
        if stage < length + 1:
            left_spaces = stage
        else:
            left_spaces = length * 2 - 1 - stage
        return '[' + ' ' * left_spaces + '=' + ' ' * (length - left_spaces) + ']'

    for i in range(100):
        sys.stdout.write('\b\b\b')
        sys.stdout.write(animation(i, 6))
        sys.stdout.flush()
        time.sleep(0.2)

loading_thread = threading.Thread(target=animateLoading)
loading_thread.start()

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

import serial
import picamera
from SimpleCV import *
from os import path
## our library
from ogplab import *
import ircam
from chase2 import *

loading_thread.stop()


print "Initializing connections, please wait..."

## some important variables

s = serial.Serial('/dev/ttyUSB0', 9600)                     ## serial to arduino

c2 = SimpleCV.Camera(0,{ "width": 544, "height": 288 })          ## opens a camera
#c = SimpleCV.Camera(1,{ "width": 544, "height": 288 })           ## or two
js = SimpleCV.JpegStreamer('0.0.0.0:8080')                        ## opens socket for jpeg out
sleep(4)                                               ## strategic buffering, possibly unnecessary
c2.getImage().save(js.framebuffer)                 ## push a jpeg to the jpeg socket

cam_mode = int(1)

##autocalibration
acu = int(1)
acd = int(1)
acl = int(1)
acr = int(1)

showimage = int(1)
mapsize = int(8)
stepsize = int(500)

stat = "ogp"
s.write('3')
s.write('8')

#acx (serial, direction, time (ms), time multiplier for each direction);

sqx = int(272)
sqy = int(144)

print "* Ready to go, just make a connection from the web socket"

class WSHandler(tornado.websocket.WebSocketHandler):

    def open(self):
        print 'New connection was opened 1'
        self.write_message("telescope listening")   ## sending message through text socket
        x = int(0)
        y = int(0)
        z = int(0)
        self.x = 0
        self.y = 0
        self.z = 0
        self.mapsize = mapsize
        self.showimage = showimage
        self.stepsize = stepsize #used for mapping
        self.cam_mode = cam_mode
        self.sqx = sqx
        self.sqy = sqy

    def function_that_downloads():
        while True:
            sleep(0.2)
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            irpic.update()

    def on_message(self, message):

        print 'Incoming message:', message      ## output message to python
        showimage = self.showimage
        mapsize = self.mapsize
        stepsize = self.stepsize
        x = self.x
        y = self.y
        z = self.z
        stat = "ogp"
        sqx = self.sqx
        sqy=self.sqy

        cam_mode = self.cam_mode

        if message.startswith('joy'):
            s.write('j' + message[3:])
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            if (message == 'joy33') {
                irpic.run()
            }
            else {
                irpic.update()
            }

            # if hasattr(self, "update_thread") and self.update_thread.isAlive() and message == "joy33":
            #     self.update_thread.stop()
            # elif ((hasattr(self, "update_thread") and not self.update_thread.isAlive()) or not hasattr(self, "update_thread")) and message != "joy33":
            #     update_thread = threading.Thread(target=function_that_downloads)
            #     update_thread.start()
            #     self.update_thread = update_thread

        if message.startswith('nr'):            ##    switches for incoming socket events
            print "j"
            x = x + 1
            self.x = x
            self.write_message("echo: " + message + " right " )
            d = 'r'
            ms = int(message[2]) * 25
            s.write('4')
            sleep(0.5 * int(message[2]))
            s.write('3')
            # mov = acx(s, d, ms, acu, acd, acl, acr)
            # mov.run()
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            irpic.run()

        if message.startswith('nl'): #slow CCW (nudge left)
            print "h"
            s.write('h')
            x = x - 1
            self.x = x
            self.write_message("echo: " + message + " left" )
            d = 'l'
            ms = int(message[2]) * 25
            s.write('2')
            sleep(0.5 * int(message[2]))
            s.write('3')
            print "moving left"

            # mov = acx(s, d, ms, acu, acd, acl, acr)
            # mov.run()
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            irpic.run()

        if message.startswith('nu'):
            print "y"
            y = y + 1
            self.y = y
            self.write_message("echo: " + message + " up   ")
            d = 'u'
            ms = int(message[2]) * 25
            s.write('6')
            sleep(0.5 * int(message[2]))
            s.write('8')
            #mov = acx(s, d, ms, acu, acd, acl, acr)
            #mov.run()
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            irpic.run()

        if message.startswith('nd'):
            print "g"
            y = y - 1
            self.y = y
            self.write_message("echo: " + message + " down   ")
            d = 'd'
            ms = int(message[2]) * 25
            s.write('9')
            sleep(0.5 * int(message[2]))
            s.write('8')
            #mov = acx(s, d, ms, acu, acd, acl, acr)
            #mov.run()
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            irpic.run()

        if message =='c3': #capture
            cam_mode = 3
            self.cam_mode = cam_mode
            img1 = c2.getImage()
            blobs = img1.findBlobs()
            if blobs:
                img1.drawCircle((blobs[-1].x,blobs[-1].y),30,color=(255,255,255))
                img1.drawCircle((blobs[-1].centroid()),10,color=(255,100,100))
                rgb1 = blobs[-1].meanColor()
                cent = blobs[-1].centroid()

            img1.drawText(str(stat), 10, 10, fontsize=50)
            img1.drawText(str(x), 10, 70, color=(255,255,255), fontsize=25)
            img1.drawText(str(y), 10, 100, color=(255,255,255), fontsize=25)
            img1.drawRectangle(sqx,sqy,25, 25,color=(255,255,255))

            img1.drawText(str(z), 10, 230, color=(255,255,255), fontsize=15)
            img1.drawText(str(cent), 10, 250, color=(255,255,255), fontsize=15)
            img1.drawText(str(rgb1), 10, 270, color=(255,255,255), fontsize=15)
            img1.save(js.framebuffer)
            self.write_message("echo: " + message + " " + str(cam_mode) )

        if message =='c2': #main
            cam_mode = 2
            self.cam_mode = cam_mode
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            irpic.run()
            self.write_message("echo: " + message + " " + str(cam_mode) )

        if message =='c1': #spotter
            cam_mode = 1
            self.cam_mode = cam_mode
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            irpic.run()
            self.write_message("echo: " + message + " " + str(cam_mode) )

        if message == 'squ': #moving sighting square
            print "squ"
            sqy = self.sqy
            sqy = sqy + 25
            self.write_message("echo: "+str(sqy)+" sighting square")
            self.sqy=sqy
        if message == 'sqd':
            print "sqd"
            sqy = self.sqy
            sqy = sqy - 25
            self.write_message("echo: "+str(sqy)+" sighting square")
            self.sqy=sqy
        if message == 'sql':
            print "sql"
            sqx = self.sqx
            sqx = sqx + 25
            self.write_message("echo: "+str(sqx)+" sighting square")
            self.sqx=sqx
        if message == 'sqr':
            print "sqr"
            sqx = self.sqx
            sqx = sqx - 25
            self.write_message("echo: "+str(sqx)+" sighting square")
            self.sqx=sqx

        if message =='+': #step size
            print "+"
            stepsize = self.stepsize
            stepsize = stepsize + 25
            self.write_message("echo: " + str(stepsize) + " stepsize plus" )
            self.stepsize = stepsize
        if message =='-':
            print "-"
            stepsize = self.stepsize
            stepsize = stepsize - 25
            self.write_message("echo: " + str(stepsize) + " stepsize minus" )
            self.stepsize = stepsize

        if message =='p':
            stat = "mapsizing"
            print "p"
            mapsize = mapsize + 1
            self.mapsize= mapsize
            self.write_message("echo: " + message + " mapsize " + str(mapsize))
            print "n"
            self.write_message("echo: " + message + " map" )
            print stepsize
            m = stepsize
            wsh = tornado.websocket.WebSocketHandler        ## wsh holds some socket info
            wsh2 = self                                    ## wsh2 holds the name of the instance
            map = so(mapsize, m, js, wsh, wsh2, c2, cam_mode)               ##  make an istance of the mapper --SO stands for seek out
            self.map = map
            map.histo()                                   ##  histogram is necessary before run

        if message =='l':
            stat = "mapsizing"
            print "l"
            mapsize = mapsize - 1
            self.mapsize = mapsize
            self.write_message("echo: " + message + " mapsize " + str(mapsize))
            print "n"
            self.write_message("echo: " + message + " map" )
            print stepsize
            m = stepsize
            wsh = tornado.websocket.WebSocketHandler        ## wsh holds some socket info
            wsh2 = self                                    ## wsh2 holds the name of the instance
            map = so(mapsize, m, js, wsh, wsh2, c2, cam_mode)               ##  make an instance of the mapper --SO stands for seek out
            self.map = map
            map.histo()                                   ##  histogram is necessary before run

        if message =='z':
            stat = "mapping down"
            print "z- map down"
            y = y - 1
            self.y = y
            self.write_message("echo: " + message + " map down   ")
            d = 'd'
            ms = stepsize
            s.write('9')
            mov = acx(s, d, ms, acu, acd, acl, acr)
            mov.run()
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            irpic.run()

        if message =='a':
            stat = "mapping left"
            print "a- map left"
            x = x-1
            self.x = x
            self.write_message("echo: " + message + " map left   ")
            d = 'l'
            ms = stepsize
            s.write('2')
            mov = acx(s, d, ms, acu, acd, acl, acr)
            mov.run()
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            irpic.run()

        if message =='w':
            stat = "mapping up"
            print "w- map up"
            y = y + 1
            self.y = y
            self.write_message("echo: " + message + " map up   ")
            d = 'u'
            ms = stepsize
            s.write('6')
            mov = acx(s, d, ms, acu, acd, acl, acr)
            mov.run()
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            irpic.run()

        if message =='s':
            stat = "mapping right"
            print "s- map right"
            x = x + 1
            self.x = x
            self.write_message("echo: " + message + " map right   ")
            d = 'r'
            ms = stepsize
            s.write('4')
            mov = acx(s, d, ms, acu, acd, acl, acr)
            mov.run()
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            irpic.run()

        if message =='b':           ## MAPPER
            print "b"
            self.write_message("echo: " + message + " map" )
            m = stepsize
            wsh = tornado.websocket.WebSocketHandler        ## wsh holds some socket info
            wsh2 = self       ## wsh2 holds the name of the instance
            map = self.map
            map.run()

        if message =='n':           ## MAPPER
            print "n"
            self.write_message("echo: " + message + " map" )
            print stepsize
            m = stepsize
            wsh = tornado.websocket.WebSocketHandler        ## wsh holds some socket info
            wsh2 = self                                    ## wsh2 holds the name of the instance
            map = so(mapsize, m, js, wsh, wsh2, c2, cam_mode)               ##  make a new istance of the mapper --SO stands for seek out
            self.map = map
            map.histo()                                   ##  histogram is necessary before run
           ## print map.mySet                      ## print map log data array

        if message == 'c':
            wsh = tornado.websocket.WebSocketHandler        ## wsh holds some socket info
            wsh2 = self                                    ## wsh2 holds the name of the instance
            cchase = chase3(js, wsh, wsh2, c2, sqx, sqy, cam_mode)
            cchase.run()

        if message == 'k':
            wsh = tornado.websocket.WebSocketHandler        ## wsh holds some socket info
            wsh2 = self                                    ## wsh2 holds the name of the instance
       ##     ac = autocal(c, js, wsh, wsh2)
      ##      ac.run()
        if message == 'x':
            showimage = showimage - 1
            self.showimage = showimage
            pth1 = "/var/www/images/image"
            pth3 = ".png"
            pth = pth1 + str(showimage) + pth3
            apath = path.abspath(pth)
            self.write_message(pth)
            print showimage
            img1 = Image(pth)
            img1.save(js.framebuffer)


        if message == 'v':
            showimage = showimage + 1
            self.showimage = showimage
            pth1 = "/var/www/images/image"
            pth3 = ".png"
            pth = pth1 + str(showimage) + pth3
            apath = path.abspath(pth)
            self.write_message(pth)
            print showimage
            img1 = Image(pth)
            img1.save(js.framebuffer)
##

        if message =='t':
            print "t"
            s.write('t')
            sleep(1)
            s.write('c')
            self.write_message("echo: " + message + " focus out")
        if message =='f':
            print "f"
            s.write('f')
            sleep(1)
            s.write('c')

            self.write_message("echo: " + message + " focus in")


        if message =='2':
            print "2"
            s.write('2')
            self.write_message("echo: " + message + " 2")

        #stop mapping movement and other actions
        if message =='3':
            print "All Stop, Capturing New Image"
            s.write('j33')
            self.write_message("echo: " + message + "3")
            irpic = ircam.pinoir2(js, cam_mode, c2, x, y, z, stat,sqx,sqy)
            irpic.run()

        if message =='4':
            print "4"
            s.write('4')
            self.write_message("echo: " + message + "4")


        if message =='7':
            print "7"
            s.write('6')
            self.write_message("echo: " + message + " 7")

        if message =='9':
            print "9"
            s.write('9')
            self.write_message("echo: " + message + " 9")



    def on_close(self):                       ##  if you lose the socket
        print 'Connection was closed...'

    def check_origin(self, origin):
        return True

application = tornado.web.Application([        ##creates instance of socket
    (r'/ws', WSHandler),
])


if __name__ == "__main__":                       ##    since this is the main module
    http_server = tornado.httpserver.HTTPServer(application)      ## opens the socket
    http_server.listen(8888)                                     ## on this port
    tornado.ioloop.IOLoop.instance().start()        ##   this starts the threaded socket loop
# <<<<<<< HEAD:newsocket.py
# =======
#
# >>>>>>> FETCH_HEAD:newsocket.py
