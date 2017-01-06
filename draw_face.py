import sys
import os
import numpy as np
import pylab as pl
import glob
import cv2
import subprocess
import time
import math

def draw_face(argv):
	face = np.zeros((720, 1280, 3), np.uint8)

	info_path = argv[1]
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

	cv2.imwrite("webcam/face.jpg", face)

def main(argv):
	mirror = True
	cv2.namedWindow("webcam", 0)
	cam = cv2.VideoCapture(0)

	while not cam.isOpened():
		cam = cv2.VideoCapture(0)
		time.sleep(10)

	while True:
		ret_val, img = cam.read()
		if mirror: 
			img = cv2.flip(img, 1)
		cv2.imshow('webcam', img)
		if cv2.waitKey(1) == 27: 
			sys.exit(0)  # esc to quit
		if cv2.waitKey(1) == 32:
			print "taking picture..."
			cam.set(3, 762)
			cam.set(4, 562)
			cv2.imwrite("./webcam/cam.jpg", img)
			subprocess.call(['./stasm.sh'])
			break
		time.sleep(0.005)

	cam.release()
	cv2.destroyAllWindows()

	draw_face(argv)

if __name__ == '__main__':
	main(sys.argv)
