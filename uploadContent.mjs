// Quick script to upload content to Firebase
// Run with: node uploadContent.mjs

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// Firebase configuration (same as in your app)
const firebaseConfig = {
  apiKey: "AIzaSyAehc3IR1dhZt6mmzLEcKh0EFeSYQuqX1s",
  authDomain: "stemify-dashboard.firebaseapp.com",
  databaseURL: "https://stemify-dashboard-default-rtdb.firebaseio.com",
  projectId: "stemify-dashboard",
  storageBucket: "stemify-dashboard.firebasestorage.app",
  messagingSenderId: "711595453144",
  appId: "1:711595453144:web:d4f4f3351ed7ee811b05ad",
  measurementId: "G-RTRLW8MM9B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const realtimeDb = getDatabase(app);

// NEW ALIGNED QUIZZES - Matching sensor sequence
const ALIGNED_QUIZZES = {
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
};

// LEVEL TASKS - NEW SENSOR SEQUENCE
const LEVEL_TASKS = {
  // LEVEL 1: PIR MOTION SENSOR
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
1. Connect VCC pin to Arduino 5V (Red wire)
2. Connect GND pin to Arduino GND (Black wire)
3. Connect OUT pin to Arduino Digital Pin 2 (Yellow wire)

⚙️ SENSOR ADJUSTMENTS:
• LEFT POT: Sensitivity (turn clockwise for more range)
• RIGHT POT: Time Delay (turn clockwise for longer)

⚠️ IMPORTANT:
• Wait 30-60 seconds after powering on for sensor to stabilize

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
2. "Read PIR Sensor" - Gets motion status
3. "If-Else" - Makes decision based on motion
4. "Buzzer ON/OFF" - Controls alarm sound
5. "LED ON/OFF" - Controls indicator light

Go to Block Coding tab and build this program!`
    }
  ],

  // LEVEL 2: ULTRASONIC SENSOR
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

📏 SENSOR SPECIFICATIONS:
• Operating Voltage: 5V DC
• Detection Range: 2cm - 400cm
• Accuracy: ±3mm
• Pins: VCC, TRIG, ECHO, GND

⚙️ HOW IT WORKS:
1. TRIG pin sends a short ultrasonic pulse
2. Sound wave hits object, bounces back
3. ECHO pin receives the reflected sound
4. Distance = (Time × Speed of Sound) / 2

🧱 BLOCK CODING PREVIEW (Task 3):
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
      description: "Learn how to wire the HC-SR04 sensor.",
      instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x Ultrasonic Sensor (HC-SR04)
• 1x Arduino Nano/Uno
• 4x Jumper wires

📍 ULTRASONIC SENSOR PINS (4 pins):
┌─────────────────────────────────┐
│  [VCC] [TRIG] [ECHO] [GND]      │
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

⚠️ IMPORTANT:
• HC-SR04 needs 5V (won't work with 3.3V)
• Mount sensor level and pointing straight ahead

✅ Verify connections and proceed to Task 3!`
    },
    {
      id: 2003,
      taskNumber: 3,
      level: 2,
      sensor: "Ultrasonic Sensor (HC-SR04)",
      type: "coding",
      title: "Block Coding: Obstacle Avoider",
      description: "Program your car to detect and avoid obstacles!",
      instructions: `🧱 BLOCK CODING CHALLENGE:

Create an Obstacle Avoiding Robot:

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
4. "Move Forward/Backward" - Movement
5. "Turn Right/Left" - Direction
6. "Stop" - Stop motors

Go to Block Coding tab and build this program!`
    }
  ],

  // LEVEL 3: IR SENSOR
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
• Edge detection
• Close-range obstacle detection
• Object counting

📏 SENSOR SPECIFICATIONS:
• Operating Voltage: 3.3V - 5V
• Detection Range: 2cm - 30cm (adjustable)
• Output: Digital (HIGH/LOW)

⚙️ HOW IT WORKS:
1. IR LED emits infrared light
2. Light hits object and reflects back
3. IR receiver detects the reflected light
4. Outputs LOW when obstacle detected

🎨 COLOR MATTERS:
• White colors → Reflect IR well
• Black colors → Absorb IR (poor detection)

🧱 BLOCK CODING PREVIEW (Task 3):
Line Following Robot!

