#!/usr/bin/env/ python
import os
from tornado import web, ioloop, websocket
from tornado.options import define, options
import json
import datetime
#import urllib2
import base64
import sys
import numpy as np
import pylab as pl
import glob
import cv2
import subprocess
import time
import math

define("ip", default="your.ip")
define("port", default=8888)

def draw_face(img):
    print ('draw_face')
    #face = np.zeros((cam_height, cam_width, cam_channels), np.uint8)
    face = img

    info_path = "./static/"
    for filename in glob.glob(os.path.join(info_path, '*.txt')):
        file = open(str(filename), 'r')
        lines = file.readlines()
        if (filename.find('frown') == -1):
            for line in lines:
                l = line.split(' ')
                h = int(l[0])
                w = int(l[1])
                cv2.circle(face, (h, w), 2, (255, 255, 255), -1)
        file.close()

    cv2.imwrite("./static/face.jpg", face)
    print ('draw_face success')

# render UI
class Chat(web.RequestHandler):
    def get(self):
        self.render("index.html")

# Interacte with client using websockethandler
class Socket(websocket.WebSocketHandler):
    def open(self):
        # save websocket if connection constructed
        print ('connected.')
    
    def on_close(self):
        # remove websocket of connection closed
        print (' disconnected.')
    
    def on_message(self, message):
        print ('on_message')
        d = json.loads(message)
        for key in d:
            if key == "img":
                print ('writing image')
                decode_message = d[key].split(",")[1]
                imgdata = base64.b64decode(decode_message)
                filename = './static/cam.jpg'
                with open(filename, 'wb') as f:
                    f.write(imgdata)
                    print ('webcam image written')
                
                print ('running stasm')
                img = cv2.imread(filename)
                #cv2.imshow(filename, img)
                #if mirror: 
                img = cv2.flip(img, 1)
                cv2.imshow('flip', img)
                #if cv2.waitKey(1) == 27: 
                #    sys.exit(0)  # esc to quit
                #if cv2.waitKey(1) == 32: #space
                print("running subprocess...")
                cv2.imwrite("./static/cam.jpg", img)
                subprocess.call(['./stasm.sh'])
                #    break
                time.sleep(0.005)
                cv2.destroyAllWindows()
                draw_face(img)
                send_message = {"draw_face":"draw_face success"}
                self.write_message(send_message)
                    
            if key == "end":
                exit(0)

# setting parameter
settings = dict(
                debug=True,
                autoreload=True,
                compiled_template_cache=False,
                static_path=os.path.join(os.path.dirname(__file__),"static"),
                template_path=os.path.join(os.path.dirname(__file__))
                )

class Application(web.Application):
    def __init__(self):
        handlers = [
                    (r"/", Chat),
                    (r"/socket", Socket)
                    ]
        print("static_path: ",settings["static_path"],"template_path: ",settings["template_path"])
        web.Application.__init__(self, handlers, **settings)

def main():
    options.parse_command_line()
    app = Application()
    app.listen(options.port)
    ioloop.IOLoop.current().start()

if __name__ == "__main__":
    main()