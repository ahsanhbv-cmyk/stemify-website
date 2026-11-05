// STEMify Complete Course Content Setup
// Run this ONCE to populate all tasks and quizzes in Firebase

import { realtimeDb } from "./firebase";
import { ref, set } from "firebase/database";

// ═══════════════════════════════════════════════════════════════════
// 📚 COMPLETE COURSE CONTENT - 10 LEVELS × 3 TASKS × 1 QUIZ EACH
// NEW SENSOR SEQUENCE: PIR → Ultrasonic → IR → Bluetooth → Temperature → Gas → LDR → Soil Moisture → Sound → Computer Vision
// ═══════════════════════════════════════════════════════════════════

const COMPLETE_COURSE_CONTENT = {
  // ═══════════════════════════════════════════════════════════════════
  // LEVEL 1: PIR MOTION SENSOR (HC-SR501)
  // ═══════════════════════════════════════════════════════════════════
  levelTasks: {
    1: [
      {
        id: 1001,
        taskNumber: 1,
        level: 1,
        sensor: "PIR Motion Sensor (HC-SR501)",
        type: "learning",
        title: "Learn About PIR Motion Sensor",
        description: "Understand how PIR sensors detect human and animal movement using infrared radiation.",
        instructions: `📚 ABOUT PIR MOTION SENSOR:

🔍 WHAT IS PIR?
PIR stands for "Passive Infrared". It detects motion by sensing changes in infrared (heat) radiation.

🎯 WHY WE USE PIR SENSOR:
• Security systems and alarms
• Automatic lights that turn on when you enter
• Smart home automation
• Energy saving (lights/AC turn off when no one is around)

📏 SENSOR SPECIFICATIONS:
• Operating Voltage: 5V DC
• Detection Range: 3-7 meters
• Detection Angle: ~120°
• Output: HIGH when motion detected
• Warm-up Time: 30-60 seconds

⚙️ HOW IT WORKS:
1. PIR sensor has a special lens (Fresnel lens)
2. The lens focuses infrared radiation onto the sensor
3. When a warm body (human/animal) moves, the IR pattern changes
4. The sensor detects this change and outputs HIGH signal

🧱 BLOCK CODING PREVIEW (Task 3):
In Task 3, you'll create a Security System:
┌─────────────────────────┐
│ 🔄 LOOP FOREVER         │
│   📡 READ PIR SENSOR    │
│   ❓ IF Motion Detected │
│      🔔 ALARM ON        │
│      💡 LED ON          │
│   ❓ ELSE               │
│      🔔 ALARM OFF       │
│      💡 LED OFF         │
└─────────────────────────┘

✅ Continue to Task 2 to learn wiring!`
      },
      {
        id: 1002,
        taskNumber: 2,
        level: 1,
        sensor: "PIR Motion Sensor (HC-SR501)",
        type: "wiring",
        title: "Connect PIR Motion Sensor to Arduino",
        description: "Learn step-by-step how to wire the PIR sensor to your Arduino board.",
        instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x PIR Motion Sensor (HC-SR501)
• 1x Arduino Nano/Uno
• 3x Jumper wires (Female-to-Male)
• 1x Breadboard (optional)

📍 PIR SENSOR PINS (3 pins):
┌─────────────────────────────┐
│  [VCC]   [OUT]   [GND]      │
│    │       │       │        │
│   5V    Signal   Ground     │
└─────────────────────────────┘

🔗 WIRING CONNECTIONS:

   PIR Sensor          Arduino
   ──────────          ───────
   VCC (Power)    →    5V
   GND (Ground)   →    GND
   OUT (Signal)   →    Pin D2

📋 STEP-BY-STEP:
1. Locate the 3 pins on your PIR sensor
2. Connect VCC pin to Arduino 5V (Red wire)
3. Connect GND pin to Arduino GND (Black wire)
4. Connect OUT pin to Arduino Digital Pin 2 (Yellow/Green wire)

⚙️ SENSOR ADJUSTMENTS:
The PIR sensor has 2 potentiometers (small screws):
• LEFT POT: Sensitivity - How far it can detect (turn clockwise for more range)
• RIGHT POT: Time Delay - How long output stays HIGH (turn clockwise for longer)

🔘 JUMPER SETTING:
• Position H (Hold): Repeat trigger - stays HIGH while motion continues
• Position L (Low): Single trigger - outputs once per detection

⚠️ IMPORTANT:
• Wait 30-60 seconds after powering on for sensor to stabilize
• Don't move in front of sensor during warm-up
• Keep away from heat sources (AC vents, heaters)

✅ Double-check your connections, then proceed to Task 3!`
      },
      {
        id: 1003,
        taskNumber: 3,
        level: 1,
        sensor: "PIR Motion Sensor (HC-SR501)",
        type: "coding",
        title: "Block Coding: Security Alarm System",
        description: "Use block coding to create a motion-activated security alarm!",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a Security Alarm System:
When motion is detected, turn on alarm and LED!

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ SENSOR (PIR Motion)
   ❓ IF Motion = TRUE
      🔔 BUZZER ON
      💡 LED ON (Red)
      ⏱️ WAIT 2 seconds
   ❓ ELSE
      🔔 BUZZER OFF
      💡 LED OFF
   ⏱️ WAIT 100ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 BLOCKS TO USE:
1. "Loop Forever" - Keeps checking continuously
2. "Read PIR Sensor" - Gets motion status (TRUE/FALSE)
3. "If-Else" - Makes decision based on motion
4. "Buzzer ON/OFF" - Controls alarm sound
5. "LED ON/OFF" - Controls indicator light
6. "Wait" - Adds delay

🎯 HOW IT WORKS:
1. The program continuously reads the PIR sensor
2. When motion detected → Alarm sounds, LED lights up
3. After 2 seconds → Check again
4. No motion → Alarm and LED turn off

💡 TIPS:
• Position sensor facing the area you want to monitor
• Start with low sensitivity, then increase
• Test by walking past the sensor

Go to Block Coding tab and build this program!
Click "Send to Car" to test on your STEMify car!`
      }
    ],

    // ═══════════════════════════════════════════════════════════════════
    // LEVEL 2: ULTRASONIC SENSOR (HC-SR04)
    // ═══════════════════════════════════════════════════════════════════
    2: [
      {
        id: 2001,
        taskNumber: 1,
        level: 2,
        sensor: "Ultrasonic Sensor (HC-SR04)",
        type: "learning",
        title: "Learn About Ultrasonic Sensor",
        description: "Understand how ultrasonic sensors measure distance using sound waves.",
        instructions: `📚 ABOUT ULTRASONIC SENSOR:

🔍 WHAT IS ULTRASONIC SENSOR?
A sensor that measures distance by sending sound waves and measuring how long they take to bounce back - just like how bats navigate!

🎯 WHY WE USE ULTRASONIC SENSOR:
• Obstacle detection and avoidance
• Distance measurement
• Parking sensors in cars
• Robot navigation
• Level measurement (water tanks)

📏 SENSOR SPECIFICATIONS:
• Operating Voltage: 5V DC
• Detection Range: 2cm - 400cm
• Accuracy: ±3mm
• Ultrasonic Frequency: 40kHz
• Pins: VCC, TRIG, ECHO, GND

⚙️ HOW IT WORKS:
1. TRIG pin sends a short ultrasonic pulse (40kHz sound)
2. Sound wave travels, hits object, bounces back
3. ECHO pin receives the reflected sound
4. Distance = (Time × Speed of Sound) / 2

🧱 BLOCK CODING PREVIEW (Task 3):
In Task 3, you'll create an Obstacle Avoider:
┌─────────────────────────────┐
│ 🔄 LOOP FOREVER             │
│   📡 READ DISTANCE          │
│   ❓ IF Distance < 20cm     │
│      🛑 STOP                │
│      ➡️ TURN RIGHT          │
│   ❓ ELSE                   │
│      ⬆️ MOVE FORWARD        │
└─────────────────────────────┘

✅ Continue to Task 2 to learn wiring!`
      },
      {
        id: 2002,
        taskNumber: 2,
        level: 2,
        sensor: "Ultrasonic Sensor (HC-SR04)",
        type: "wiring",
        title: "Connect Ultrasonic Sensor to Arduino",
        description: "Learn step-by-step how to wire the HC-SR04 sensor.",
        instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x Ultrasonic Sensor (HC-SR04)
• 1x Arduino Nano/Uno
• 4x Jumper wires

📍 ULTRASONIC SENSOR PINS (4 pins):
┌─────────────────────────────────┐
│  [VCC] [TRIG] [ECHO] [GND]      │
│    │     │      │      │        │
│   5V   Trigger Echo  Ground     │
└─────────────────────────────────┘

🔗 WIRING CONNECTIONS:

   HC-SR04            Arduino
   ───────            ───────
   VCC (Power)    →   5V
   GND (Ground)   →   GND
   TRIG (Trigger) →   Pin D12
   ECHO (Echo)    →   Pin D13

📋 STEP-BY-STEP:
1. Connect VCC to Arduino 5V (Red wire)
2. Connect GND to Arduino GND (Black wire)
3. Connect TRIG to Arduino Pin 12 (Yellow wire)
4. Connect ECHO to Arduino Pin 13 (Green wire)

⚠️ IMPORTANT NOTES:
• HC-SR04 needs 5V (won't work well with 3.3V)
• Keep sensor away from soft/angled surfaces
• Sound-absorbing materials may not reflect well
• Mount sensor level and pointing straight ahead

📐 MOUNTING TIPS:
• Mount on front of car for obstacle detection
• Keep sensor clear of obstructions
• Ensure it has clear "line of sight"

✅ Verify connections and proceed to Task 3!`
      },
      {
        id: 2003,
        taskNumber: 3,
        level: 2,
        sensor: "Ultrasonic Sensor (HC-SR04)",
        type: "coding",
        title: "Block Coding: Obstacle Avoider",
        description: "Program your car to automatically detect and avoid obstacles!",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create an Obstacle Avoiding Robot:
Car moves forward but turns when obstacle detected!

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ DISTANCE (Ultrasonic)
   ❓ IF Distance < 20cm
      🛑 STOP
      ⏱️ WAIT 300ms
      ⬇️ MOVE BACKWARD
      ⏱️ WAIT 500ms
      ➡️ TURN RIGHT
      ⏱️ WAIT 400ms
   ❓ ELSE
      ⬆️ MOVE FORWARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 BLOCKS TO USE:
1. "Loop Forever" - Continuous operation
2. "Read Distance" - Gets distance in cm
3. "If-Else" - Decision making
4. "Move Forward/Backward" - Control movement
5. "Turn Right/Left" - Change direction
6. "Stop" - Stop all motors
7. "Wait" - Timing control

🎯 HOW IT WORKS:
1. Constantly measure distance ahead
2. If obstacle within 20cm → Stop, backup, turn
3. If clear → Keep moving forward

💡 TIPS:
• Adjust the 20cm threshold based on your needs
• Add random left/right turns for better navigation
• Lower speed near obstacles for safety

Go to Block Coding tab and build this program!`
      }
    ],

    // ═══════════════════════════════════════════════════════════════════
    // LEVEL 3: IR OBSTACLE SENSOR
    // ═══════════════════════════════════════════════════════════════════
    3: [
      {
        id: 3001,
        taskNumber: 1,
        level: 3,
        sensor: "IR Obstacle Sensor",
        type: "learning",
        title: "Learn About IR Sensor",
        description: "Understand how infrared sensors detect obstacles and lines.",
        instructions: `📚 ABOUT IR OBSTACLE SENSOR:

🔍 WHAT IS IR SENSOR?
IR (Infrared) sensors detect objects by emitting infrared light and measuring the reflection.

🎯 WHY WE USE IR SENSOR:
• Line following robots
• Edge detection (prevents falling)
• Close-range obstacle detection
• Object counting
• Proximity sensing

📏 SENSOR SPECIFICATIONS:
• Operating Voltage: 3.3V - 5V
• Detection Range: 2cm - 30cm (adjustable)
• Output: Digital (HIGH/LOW)
• Has potentiometer to adjust sensitivity
• Has indicator LEDs

⚙️ HOW IT WORKS:
1. IR LED emits infrared light (invisible to humans)
2. Light hits an object and reflects back
3. IR receiver detects the reflected light
4. Outputs LOW when obstacle detected, HIGH when clear

🎨 COLOR MATTERS:
• White/Light colors → Reflect IR well → Better detection
• Black/Dark colors → Absorb IR → Poor detection
• This is why line followers use black tape on white surface!

🧱 BLOCK CODING PREVIEW (Task 3):
In Task 3, you'll create a Line Follower:
┌─────────────────────────────┐
│ 🔄 LOOP FOREVER             │
│   📡 READ IR SENSOR         │
│   ❓ IF Line Detected       │
│      ⬆️ MOVE FORWARD        │
│   ❓ ELSE                   │
│      🔍 SEARCH FOR LINE     │
└─────────────────────────────┘

✅ Continue to Task 2 to learn wiring!`
      },
      {
        id: 3002,
        taskNumber: 2,
        level: 3,
        sensor: "IR Obstacle Sensor",
        type: "wiring",
        title: "Connect IR Sensor to Arduino",
        description: "Learn step-by-step how to wire the IR obstacle sensor.",
        instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x IR Obstacle Sensor Module
• 1x Arduino Nano/Uno
• 3x Jumper wires

📍 IR SENSOR PINS (3 pins):
┌─────────────────────────────┐
│  [VCC]   [GND]   [OUT]      │
│    │       │       │        │
│  Power  Ground  Signal      │
└─────────────────────────────┘

🔗 WIRING CONNECTIONS:

   IR Sensor           Arduino
   ─────────           ───────
   VCC (Power)     →   5V
   GND (Ground)    →   GND
   OUT (Signal)    →   Pin D3

📋 STEP-BY-STEP:
1. Connect VCC to Arduino 5V (Red wire)
2. Connect GND to Arduino GND (Black wire)
3. Connect OUT to Arduino Pin 3 (Yellow wire)

⚙️ ADJUSTING SENSITIVITY:
The sensor has a small potentiometer (blue box with screw):
• Turn CLOCKWISE → Increase range (detect farther)
• Turn COUNTER-CLOCKWISE → Decrease range (detect closer)

💡 LED INDICATORS:
• Power LED: Always ON when powered
• Signal LED: ON when obstacle detected

📐 MOUNTING FOR LINE FOLLOWING:
• Mount pointing DOWN at the ground
• Height: 1-2cm from ground
• Slightly angled forward

📐 MOUNTING FOR OBSTACLE DETECTION:
• Mount pointing FORWARD
• At front of car
• Clear line of sight

✅ Adjust sensitivity and proceed to Task 3!`
      },
      {
        id: 3003,
        taskNumber: 3,
        level: 3,
        sensor: "IR Obstacle Sensor",
        type: "coding",
        title: "Block Coding: Line Following Robot",
        description: "Program your car to follow a black line on white surface!",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a Line Following Robot:
Car follows a black line on white surface!

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ IR SENSOR
   ❓ IF Line Detected (BLACK)
      ⬆️ MOVE FORWARD
      💡 LED ON
   ❓ ELSE (WHITE surface)
      🛑 STOP
      ➡️ TURN RIGHT slightly
      ⏱️ WAIT 100ms
      📡 READ IR SENSOR
      ❓ IF Still No Line
         ⬅️ TURN LEFT slightly
         ⏱️ WAIT 200ms
      💡 LED OFF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 BLOCKS TO USE:
1. "Loop Forever" - Continuous operation
2. "Read IR Sensor" - Detect line (TRUE = black line)
3. "If-Else" - Decision based on detection
4. "Move Forward" - Follow the line
5. "Turn Right/Left" - Search for line
6. "Stop" - Pause movement

🎯 HOW IT WORKS:
1. Sensor points down at the ground
2. Black line detected → Move forward
3. White surface (lost line) → Search by turning
4. Found line again → Resume forward movement

🛤️ MAKING A TRACK:
• Use black electrical tape on white paper/board
• Make smooth curves (no sharp turns)
• Start with simple oval track

💡 TIPS:
• Adjust IR sensor sensitivity for your surface
• Lower speed = better line following
• Add second IR sensor for better tracking

Go to Block Coding tab and build this program!`
      }
    ],

    // ═══════════════════════════════════════════════════════════════════
    // LEVEL 4: BLUETOOTH MODULE (HC-05)
    // ═══════════════════════════════════════════════════════════════════
    4: [
      {
        id: 4001,
        taskNumber: 1,
        level: 4,
        sensor: "Bluetooth Module (HC-05)",
        type: "learning",
        title: "Learn About Bluetooth Module",
        description: "Understand how Bluetooth wireless communication works.",
        instructions: `📚 ABOUT BLUETOOTH MODULE (HC-05):

🔍 WHAT IS BLUETOOTH?
Bluetooth is a wireless technology for exchanging data over short distances. Named after Viking King Harald "Bluetooth" Gormsson!

🎯 WHY WE USE BLUETOOTH:
• Wireless control of robots/cars
• Send commands from smartphone
• Receive sensor data on phone
• No wires = more freedom!
• Easy to connect (pairing)

📏 MODULE SPECIFICATIONS:
• Operating Voltage: 3.3V - 5V
• Communication: Serial (UART)
• Range: Up to 10 meters
• Default Password: "1234"
• Baud Rate: 9600 (default)

⚙️ HOW IT WORKS:
1. Phone sends Bluetooth command
2. HC-05 receives the signal
3. Converts to serial data for Arduino
4. Arduino reads and executes command
5. Can also send data back to phone!

📱 BLUETOOTH COMMANDS WE'LL USE:
• 'F' → Move Forward
• 'B' → Move Backward
• 'L' → Turn Left
• 'R' → Turn Right
• 'S' → Stop

🧱 BLOCK CODING PREVIEW (Task 3):
In Task 3, you'll create Phone-Controlled Car:
┌─────────────────────────────┐
│ 🔄 LOOP FOREVER             │
│   📡 READ BLUETOOTH         │
│   ❓ IF Command = 'F'       │
│      ⬆️ MOVE FORWARD        │
│   ❓ IF Command = 'S'       │
│      🛑 STOP                │
└─────────────────────────────┘

✅ Continue to Task 2 to learn wiring!`
      },
      {
        id: 4002,
        taskNumber: 2,
        level: 4,
        sensor: "Bluetooth Module (HC-05)",
        type: "wiring",
        title: "Connect Bluetooth Module to Arduino",
        description: "Learn how to wire HC-05 Bluetooth module safely.",
        instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x HC-05 Bluetooth Module
• 1x Arduino Nano/Uno
• 4x Jumper wires
• 2x Resistors (1K and 2K) for voltage divider

📍 HC-05 PINS:
┌──────────────────────────────────┐
│  [VCC] [GND] [TXD] [RXD] [STATE]│
│    │     │     │     │      │   │
│  Power Ground  TX   RX   Status │
└──────────────────────────────────┘

🔗 WIRING CONNECTIONS:

   HC-05              Arduino
   ─────              ───────
   VCC (Power)    →   5V
   GND (Ground)   →   GND
   TXD (Transmit) →   Pin D10 (SoftwareSerial RX)
   RXD (Receive)  →   Pin D11 (Through voltage divider!)

⚠️ IMPORTANT - VOLTAGE DIVIDER FOR RXD:
HC-05 RXD pin is 3.3V! Arduino outputs 5V!
You MUST use a voltage divider:

   Arduino Pin 11 ──[1KΩ]──┬──[2KΩ]── GND
                           │
                           └── HC-05 RXD

Or use this simpler method:
   Arduino Pin 11 ──[1KΩ]── HC-05 RXD

📋 STEP-BY-STEP:
1. Connect VCC to Arduino 5V (Red wire)
2. Connect GND to Arduino GND (Black wire)
3. Connect TXD to Arduino Pin 10 (Green wire)
4. Connect RXD through voltage divider to Pin 11 (Yellow wire)

💡 LED INDICATORS:
• Blinking fast: Ready to pair
• Blinking slow: Connected
• Double blink: AT Command mode

📱 PAIRING WITH PHONE:
1. Power on HC-05
2. Open phone Bluetooth settings
3. Find "HC-05" and pair
4. Enter password: 1234
5. Use Bluetooth terminal app to send commands

✅ Wire carefully and proceed to Task 3!`
      },
      {
        id: 4003,
        taskNumber: 3,
        level: 4,
        sensor: "Bluetooth Module (HC-05)",
        type: "coding",
        title: "Block Coding: Phone-Controlled Car",
        description: "Control your car wirelessly using your smartphone!",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a Phone-Controlled Car:
Control your car with Bluetooth commands from phone!

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ BLUETOOTH Command
   ❓ IF Command = 'F'
      ⬆️ MOVE FORWARD
      💡 LED ON
   ❓ ELSE IF Command = 'B'
      ⬇️ MOVE BACKWARD
   ❓ ELSE IF Command = 'L'
      ⬅️ TURN LEFT
   ❓ ELSE IF Command = 'R'
      ➡️ TURN RIGHT
   ❓ ELSE IF Command = 'S'
      🛑 STOP
      💡 LED OFF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 BLOCKS TO USE:
1. "Loop Forever" - Always listening
2. "Read Bluetooth" - Get command character
3. "If-Else If" - Multiple command handling
4. "Move Forward/Backward" - Direction control
5. "Turn Left/Right" - Steering
6. "Stop" - Halt movement

📱 PHONE APP SETUP:
1. Download "Bluetooth RC Controller" or similar app
2. Connect to HC-05
3. Configure buttons to send: F, B, L, R, S

🎯 COMMAND REFERENCE:
• F = Forward
• B = Backward
• L = Left
• R = Right
• S = Stop

💡 TIPS:
• Test one command at a time
• Start with Stop command first
• Keep phone within 10m range
• If disconnected, just reconnect

🎮 BONUS COMMANDS TO ADD:
• 'H' = Horn (Buzzer)
• '1' = Speed Low
• '2' = Speed Medium
• '3' = Speed High

Go to Block Coding tab and build this program!`
      }
    ],

    // ═══════════════════════════════════════════════════════════════════
    // LEVEL 5: TEMPERATURE SENSOR (DHT11)
    // ═══════════════════════════════════════════════════════════════════
    5: [
      {
        id: 5001,
        taskNumber: 1,
        level: 5,
        sensor: "Temperature Sensor (DHT11)",
        type: "learning",
        title: "Learn About Temperature & Humidity Sensor",
        description: "Understand how DHT11 measures temperature and humidity.",
        instructions: `📚 ABOUT DHT11 SENSOR:

🔍 WHAT IS DHT11?
A digital sensor that measures both temperature AND humidity in one package!

🎯 WHY WE USE DHT11:
• Weather stations
• Indoor climate monitoring
• Greenhouse automation
• HVAC systems
• Smart home projects

📏 SENSOR SPECIFICATIONS:
• Operating Voltage: 3.3V - 5V
• Temperature Range: 0°C to 50°C
• Temperature Accuracy: ±2°C
• Humidity Range: 20% to 80%
• Humidity Accuracy: ±5%
• Sampling Rate: 1 reading per second

⚙️ HOW IT WORKS:
1. Contains a thermistor (temperature-sensitive resistor)
2. Contains a humidity-sensitive capacitor
3. Internal chip converts readings to digital signal
4. Uses one-wire protocol (single data pin)

🌡️ TEMPERATURE VS HUMIDITY:
• Temperature: How hot or cold the air is
• Humidity: How much water vapor is in the air
• Both affect comfort level!

🧱 BLOCK CODING PREVIEW (Task 3):
In Task 3, you'll create a Climate Alert System:
┌─────────────────────────────┐
│ 🔄 LOOP FOREVER             │
│   📡 READ TEMPERATURE       │
│   ❓ IF Temp > 35°C         │
│      🔔 HOT ALERT!          │
│   ❓ IF Temp < 15°C         │
│      💡 COLD WARNING        │
└─────────────────────────────┘

✅ Continue to Task 2 to learn wiring!`
      },
      {
        id: 5002,
        taskNumber: 2,
        level: 5,
        sensor: "Temperature Sensor (DHT11)",
        type: "wiring",
        title: "Connect DHT11 to Arduino",
        description: "Learn how to wire the temperature and humidity sensor.",
        instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x DHT11 Sensor (or module)
• 1x Arduino Nano/Uno
• 3x Jumper wires
• 1x 10K Resistor (if using bare sensor)

📍 DHT11 PINS (3-pin module):
┌─────────────────────────────┐
│    [VCC]  [DATA]  [GND]     │
│      │      │       │       │
│    Power  Signal  Ground    │
└─────────────────────────────┘

🔗 WIRING CONNECTIONS:

   DHT11              Arduino
   ─────              ───────
   VCC (Power)    →   5V
   GND (Ground)   →   GND
   DATA (Signal)  →   Pin D4

📋 STEP-BY-STEP:
1. Connect VCC to Arduino 5V (Red wire)
2. Connect GND to Arduino GND (Black wire)
3. Connect DATA to Arduino Pin 4 (Yellow wire)

💡 IF USING BARE SENSOR (4-PIN):
Add 10K pull-up resistor between VCC and DATA:

   5V ──┬── VCC
        │
       [10KΩ]
        │
        ├── DATA ── Pin D4
        │
   GND ─┴── GND

⚠️ IMPORTANT NOTES:
• Wait at least 1 second between readings
• First reading may be incorrect - discard it
• Keep sensor away from direct sunlight
• Don't touch the sensor grid

📐 MOUNTING:
• Mount in open air for accurate readings
• Away from heat sources
• Protected from rain/water

✅ Connect and proceed to Task 3!`
      },
      {
        id: 5003,
        taskNumber: 3,
        level: 5,
        sensor: "Temperature Sensor (DHT11)",
        type: "coding",
        title: "Block Coding: Climate Alert System",
        description: "Create an automatic temperature monitoring and alert system!",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a Climate Alert System:
Monitor temperature and alert for extreme conditions!

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ TEMPERATURE
   📡 READ HUMIDITY
   
   ❓ IF Temperature > 35°C
      🔔 BUZZER ON (Hot alert!)
      💡 LED RED
      ⏱️ WAIT 1 second
      🔔 BUZZER OFF
      
   ❓ ELSE IF Temperature < 15°C
      💡 LED BLUE (Cold)
      💡 LED BLINK
      
   ❓ ELSE
      💡 LED GREEN (Comfortable)
   
   ⏱️ WAIT 2 seconds
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 BLOCKS TO USE:
1. "Loop Forever" - Continuous monitoring
2. "Read Temperature" - Get temp in °C
3. "Read Humidity" - Get humidity %
4. "If-Else If-Else" - Multiple conditions
5. "Buzzer ON/OFF" - Audio alert
6. "LED Color" - Visual indication
7. "Wait" - Delay between readings

🌡️ TEMPERATURE ZONES:
• Above 35°C = HOT (danger!)
• 15°C to 35°C = Comfortable
• Below 15°C = COLD

💡 BONUS FEATURES:
• Add humidity alert (>80% = too humid)
• Display readings on serial monitor
• Log data over time

Go to Block Coding tab and build this program!`
      }
    ],

    // ═══════════════════════════════════════════════════════════════════
    // LEVEL 6: GAS SENSOR (MQ-2)
    // ═══════════════════════════════════════════════════════════════════
    6: [
      {
        id: 6001,
        taskNumber: 1,
        level: 6,
        sensor: "Gas Sensor (MQ-2)",
        type: "learning",
        title: "Learn About Gas Sensor",
        description: "Understand how MQ-2 detects dangerous gases and smoke.",
        instructions: `📚 ABOUT MQ-2 GAS SENSOR:

🔍 WHAT IS MQ-2?
A gas sensor that can detect multiple flammable gases and smoke - essential for safety!

🎯 WHY WE USE GAS SENSOR:
• Gas leak detection (LPG, natural gas)
• Smoke detection (fire alarm)
• Air quality monitoring
• Industrial safety
• Kitchen safety systems

📏 SENSOR SPECIFICATIONS:
• Operating Voltage: 5V DC
• Detects: LPG, Smoke, Methane, Propane, Hydrogen
• Heater Voltage: 5V
• Warm-up Time: 2-5 minutes (48 hours for best accuracy)
• Output: Analog (A0) and Digital (D0)

⚠️ SAFETY WARNING:
MQ-2 heater gets HOT! Handle carefully!

⚙️ HOW IT WORKS:
1. Internal heater warms a tin dioxide (SnO2) layer
2. Clean air: High resistance, low output
3. Gas present: Low resistance, high output
4. More gas = higher voltage output

🔢 TWO OUTPUT TYPES:
• A0 (Analog): Variable voltage (0-5V) based on gas concentration
• D0 (Digital): HIGH/LOW based on threshold (adjustable)

🧱 BLOCK CODING PREVIEW (Task 3):
In Task 3, you'll create a Gas Leak Alarm:
┌─────────────────────────────┐
│ 🔄 LOOP FOREVER             │
│   📡 READ GAS LEVEL         │
│   ❓ IF Gas > 40%           │
│      🚨 EMERGENCY ALARM!    │
│   ❓ IF Gas > 20%           │
│      ⚠️ WARNING BEEP        │
└─────────────────────────────┘

✅ Continue to Task 2 to learn wiring!`
      },
      {
        id: 6002,
        taskNumber: 2,
        level: 6,
        sensor: "Gas Sensor (MQ-2)",
        type: "wiring",
        title: "Connect Gas Sensor to Arduino",
        description: "Learn how to safely wire the MQ-2 gas sensor.",
        instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x MQ-2 Gas Sensor Module
• 1x Arduino Nano/Uno
• 4x Jumper wires

📍 MQ-2 MODULE PINS:
┌─────────────────────────────────┐
│  [VCC] [GND] [D0]  [A0]         │
│    │     │    │      │          │
│  Power Ground Digital Analog    │
└─────────────────────────────────┘

🔗 WIRING CONNECTIONS:

   MQ-2               Arduino
   ────               ───────
   VCC (Power)    →   5V (Must be 5V!)
   GND (Ground)   →   GND
   A0 (Analog)    →   Pin A0
   D0 (Digital)   →   Pin D5 (optional)

📋 STEP-BY-STEP:
1. Connect VCC to Arduino 5V (Red wire)
2. Connect GND to Arduino GND (Black wire)
3. Connect A0 to Arduino Analog Pin A0 (Yellow wire)
4. Optionally connect D0 to Pin D5 (Green wire)

⚙️ ADJUSTING THRESHOLD:
The module has a potentiometer:
• Turn CLOCKWISE → Higher threshold (less sensitive)
• Turn COUNTER-CLOCKWISE → Lower threshold (more sensitive)

⚠️ IMPORTANT NOTES:
• Sensor needs 5V (not 3.3V) for heater
• Wait 2-5 minutes for warm-up
• Best accuracy after 24-48 hours burn-in
• Keep in ventilated area
• Heater gets HOT - don't touch!

📐 PLACEMENT:
• Near potential gas leak sources
• Not directly above stove
• At appropriate height (LPG is heavier than air)

✅ Power on and let warm up before Task 3!`
      },
      {
        id: 6003,
        taskNumber: 3,
        level: 6,
        sensor: "Gas Sensor (MQ-2)",
        type: "coding",
        title: "Block Coding: Gas Leak Alarm System",
        description: "Create a safety system that detects gas leaks and alerts!",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a Gas Leak Alarm System:
Detect dangerous gas levels and sound emergency alarm!

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ GAS LEVEL (%)
   
   ❓ IF Gas Level > 40%
      🚨 ALARM CONTINUOUS!
      💡 LED BLINK FAST (RED)
      🛑 STOP CAR (Safety!)
      📢 Display "DANGER!"
      
   ❓ ELSE IF Gas Level > 20%
      🔔 WARNING BEEP
      💡 LED YELLOW
      ⏱️ WAIT 1 second
      🔔 BEEP OFF
      
   ❓ ELSE
      💡 LED GREEN (Safe)
      🔔 ALARM OFF
      
   ⏱️ WAIT 500ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 BLOCKS TO USE:
1. "Loop Forever" - Continuous monitoring
2. "Read Gas Sensor" - Get gas percentage
3. "If-Else If-Else" - Multiple alert levels
4. "Alarm/Buzzer" - Audio warning
5. "LED Color/Blink" - Visual warning
6. "Stop" - Emergency stop

🎯 ALERT LEVELS:
• 0-20%: Safe (Green LED)
• 20-40%: Warning (Yellow + Beep)
• 40%+: DANGER! (Red + Continuous Alarm)

⚠️ TESTING SAFELY:
• Test with lighter gas briefly (don't ignite!)
• Or test near alcohol hand sanitizer vapor
• Always test in ventilated area

💡 REAL-WORLD APPLICATION:
This is exactly how commercial gas detectors work!
Your program could save lives!

Go to Block Coding tab and build this program!`
      }
    ],

    // ═══════════════════════════════════════════════════════════════════
    // LEVEL 7: LDR LIGHT SENSOR
    // ═══════════════════════════════════════════════════════════════════
    7: [
      {
        id: 7001,
        taskNumber: 1,
        level: 7,
        sensor: "LDR Light Sensor",
        type: "learning",
        title: "Learn About Light Sensor (LDR)",
        description: "Understand how LDR detects light intensity.",
        instructions: `📚 ABOUT LDR (LIGHT DEPENDENT RESISTOR):

🔍 WHAT IS LDR?
A resistor that changes its resistance based on light intensity. More light = less resistance!

🎯 WHY WE USE LDR:
• Automatic street lights
• Day/night detection
• Light-following robots
• Screen brightness control
• Camera exposure meters

📏 SENSOR SPECIFICATIONS:
• Resistance in dark: 1MΩ or more
• Resistance in light: Few hundred ohms
• Response time: ~20-30ms
• Spectral peak: ~550nm (green light)
• Operating voltage: 3.3V - 5V (with resistor)

⚙️ HOW IT WORKS:
1. LDR contains cadmium sulfide (CdS)
2. Light photons hit the CdS
3. Photons create electron-hole pairs
4. More light = more charge carriers = less resistance

📊 RESISTANCE CHANGES:
• Bright sunlight: ~100-500Ω
• Room light: ~5KΩ-10KΩ
• Dark room: ~200KΩ-1MΩ
• Total darkness: ~10MΩ+

🧱 BLOCK CODING PREVIEW (Task 3):
In Task 3, you'll create Auto Headlights:
┌─────────────────────────────┐
│ 🔄 LOOP FOREVER             │
│   📡 READ LIGHT LEVEL       │
│   ❓ IF Light < 20%         │
│      💡 HEADLIGHTS ON       │
│   ❓ ELSE                   │
│      💡 HEADLIGHTS OFF      │
└─────────────────────────────┘

✅ Continue to Task 2 to learn wiring!`
      },
      {
        id: 7002,
        taskNumber: 2,
        level: 7,
        sensor: "LDR Light Sensor",
        type: "wiring",
        title: "Connect LDR to Arduino",
        description: "Learn how to create a voltage divider circuit with LDR.",
        instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x LDR (Light Dependent Resistor)
• 1x 10K Ohm Resistor
• 1x Arduino Nano/Uno
• 3x Jumper wires
• OR 1x LDR Module (simpler)

📍 OPTION 1 - USING LDR MODULE:
┌─────────────────────────────┐
│  [VCC]  [GND]  [A0]  [D0]   │
│    │      │      │     │    │
│  Power  Ground Analog Digital│
└─────────────────────────────┘

   LDR Module         Arduino
   ──────────         ───────
   VCC            →   5V
   GND            →   GND
   A0             →   Pin A1
   D0             →   Pin D6 (optional)

📍 OPTION 2 - USING BARE LDR:
Create voltage divider:

   5V ─── LDR ───┬─── 10KΩ ─── GND
                 │
                 └─── Pin A1

📋 STEP-BY-STEP (Module):
1. Connect VCC to Arduino 5V (Red wire)
2. Connect GND to Arduino GND (Black wire)
3. Connect A0 to Arduino Analog Pin A1 (Yellow wire)

📋 STEP-BY-STEP (Bare LDR):
1. Connect one leg of LDR to 5V
2. Connect other leg to 10K resistor AND Arduino A1
3. Connect other end of 10K resistor to GND

⚙️ ADJUSTING THRESHOLD (Module):
The module has a potentiometer:
• Adjusts the D0 output threshold
• Turn to set when D0 switches HIGH/LOW

💡 UNDERSTANDING OUTPUT:
• Bright light → High analog value
• Dark → Low analog value

✅ Test with phone flashlight and proceed to Task 3!`
      },
      {
        id: 7003,
        taskNumber: 3,
        level: 7,
        sensor: "LDR Light Sensor",
        type: "coding",
        title: "Block Coding: Automatic Headlights",
        description: "Program your car to automatically turn on headlights when dark!",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create Automatic Headlights:
Car lights turn on automatically when it gets dark!

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ LIGHT LEVEL (%)
   
   ❓ IF Light < 20% (Dark)
      💡 HEADLIGHTS ON (Full)
      🔔 BEEP once (notification)
      
   ❓ ELSE IF Light < 50% (Dim)
      💡 HEADLIGHTS HALF brightness
      
   ❓ ELSE (Bright)
      💡 HEADLIGHTS OFF
      
   ⏱️ WAIT 500ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 BLOCKS TO USE:
1. "Loop Forever" - Continuous sensing
2. "Read Light Sensor" - Get light percentage
3. "If-Else If-Else" - Multiple light levels
4. "LED On/Off/Dim" - Control headlights
5. "Beep" - Audio notification

🌗 LIGHT LEVELS:
• 0-20%: Dark → Full headlights
• 20-50%: Dim → Half brightness
• 50-100%: Bright → Lights off

💡 HOW REAL CARS DO IT:
Modern cars have exactly this feature!
Called "automatic headlights" or "twilight sensing"

🌙 TESTING:
• Cover LDR with hand (simulates dark)
• Use phone flashlight (simulates bright)
• Normal room = dim light

🚗 BONUS FEATURES:
• Add brake lights (rear LED)
• Add turn signal blink
• Add dashboard light dimming

Go to Block Coding tab and build this program!`
      }
    ],

    // ═══════════════════════════════════════════════════════════════════
    // LEVEL 8: SOIL MOISTURE SENSOR
    // ═══════════════════════════════════════════════════════════════════
    8: [
      {
        id: 8001,
        taskNumber: 1,
        level: 8,
        sensor: "Soil Moisture Sensor",
        type: "learning",
        title: "Learn About Soil Moisture Sensor",
        description: "Understand how soil moisture sensors measure water content in soil.",
        instructions: `📚 ABOUT SOIL MOISTURE SENSOR:

🔍 WHAT IS IT?
A sensor that measures the water content in soil by detecting electrical conductivity.

🎯 WHY WE USE IT:
• Automatic plant watering systems
• Smart agriculture/farming
• Garden monitoring
• Greenhouse automation
• Lawn irrigation control

📏 SENSOR SPECIFICATIONS:
• Operating Voltage: 3.3V - 5V
• Output: Analog (variable) and Digital (threshold)
• Two parts: Probe + Controller board
• Probe material: Copper/Silver plated

⚙️ HOW IT WORKS:
1. Probe has two conductors
2. Wet soil conducts electricity better
3. Dry soil has high resistance
4. Sensor measures the resistance
5. Wet = Low resistance = High output
6. Dry = High resistance = Low output

💧 MOISTURE LEVELS:
• 0-30%: Very dry (needs water!)
• 30-60%: Optimal for most plants
• 60-80%: Moist
• 80-100%: Very wet/waterlogged

⚠️ IMPORTANT:
• Don't leave powered continuously (causes corrosion!)
• Only power when taking readings
• Clean probes periodically

🧱 BLOCK CODING PREVIEW (Task 3):
In Task 3, you'll create Auto Plant Watering:
┌─────────────────────────────┐
│ 🔄 LOOP FOREVER             │
│   📡 READ SOIL MOISTURE     │
│   ❓ IF Moisture < 30%      │
│      💧 TURN ON PUMP        │
│   ❓ ELSE                   │
│      🛑 PUMP OFF            │
└─────────────────────────────┘

✅ Continue to Task 2 to learn wiring!`
      },
      {
        id: 8002,
        taskNumber: 2,
        level: 8,
        sensor: "Soil Moisture Sensor",
        type: "wiring",
        title: "Connect Soil Moisture Sensor to Arduino",
        description: "Learn how to wire the soil moisture sensor properly.",
        instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x Soil Moisture Sensor (Probe + Module)
• 1x Arduino Nano/Uno
• 4x Jumper wires

📍 SENSOR HAS TWO PARTS:
1. PROBE: Goes into soil (2 metal prongs)
2. MODULE: Controller board with pins

📍 MODULE PINS:
┌─────────────────────────────────┐
│  [VCC] [GND] [A0]  [D0]         │
│    │     │    │      │          │
│  Power Ground Analog Digital    │
└─────────────────────────────────┘

🔗 WIRING CONNECTIONS:

   Moisture Module     Arduino
   ───────────────     ───────
   VCC (Power)     →   5V
   GND (Ground)    →   GND
   A0 (Analog)     →   Pin A2
   D0 (Digital)    →   Pin D7 (optional)

📋 STEP-BY-STEP:
1. Connect probe to module (2-pin connector)
2. Connect VCC to Arduino 5V (Red wire)
3. Connect GND to Arduino GND (Black wire)
4. Connect A0 to Arduino A2 (Yellow wire)
5. Optionally connect D0 to Pin D7 (Green wire)

⚙️ ADJUSTING THRESHOLD:
The module has a potentiometer:
• Sets the moisture level for D0 to trigger
• Turn to adjust dry/wet threshold

⚠️ ANTI-CORROSION TIP:
Instead of powering continuously:
• Connect VCC to a digital pin (e.g., D8)
• Turn ON only when reading
• Turn OFF after reading
• This extends sensor life significantly!

📐 PROPER PROBE INSERTION:
• Insert probes vertically
• Don't go too deep (2-3 inches)
• Don't bend the probes
• Keep controller board above soil!

✅ Have a pot with soil ready and proceed to Task 3!`
      },
      {
        id: 8003,
        taskNumber: 3,
        level: 8,
        sensor: "Soil Moisture Sensor",
        type: "coding",
        title: "Block Coding: Smart Plant Watering System",
        description: "Create an automatic irrigation system that waters when soil is dry!",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a Smart Plant Watering System:
Automatically water plants when soil gets dry!

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   💡 POWER SENSOR ON (Pin D8)
   ⏱️ WAIT 100ms
   📡 READ MOISTURE LEVEL (%)
   💡 POWER SENSOR OFF
   
   ❓ IF Moisture < 30% (Dry)
      💡 LED RED (Dry warning)
      🔔 BEEP "Water needed!"
      🔄 PUMP ON (Motor)
      ⏱️ WAIT 5 seconds
      🛑 PUMP OFF
      
   ❓ ELSE IF Moisture < 60% (OK)
      💡 LED YELLOW
      📢 Display "Moisture OK"
      
   ❓ ELSE (Wet enough)
      💡 LED GREEN
      📢 Display "Well watered!"
      
   ⏱️ WAIT 30 seconds
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 BLOCKS TO USE:
1. "Loop Forever" - Continuous monitoring
2. "Set Pin HIGH/LOW" - Control sensor power
3. "Read Moisture" - Get moisture percentage
4. "If-Else If-Else" - Multiple conditions
5. "Motor ON/OFF" - Control water pump
6. "LED Colors" - Status indication
7. "Wait" - Timing delays

🌱 MOISTURE ZONES:
• 0-30%: DRY → Water immediately!
• 30-60%: OK → Plants are fine
• 60%+: WET → No watering needed

⚙️ SMART FEATURES:
• Power sensor only when reading (prevents corrosion)
• Wait between readings (no need to check constantly)
• Pump runs for limited time (prevents overwatering)

🚰 PUMP CONNECTION:
• Connect small water pump to motor driver
• Use same pins as car motor
• Pump ON = Motor Forward
• Pump OFF = Motor Stop

💡 TIPS:
• Adjust thresholds for your plant type
• Succulents need less water (lower threshold)
• Tropical plants need more water (higher threshold)
• Check water reservoir!

Go to Block Coding tab and build this program!`
      }
    ],

    // ═══════════════════════════════════════════════════════════════════
    // LEVEL 9: SOUND SENSOR
    // ═══════════════════════════════════════════════════════════════════
    9: [
      {
        id: 9001,
        taskNumber: 1,
        level: 9,
        sensor: "Sound Sensor (Microphone)",
        type: "learning",
        title: "Learn About Sound Sensor",
        description: "Understand how sound sensors detect noise levels.",
        instructions: `📚 ABOUT SOUND SENSOR:

🔍 WHAT IS IT?
A microphone module that detects sound waves and converts them to electrical signals.

🎯 WHY WE USE SOUND SENSOR:
• Clap-activated switches
• Voice-activated systems
• Noise level monitoring
• Sound-reactive lights
• Baby monitors

📏 SENSOR SPECIFICATIONS:
• Operating Voltage: 3.3V - 5V
• Contains: Electret microphone
• Output: Analog (variable) and Digital (threshold)
• Frequency range: 100Hz - 10KHz
• Adjustable sensitivity via potentiometer

⚙️ HOW IT WORKS:
1. Microphone picks up sound vibrations
2. Vibrations create electrical signal
3. Amplifier boosts the signal
4. Output varies with sound intensity

📊 SOUND LEVELS:
• Whisper: ~30dB
• Normal conversation: ~60dB
• Loud music: ~90dB
• Clap: ~100dB (brief spike)

🎤 ANALOG VS DIGITAL OUTPUT:
• A0: Variable voltage based on sound level
• D0: HIGH when sound exceeds threshold

🧱 BLOCK CODING PREVIEW (Task 3):
In Task 3, you'll create a Clap-Controlled Robot:
┌─────────────────────────────┐
│ 🔄 LOOP FOREVER             │
│   📡 READ SOUND LEVEL       │
│   ❓ IF Sound > 70%         │
│      ⬆️ START MOVING!       │
│   ❓ Double Clap?           │
│      🛑 STOP!               │
└─────────────────────────────┘

✅ Continue to Task 2 to learn wiring!`
      },
      {
        id: 9002,
        taskNumber: 2,
        level: 9,
        sensor: "Sound Sensor (Microphone)",
        type: "wiring",
        title: "Connect Sound Sensor to Arduino",
        description: "Learn how to wire the sound sensor module.",
        instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x Sound Sensor Module (KY-037 or similar)
• 1x Arduino Nano/Uno
• 4x Jumper wires

📍 SOUND SENSOR PINS:
┌─────────────────────────────────┐
│  [VCC] [GND] [A0]  [D0]         │
│    │     │    │      │          │
│  Power Ground Analog Digital    │
└─────────────────────────────────┘

🔗 WIRING CONNECTIONS:

   Sound Sensor        Arduino
   ────────────        ───────
   VCC (Power)     →   5V
   GND (Ground)    →   GND
   A0 (Analog)     →   Pin A3
   D0 (Digital)    →   Pin D8 (optional)

📋 STEP-BY-STEP:
1. Connect VCC to Arduino 5V (Red wire)
2. Connect GND to Arduino GND (Black wire)
3. Connect A0 to Arduino A3 (Yellow wire)
4. Optionally connect D0 to Pin D8 (Green wire)

⚙️ ADJUSTING SENSITIVITY:
The module has a potentiometer (blue box):
• Turn CLOCKWISE → More sensitive (detects quieter sounds)
• Turn COUNTER-CLOCKWISE → Less sensitive

💡 LED INDICATORS:
• Power LED: Always ON when powered
• Signal LED: Flashes when sound detected

📐 POSITIONING:
• Point microphone toward sound source
• Keep away from motor noise
• Avoid placing near speakers
• Shield from wind if outdoors

⚠️ NOISE CONSIDERATIONS:
• Motor noise can trigger sensor
• May need to filter readings in code
• Sudden loud sounds work best (claps)

✅ Test by snapping fingers near sensor, then proceed to Task 3!`
      },
      {
        id: 9003,
        taskNumber: 3,
        level: 9,
        sensor: "Sound Sensor (Microphone)",
        type: "coding",
        title: "Block Coding: Clap-Controlled Robot",
        description: "Control your car with clap commands!",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a Clap-Controlled Robot:
One clap to start, two claps to stop!

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ SOUND LEVEL (%)
   
   ❓ IF Sound > 70% (Clap detected!)
      💡 LED ON (detected)
      ⏱️ WAIT 300ms
      📡 READ SOUND AGAIN
      
      ❓ IF Sound > 70% (Second clap!)
         🛑 STOP CAR
         💡 LED BLINK
         📢 "Double clap - Stopped!"
         
      ❓ ELSE (Single clap)
         ⬆️ MOVE FORWARD
         📢 "Single clap - Moving!"
         
   ⏱️ WAIT 100ms
   💡 LED OFF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 BLOCKS TO USE:
1. "Loop Forever" - Always listening
2. "Read Sound" - Get sound level
3. "If-Else" - Detect claps
4. "Wait" - Timing for double-clap
5. "Move/Stop" - Car control
6. "LED" - Visual feedback

👏 CLAP COMMANDS:
• 1 clap → Start moving forward
• 2 claps → Stop
• 3 claps → Spin around! (bonus)

💡 HOW DOUBLE-CLAP WORKS:
1. First clap detected (sound > 70%)
2. Wait 300ms
3. Check for second clap
4. If second clap → Double clap command
5. If no second clap → Single clap command

⚙️ TIPS:
• Clap loudly and sharply
• Adjust sensitivity if needed
• Too sensitive = motor noise triggers it
• Too insensitive = won't detect claps

🎮 BONUS COMMANDS:
• 3 claps → Spin 360°
• 4 claps → Move backward
• Hold whistle → Continuous movement

Go to Block Coding tab and build this program!`
      }
    ],

    // ═══════════════════════════════════════════════════════════════════
    // LEVEL 10: COMPUTER VISION (ESP32-CAM)
    // ═══════════════════════════════════════════════════════════════════
    10: [
      {
        id: 10001,
        taskNumber: 1,
        level: 10,
        sensor: "Computer Vision (ESP32-CAM)",
        type: "learning",
        title: "Learn About Computer Vision",
        description: "Understand how cameras and AI work together for object detection.",
        instructions: `📚 ABOUT COMPUTER VISION:

🔍 WHAT IS COMPUTER VISION?
Teaching computers to "see" and understand images using cameras and artificial intelligence!

🎯 WHY WE USE COMPUTER VISION:
• Self-driving cars
• Face recognition
• Object detection
• Gesture control
• Augmented reality
• Security systems

📷 ESP32-CAM SPECIFICATIONS:
• Camera: OV2640 (2 Megapixels)
• Resolution: Up to 1600x1200
• Processor: ESP32 (dual-core)
• WiFi: Built-in
• Flash: LED flash included
• MicroSD: Card slot for storage

⚙️ HOW IT WORKS:
1. Camera captures image
2. Image sent to processor
3. AI algorithms analyze image
4. Detects faces, objects, colors
5. Makes decisions based on detection

🧠 AI CAPABILITIES:
• Face Detection: Find human faces
• Color Detection: Identify specific colors
• Motion Detection: See movement
• Object Recognition: Identify objects

🧱 BLOCK CODING PREVIEW (Task 3):
In Task 3, you'll create a Face-Following Robot:
┌─────────────────────────────┐
│ 🔄 LOOP FOREVER             │
│   📷 CAPTURE IMAGE          │
│   🔍 DETECT FACE            │
│   ❓ IF Face Found          │
│      👁️ FOLLOW FACE         │
│   ❓ ELSE                   │
│      🔍 SEARCH...           │
└─────────────────────────────┘

🎓 CONGRATULATIONS!
This is the final and most advanced level!
You're learning real AI technology!

✅ Continue to Task 2 to learn wiring!`
      },
      {
        id: 10002,
        taskNumber: 2,
        level: 10,
        sensor: "Computer Vision (ESP32-CAM)",
        type: "wiring",
        title: "Connect ESP32-CAM",
        description: "Learn how to set up and wire the ESP32-CAM module.",
        instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x ESP32-CAM Module
• 1x FTDI Programmer (for programming)
• 5x Jumper wires
• 1x USB cable

📍 ESP32-CAM PINS:
┌────────────────────────────────────┐
│ [5V] [GND] [U0R] [U0T] [GPIO0]     │
│   │    │     │     │      │        │
│ Power GND   RX    TX   Program     │
└────────────────────────────────────┘

🔗 PROGRAMMING CONNECTION (FTDI):

   ESP32-CAM          FTDI Programmer
   ─────────          ───────────────
   5V             →   5V
   GND            →   GND
   U0R            →   TX
   U0T            →   RX
   GPIO0          →   GND (only during upload!)

📋 STEP-BY-STEP PROGRAMMING:
1. Connect ESP32-CAM to FTDI as shown above
2. Connect GPIO0 to GND (enters program mode)
3. Connect FTDI to computer via USB
4. In Arduino IDE, select "AI Thinker ESP32-CAM"
5. Upload code
6. Disconnect GPIO0 from GND
7. Press Reset button

🔗 RUNNING CONNECTION (After programming):

   ESP32-CAM          Power Source
   ─────────          ────────────
   5V             →   5V (2A recommended)
   GND            →   GND

⚠️ IMPORTANT NOTES:
• ESP32-CAM needs good 5V power (2A)
• Poor power = unstable/reboot
• Camera ribbon cable is fragile!
• Don't bend or force the camera connector

📡 WIFI SETUP:
• ESP32-CAM creates web server
• Connect to same WiFi network
• Access camera via IP address
• Stream video to browser or app

💡 LED FLASH:
• GPIO4 controls the bright LED
• Useful for low-light conditions
• Gets hot - don't leave on long!

✅ Program the ESP32-CAM and proceed to Task 3!`
      },
      {
        id: 10003,
        taskNumber: 3,
        level: 10,
        sensor: "Computer Vision (ESP32-CAM)",
        type: "coding",
        title: "Block Coding: Face-Following Robot",
        description: "Create a robot that detects and follows faces!",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a Face-Following Robot:
Robot detects faces and follows them!

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📷 CAPTURE IMAGE
   🔍 DETECT FACES
   
   ❓ IF Face Found
      📍 GET FACE POSITION (Left/Center/Right)
      
      ❓ IF Face on LEFT
         ⬅️ TURN LEFT
         
      ❓ ELSE IF Face on RIGHT
         ➡️ TURN RIGHT
         
      ❓ ELSE (Face in CENTER)
         📏 CHECK DISTANCE
         ❓ IF Face Big (Close)
            🛑 STOP (reached target)
         ❓ ELSE (Far away)
            ⬆️ MOVE FORWARD
            
   ❓ ELSE (No face found)
      🔄 SPIN SLOWLY (searching)
      💡 LED BLINK
      
   ⏱️ WAIT 200ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 BLOCKS TO USE:
1. "Capture Image" - Take photo
2. "Detect Face" - Find faces in image
3. "Get Face Position" - Where is the face?
4. "Get Face Size" - How close is face?
5. "Move/Turn" - Robot movement
6. "Spin" - Search rotation

🎯 FACE TRACKING LOGIC:
• Face on left → Turn left
• Face on right → Turn right
• Face in center → Move forward
• Face big (close) → Stop
• No face → Search by spinning

📏 DISTANCE ESTIMATION:
• Face appears bigger when closer
• Small face = far away → Move forward
• Big face = close → Stop (reached target)

🤖 ADVANCED FEATURES:
• Multiple face detection
• Face recognition (know specific people)
• Gesture recognition
• Color tracking

🎉 CONGRATULATIONS!!!
You've completed all 10 levels!
You are now a STEMify Master Engineer!

🏆 YOU'VE LEARNED:
• PIR Motion Detection
• Ultrasonic Distance Sensing
• IR Obstacle Detection
• Bluetooth Communication
• Temperature & Humidity
• Gas Detection & Safety
• Light Sensing
• Soil Moisture Monitoring
• Sound Detection
• Computer Vision & AI

Go to Block Coding tab to complete your final challenge!
Earn your Master Certificate! 🎓`
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // 📝 QUIZZES FOR ALL 10 LEVELS - ALIGNED WITH NEW SENSOR SEQUENCE
  // ═══════════════════════════════════════════════════════════════════
  levelQuizzes: {
    // LEVEL 1: PIR MOTION SENSOR QUIZ
    1: {
      level: 1,
      sensor: "PIR Motion Sensor",
      passPercentage: 60,
      questions: [
        {
          question: "What does PIR stand for?",
          options: ["Passive Infrared", "Power Infrared", "Pulse Infrared", "Proximity Infrared"],
          correctAnswer: 0
        },
        {
          question: "What does PIR sensor detect?",
          options: ["Sound waves", "Light changes", "Motion/movement (heat changes)", "Temperature"],
          correctAnswer: 2
        },
        {
          question: "How long should you wait after powering PIR sensor?",
          options: ["1 second", "30-60 seconds", "10 minutes", "1 hour"],
          correctAnswer: 1
        },
        {
          question: "What voltage does HC-SR501 PIR sensor need?",
          options: ["3.3V", "5V", "12V", "9V"],
          correctAnswer: 1
        },
        {
          question: "In a security system, what happens when motion is detected?",
          options: ["Nothing", "Alarm turns on", "Temperature reading", "Gas detection"],
          correctAnswer: 1
        }
      ]
    },

    // LEVEL 2: ULTRASONIC SENSOR QUIZ
    2: {
      level: 2,
      sensor: "Ultrasonic Sensor",
      passPercentage: 60,
      questions: [
        {
          question: "What does the Ultrasonic Sensor (HC-SR04) measure?",
          options: ["Temperature", "Distance", "Light", "Sound volume"],
          correctAnswer: 1
        },
        {
          question: "Which pin sends the ultrasonic pulse?",
          options: ["VCC", "GND", "TRIG", "ECHO"],
          correctAnswer: 2
        },
        {
          question: "What is the range of HC-SR04 sensor?",
          options: ["1cm - 50cm", "2cm - 400cm", "10cm - 1000cm", "5cm - 100cm"],
          correctAnswer: 1
        },
        {
          question: "In block coding, which block should you use before 'If Object < 20cm'?",
          options: ["Move Forward", "Read Distance", "Stop", "Buzzer"],
          correctAnswer: 1
        },
        {
          question: "What technique does ultrasonic sensor use (same as bats)?",
          options: ["X-ray", "Echolocation", "Magnetism", "Heat sensing"],
          correctAnswer: 1
        }
      ]
    },

    // LEVEL 3: IR SENSOR QUIZ
    3: {
      level: 3,
      sensor: "IR Sensor",
      passPercentage: 60,
      questions: [
        {
          question: "What type of light does IR sensor use?",
          options: ["Visible light", "Infrared light", "UV light", "Laser"],
          correctAnswer: 1
        },
        {
          question: "What is the IR sensor best used for?",
          options: ["Measuring temperature", "Line following robots", "Sound detection", "Gas detection"],
          correctAnswer: 1
        },
        {
          question: "What surface reflects IR light better?",
          options: ["Black surface", "White surface", "Transparent surface", "Water"],
          correctAnswer: 1
        },
        {
          question: "How do you adjust IR sensor detection range?",
          options: ["Change voltage", "Turn potentiometer", "Add resistor", "Change code only"],
          correctAnswer: 1
        },
        {
          question: "What does the IR sensor output when obstacle is detected?",
          options: ["Always HIGH", "Always LOW", "LOW signal", "No signal"],
          correctAnswer: 2
        }
      ]
    },

    // LEVEL 4: BLUETOOTH MODULE QUIZ
    4: {
      level: 4,
      sensor: "Bluetooth Module",
      passPercentage: 60,
      questions: [
        {
          question: "What wireless technology does HC-05 use?",
          options: ["WiFi", "Bluetooth", "Zigbee", "NFC"],
          correctAnswer: 1
        },
        {
          question: "What is the default password for HC-05?",
          options: ["0000", "1234", "admin", "password"],
          correctAnswer: 1
        },
        {
          question: "What is the typical range of Bluetooth communication?",
          options: ["1 meter", "Up to 10 meters", "100 meters", "1 km"],
          correctAnswer: 1
        },
        {
          question: "Why do we need a voltage divider for HC-05 RXD pin?",
          options: ["To increase voltage", "To convert 5V to 3.3V", "To filter noise", "To save power"],
          correctAnswer: 1
        },
        {
          question: "Who was Bluetooth technology named after?",
          options: ["A scientist", "A Viking king", "A mountain", "An inventor"],
          correctAnswer: 1
        }
      ]
    },

    // LEVEL 5: TEMPERATURE SENSOR (DHT11) QUIZ
    5: {
      level: 5,
      sensor: "Temperature Sensor (DHT11)",
      passPercentage: 60,
      questions: [
        {
          question: "What does DHT11 sensor measure?",
          options: ["Only Temperature", "Only Humidity", "Temperature and Humidity", "Distance"],
          correctAnswer: 2
        },
        {
          question: "How many pins does DHT11 module need for connection?",
          options: ["2 pins", "3 pins", "4 pins", "5 pins"],
          correctAnswer: 1
        },
        {
          question: "What is the temperature range of DHT11?",
          options: ["0°C to 50°C", "-40°C to 80°C", "10°C to 100°C", "-10°C to 60°C"],
          correctAnswer: 0
        },
        {
          question: "Why should you wait between DHT11 readings?",
          options: ["It gets hot", "Sensor is slow (needs 1-2 seconds)", "Saves power", "Better accuracy"],
          correctAnswer: 1
        },
        {
          question: "In the sample code, what triggers the alarm?",
          options: ["Temp < 20°C", "Temp > 35°C", "Humidity > 80%", "Button press"],
          correctAnswer: 1
        }
      ]
    },

    // LEVEL 6: GAS SENSOR (MQ-2) QUIZ
    6: {
      level: 6,
      sensor: "Gas Sensor (MQ-2)",
      passPercentage: 60,
      questions: [
        {
          question: "What gases can MQ-2 sensor detect?",
          options: ["Only oxygen", "LPG, Smoke, Methane", "Only CO2", "Water vapor"],
          correctAnswer: 1
        },
        {
          question: "Why does MQ-2 sensor need warm-up time?",
          options: ["To charge battery", "To heat internal element", "To connect WiFi", "To save data"],
          correctAnswer: 1
        },
        {
          question: "What voltage does MQ-2 heater need?",
          options: ["3.3V", "5V", "12V", "9V"],
          correctAnswer: 1
        },
        {
          question: "Which output gives variable gas reading?",
          options: ["VCC", "GND", "A0 (Analog)", "D0 (Digital)"],
          correctAnswer: 2
        },
        {
          question: "In the alarm program, what happens when Gas > 40%?",
          options: ["LED Off", "Emergency Alarm On", "Move Forward", "Read Temperature"],
          correctAnswer: 1
        }
      ]
    },

    // LEVEL 7: LDR LIGHT SENSOR QUIZ
    7: {
      level: 7,
      sensor: "LDR Light Sensor",
      passPercentage: 60,
      questions: [
        {
          question: "What does LDR stand for?",
          options: ["Light Dependent Resistor", "Low Distance Reader", "Light Digital Receiver", "Laser Distance Reader"],
          correctAnswer: 0
        },
        {
          question: "What happens to LDR resistance in bright light?",
          options: ["Increases", "Decreases", "Stays same", "Becomes zero"],
          correctAnswer: 1
        },
        {
          question: "What extra component does LDR circuit need?",
          options: ["Capacitor", "10K Resistor (voltage divider)", "Transistor", "Diode"],
          correctAnswer: 1
        },
        {
          question: "In the block code, when should headlights turn on?",
          options: ["When bright", "When dark (< 20%)", "When hot", "When motion detected"],
          correctAnswer: 1
        },
        {
          question: "LDR is commonly used in which device?",
          options: ["Gas detector", "Automatic street lights", "Thermometer", "Speedometer"],
          correctAnswer: 1
        }
      ]
    },

    // LEVEL 8: SOIL MOISTURE SENSOR QUIZ
    8: {
      level: 8,
      sensor: "Soil Moisture Sensor",
      passPercentage: 60,
      questions: [
        {
          question: "What does soil moisture sensor measure?",
          options: ["Soil temperature", "Water content in soil", "Soil pH", "Sunlight"],
          correctAnswer: 1
        },
        {
          question: "Why shouldn't you power the sensor continuously?",
          options: ["Uses too much power", "Causes corrosion on probes", "Breaks the sensor", "Wrong readings"],
          correctAnswer: 1
        },
        {
          question: "Wet soil has what kind of resistance?",
          options: ["High resistance", "Low resistance", "No resistance", "Infinite resistance"],
          correctAnswer: 1
        },
        {
          question: "What does 'Moisture < 30%' mean in block code?",
          options: ["Plant needs water (dry)", "Too much water", "Perfect moisture", "Sensor error"],
          correctAnswer: 0
        },
        {
          question: "What should turn on when soil is dry?",
          options: ["Heater", "Water Pump", "Fan", "Alarm only"],
          correctAnswer: 1
        }
      ]
    },

    // LEVEL 9: SOUND SENSOR QUIZ
    9: {
      level: 9,
      sensor: "Sound Sensor",
      passPercentage: 60,
      questions: [
        {
          question: "What does sound sensor detect?",
          options: ["Light", "Temperature", "Sound waves", "Distance"],
          correctAnswer: 2
        },
        {
          question: "What component is inside sound sensor module?",
          options: ["Camera", "Microphone", "Speaker", "Motor"],
          correctAnswer: 1
        },
        {
          question: "How do you adjust sound sensor sensitivity?",
          options: ["Change code only", "Turn potentiometer", "Add resistor", "Change voltage"],
          correctAnswer: 1
        },
        {
          question: "In clap switch program, when does action happen?",
          options: ["When quiet", "When sound > 70%", "When dark", "When hot"],
          correctAnswer: 1
        },
        {
          question: "Sound sensor is commonly used for?",
          options: ["Gas detection", "Voice-activated systems", "Temperature control", "Distance measurement"],
          correctAnswer: 1
        }
      ]
    },

    // LEVEL 10: COMPUTER VISION (ESP32-CAM) QUIZ
    10: {
      level: 10,
      sensor: "Computer Vision (ESP32-CAM)",
      passPercentage: 60,
      questions: [
        {
          question: "What camera does ESP32-CAM use?",
          options: ["OV7670", "OV2640", "Raspberry Pi Cam", "Webcam"],
          correctAnswer: 1
        },
        {
          question: "What is Computer Vision used for?",
          options: ["Only taking photos", "Face detection & object recognition", "Playing music", "Temperature sensing"],
          correctAnswer: 1
        },
        {
          question: "What should GPIO0 be connected to during programming?",
          options: ["5V", "GND", "3.3V", "Nothing"],
          correctAnswer: 1
        },
        {
          question: "What technology do self-driving cars use?",
          options: ["Only GPS", "Computer Vision with cameras", "Only radar", "Manual driving"],
          correctAnswer: 1
        },
        {
          question: "After completing Level 10, you receive:",
          options: ["Nothing", "STEMify Master Engineer Certificate!", "A toy car", "Only XP points"],
          correctAnswer: 1
        }
      ]
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// 🚀 UPLOAD FUNCTION - Run this to populate Firebase
// ═══════════════════════════════════════════════════════════════════

export async function uploadAllContent() {
  console.log("🚀 Starting STEMify content upload...\n");
  console.log("📋 NEW SENSOR SEQUENCE:");
  console.log("   1. PIR Motion Sensor");
  console.log("   2. Ultrasonic Sensor");
  console.log("   3. IR Obstacle Sensor");
  console.log("   4. Bluetooth Module");
  console.log("   5. Temperature Sensor (DHT11)");
  console.log("   6. Gas Sensor (MQ-2)");
  console.log("   7. LDR Light Sensor");
  console.log("   8. Soil Moisture Sensor");
  console.log("   9. Sound Sensor");
  console.log("   10. Computer Vision (ESP32-CAM)\n");
  
  try {
    // Upload all tasks
    console.log("📚 Uploading tasks for all 10 levels...");
    await set(ref(realtimeDb, 'levelTasks'), COMPLETE_COURSE_CONTENT.levelTasks);
    console.log("✅ Tasks uploaded successfully!\n");
    
    // Upload all quizzes
    console.log("📝 Uploading quizzes for all 10 levels...");
    await set(ref(realtimeDb, 'levelQuizzes'), COMPLETE_COURSE_CONTENT.levelQuizzes);
    console.log("✅ Quizzes uploaded successfully!\n");
    
    console.log("═══════════════════════════════════════════");
    console.log("🎉 ALL CONTENT UPLOADED SUCCESSFULLY!");
    console.log("═══════════════════════════════════════════");
    console.log("\n📊 Summary:");
    console.log("   • 10 Levels");
    console.log("   • 30 Tasks (3 per level)");
    console.log("   • 10 Quizzes (5 questions each)");
    console.log("   • 50 Quiz Questions total");
    console.log("\n✅ Students can now start learning!");
    console.log("✅ Quizzes are aligned with sensor sequence!");
    
    return true;
  } catch (error) {
    console.error("❌ Error uploading content:", error);
    return false;
  }
}

// Export content for reference
export { COMPLETE_COURSE_CONTENT };