✅ Continue to Task 2 to learn wiring!`
    },
    {
      id: 3002,
      taskNumber: 2,
      level: 3,
      sensor: "IR Obstacle Sensor",
      type: "wiring",
      title: "Connect IR Sensor to Arduino",
      description: "Learn how to wire the IR obstacle sensor.",
      instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x IR Obstacle Sensor Module
• 1x Arduino Nano/Uno
• 3x Jumper wires

📍 IR SENSOR PINS (3 pins):
┌─────────────────────────────┐
│  [VCC]   [GND]   [OUT]      │
└─────────────────────────────┘

🔗 WIRING CONNECTIONS:

   IR Sensor           Arduino
   ─────────           ───────
   VCC (Power)     →   5V
   GND (Ground)    →   GND
   OUT (Signal)    →   Pin D3

⚙️ ADJUSTING SENSITIVITY:
Turn the potentiometer to adjust detection range.

💡 LED INDICATORS:
• Power LED: Always ON when powered
• Signal LED: ON when obstacle detected

✅ Adjust sensitivity and proceed to Task 3!`
    },
    {
      id: 3003,
      taskNumber: 3,
      level: 3,
      sensor: "IR Obstacle Sensor",
      type: "coding",
      title: "Block Coding: Line Following Robot",
      description: "Program your car to follow a black line!",
      instructions: `🧱 BLOCK CODING CHALLENGE:

Create a Line Following Robot:

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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛤️ MAKING A TRACK:
Use black electrical tape on white paper!

Go to Block Coding tab and build this program!`
    }
  ],

  // LEVEL 4: BLUETOOTH MODULE
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
Bluetooth is wireless technology for exchanging data over short distances. Named after Viking King Harald "Bluetooth"!

🎯 WHY WE USE BLUETOOTH:
• Wireless control of robots/cars
• Send commands from smartphone
• Receive sensor data on phone
• No wires = more freedom!

📏 MODULE SPECIFICATIONS:
• Operating Voltage: 3.3V - 5V
• Range: Up to 10 meters
• Default Password: "1234"
• Baud Rate: 9600 (default)

📱 BLUETOOTH COMMANDS:
• 'F' → Move Forward
• 'B' → Move Backward
• 'L' → Turn Left
• 'R' → Turn Right
• 'S' → Stop

✅ Continue to Task 2 to learn wiring!`
    },
    {
      id: 4002,
      taskNumber: 2,
      level: 4,
      sensor: "Bluetooth Module (HC-05)",
      type: "wiring",
      title: "Connect Bluetooth Module to Arduino",
      description: "Learn how to wire HC-05 Bluetooth module.",
      instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x HC-05 Bluetooth Module
• 1x Arduino Nano/Uno
• 4x Jumper wires
• Resistors (1K and 2K) for voltage divider

📍 HC-05 PINS:
┌──────────────────────────────────┐
│  [VCC] [GND] [TXD] [RXD]        │
└──────────────────────────────────┘

🔗 WIRING CONNECTIONS:

   HC-05              Arduino
   ─────              ───────
   VCC (Power)    →   5V
   GND (Ground)   →   GND
   TXD (Transmit) →   Pin D10
   RXD (Receive)  →   Pin D11 (Through voltage divider!)

⚠️ VOLTAGE DIVIDER FOR RXD:
HC-05 RXD is 3.3V! Use resistor divider:
Arduino Pin 11 ──[1KΩ]── HC-05 RXD

📱 PAIRING:
1. Find "HC-05" in phone Bluetooth
2. Password: 1234

✅ Wire carefully and proceed to Task 3!`
    },
    {
      id: 4003,
      taskNumber: 3,
      level: 4,
      sensor: "Bluetooth Module (HC-05)",
      type: "coding",
      title: "Block Coding: Phone-Controlled Car",
      description: "Control your car wirelessly using smartphone!",
      instructions: `🧱 BLOCK CODING CHALLENGE:

Create a Phone-Controlled Car:

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ BLUETOOTH Command
   ❓ IF Command = 'F'
      ⬆️ MOVE FORWARD
   ❓ ELSE IF Command = 'B'
      ⬇️ MOVE BACKWARD
   ❓ ELSE IF Command = 'L'
      ⬅️ TURN LEFT
   ❓ ELSE IF Command = 'R'
      ➡️ TURN RIGHT
   ❓ ELSE IF Command = 'S'
      🛑 STOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 PHONE APP:
Download "Bluetooth RC Controller" app

Go to Block Coding tab and build this program!`
    }
  ],

  // LEVEL 5: TEMPERATURE SENSOR
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
A digital sensor that measures both temperature AND humidity!

