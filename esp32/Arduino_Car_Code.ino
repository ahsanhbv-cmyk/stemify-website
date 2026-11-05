/*
 * ═══════════════════════════════════════════════════════════════════
 * STEMify Arduino Car Controller
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Board: Arduino Nano / Arduino Uno
 * 
 * Ye code Arduino mai upload karo
 * ESP8266 se commands receive karta hai aur car control karta hai
 * Students isme sensors connect karte hain level ke hisab se
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

#include <SoftwareSerial.h>

// ═══════════════════════════════════════════════════════════════════
// PIN CONFIGURATION - MOTOR DRIVER (L298N)
// ═══════════════════════════════════════════════════════════════════

#define MOTOR_A_EN  5    // PWM - Motor A Speed
#define MOTOR_A_IN1 4    // Motor A Direction
#define MOTOR_A_IN2 3    // Motor A Direction
#define MOTOR_B_EN  6    // PWM - Motor B Speed
#define MOTOR_B_IN1 7    // Motor B Direction
#define MOTOR_B_IN2 8    // Motor B Direction

// ═══════════════════════════════════════════════════════════════════
// PIN CONFIGURATION - ESP8266 SERIAL COMMUNICATION
// ═══════════════════════════════════════════════════════════════════

#define ESP_RX 10   // Arduino RX ← ESP8266 TX
#define ESP_TX 11   // Arduino TX → ESP8266 RX (through voltage divider!)

SoftwareSerial espSerial(ESP_RX, ESP_TX);

// ═══════════════════════════════════════════════════════════════════
// PIN CONFIGURATION - SENSORS (Students connect as per level)
// ═══════════════════════════════════════════════════════════════════

// Level 1: PIR Motion Sensor
#define PIR_PIN 12

// Level 2: Ultrasonic Sensor (HC-SR04)
#define ULTRASONIC_TRIG 12
#define ULTRASONIC_ECHO 13

// Level 3: IR Sensor
#define IR_SENSOR_PIN A0

// Level 5: DHT11 Temperature Sensor
#define DHT_PIN 9

// Level 6: MQ-2 Gas Sensor
#define GAS_SENSOR_PIN A1

// Level 7: LDR Light Sensor
#define LDR_PIN A2

// Level 8: Soil Moisture Sensor
#define SOIL_PIN A3

// Level 9: Sound Sensor
#define SOUND_PIN A4

// Common
#define LED_PIN A5
#define BUZZER_PIN A5  // Same pin, can use LED or buzzer

// ═══════════════════════════════════════════════════════════════════
// VARIABLES
// ═══════════════════════════════════════════════════════════════════

int motorSpeed = 200;  // 0-255
String inputCommand = "";
bool ledState = false;

// ═══════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════

void setup() {
  // Serial for debugging (USB)
  Serial.begin(115200);
  
  // Serial for ESP8266 communication
  espSerial.begin(9600);
  
  Serial.println();
  Serial.println("╔═══════════════════════════════════════════╗");
  Serial.println("║   STEMify Arduino Car Controller          ║");
  Serial.println("║   Waiting for ESP8266 commands...         ║");
  Serial.println("╚═══════════════════════════════════════════╝");
  
  // Setup motor pins
  pinMode(MOTOR_A_EN, OUTPUT);
  pinMode(MOTOR_A_IN1, OUTPUT);
  pinMode(MOTOR_A_IN2, OUTPUT);
  pinMode(MOTOR_B_EN, OUTPUT);
  pinMode(MOTOR_B_IN1, OUTPUT);
  pinMode(MOTOR_B_IN2, OUTPUT);
  
  // Setup sensor pins
  pinMode(PIR_PIN, INPUT);
  pinMode(ULTRASONIC_TRIG, OUTPUT);
  pinMode(ULTRASONIC_ECHO, INPUT);
  pinMode(IR_SENSOR_PIN, INPUT);
  pinMode(GAS_SENSOR_PIN, INPUT);
  pinMode(LDR_PIN, INPUT);
  pinMode(SOIL_PIN, INPUT);
  pinMode(SOUND_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  
  // Stop motors initially
  stopMotors();
  
  Serial.println("✅ Arduino Ready!");
  Serial.println();
}

// ═══════════════════════════════════════════════════════════════════
// MAIN LOOP
// ═══════════════════════════════════════════════════════════════════

void loop() {
  // Check for commands from ESP8266
  while (espSerial.available()) {
    char c = espSerial.read();
    if (c == '\n') {
      processCommand(inputCommand);
      inputCommand = "";
    } else {
      inputCommand += c;
    }
  }
  
  // Also check USB Serial for testing
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      processCommand(inputCommand);
      inputCommand = "";
    } else {
      inputCommand += c;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// COMMAND PROCESSING
// ═══════════════════════════════════════════════════════════════════

void processCommand(String cmd) {
  cmd.trim();
  cmd.toUpperCase();
  
  if (cmd.length() == 0) return;
  
  Serial.print("📥 Command: ");
  Serial.println(cmd);
  
  // Motor Commands
  if (cmd == "FORWARD") {
    moveForward();
  }
  else if (cmd == "BACKWARD") {
    moveBackward();
  }
  else if (cmd == "LEFT") {
    turnLeft();
  }
  else if (cmd == "RIGHT") {
    turnRight();
  }
  else if (cmd == "STOP") {
    stopMotors();
  }
  
  // Speed Commands
  else if (cmd.startsWith("SPEED_")) {
    int speed = cmd.substring(6).toInt();
    setSpeed(speed);
  }
  
  // LED/Buzzer Commands
  else if (cmd == "LED_ON" || cmd == "BUZZER_ON") {
    digitalWrite(LED_PIN, HIGH);
    ledState = true;
    Serial.println("   💡 LED ON");
  }
  else if (cmd == "LED_OFF" || cmd == "BUZZER_OFF") {
    digitalWrite(LED_PIN, LOW);
    ledState = false;
    Serial.println("   💡 LED OFF");
  }
  else if (cmd == "LED_TOGGLE") {
    ledState = !ledState;
    digitalWrite(LED_PIN, ledState ? HIGH : LOW);
    Serial.print("   💡 LED: ");
    Serial.println(ledState ? "ON" : "OFF");
  }
  else if (cmd == "BEEP") {
    beep();
  }
  
  // Sensor Read Commands
  else if (cmd == "READ_PIR" || cmd == "READ_MOTION") {
    readPIR();
  }
  else if (cmd == "READ_DISTANCE" || cmd == "READ_ULTRASONIC") {
    readUltrasonic();
  }
  else if (cmd == "READ_IR") {
    readIR();
  }
  else if (cmd == "READ_TEMP" || cmd == "READ_TEMPERATURE") {
    readTemperature();
  }
  else if (cmd == "READ_GAS") {
    readGas();
  }
  else if (cmd == "READ_LIGHT" || cmd == "READ_LDR") {
    readLight();
  }
  else if (cmd == "READ_SOIL" || cmd == "READ_MOISTURE") {
    readSoilMoisture();
  }
  else if (cmd == "READ_SOUND") {
    readSound();
  }
  else if (cmd == "READ_ALL" || cmd == "READ_SENSOR") {
    readAllSensors();
  }
  
  // Delay Commands
  else if (cmd.startsWith("DELAY_")) {
    int delayTime = cmd.substring(6).toInt();
    Serial.print("   ⏱️ Waiting ");
    Serial.print(delayTime);
    Serial.println("ms");
    delay(delayTime);
  }
  else if (cmd == "WAIT_500") {
    delay(500);
  }
  else if (cmd == "WAIT_1000") {
    delay(1000);
  }
  
  else {
    Serial.print("   ⚠️ Unknown command: ");
    Serial.println(cmd);
  }
}

// ═══════════════════════════════════════════════════════════════════
// MOTOR CONTROL FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

void moveForward() {
  Serial.println("   🚗 FORWARD");
  digitalWrite(MOTOR_A_IN1, HIGH);
  digitalWrite(MOTOR_A_IN2, LOW);
  analogWrite(MOTOR_A_EN, motorSpeed);
  digitalWrite(MOTOR_B_IN1, HIGH);
  digitalWrite(MOTOR_B_IN2, LOW);
  analogWrite(MOTOR_B_EN, motorSpeed);
  sendResponse("OK:FORWARD");
}

void moveBackward() {
  Serial.println("   🚗 BACKWARD");
  digitalWrite(MOTOR_A_IN1, LOW);
  digitalWrite(MOTOR_A_IN2, HIGH);
  analogWrite(MOTOR_A_EN, motorSpeed);
  digitalWrite(MOTOR_B_IN1, LOW);
  digitalWrite(MOTOR_B_IN2, HIGH);
  analogWrite(MOTOR_B_EN, motorSpeed);
  sendResponse("OK:BACKWARD");
}

void turnLeft() {
  Serial.println("   🚗 LEFT");
  digitalWrite(MOTOR_A_IN1, LOW);
  digitalWrite(MOTOR_A_IN2, HIGH);
  analogWrite(MOTOR_A_EN, motorSpeed);
  digitalWrite(MOTOR_B_IN1, HIGH);
  digitalWrite(MOTOR_B_IN2, LOW);
  analogWrite(MOTOR_B_EN, motorSpeed);
  sendResponse("OK:LEFT");
}

void turnRight() {
  Serial.println("   🚗 RIGHT");
  digitalWrite(MOTOR_A_IN1, HIGH);
  digitalWrite(MOTOR_A_IN2, LOW);
  analogWrite(MOTOR_A_EN, motorSpeed);
  digitalWrite(MOTOR_B_IN1, LOW);
  digitalWrite(MOTOR_B_IN2, HIGH);
  analogWrite(MOTOR_B_EN, motorSpeed);
  sendResponse("OK:RIGHT");
}

void stopMotors() {
  Serial.println("   🛑 STOP");
  digitalWrite(MOTOR_A_IN1, LOW);
  digitalWrite(MOTOR_A_IN2, LOW);
  analogWrite(MOTOR_A_EN, 0);
  digitalWrite(MOTOR_B_IN1, LOW);
  digitalWrite(MOTOR_B_IN2, LOW);
  analogWrite(MOTOR_B_EN, 0);
  sendResponse("OK:STOP");
}

void setSpeed(int speed) {
  motorSpeed = constrain(speed, 0, 255);
  Serial.print("   ⚡ Speed set to: ");
  Serial.println(motorSpeed);
  sendResponse("OK:SPEED:" + String(motorSpeed));
}

// ═══════════════════════════════════════════════════════════════════
// LED & BUZZER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

void beep() {
  Serial.println("   🔔 BEEP!");
  digitalWrite(LED_PIN, HIGH);
  delay(100);
  digitalWrite(LED_PIN, LOW);
  delay(100);
  digitalWrite(LED_PIN, HIGH);
  delay(100);
  digitalWrite(LED_PIN, LOW);
}

// ═══════════════════════════════════════════════════════════════════
// SENSOR READING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

void readPIR() {
  int motion = digitalRead(PIR_PIN);
  Serial.print("   🚶 PIR Motion: ");
  Serial.println(motion ? "DETECTED" : "No motion");
  sendResponse("PIR:" + String(motion));
}

void readUltrasonic() {
  // Send trigger pulse
  digitalWrite(ULTRASONIC_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(ULTRASONIC_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRASONIC_TRIG, LOW);
  
  // Read echo
  long duration = pulseIn(ULTRASONIC_ECHO, HIGH, 30000);
  float distance = (duration * 0.034) / 2.0;
  
  if (duration == 0 || distance > 400) {
    distance = -1;
  }
  
  Serial.print("   📏 Distance: ");
  if (distance < 0) {
    Serial.println("Out of range");
  } else {
    Serial.print(distance);
    Serial.println(" cm");
  }
  sendResponse("DIST:" + String((int)distance));
}

void readIR() {
  int irValue = analogRead(IR_SENSOR_PIN);
  int percentage = map(irValue, 0, 1023, 0, 100);
  bool obstacle = irValue < 500;  // Adjust threshold as needed
  
  Serial.print("   📡 IR Sensor: ");
  Serial.print(percentage);
  Serial.print("% - ");
  Serial.println(obstacle ? "OBSTACLE" : "Clear");
  sendResponse("IR:" + String(percentage) + ":" + String(obstacle));
}

void readTemperature() {
  // Simple analog reading (for actual DHT11, use DHT library)
  int raw = analogRead(A0);
  float voltage = raw * (5.0 / 1023.0);
  float temperature = voltage * 100;  // Simplified
  
  Serial.print("   🌡️ Temperature: ");
  Serial.print(temperature, 1);
  Serial.println("°C");
  sendResponse("TEMP:" + String(temperature, 1));
}

void readGas() {
  int gasValue = analogRead(GAS_SENSOR_PIN);
  int percentage = map(gasValue, 0, 1023, 0, 100);
  
  Serial.print("   💨 Gas Level: ");
  Serial.print(percentage);
  Serial.println("%");
  
  if (percentage > 40) {
    Serial.println("   ⚠️ WARNING: High gas level!");
  }
  sendResponse("GAS:" + String(percentage));
}

void readLight() {
  int lightValue = analogRead(LDR_PIN);
  int percentage = map(lightValue, 0, 1023, 0, 100);
  
  Serial.print("   💡 Light Level: ");
  Serial.print(percentage);
  Serial.print("% - ");
  
  if (percentage < 20) Serial.println("DARK");
  else if (percentage < 50) Serial.println("DIM");
  else if (percentage < 80) Serial.println("BRIGHT");
  else Serial.println("VERY BRIGHT");
  
  sendResponse("LIGHT:" + String(percentage));
}

void readSoilMoisture() {
  int soilValue = analogRead(SOIL_PIN);
  int percentage = map(soilValue, 1023, 0, 0, 100);  // Inverted
  
  Serial.print("   🌱 Soil Moisture: ");
  Serial.print(percentage);
  Serial.print("% - ");
  
  if (percentage < 30) Serial.println("DRY - Needs water!");
  else if (percentage < 60) Serial.println("GOOD");
  else Serial.println("WET");
  
  sendResponse("SOIL:" + String(percentage));
}

void readSound() {
  int soundValue = analogRead(SOUND_PIN);
  int percentage = map(soundValue, 0, 1023, 0, 100);
  
  Serial.print("   🔊 Sound Level: ");
  Serial.print(percentage);
  Serial.println("%");
  sendResponse("SOUND:" + String(percentage));
}

void readAllSensors() {
  Serial.println("\n═══════════════════════════════════");
  Serial.println("📊 ALL SENSOR READINGS");
  Serial.println("═══════════════════════════════════");
  
  readPIR();
  readUltrasonic();
  readIR();
  readLight();
  readGas();
  readSoilMoisture();
  readSound();
  
  Serial.println("═══════════════════════════════════\n");
}

// ═══════════════════════════════════════════════════════════════════
// COMMUNICATION WITH ESP8266
// ═══════════════════════════════════════════════════════════════════

void sendResponse(String response) {
  espSerial.println(response);
}

/*
 * ═══════════════════════════════════════════════════════════════════
 * WIRING GUIDE - ARDUINO CONNECTIONS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * MOTOR DRIVER (L298N):
 * ─────────────────────
 * Arduino D5  → ENA (Motor A Speed - PWM)
 * Arduino D4  → IN1 (Motor A Direction)
 * Arduino D3  → IN2 (Motor A Direction)
 * Arduino D6  → ENB (Motor B Speed - PWM)
 * Arduino D7  → IN3 (Motor B Direction)
 * Arduino D8  → IN4 (Motor B Direction)
 * Arduino GND → L298N GND
 * 
 * ESP8266 COMMUNICATION:
 * ──────────────────────
 * Arduino D10 (RX) ← ESP8266 GPIO15/D8 (TX)
 * Arduino D11 (TX) → ESP8266 GPIO13/D7 (RX) ⚠️ Use voltage divider!
 * Arduino GND      → ESP8266 GND
 * 
 * SENSORS (Connect as per level):
 * ───────────────────────────────
 * Level 1 - PIR:        D2
 * Level 2 - Ultrasonic: D12 (TRIG), D13 (ECHO)
 * Level 3 - IR:         A0
 * Level 5 - DHT11:      D9
 * Level 6 - Gas (MQ-2): A1
 * Level 7 - LDR:        A2
 * Level 8 - Soil:       A3
 * Level 9 - Sound:      A4
 * LED/Buzzer:           A5
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

