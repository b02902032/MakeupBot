#!/usr/bin/env/ python
import os
from tornado import web, ioloop, websocket
from tornado.options import define, options
import json
import datetime
#import urllib2
import base64
import sys
import os
import numpy as np
import pylab as pl
import glob
import cv2
import subprocess
import time
import math

define("ip", default="your.ip")
define("port", default=8888)

def draw_face():
    face = np.zeros((720, 1280, 3), np.uint8)

    info_path = ""
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

    cv2.imwrite("face.jpg", face)

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
                with open("imageToSave.png", "wb") as fh:
                    decode_message = d[key].split(",")[1]
                    fh.write(base64.decodestring(decode_message))

                """
                with open("cam.jpg", "wb") as fh:
                    decode_message = d[key].split(",")[1]
                    #print(decode_message)
                    fh.write(base64.decodestring(decode_message))
                    print ('runnung stasm')
                    while True:
                        ret_val, img = base64.decodestring(decode_message)
                        if mirror: 
                            img = cv2.flip(img, 1)
                        cv2.imshow('img', img)
                        if cv2.waitKey(1) == 27: 
                            sys.exit(0)  # esc to quit
                        if cv2.waitKey(1) == 32: #space
                            print("taking picture...")
                            cam.set(3, 762)
                            cam.set(4, 562)
                            cv2.imwrite("./cam.jpg", img)
                            subprocess.call(['./stasm.sh'])
                            break
                        time.sleep(0.005)

                    cam.release()
                    cv2.destroyAllWindows()

                    draw_face(argv)
                    """
            if key == "end":
                exit(0)
        #write_message(message)

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