🎯 WHY WE USE DHT11:
• Weather stations
• Indoor climate monitoring
• Greenhouse automation
• Smart home projects

📏 SENSOR SPECIFICATIONS:
• Operating Voltage: 3.3V - 5V
• Temperature Range: 0°C to 50°C
• Temperature Accuracy: ±2°C
• Humidity Range: 20% to 80%
• Sampling Rate: 1 reading per second

⚙️ HOW IT WORKS:
1. Contains thermistor for temperature
2. Contains humidity-sensitive capacitor
3. Internal chip converts to digital signal

✅ Continue to Task 2 to learn wiring!`
    },
    {
      id: 5002,
      taskNumber: 2,
      level: 5,
      sensor: "Temperature Sensor (DHT11)",
      type: "wiring",
      title: "Connect DHT11 to Arduino",
      description: "Learn how to wire the temperature sensor.",
      instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x DHT11 Sensor (or module)
• 1x Arduino Nano/Uno
• 3x Jumper wires

📍 DHT11 PINS (3-pin module):
┌─────────────────────────────┐
│    [VCC]  [DATA]  [GND]     │
└─────────────────────────────┘

🔗 WIRING CONNECTIONS:

   DHT11              Arduino
   ─────              ───────
   VCC (Power)    →   5V
   GND (Ground)   →   GND
   DATA (Signal)  →   Pin D4

⚠️ IMPORTANT:
• Wait at least 1 second between readings
• Keep away from direct sunlight

✅ Connect and proceed to Task 3!`
    },
    {
      id: 5003,
      taskNumber: 3,
      level: 5,
      sensor: "Temperature Sensor (DHT11)",
      type: "coding",
      title: "Block Coding: Climate Alert System",
      description: "Create a temperature monitoring system!",
      instructions: `🧱 BLOCK CODING CHALLENGE:

Create a Climate Alert System:

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ TEMPERATURE
   
   ❓ IF Temperature > 35°C
      🔔 BUZZER ON (Hot alert!)
      💡 LED RED
      
   ❓ ELSE IF Temperature < 15°C
      💡 LED BLUE (Cold)
      
   ❓ ELSE
      💡 LED GREEN (Comfortable)
   
   ⏱️ WAIT 2 seconds
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Go to Block Coding tab and build this program!`
    }
  ],

  // LEVEL 6: GAS SENSOR
  6: [
    {
      id: 6001,
      taskNumber: 1,
      level: 6,
      sensor: "Gas Sensor (MQ-2)",
      type: "learning",
      title: "Learn About Gas Sensor",
      description: "Understand how MQ-2 detects dangerous gases.",
      instructions: `📚 ABOUT MQ-2 GAS SENSOR:

🔍 WHAT IS MQ-2?
A gas sensor that detects flammable gases and smoke!

🎯 WHY WE USE GAS SENSOR:
• Gas leak detection (LPG, natural gas)
• Smoke detection (fire alarm)
• Air quality monitoring
• Safety systems

📏 SENSOR SPECIFICATIONS:
• Operating Voltage: 5V DC
• Detects: LPG, Smoke, Methane, Propane
• Warm-up Time: 2-5 minutes
• Output: Analog (A0) and Digital (D0)

⚠️ SAFETY: MQ-2 heater gets HOT!

⚙️ HOW IT WORKS:
1. Internal heater warms tin dioxide layer
2. Clean air: High resistance
3. Gas present: Low resistance, high output

✅ Continue to Task 2 to learn wiring!`
    },
    {
      id: 6002,
      taskNumber: 2,
      level: 6,
      sensor: "Gas Sensor (MQ-2)",
      type: "wiring",
      title: "Connect Gas Sensor to Arduino",
      description: "Learn how to wire the MQ-2 gas sensor.",
      instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x MQ-2 Gas Sensor Module
• 1x Arduino Nano/Uno
• 4x Jumper wires

📍 MQ-2 MODULE PINS:
┌─────────────────────────────────┐
│  [VCC] [GND] [D0]  [A0]         │
└─────────────────────────────────┘

🔗 WIRING CONNECTIONS:

   MQ-2               Arduino
   ────               ───────
   VCC (Power)    →   5V (Must be 5V!)
   GND (Ground)   →   GND
   A0 (Analog)    →   Pin A0
   D0 (Digital)   →   Pin D5 (optional)

⚠️ IMPORTANT:
• Sensor needs 5V for heater
• Wait 2-5 minutes for warm-up
• Heater gets HOT - don't touch!

✅ Power on and let warm up before Task 3!`
    },
    {
      id: 6003,
      taskNumber: 3,
      level: 6,
      sensor: "Gas Sensor (MQ-2)",
      type: "coding",
      title: "Block Coding: Gas Leak Alarm System",
      description: "Create a safety system that detects gas leaks!",
      instructions: `🧱 BLOCK CODING CHALLENGE:

Create a Gas Leak Alarm System:

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ GAS LEVEL (%)
   
   ❓ IF Gas Level > 40%
      🚨 ALARM CONTINUOUS!
      💡 LED BLINK FAST (RED)
      🛑 STOP CAR
      
   ❓ ELSE IF Gas Level > 20%
      🔔 WARNING BEEP
      💡 LED YELLOW
      
   ❓ ELSE
      💡 LED GREEN (Safe)
      
   ⏱️ WAIT 500ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Go to Block Coding tab and build this program!`
    }
  ],

  // LEVEL 7: LDR LIGHT SENSOR
  7: [
    {
      id: 7001,
      taskNumber: 1,
      level: 7,
      sensor: "LDR Light Sensor",
      type: "learning",
      title: "Learn About Light Sensor (LDR)",
      description: "Understand how LDR detects light intensity.",
      instructions: `📚 ABOUT LDR:

🔍 WHAT IS LDR?
Light Dependent Resistor - changes resistance based on light!

🎯 WHY WE USE LDR:
• Automatic street lights
• Day/night detection
• Light-following robots
• Screen brightness control

📏 SPECIFICATIONS:
• Dark: High resistance (1MΩ+)
• Light: Low resistance (100Ω)

⚙️ HOW IT WORKS:
More light = More conductivity = Less resistance

✅ Continue to Task 2 to learn wiring!`
    },
    {
      id: 7002,
      taskNumber: 2,
      level: 7,
      sensor: "LDR Light Sensor",
      type: "wiring",
      title: "Connect LDR to Arduino",
      description: "Learn how to create voltage divider with LDR.",
      instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x LDR Module (or LDR + 10K resistor)
• 1x Arduino Nano/Uno
• 3x Jumper wires

📍 LDR MODULE PINS:
┌─────────────────────────────┐
│  [VCC]  [GND]  [A0]  [D0]   │
└─────────────────────────────┘

🔗 WIRING CONNECTIONS:

   LDR Module         Arduino
   ──────────         ───────
   VCC            →   5V
   GND            →   GND
   A0             →   Pin A1

✅ Test with phone flashlight and proceed to Task 3!`
    },
    {
      id: 7003,
      taskNumber: 3,
      level: 7,
      sensor: "LDR Light Sensor",
      type: "coding",
      title: "Block Coding: Automatic Headlights",
      description: "Program automatic headlights for your car!",
      instructions: `🧱 BLOCK CODING CHALLENGE:

Create Automatic Headlights:

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ LIGHT LEVEL (%)
   
   ❓ IF Light < 20% (Dark)
      💡 HEADLIGHTS ON (Full)
      
   ❓ ELSE IF Light < 50% (Dim)
      💡 HEADLIGHTS HALF
      
   ❓ ELSE (Bright)
      💡 HEADLIGHTS OFF
      
   ⏱️ WAIT 500ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Go to Block Coding tab and build this program!`
    }
  ],

  // LEVEL 8: SOIL MOISTURE SENSOR
  8: [
    {
      id: 8001,
      taskNumber: 1,
      level: 8,
      sensor: "Soil Moisture Sensor",
      type: "learning",
      title: "Learn About Soil Moisture Sensor",
      description: "Understand how soil moisture sensors work.",
      instructions: `📚 ABOUT SOIL MOISTURE SENSOR:

🔍 WHAT IS IT?
Measures water content in soil by detecting electrical conductivity.

🎯 WHY WE USE IT:
• Automatic plant watering
• Smart agriculture
• Garden monitoring
• Greenhouse automation

📏 SPECIFICATIONS:
• Operating Voltage: 3.3V - 5V
• Output: Analog and Digital

⚙️ HOW IT WORKS:
• Wet soil = Low resistance = High output
• Dry soil = High resistance = Low output

💧 MOISTURE LEVELS:
• 0-30%: Dry (needs water!)
• 30-60%: Optimal
• 60-100%: Wet

⚠️ Don't leave powered continuously (corrosion!)

✅ Continue to Task 2 to learn wiring!`
    },
    {
      id: 8002,
      taskNumber: 2,
      level: 8,
      sensor: "Soil Moisture Sensor",
      type: "wiring",
      title: "Connect Soil Moisture Sensor to Arduino",
      description: "Learn how to wire the soil moisture sensor.",
      instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x Soil Moisture Sensor (Probe + Module)
• 1x Arduino Nano/Uno
• 4x Jumper wires

📍 MODULE PINS:
┌─────────────────────────────────┐
│  [VCC] [GND] [A0]  [D0]         │
└─────────────────────────────────┘

🔗 WIRING CONNECTIONS:

   Moisture Module     Arduino
   ───────────────     ───────
   VCC (Power)     →   5V
   GND (Ground)    →   GND
   A0 (Analog)     →   Pin A2
   D0 (Digital)    →   Pin D7 (optional)

📋 STEP-BY-STEP:
1. Connect probe to module
2. Connect VCC to Arduino 5V
3. Connect GND to Arduino GND
4. Connect A0 to Arduino A2

✅ Have a pot with soil ready and proceed to Task 3!`
    },
    {
      id: 8003,
      taskNumber: 3,
      level: 8,
      sensor: "Soil Moisture Sensor",
      type: "coding",
      title: "Block Coding: Smart Plant Watering System",
      description: "Create an automatic irrigation system!",
      instructions: `🧱 BLOCK CODING CHALLENGE:

Create Smart Plant Watering System:

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ MOISTURE LEVEL (%)
   
   ❓ IF Moisture < 30% (Dry)
      💡 LED RED (Dry warning)
      🔔 BEEP
      🔄 PUMP ON (Motor)
      ⏱️ WAIT 5 seconds
      🛑 PUMP OFF
      
   ❓ ELSE IF Moisture < 60% (OK)
      💡 LED YELLOW
      
   ❓ ELSE (Wet)
      💡 LED GREEN
      
   ⏱️ WAIT 10 seconds
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Go to Block Coding tab and build this program!`
    }
  ],

  // LEVEL 9: SOUND SENSOR
  9: [
    {
      id: 9001,
      taskNumber: 1,
      level: 9,
      sensor: "Sound Sensor (Microphone)",
      type: "learning",
      title: "Learn About Sound Sensor",
      description: "Understand how sound sensors detect noise.",
      instructions: `📚 ABOUT SOUND SENSOR:

🔍 WHAT IS IT?
A microphone module that detects sound waves.

🎯 WHY WE USE SOUND SENSOR:
• Clap-activated switches
• Voice-activated systems
• Noise level monitoring
• Sound-reactive lights

📏 SPECIFICATIONS:
• Operating Voltage: 3.3V - 5V
• Contains: Electret microphone
• Output: Analog and Digital
• Adjustable sensitivity

⚙️ HOW IT WORKS:
Microphone picks up sound vibrations and converts to electrical signal.

✅ Continue to Task 2 to learn wiring!`
    },
    {
      id: 9002,
      taskNumber: 2,
      level: 9,
      sensor: "Sound Sensor (Microphone)",
      type: "wiring",
      title: "Connect Sound Sensor to Arduino",
      description: "Learn how to wire the sound sensor.",
      instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x Sound Sensor Module
• 1x Arduino Nano/Uno
• 4x Jumper wires

📍 SOUND SENSOR PINS:
┌─────────────────────────────────┐
│  [VCC] [GND] [A0]  [D0]         │
└─────────────────────────────────┘

🔗 WIRING CONNECTIONS:

   Sound Sensor        Arduino
   ────────────        ───────
   VCC (Power)     →   5V
   GND (Ground)    →   GND
   A0 (Analog)     →   Pin A3
   D0 (Digital)    →   Pin D8 (optional)

⚙️ ADJUSTING SENSITIVITY:
Turn the potentiometer to adjust.

✅ Test by snapping fingers and proceed to Task 3!`
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

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📡 READ SOUND LEVEL (%)
   
   ❓ IF Sound > 70% (Clap!)
      💡 LED ON
      ⏱️ WAIT 300ms
      📡 READ SOUND AGAIN
      
      ❓ IF Sound > 70% (Double clap!)
         🛑 STOP CAR
         
      ❓ ELSE (Single clap)
         ⬆️ MOVE FORWARD
         
   ⏱️ WAIT 100ms
   💡 LED OFF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👏 1 clap = Move, 2 claps = Stop

Go to Block Coding tab and build this program!`
    }
  ],

  // LEVEL 10: COMPUTER VISION
  10: [
    {
      id: 10001,
      taskNumber: 1,
      level: 10,
      sensor: "Computer Vision (ESP32-CAM)",
      type: "learning",
      title: "Learn About Computer Vision",
      description: "Understand how cameras and AI work together.",
      instructions: `📚 ABOUT COMPUTER VISION:

🔍 WHAT IS COMPUTER VISION?
Teaching computers to "see" using cameras and AI!

🎯 WHY WE USE COMPUTER VISION:
• Self-driving cars
• Face recognition
• Object detection
• Gesture control
• Security systems

📷 ESP32-CAM SPECIFICATIONS:
• Camera: OV2640 (2 Megapixels)
• Processor: ESP32 (dual-core)
• WiFi: Built-in
• Flash: LED included

🧠 AI CAPABILITIES:
• Face Detection
• Color Detection
• Motion Detection
• Object Recognition

🎓 CONGRATULATIONS!
This is the final and most advanced level!

✅ Continue to Task 2 to learn wiring!`
    },
    {
      id: 10002,
      taskNumber: 2,
      level: 10,
      sensor: "Computer Vision (ESP32-CAM)",
      type: "wiring",
      title: "Connect ESP32-CAM",
      description: "Learn how to set up ESP32-CAM module.",
      instructions: `🔌 WIRING INSTRUCTIONS:

📦 COMPONENTS NEEDED:
• 1x ESP32-CAM Module
• 1x FTDI Programmer
• 5x Jumper wires

📍 PROGRAMMING CONNECTION:

   ESP32-CAM          FTDI
   ─────────          ────
   5V             →   5V
   GND            →   GND
   U0R            →   TX
   U0T            →   RX
   GPIO0          →   GND (during upload!)

📋 PROGRAMMING STEPS:
1. Connect GPIO0 to GND
2. Upload code
3. Disconnect GPIO0 from GND
4. Press Reset button

⚠️ ESP32-CAM needs good 5V power (2A)

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

YOUR TASK - Build this program:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 LOOP FOREVER
   📷 CAPTURE IMAGE
   🔍 DETECT FACES
   
   ❓ IF Face Found
      ❓ IF Face on LEFT
         ⬅️ TURN LEFT
      ❓ ELSE IF Face on RIGHT
         ➡️ TURN RIGHT
      ❓ ELSE (CENTER)
         ⬆️ MOVE FORWARD
            
   ❓ ELSE (No face)
      🔄 SPIN SLOWLY (searching)
      
   ⏱️ WAIT 200ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 CONGRATULATIONS!!!
You've completed all 10 levels!
You are now a STEMify Master Engineer! 🏆

Go to Block Coding tab to complete your final challenge!`
    }
  ]
};

async function uploadAll() {
  console.log("🚀 Uploading aligned content to Firebase...\n");
  console.log("📋 NEW SENSOR SEQUENCE:");
  console.log("   Level 1: PIR Motion Sensor");
  console.log("   Level 2: Ultrasonic Sensor");
  console.log("   Level 3: IR Obstacle Sensor");
  console.log("   Level 4: Bluetooth Module");
  console.log("   Level 5: Temperature Sensor (DHT11)");
  console.log("   Level 6: Gas Sensor (MQ-2)");
  console.log("   Level 7: LDR Light Sensor");
  console.log("   Level 8: Soil Moisture Sensor");
  console.log("   Level 9: Sound Sensor");
  console.log("   Level 10: Computer Vision (ESP32-CAM)\n");
  
  try {
    // Upload Tasks
    console.log("📚 Uploading Level Tasks...");
    await set(ref(realtimeDb, 'levelTasks'), LEVEL_TASKS);
    console.log("✅ Tasks uploaded successfully!\n");
    
    // Upload Quizzes
    console.log("📝 Uploading Level Quizzes...");
    await set(ref(realtimeDb, 'levelQuizzes'), ALIGNED_QUIZZES);
    console.log("✅ Quizzes uploaded successfully!\n");
    
    console.log("═══════════════════════════════════════════");
    console.log("🎉 ALL CONTENT UPLOADED SUCCESSFULLY!");
    console.log("═══════════════════════════════════════════");
    console.log("\n📊 Summary:");
    console.log("   • 10 Levels");
    console.log("   • 30 Tasks (3 per level)");
    console.log("   • 10 Quizzes (5 questions each)");
    console.log("\n✅ Tasks and Quizzes are now aligned!");
    console.log("📝 Refresh your browser to see the changes.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error uploading content:", error);
    process.exit(1);
  }
}

uploadAll();

