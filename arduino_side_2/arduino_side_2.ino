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


char val = 'n';         // variable to receive data from the serial port

Servo myservo;         // create servo objects
Servo myservo2;
AF_DCMotor motor(2);     //create dc motor object

void setup()
{
  myservo.attach(9);         // attaches the servo on pin 9 to the servo object
  myservo2.attach(10);

  motor.setSpeed(MOTOR_STOP);         // just to make sure the motor is stopped
  motor.run(RELEASE);

  pinMode(13, OUTPUT);

  Serial.begin(9600);    // start serial communication at 9600bps
}

void loop() {
  mode = '';
  if( Serial.available() )       // if data is available to read
  {
    val = Serial.read();         // read it and store it in 'val'
    if (strlen(val) > 1) {
      //array = str_split
    }
  }

  switch( val )        //switch handles incoming signal
{

        case FOCUS_ONE:                      //   focus  1
        motor.setSpeed(MOTOR_FULL);
        motor.run(FORWARD);
        Serial.println("focus 1");
        digitalWrite(13, HIGH);
        break;

        case FOCUS_STOP:                  // focus stop
        motor.run(RELEASE);
        Serial.println("focus stop");
        digitalWrite(13, LOW);
        break;

        case FOCUS_TWO:                  // focus 2
        motor.setSpeed(MOTOR_FULL);
        motor.run(BACKWARD);
        digitalWrite(13, HIGH);
        break;


        case FAST_CCW_1_SIGNAL:                         //  directionals  X
        myservo.write(FAST_CCW);
        Serial.println("1 - CounterClockwise Fast");
        digitalWrite(13, HIGH);
        break;

        case SLOW_CCW_1_SIGNAL:
        myservo.write(SLOW_CCW);
        Serial.println("2 - CounterClockwise");
        digitalWrite(13, HIGH);
        break;

        case SERVO_STOP_1_SIGNAL:               // stopped
        myservo.write(SERVO_STOP);
        Serial.println("3 - Stop x");
        digitalWrite(13, LOW);
        break;

        case SLOW_CW_1_SIGNAL:
        myservo.write(SLOW_CW);
        Serial.println("8 - Clockwise");
        digitalWrite(13, HIGH);
        break;

        case FAST_CW_1_SIGNAL:
        myservo.write(FAST_CW);
        Serial.println("9 - Clockwise Fast");
        digitalWrite(13, HIGH);
        break;

        case FAST_CCW_2_SIGNAL:                           // Y
        myservo2.write(FAST_CCW);
        Serial.println("7 - down fast");
        break;

        case SLOW_CCW_2_SIGNAL:
        myservo2.write(SLOW_CCW);
        Serial.println("7 - down");
        digitalWrite(13, HIGH);
        break;

        case SERVO_STOP_2_SIGNAL:
        myservo2.write(SERVO_STOP);
        digitalWrite(13, LOW);
        break;

        case FAST_CW_2_SIGNAL:
        myservo2.write(FAST_CW);
        Serial.println("9 - up");
        digitalWrite(13, HIGH);
        break;

        case SLOW_CW_2_SIGNAL:
        myservo2.write(SLOW_CW);
        Serial.println("0 - up fast");
        digitalWrite(13, HIGH);
        break;

        case ALL_STOP:
        myservo2.write(SERVO_STOP);
        myservo.write(SERVO_STOP);
        Serial.println("all stop");
        digitalWrite(13, LOW);
        break;


        default :              // catches exceptions
        myservo.write(SERVO_STOP);
        myservo2.write(SERVO_STOP);
        Serial.println("default");
        digitalWrite(13, LOW);


}

}
//hi
// (c) Copyright 2014   C. Robert Barnett III
