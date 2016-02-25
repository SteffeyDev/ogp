import serial

s = serial.Serial('/dev/ttyUSB0', 9600)                     ## serial to arduino
s.write('3')
s.write('8')

while True:
    input = raw_input("Enter command: ")
    s.write(input)
