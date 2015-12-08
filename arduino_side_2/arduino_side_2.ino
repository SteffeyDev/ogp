// OGP -- ARDUINO SIDE V2.0
// in this version, all of the timing is left up to the rpi
// for use with any serial device over usb
// this config handles:  2 SERVOS, and 1 MOTOR

#include <Servo.h>
#include "AFMotor.h"

static int const SERVO_STOP = 90;
static int const SLOW_CW = 87; //CW = Clockwise
static int const FAST_CW = 85;
static int const SLOW_CCW = 93; //CCW = CounterClockwise
static int const FAST_CCW = 95;
static int const MOTOR_STOP = 0;
static int const MOTOR_FULL = 255;
static int const MOTOR_HALF = 128;

static char const FOCUS_ONE = 'f';
static char const FOCUS_STOP = 'c';
static char const FOCUS_TWO = 't';
static char const ALL_STOP = 'N';
static char const FAST_CCW_1_SIGNAL = '1';
static char const SLOW_CCW_1_SIGNAL = '2';
static char const SERVO_STOP_1_SIGNAL = '3';
static char const SLOW_CW_1_SIGNAL = '4';
static char const FAST_CW_1_SIGNAL = '5';
static char const FAST_CCW_2_SIGNAL = '6';
static char const SLOW_CCW_2_SIGNAL = '7';
static char const SERVO_STOP_2_SIGNAL = '8';
static char const SLOW_CW_2_SIGNAL = '0';
static char const FAST_CW_2_SIGNAL = '9';


//char val[] = 'n';         // variable to receive data from the serial port

Servo myservo;         // create servo objects
Servo myservo2;
AF_DCMotor motor(2);     //create dc motor object
char val[5] = "NIL";// Allocate some space for the string
char inChar=-1; // Where to store the character read
byte index = 0; // Index into array; where to store the character

void setup()
{
  myservo.attach(9);         // attaches the servo on pin 9 to the servo object
  myservo2.attach(10);
  myservo.write(SERVO_STOP);
  myservo2.write(SERVO_STOP);

  motor.setSpeed(MOTOR_STOP);         // just to make sure the motor is stopped
  motor.run(RELEASE);

  pinMode(13, OUTPUT);

  Serial.begin(9600);    // start serial communication at 9600bps
}

void loop() {
  if( Serial.available() ) {      // if data is available to read
    if (Serial.available() > 0) // Don't read unless you know there is data
    {
      inChar = Serial.read(); // Read a character
      val[index] = inChar; // Store it
      if (inChar == 'j' || index > 0) {
        val[index] = inChar;
        index++; // Increment where to write next
      }
      else {
        index = 0;
      }
    }
    if (val[0] == 'j' && index == 3) {         //val needs to have 2 numbers b/w 0 and 6 (ex. j26)

        int c = 0;
        int x = ((val[1] - '0') - 3) * 2; //gives value between -6 & 6
        int y = ((val[2] - '0') - 3) * 2;
        myservo.write(90 + x);
        myservo2.write(90 + y);
        index = 0;
    }
    else {


      switch( val[0] ) {       //switch handles incoming signal


        case FOCUS_ONE:                      //   focus  1
        motor.setSpeed(MOTOR_FULL);
        motor.run(FORWARD);
        Serial.println("focus 1");
        break;

        case FOCUS_STOP:                  // focus stop
        motor.run(RELEASE);
        Serial.println("focus stop");
        break;

        case FOCUS_TWO:                  // focus 2
        motor.setSpeed(MOTOR_FULL);
        motor.run(BACKWARD);
        break;


        case FAST_CCW_1_SIGNAL:                         //  directionals  X
        myservo.write(FAST_CCW);
        Serial.println("1 - CounterClockwise Fast");
        break;

        case SLOW_CCW_1_SIGNAL:
        myservo.write(SLOW_CCW);
        Serial.println("2 - CounterClockwise");
        break;

        case SERVO_STOP_1_SIGNAL:               // stopped
        myservo.write(SERVO_STOP);
        Serial.println("3 - Stop x");
        break;

        case SLOW_CW_1_SIGNAL:
        myservo.write(SLOW_CW);
        Serial.println("8 - Clockwise");
        break;

        case FAST_CW_1_SIGNAL:
        myservo.write(FAST_CW);
        Serial.println("9 - Clockwise Fast");
        break;

        case FAST_CCW_2_SIGNAL:                           // Y
        myservo2.write(FAST_CW);
        Serial.println("7 - down fast");
        break;

        case SLOW_CCW_2_SIGNAL:
        myservo2.write(SLOW_CW);
        Serial.println("7 - down");
        break;

        case SERVO_STOP_2_SIGNAL:
        myservo2.write(SERVO_STOP);
        break;

        case FAST_CW_2_SIGNAL:
        myservo2.write(FAST_CCW);
        Serial.println("9 - up");
        break;

        case SLOW_CW_2_SIGNAL:
        myservo2.write(SLOW_CCW);
        Serial.println("0 - up fast");
        break;

        case ALL_STOP:
        myservo2.write(SERVO_STOP);
        myservo.write(SERVO_STOP);
        Serial.println("all stop");
        break;


        default :              // catches exceptions
        myservo.write(SERVO_STOP);
        myservo2.write(SERVO_STOP);
        Serial.println("default");

      }
    }

}
}

//hi
// (c) Copyright 2014   C. Robert Barnett III
