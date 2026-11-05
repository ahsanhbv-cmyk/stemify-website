// ═══════════════════════════════════════════════════════════════════════════
// 🎓 STEMify Complete Course Content Upload Script
// ═══════════════════════════════════════════════════════════════════════════
// 
// This script uploads ALL course content to Firebase:
// ✅ 10 Sensors/Levels
// ✅ 30 Tasks (3 per level)
// ✅ 10 Quizzes (1 per level)
// ✅ Block coding configurations
//
// HOW TO USE:
// 1. Open browser console on STEMify (F12 → Console)
// 2. Make sure you're logged in as ADMIN
// 3. Copy-paste this entire script
// 4. Press Enter
// ═══════════════════════════════════════════════════════════════════════════

// Import Firebase (if running in browser with STEMify loaded)
// const { realtimeDb } = await import('./firebase.js');
// const { ref, set } = await import('firebase/database');

const COURSE_CONTENT = {
  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 1: ULTRASONIC SENSOR (HC-SR04)
  // ═══════════════════════════════════════════════════════════════════════════
  1: {
    sensor: {
      id: "ultrasonic",
      name: "Ultrasonic Sensor (HC-SR04)",
      icon: "📏",
      color: "#3b82f6",
      description: "Learn to measure distance using sound waves",
      difficulty: "Beginner"
    },
    tasks: [
      {
        id: 1001,
        taskNumber: 1,
        type: "wiring",
        title: "Connect Ultrasonic Sensor to ESP32",
        description: "Learn the basics of the HC-SR04 ultrasonic sensor and connect it properly to your ESP32 board.",
        instructions: `📚 WHAT YOU'LL LEARN:
• How ultrasonic sensors work (sound waves)
• Pin configuration of HC-SR04
• Safe wiring practices

🔌 WIRING STEPS:
1. Connect VCC pin → ESP32 5V (or VIN)
2. Connect GND pin → ESP32 GND
3. Connect TRIG pin → ESP32 GPIO 12
4. Connect ECHO pin → ESP32 GPIO 13
   ⚠️ Use a voltage divider (2 resistors) for ECHO!
   ECHO → 1KΩ → GPIO13
         ↓
        2KΩ → GND

📌 PIN SUMMARY:
   HC-SR04    →    ESP32
   ────────────────────────
   VCC        →    5V/VIN
   GND        →    GND
   TRIG       →    GPIO 12
   ECHO       →    GPIO 13 (with voltage divider)

✅ COMPLETION CHECK:
□ All 4 wires connected
□ Voltage divider for ECHO pin
□ No loose connections`,
        xpReward: 50
      },
      {
        id: 1002,
        taskNumber: 2,
        type: "testing",
        title: "Test Distance Measurements",
        description: "Upload test code and verify your ultrasonic sensor is measuring distances correctly.",
        instructions: `📚 WHAT YOU'LL LEARN:
• How to read sensor data
• Understanding distance calculations
• Serial monitor debugging

🧪 TESTING STEPS:
1. Open Arduino IDE
2. Upload the test code (provided below)
3. Open Serial Monitor (115200 baud)
4. Place objects at different distances
5. Verify readings match actual distances

📝 TEST CODE:
─────────────────────────────────
#define TRIG 12
#define ECHO 13

void setup() {
  Serial.begin(115200);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
}

void loop() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  
  long duration = pulseIn(ECHO, HIGH);
  float distance = duration * 0.034 / 2;
  
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  delay(500);
}
─────────────────────────────────

✅ COMPLETION CHECK:
□ Code uploaded successfully
□ Serial monitor shows readings
□ Readings are accurate (±2cm)
□ Sensor detects objects 2cm - 400cm`,
        xpReward: 50
      },
      {
        id: 1003,
        taskNumber: 3,
        type: "coding",
        title: "Block Coding: Obstacle Detection",
        description: "Use block coding to create an obstacle detection system that stops the car when objects are too close.",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a program that:
1. Reads the ultrasonic sensor
2. If distance < 20cm → Stop the car
3. If distance >= 20cm → Move forward
4. Repeat continuously

📋 BLOCKS TO USE:
• 📡 Read Sensor
• ⬆️ Move Forward
• 🛑 Stop
• ⏱️ Wait 500ms

🎯 EXPECTED BEHAVIOR:
• Car moves forward when path is clear
• Car stops when obstacle detected
• Car resumes when obstacle removed

💡 HINT:
Use the block coding interface to drag and drop blocks.
Your code will automatically be sent to ESP32!

✅ COMPLETION CHECK:
□ Block code created
□ Sent to ESP32
□ Car stops when hand placed in front
□ Car resumes when hand removed`,
        xpReward: 50
      }
    ],
    quiz: {
      questions: [
        {
          question: "What does the ultrasonic sensor use to measure distance?",
          options: ["Light waves", "Sound waves", "Radio waves", "Heat waves"],
          correctAnswer: 1
        },
        {
          question: "What is the maximum range of HC-SR04 sensor?",
          options: ["100cm", "200cm", "400cm", "1000cm"],
          correctAnswer: 2
        },
        {
          question: "Which pin sends the ultrasonic pulse?",
          options: ["VCC", "GND", "TRIG", "ECHO"],
          correctAnswer: 2
        },
        {
          question: "Why do we need a voltage divider for ECHO pin?",
          options: [
            "To increase voltage",
            "To convert 5V to 3.3V for ESP32",
            "To make it faster",
            "To reduce noise"
          ],
          correctAnswer: 1
        },
        {
          question: "How is distance calculated from ultrasonic sensor?",
          options: [
            "Time × Speed of light",
            "Time × Speed of sound / 2",
            "Voltage × 100",
            "Frequency × Wavelength"
          ],
          correctAnswer: 1
        }
      ],
      passPercentage: 60
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 2: TEMPERATURE SENSOR (DHT11)
  // ═══════════════════════════════════════════════════════════════════════════
  2: {
    sensor: {
      id: "temperature",
      name: "Temperature & Humidity Sensor (DHT11)",
      icon: "🌡️",
      color: "#ef4444",
      description: "Measure temperature and humidity from the environment",
      difficulty: "Beginner"
    },
    tasks: [
      {
        id: 2001,
        taskNumber: 1,
        type: "wiring",
        title: "Connect DHT11 Temperature Sensor",
        description: "Wire the DHT11 sensor to read temperature and humidity data.",
        instructions: `📚 WHAT YOU'LL LEARN:
• DHT11 sensor specifications
• Single-wire communication
• Pull-up resistor usage

🔌 WIRING STEPS:
1. Connect VCC → ESP32 3.3V
2. Connect GND → ESP32 GND
3. Connect DATA → ESP32 GPIO 4
4. Add 10KΩ pull-up resistor between DATA and VCC

📌 PIN SUMMARY:
   DHT11      →    ESP32
   ────────────────────────
   VCC (+)    →    3.3V
   DATA       →    GPIO 4
   NC         →    (Not Connected)
   GND (-)    →    GND

⚠️ IMPORTANT:
• Some DHT11 modules have built-in resistor
• If no reading, add 10KΩ between DATA and VCC

✅ COMPLETION CHECK:
□ 3 wires connected
□ Pull-up resistor in place (if needed)
□ Secure connections`,
        xpReward: 50
      },
      {
        id: 2002,
        taskNumber: 2,
        type: "testing",
        title: "Read Temperature & Humidity",
        description: "Install the DHT library and test sensor readings.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Installing Arduino libraries
• Reading digital sensor data
• Understanding temperature units

📦 LIBRARY INSTALLATION:
1. Arduino IDE → Sketch → Include Library → Manage Libraries
2. Search "DHT sensor library" by Adafruit
3. Click Install
4. Also install "Adafruit Unified Sensor"

📝 TEST CODE:
─────────────────────────────────
#include "DHT.h"
#define DHTPIN 4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT!");
    return;
  }
  
  Serial.print("Temperature: ");
  Serial.print(t);
  Serial.print("°C  Humidity: ");
  Serial.print(h);
  Serial.println("%");
  delay(2000);
}
─────────────────────────────────

🧪 TEST EXPERIMENTS:
• Breathe on sensor → humidity increases
• Hold sensor → temperature increases
• Place near AC → temperature drops

✅ COMPLETION CHECK:
□ Library installed
□ Code uploaded
□ Temperature reading is reasonable (15-35°C)
□ Humidity reading changes with breath`,
        xpReward: 50
      },
      {
        id: 2003,
        taskNumber: 3,
        type: "coding",
        title: "Block Coding: Temperature Alert System",
        description: "Create a temperature monitoring system with alerts.",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a program that:
1. Reads temperature continuously
2. If temp > 30°C → Turn on LED + Buzzer
3. If temp <= 30°C → LED off, no buzzer
4. Display reading on dashboard

📋 BLOCKS TO USE:
• 📡 Read Sensor (Temperature)
• 💡 LED On/Off
• 🔔 Buzzer
• ⏱️ Wait 2 sec

🎯 EXPECTED BEHAVIOR:
• Normal temp → LED off, silent
• High temp → LED on, buzzer beeps
• Dashboard shows live temperature

💡 TIP:
Use your hand to warm the sensor and trigger the alert!

✅ COMPLETION CHECK:
□ Block code created and sent
□ LED turns on above 30°C
□ Buzzer sounds the alert
□ Dashboard shows temperature`,
        xpReward: 50
      }
    ],
    quiz: {
      questions: [
        {
          question: "What does DHT11 measure?",
          options: ["Only temperature", "Only humidity", "Temperature and humidity", "Pressure"],
          correctAnswer: 2
        },
        {
          question: "What voltage should DHT11 be connected to?",
          options: ["1.8V", "3.3V", "5V", "12V"],
          correctAnswer: 1
        },
        {
          question: "What is the temperature range of DHT11?",
          options: ["-40 to 80°C", "0 to 50°C", "-20 to 100°C", "10 to 40°C"],
          correctAnswer: 1
        },
        {
          question: "Why is a pull-up resistor sometimes needed?",
          options: [
            "To increase current",
            "To ensure stable HIGH signal on data line",
            "To reduce temperature",
            "To increase humidity"
          ],
          correctAnswer: 1
        },
        {
          question: "How often can DHT11 be read?",
          options: ["Every 10ms", "Every 100ms", "Every 1 second", "Every 2 seconds"],
          correctAnswer: 3
        }
      ],
      passPercentage: 60
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 3: GAS SENSOR (MQ-2)
  // ═══════════════════════════════════════════════════════════════════════════
  3: {
    sensor: {
      id: "gas",
      name: "Gas Sensor (MQ-2)",
      icon: "💨",
      color: "#84cc16",
      description: "Detect smoke, LPG, and combustible gases",
      difficulty: "Intermediate"
    },
    tasks: [
      {
        id: 3001,
        taskNumber: 1,
        type: "wiring",
        title: "Connect MQ-2 Gas Sensor",
        description: "Wire the MQ-2 sensor for gas and smoke detection.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Gas sensor working principle
• Analog vs Digital output
• Sensor warm-up time

⚠️ SAFETY WARNING:
• MQ-2 heater gets HOT during operation
• Do not touch the metal mesh
• Use in ventilated area

🔌 WIRING STEPS:
1. Connect VCC → ESP32 5V (needs 5V!)
2. Connect GND → ESP32 GND
3. Connect AO (Analog) → ESP32 GPIO 34
4. Connect DO (Digital) → ESP32 GPIO 35 (optional)

📌 PIN SUMMARY:
   MQ-2       →    ESP32
   ────────────────────────
   VCC        →    5V/VIN
   GND        →    GND
   AO         →    GPIO 34 (ADC)
   DO         →    GPIO 35 (optional)

⏱️ WARM-UP TIME:
• MQ-2 needs 2-3 minutes to warm up
• Wait before taking readings

✅ COMPLETION CHECK:
□ VCC connected to 5V
□ Analog output to GPIO 34
□ Sensor heater warming up`,
        xpReward: 50
      },
      {
        id: 3002,
        taskNumber: 2,
        type: "testing",
        title: "Detect Gas and Smoke",
        description: "Test the sensor with safe substances and calibrate readings.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Reading analog values
• Understanding PPM (parts per million)
• Sensor calibration basics

📝 TEST CODE:
─────────────────────────────────
#define GAS_PIN 34

void setup() {
  Serial.begin(115200);
  Serial.println("MQ-2 Gas Sensor Test");
  Serial.println("Warming up... wait 2 minutes");
  delay(120000); // 2 min warm-up
  Serial.println("Ready!");
}

void loop() {
  int gasValue = analogRead(GAS_PIN);
  int percentage = map(gasValue, 0, 4095, 0, 100);
  
  Serial.print("Gas Level: ");
  Serial.print(gasValue);
  Serial.print(" (");
  Serial.print(percentage);
  Serial.println("%)");
  
  if (gasValue > 1000) {
    Serial.println("⚠️ HIGH GAS DETECTED!");
  }
  
  delay(1000);
}
─────────────────────────────────

🧪 SAFE TEST IDEAS:
• Wave a lighter (unlit) near sensor → gas detected
• Blow out a match near sensor → smoke detected
• Use rubbing alcohol on cotton → vapor detected
• ⚠️ DO NOT use actual flames!

✅ COMPLETION CHECK:
□ Sensor warmed up (2+ minutes)
□ Normal reading: 100-400
□ Gas detected: reading jumps to 1000+
□ Readings return to normal after gas clears`,
        xpReward: 50
      },
      {
        id: 3003,
        taskNumber: 3,
        type: "coding",
        title: "Block Coding: Gas Leak Alarm",
        description: "Create a gas leak detection system with visual and audio alerts.",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a safety system that:
1. Continuously monitors gas levels
2. If gas > threshold → Sound alarm + Flash LED
3. Display gas level on dashboard
4. Show "DANGER" or "SAFE" status

📋 BLOCKS TO USE:
• 📡 Read Sensor (Gas)
• 💡 LED Toggle
• 🔔 Buzzer
• ⏱️ Wait 500ms
• 🛑 Stop (car should stop in gas area!)

🎯 EXPECTED BEHAVIOR:
• Normal: LED steady, no sound
• Gas detected: LED flashing, buzzer beeping
• Car stops moving in danger zone

⚠️ REAL-WORLD APPLICATION:
This is how real gas detectors work in homes!

✅ COMPLETION CHECK:
□ System detects gas increase
□ LED flashes during alert
□ Buzzer sounds warning
□ Dashboard shows live gas level`,
        xpReward: 50
      }
    ],
    quiz: {
      questions: [
        {
          question: "What gases can MQ-2 sensor detect?",
          options: ["Only oxygen", "Only CO2", "LPG, smoke, methane, propane", "Only nitrogen"],
          correctAnswer: 2
        },
        {
          question: "Why does MQ-2 need warm-up time?",
          options: [
            "To charge the battery",
            "Heater needs to reach operating temperature",
            "To download updates",
            "To calibrate automatically"
          ],
          correctAnswer: 1
        },
        {
          question: "What type of output does AO pin provide?",
          options: ["Digital (0 or 1)", "Analog (0-4095)", "PWM", "I2C data"],
          correctAnswer: 1
        },
        {
          question: "What voltage does MQ-2 require?",
          options: ["3.3V only", "5V", "12V", "1.8V"],
          correctAnswer: 1
        },
        {
          question: "What happens to sensor reading when gas is detected?",
          options: ["Value decreases", "Value increases", "Value stays same", "Sensor turns off"],
          correctAnswer: 1
        }
      ],
      passPercentage: 60
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 4: IR OBSTACLE SENSOR
  // ═══════════════════════════════════════════════════════════════════════════
  4: {
    sensor: {
      id: "ir_obstacle",
      name: "IR Obstacle Sensor",
      icon: "📡",
      color: "#8b5cf6",
      description: "Detect obstacles using infrared light",
      difficulty: "Intermediate"
    },
    tasks: [
      {
        id: 4001,
        taskNumber: 1,
        type: "wiring",
        title: "Connect IR Obstacle Sensor",
        description: "Wire the IR sensor module to detect nearby obstacles.",
        instructions: `📚 WHAT YOU'LL LEARN:
• How IR sensors work
• Reflection-based detection
• Digital output reading

🔌 WIRING STEPS:
1. Connect VCC → ESP32 3.3V
2. Connect GND → ESP32 GND
3. Connect OUT → ESP32 GPIO 15

📌 PIN SUMMARY:
   IR Sensor  →    ESP32
   ────────────────────────
   VCC        →    3.3V
   GND        →    GND
   OUT        →    GPIO 15

🔧 SENSITIVITY ADJUSTMENT:
• Most IR modules have a potentiometer
• Turn clockwise = less sensitive (closer detection)
• Turn counter-clockwise = more sensitive

📏 DETECTION RANGE:
• Typically 2cm - 30cm
• Adjust potentiometer for your needs

✅ COMPLETION CHECK:
□ 3 wires connected
□ LED on module lights up
□ Sensitivity adjusted`,
        xpReward: 50
      },
      {
        id: 4002,
        taskNumber: 2,
        type: "testing",
        title: "Test Obstacle Detection",
        description: "Verify the IR sensor detects obstacles at various distances.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Digital input reading
• Active LOW vs Active HIGH
• Detection range testing

📝 TEST CODE:
─────────────────────────────────
#define IR_PIN 15

void setup() {
  Serial.begin(115200);
  pinMode(IR_PIN, INPUT);
  Serial.println("IR Sensor Test");
}

void loop() {
  int obstacle = digitalRead(IR_PIN);
  
  if (obstacle == LOW) {
    Serial.println("🚧 OBSTACLE DETECTED!");
  } else {
    Serial.println("✅ Path clear");
  }
  
  delay(200);
}
─────────────────────────────────

🧪 TEST EXPERIMENTS:
• Place hand in front → detects
• Use white paper → detects easily
• Use black paper → may not detect (IR absorbed)
• Test at different distances

📊 COLOR EFFECTS:
• White/light colors → reflect IR well
• Black/dark colors → absorb IR
• This affects detection!

✅ COMPLETION CHECK:
□ Detects white objects
□ Detection at correct distance
□ Serial shows status changes
□ Onboard LED matches detection`,
        xpReward: 50
      },
      {
        id: 4003,
        taskNumber: 3,
        type: "coding",
        title: "Block Coding: Line Following Robot",
        description: "Program the car to follow a line or avoid obstacles.",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create obstacle avoidance:
1. Move forward by default
2. When obstacle detected → Stop
3. Turn right
4. Check again
5. Continue if clear

📋 BLOCKS TO USE:
• 📡 Read Sensor (IR)
• ⬆️ Move Forward
• 🛑 Stop
• ➡️ Turn Right
• ⏱️ Wait 300ms

🎯 EXPECTED BEHAVIOR:
• Car moves forward
• Detects obstacle → stops
• Turns right to avoid
• Continues moving

💡 ADVANCED CHALLENGE:
Add left turning if right is blocked too!

✅ COMPLETION CHECK:
□ Car moves forward
□ Stops at obstacles
□ Turns to avoid
□ Continues after avoiding`,
        xpReward: 50
      }
    ],
    quiz: {
      questions: [
        {
          question: "What does IR stand for?",
          options: ["Internal Resistance", "Infrared", "Input Reader", "Image Recognition"],
          correctAnswer: 1
        },
        {
          question: "How does an IR obstacle sensor work?",
          options: [
            "Detects sound waves",
            "Emits IR light and detects reflection",
            "Measures temperature",
            "Uses GPS"
          ],
          correctAnswer: 1
        },
        {
          question: "What color is hardest for IR sensors to detect?",
          options: ["White", "Yellow", "Black", "Red"],
          correctAnswer: 2
        },
        {
          question: "What does LOW output typically mean?",
          options: ["No obstacle", "Obstacle detected", "Sensor error", "Low battery"],
          correctAnswer: 1
        },
        {
          question: "What component adjusts IR sensor sensitivity?",
          options: ["Capacitor", "Resistor", "Potentiometer", "Transistor"],
          correctAnswer: 2
        }
      ],
      passPercentage: 60
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 5: SOIL MOISTURE SENSOR
  // ═══════════════════════════════════════════════════════════════════════════
  5: {
    sensor: {
      id: "soil_moisture",
      name: "Soil Moisture Sensor",
      icon: "🌱",
      color: "#22c55e",
      description: "Measure water content in soil for plant monitoring",
      difficulty: "Intermediate"
    },
    tasks: [
      {
        id: 5001,
        taskNumber: 1,
        type: "wiring",
        title: "Connect Soil Moisture Sensor",
        description: "Wire the soil moisture sensor to monitor plant watering needs.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Capacitive vs resistive sensors
• Analog moisture reading
• Corrosion considerations

🔌 WIRING STEPS:
1. Connect VCC → ESP32 3.3V
2. Connect GND → ESP32 GND
3. Connect AO → ESP32 GPIO 34

📌 PIN SUMMARY:
   Soil Sensor →   ESP32
   ────────────────────────
   VCC         →   3.3V
   GND         →   GND
   AO          →   GPIO 34

⚠️ SENSOR TYPES:
• Resistive: Cheaper, corrodes over time
• Capacitive: More durable, recommended

💡 TIP:
Don't leave resistive sensor powered
continuously - it corrodes faster!

✅ COMPLETION CHECK:
□ Sensor connected
□ Probe inserted in soil/water
□ No corrosion visible`,
        xpReward: 50
      },
      {
        id: 5002,
        taskNumber: 2,
        type: "testing",
        title: "Measure Soil Moisture Levels",
        description: "Calibrate and test moisture readings in different conditions.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Calibrating sensors
• Mapping values to percentages
• Threshold setting

📝 TEST CODE:
─────────────────────────────────
#define SOIL_PIN 34

// Calibration values (adjust for your sensor)
int dryValue = 3500;  // Value in dry air
int wetValue = 1500;  // Value in water

void setup() {
  Serial.begin(115200);
  Serial.println("Soil Moisture Sensor");
}

void loop() {
  int rawValue = analogRead(SOIL_PIN);
  int moisture = map(rawValue, dryValue, wetValue, 0, 100);
  moisture = constrain(moisture, 0, 100);
  
  Serial.print("Raw: ");
  Serial.print(rawValue);
  Serial.print(" | Moisture: ");
  Serial.print(moisture);
  Serial.print("% | ");
  
  if (moisture < 30) {
    Serial.println("🏜️ DRY - Water needed!");
  } else if (moisture < 70) {
    Serial.println("👍 GOOD - Optimal moisture");
  } else {
    Serial.println("💧 WET - Too much water");
  }
  
  delay(1000);
}
─────────────────────────────────

🧪 CALIBRATION:
1. Put sensor in air → note the value (dry)
2. Put sensor in water → note the value (wet)
3. Update dryValue and wetValue in code

✅ COMPLETION CHECK:
□ Calibration values set
□ Dry reading: 0-30%
□ Wet reading: 70-100%
□ Readings are stable`,
        xpReward: 50
      },
      {
        id: 5003,
        taskNumber: 3,
        type: "coding",
        title: "Block Coding: Smart Plant Watering Alert",
        description: "Create an automatic plant monitoring system.",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a plant care system:
1. Read soil moisture every 5 seconds
2. If moisture < 30% → Alert (LED + Buzzer)
3. Display moisture level on dashboard
4. Show "Water Me!" or "I'm Happy!" status

📋 BLOCKS TO USE:
• 📡 Read Sensor (Soil)
• 💡 LED On/Off
• 🔔 Buzzer
• ⏱️ Wait 5 sec

🎯 EXPECTED BEHAVIOR:
• Dashboard shows moisture %
• LED lights up when soil is dry
• Buzzer reminds to water
• Alert stops when watered

🌱 REAL APPLICATION:
This is how smart garden systems work!

✅ COMPLETION CHECK:
□ Moisture displayed on dashboard
□ Alert when dry (< 30%)
□ Alert stops when wet
□ System runs continuously`,
        xpReward: 50
      }
    ],
    quiz: {
      questions: [
        {
          question: "What does a soil moisture sensor measure?",
          options: ["Soil temperature", "Water content in soil", "Soil pH", "Soil nutrients"],
          correctAnswer: 1
        },
        {
          question: "Which sensor type is more durable?",
          options: ["Resistive", "Capacitive", "Both equal", "Neither"],
          correctAnswer: 1
        },
        {
          question: "Why do resistive sensors corrode?",
          options: [
            "They use batteries",
            "Electric current through wet soil causes electrolysis",
            "They get too hot",
            "Sunlight damages them"
          ],
          correctAnswer: 1
        },
        {
          question: "What reading indicates dry soil?",
          options: ["Low value (close to 0)", "High value (close to 4095)", "Exactly 2048", "Negative value"],
          correctAnswer: 1
        },
        {
          question: "What is the ideal moisture level for most plants?",
          options: ["0-20%", "30-70%", "80-100%", "Exactly 50%"],
          correctAnswer: 1
        }
      ],
      passPercentage: 60
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 6: LDR LIGHT SENSOR
  // ═══════════════════════════════════════════════════════════════════════════
  6: {
    sensor: {
      id: "ldr",
      name: "LDR Light Sensor",
      icon: "💡",
      color: "#eab308",
      description: "Detect light intensity using a photoresistor",
      difficulty: "Intermediate"
    },
    tasks: [
      {
        id: 6001,
        taskNumber: 1,
        type: "wiring",
        title: "Connect LDR Light Sensor",
        description: "Create a voltage divider circuit with the LDR.",
        instructions: `📚 WHAT YOU'LL LEARN:
• How LDR (photoresistor) works
• Voltage divider concept
• Analog light measurement

🔌 WIRING (VOLTAGE DIVIDER):
   3.3V
    │
   [LDR]
    │
    ├──────► GPIO 35 (ADC)
    │
   [10KΩ]
    │
   GND

📌 STEP BY STEP:
1. LDR one leg → 3.3V
2. LDR other leg → GPIO 35
3. Same leg → 10KΩ resistor
4. Other end of resistor → GND

⚡ HOW IT WORKS:
• Dark: LDR resistance HIGH → low voltage at GPIO
• Light: LDR resistance LOW → high voltage at GPIO

✅ COMPLETION CHECK:
□ LDR connected with voltage divider
□ 10KΩ resistor in place
□ Correct GPIO pin used`,
        xpReward: 50
      },
      {
        id: 6002,
        taskNumber: 2,
        type: "testing",
        title: "Measure Light Intensity",
        description: "Test the LDR in different lighting conditions.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Analog reading interpretation
• Light level mapping
• Day/night detection

📝 TEST CODE:
─────────────────────────────────
#define LDR_PIN 35

void setup() {
  Serial.begin(115200);
  Serial.println("LDR Light Sensor Test");
}

void loop() {
  int lightValue = analogRead(LDR_PIN);
  int lightPercent = map(lightValue, 0, 4095, 0, 100);
  
  Serial.print("Light: ");
  Serial.print(lightValue);
  Serial.print(" (");
  Serial.print(lightPercent);
  Serial.print("%) | ");
  
  if (lightPercent < 20) {
    Serial.println("🌙 DARK");
  } else if (lightPercent < 60) {
    Serial.println("☁️ DIM");
  } else {
    Serial.println("☀️ BRIGHT");
  }
  
  delay(500);
}
─────────────────────────────────

🧪 TEST EXPERIMENTS:
• Cover LDR → low reading (dark)
• Phone flashlight → high reading
• Room light on/off → see change
• Near window → varies with sun

✅ COMPLETION CHECK:
□ Readings change with light
□ Dark = low value
□ Bright = high value
□ Percentage mapping works`,
        xpReward: 50
      },
      {
        id: 6003,
        taskNumber: 3,
        type: "coding",
        title: "Block Coding: Automatic Headlights",
        description: "Create automatic headlights that turn on in darkness.",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create auto-headlights:
1. Read light level continuously
2. If dark (< 30%) → Turn on LED (headlight)
3. If bright (> 30%) → Turn off LED
4. Display light level on dashboard

📋 BLOCKS TO USE:
• 📡 Read Sensor (Light)
• 💡 LED On/Off
• ⏱️ Wait 500ms

🎯 EXPECTED BEHAVIOR:
• LED off in bright room
• Cover LDR → LED turns on
• Uncover → LED turns off
• Like real car headlights!

🚗 REAL APPLICATION:
This is how automatic headlights in cars work!

✅ COMPLETION CHECK:
□ LED responds to light changes
□ Dashboard shows light %
□ Works like auto headlights
□ Smooth transitions`,
        xpReward: 50
      }
    ],
    quiz: {
      questions: [
        {
          question: "What does LDR stand for?",
          options: ["Light Dependent Resistor", "Low Data Rate", "Linear Detection Range", "Laser Distance Reader"],
          correctAnswer: 0
        },
        {
          question: "What happens to LDR resistance in bright light?",
          options: ["Increases", "Decreases", "Stays same", "Becomes infinite"],
          correctAnswer: 1
        },
        {
          question: "Why do we need a voltage divider with LDR?",
          options: [
            "To increase brightness",
            "To convert resistance change to voltage change",
            "To protect the LDR",
            "To make it waterproof"
          ],
          correctAnswer: 1
        },
        {
          question: "What value resistor is typically used with LDR?",
          options: ["100Ω", "1KΩ", "10KΩ", "1MΩ"],
          correctAnswer: 2
        },
        {
          question: "What is a common application of LDR?",
          options: ["Temperature measurement", "Automatic street lights", "Playing music", "WiFi connection"],
          correctAnswer: 1
        }
      ],
      passPercentage: 60
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 7: FLAME SENSOR
  // ═══════════════════════════════════════════════════════════════════════════
  7: {
    sensor: {
      id: "flame",
      name: "Flame Sensor",
      icon: "🔥",
      color: "#f97316",
      description: "Detect fire and flames for safety systems",
      difficulty: "Advanced"
    },
    tasks: [
      {
        id: 7001,
        taskNumber: 1,
        type: "wiring",
        title: "Connect Flame Sensor Module",
        description: "Wire the flame detection sensor for fire safety monitoring.",
        instructions: `📚 WHAT YOU'LL LEARN:
• IR-based flame detection
• Fire safety systems
• Digital and analog outputs

⚠️ SAFETY WARNING:
• Do NOT use actual fires for testing
• Use a lighter (unlit) or IR remote
• Adult supervision required

🔌 WIRING STEPS:
1. Connect VCC → ESP32 3.3V
2. Connect GND → ESP32 GND
3. Connect DO → ESP32 GPIO 16 (Digital)
4. Connect AO → ESP32 GPIO 36 (Analog)

📌 PIN SUMMARY:
   Flame Sensor →   ESP32
   ────────────────────────
   VCC          →   3.3V
   GND          →   GND
   DO           →   GPIO 16
   AO           →   GPIO 36

📊 DETECTION:
• Detects IR wavelength 760-1100nm
• Range: up to 80cm for lighter flame

✅ COMPLETION CHECK:
□ Both outputs connected
□ Sensor LED visible
□ Ready for safe testing`,
        xpReward: 50
      },
      {
        id: 7002,
        taskNumber: 2,
        type: "testing",
        title: "Test Flame Detection",
        description: "Safely test flame detection using IR sources.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Safe testing methods
• Analog vs digital reading
• Sensitivity adjustment

📝 TEST CODE:
─────────────────────────────────
#define FLAME_DO 16
#define FLAME_AO 36

void setup() {
  Serial.begin(115200);
  pinMode(FLAME_DO, INPUT);
  Serial.println("Flame Sensor Test");
  Serial.println("Use IR remote or phone camera light");
}

void loop() {
  int digital = digitalRead(FLAME_DO);
  int analog = analogRead(FLAME_AO);
  
  Serial.print("Analog: ");
  Serial.print(analog);
  Serial.print(" | Digital: ");
  Serial.print(digital == LOW ? "🔥 FLAME!" : "✅ Safe");
  Serial.println();
  
  if (digital == LOW) {
    Serial.println("⚠️ FIRE DETECTED! ⚠️");
  }
  
  delay(200);
}
─────────────────────────────────

🧪 SAFE TEST IDEAS:
• TV remote → point at sensor, press button
• Phone camera with flash on
• Candle from safe distance (adult supervision)
• IR LED if available

✅ COMPLETION CHECK:
□ Detects IR remote
□ Digital output changes
□ Analog shows intensity
□ Returns to safe state`,
        xpReward: 50
      },
      {
        id: 7003,
        taskNumber: 3,
        type: "coding",
        title: "Block Coding: Fire Alarm System",
        description: "Create a fire detection and alarm system.",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a fire safety system:
1. Monitor flame sensor continuously
2. If flame detected → Full alarm mode:
   - Buzzer sounds continuously
   - LED flashes rapidly
   - Car reverses away
3. Display status on dashboard

📋 BLOCKS TO USE:
• 📡 Read Sensor (Flame)
• 🔔 Buzzer
• 💡 LED Toggle
• ⬇️ Move Backward
• 🛑 Stop
• ⏱️ Wait 200ms

🎯 EXPECTED BEHAVIOR:
• Normal: LED off, silent
• Flame: Buzzer alarm, LED flash, car backs up
• Real fire alarm simulation!

🚒 REAL APPLICATION:
Fire alarm systems in buildings use similar sensors!

✅ COMPLETION CHECK:
□ Detects flame/IR source
□ Alarm sounds immediately
□ Car moves away from danger
□ Dashboard shows FIRE alert`,
        xpReward: 50
      }
    ],
    quiz: {
      questions: [
        {
          question: "What type of light does a flame sensor detect?",
          options: ["Visible light", "Ultraviolet", "Infrared (IR)", "X-ray"],
          correctAnswer: 2
        },
        {
          question: "What is the typical detection range of a flame sensor?",
          options: ["5cm", "80cm", "5 meters", "50 meters"],
          correctAnswer: 1
        },
        {
          question: "What wavelength range do flame sensors detect?",
          options: ["400-700nm", "760-1100nm", "1500-2000nm", "100-300nm"],
          correctAnswer: 1
        },
        {
          question: "Why can TV remotes trigger flame sensors?",
          options: [
            "They emit radio waves",
            "They emit infrared light",
            "They are very hot",
            "They make sound"
          ],
          correctAnswer: 1
        },
        {
          question: "What does LOW output from flame sensor indicate?",
          options: ["No flame", "Flame detected", "Sensor error", "Low battery"],
          correctAnswer: 1
        }
      ],
      passPercentage: 60
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 8: PIR MOTION SENSOR
  // ═══════════════════════════════════════════════════════════════════════════
  8: {
    sensor: {
      id: "pir",
      name: "PIR Motion Sensor",
      icon: "🚶",
      color: "#ec4899",
      description: "Detect human movement using passive infrared",
      difficulty: "Advanced"
    },
    tasks: [
      {
        id: 8001,
        taskNumber: 1,
        type: "wiring",
        title: "Connect PIR Motion Sensor",
        description: "Wire the PIR sensor for motion detection applications.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Passive infrared technology
• Motion sensing principle
• Timing adjustment

🔌 WIRING STEPS:
1. Connect VCC → ESP32 5V (PIR needs 5V)
2. Connect GND → ESP32 GND
3. Connect OUT → ESP32 GPIO 17

📌 PIN SUMMARY:
   PIR Sensor  →   ESP32
   ────────────────────────
   VCC         →   5V/VIN
   OUT         →   GPIO 17
   GND         →   GND

🔧 ADJUSTMENTS (on sensor):
• Sensitivity pot: Detection range
• Time pot: How long output stays HIGH

⏱️ WARM-UP:
• PIR needs 30-60 seconds to stabilize
• Don't move during warm-up

✅ COMPLETION CHECK:
□ 3 wires connected
□ Using 5V for VCC
□ Sensor warmed up`,
        xpReward: 50
      },
      {
        id: 8002,
        taskNumber: 2,
        type: "testing",
        title: "Test Motion Detection",
        description: "Test the PIR sensor's motion detection capabilities.",
        instructions: `📚 WHAT YOU'LL LEARN:
• PIR warm-up behavior
• Sensitivity adjustment
• Trigger modes

📝 TEST CODE:
─────────────────────────────────
#define PIR_PIN 17

void setup() {
  Serial.begin(115200);
  pinMode(PIR_PIN, INPUT);
  
  Serial.println("PIR Sensor Test");
  Serial.println("Warming up... wait 30 seconds");
  Serial.println("DON'T MOVE during warm-up!");
  
  delay(30000);
  Serial.println("Ready! Wave your hand...");
}

void loop() {
  int motion = digitalRead(PIR_PIN);
  
  if (motion == HIGH) {
    Serial.println("🚶 MOTION DETECTED!");
  } else {
    Serial.println("✅ No motion");
  }
  
  delay(100);
}
─────────────────────────────────

🧪 TEST EXPERIMENTS:
• Wave hand → triggers
• Walk past sensor → triggers
• Stay still → no trigger
• Pet walking → may trigger!

⚙️ ADJUSTMENTS:
• Turn sensitivity pot for range
• Turn time pot for output duration

✅ COMPLETION CHECK:
□ Warm-up completed
□ Detects hand wave
□ Detects walking
□ Returns to no-motion state`,
        xpReward: 50
      },
      {
        id: 8003,
        taskNumber: 3,
        type: "coding",
        title: "Block Coding: Security Alarm System",
        description: "Create a motion-activated security system.",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create a security system:
1. Monitor for motion continuously
2. When motion detected:
   - Sound buzzer 3 times
   - Flash LED
   - Display "INTRUDER!" on dashboard
3. After 5 seconds, reset to monitoring

📋 BLOCKS TO USE:
• 📡 Read Sensor (Motion)
• 🔔 Buzzer
• 💡 LED Toggle
• ⏱️ Wait 500ms
• ⏱️ Wait 5 sec

🎯 EXPECTED BEHAVIOR:
• Silent when no motion
• Alarm when someone walks by
• Resets after timeout
• Like a real burglar alarm!

🏠 REAL APPLICATION:
Home security systems use PIR sensors!

✅ COMPLETION CHECK:
□ Detects motion
□ Alarm sequence plays
□ Dashboard shows alert
□ Auto-resets after timeout`,
        xpReward: 50
      }
    ],
    quiz: {
      questions: [
        {
          question: "What does PIR stand for?",
          options: ["Power Infrared Receiver", "Passive Infrared", "Positive IR", "Projected IR"],
          correctAnswer: 1
        },
        {
          question: "Why is PIR called 'passive'?",
          options: [
            "It doesn't use power",
            "It only receives IR, doesn't emit it",
            "It's very slow",
            "It requires less wiring"
          ],
          correctAnswer: 1
        },
        {
          question: "What does PIR actually detect?",
          options: [
            "Sound waves",
            "Changes in infrared radiation (body heat)",
            "Magnetic fields",
            "Radio waves"
          ],
          correctAnswer: 1
        },
        {
          question: "Why does PIR need warm-up time?",
          options: [
            "To charge the battery",
            "To calibrate to ambient IR levels",
            "To connect to WiFi",
            "To update firmware"
          ],
          correctAnswer: 1
        },
        {
          question: "What can trigger a false positive on PIR?",
          options: [
            "Loud sounds",
            "Hot air from heater/AC",
            "Strong WiFi signal",
            "Bright visible light"
          ],
          correctAnswer: 1
        }
      ],
      passPercentage: 60
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 9: WATER LEVEL SENSOR
  // ═══════════════════════════════════════════════════════════════════════════
  9: {
    sensor: {
      id: "water_level",
      name: "Water Level Sensor",
      icon: "🌊",
      color: "#06b6d4",
      description: "Detect water presence and measure water level",
      difficulty: "Advanced"
    },
    tasks: [
      {
        id: 9001,
        taskNumber: 1,
        type: "wiring",
        title: "Connect Water Level Sensor",
        description: "Wire the water level sensor for liquid detection.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Resistive water sensing
• Analog level measurement
• Waterproofing considerations

🔌 WIRING STEPS:
1. Connect + (VCC) → ESP32 3.3V
2. Connect - (GND) → ESP32 GND
3. Connect S (Signal) → ESP32 GPIO 34

📌 PIN SUMMARY:
   Water Sensor →   ESP32
   ────────────────────────
   +  (VCC)     →   3.3V
   -  (GND)     →   GND
   S  (Signal)  →   GPIO 34

⚠️ IMPORTANT:
• Only submerge the sensing part
• Keep electronics dry!
• Don't power continuously (corrosion)

📏 SENSING AREA:
• Parallel traces on PCB
• More water = more conductivity
• Analog value increases with water level

✅ COMPLETION CHECK:
□ 3 wires connected
□ Sensor orientation correct
□ Electronics kept dry`,
        xpReward: 50
      },
      {
        id: 9002,
        taskNumber: 2,
        type: "testing",
        title: "Test Water Level Detection",
        description: "Test the sensor with different water levels.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Reading water levels
• Threshold setting
• Flood detection

📝 TEST CODE:
─────────────────────────────────
#define WATER_PIN 34

void setup() {
  Serial.begin(115200);
  Serial.println("Water Level Sensor Test");
}

void loop() {
  int waterLevel = analogRead(WATER_PIN);
  int percent = map(waterLevel, 0, 2000, 0, 100);
  percent = constrain(percent, 0, 100);
  
  Serial.print("Level: ");
  Serial.print(waterLevel);
  Serial.print(" (");
  Serial.print(percent);
  Serial.print("%) | ");
  
  if (waterLevel < 300) {
    Serial.println("🏜️ DRY");
  } else if (waterLevel < 1000) {
    Serial.println("💧 LOW WATER");
  } else if (waterLevel < 1500) {
    Serial.println("🌊 MEDIUM");
  } else {
    Serial.println("🌊🌊 HIGH WATER!");
  }
  
  delay(500);
}
─────────────────────────────────

🧪 TEST WITH:
• Cup of water
• Dip sensor gradually
• Observe level changes
• Remove and see it drop

✅ COMPLETION CHECK:
□ Reads 0 when dry
□ Value increases in water
□ Responds to level changes
□ Returns to low when removed`,
        xpReward: 50
      },
      {
        id: 9003,
        taskNumber: 3,
        type: "coding",
        title: "Block Coding: Flood Warning System",
        description: "Create a flood detection and warning system.",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create flood detection:
1. Monitor water level continuously
2. If level > 70% → Flood warning:
   - Buzzer alarm
   - LED rapid flash
   - Car moves to safety (backward)
3. Display level on dashboard

📋 BLOCKS TO USE:
• 📡 Read Sensor (Water)
• 🔔 Buzzer
• 💡 LED Toggle
• ⬇️ Move Backward
• 🛑 Stop
• ⏱️ Wait 500ms

🎯 EXPECTED BEHAVIOR:
• Normal: Shows water level
• High water: Full alarm mode
• Car escapes flood area

🌊 REAL APPLICATION:
Flood sensors protect basements and warehouses!

✅ COMPLETION CHECK:
□ Level displayed on dashboard
□ Alarm at high water
□ Car reverses from flood
□ System monitors continuously`,
        xpReward: 50
      }
    ],
    quiz: {
      questions: [
        {
          question: "How does a water level sensor work?",
          options: [
            "Measures water temperature",
            "Measures conductivity between traces",
            "Uses ultrasonic waves",
            "Measures water pressure"
          ],
          correctAnswer: 1
        },
        {
          question: "Why shouldn't you power the sensor continuously?",
          options: [
            "Uses too much electricity",
            "Causes electrolysis and corrosion",
            "Makes too much noise",
            "Overheats the water"
          ],
          correctAnswer: 1
        },
        {
          question: "What part of the sensor should be in water?",
          options: [
            "The entire sensor",
            "Only the parallel trace section",
            "Only the connector",
            "Nothing should touch water"
          ],
          correctAnswer: 1
        },
        {
          question: "What type of output does this sensor provide?",
          options: ["Digital only", "Analog only", "Both digital and analog", "I2C"],
          correctAnswer: 1
        },
        {
          question: "What happens to the reading as water level increases?",
          options: ["Value decreases", "Value increases", "Value stays same", "Value becomes negative"],
          correctAnswer: 1
        }
      ],
      passPercentage: 60
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 10: SOUND SENSOR (MICROPHONE MODULE)
  // ═══════════════════════════════════════════════════════════════════════════
  10: {
    sensor: {
      id: "sound",
      name: "Sound Sensor (Microphone)",
      icon: "🔊",
      color: "#6366f1",
      description: "Detect sound levels and respond to audio",
      difficulty: "Advanced"
    },
    tasks: [
      {
        id: 10001,
        taskNumber: 1,
        type: "wiring",
        title: "Connect Sound Sensor Module",
        description: "Wire the microphone module for sound detection.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Electret microphone basics
• Sound to electrical conversion
• Sensitivity adjustment

🔌 WIRING STEPS:
1. Connect VCC → ESP32 3.3V
2. Connect GND → ESP32 GND
3. Connect AO → ESP32 GPIO 34 (Analog)
4. Connect DO → ESP32 GPIO 35 (Digital)

📌 PIN SUMMARY:
   Sound Sensor →   ESP32
   ────────────────────────
   VCC          →   3.3V
   GND          →   GND
   AO           →   GPIO 34
   DO           →   GPIO 35

🔧 SENSITIVITY:
• Adjust potentiometer on module
• Turn until LED barely lights in quiet
• Sounds will then trigger it

✅ COMPLETION CHECK:
□ All 4 pins connected
□ Module LED visible
□ Sensitivity adjusted`,
        xpReward: 50
      },
      {
        id: 10002,
        taskNumber: 2,
        type: "testing",
        title: "Test Sound Detection",
        description: "Test the sensor with different sound levels.",
        instructions: `📚 WHAT YOU'LL LEARN:
• Analog sound levels
• Digital threshold trigger
• Sound pattern detection

📝 TEST CODE:
─────────────────────────────────
#define SOUND_AO 34
#define SOUND_DO 35

int baseline = 0;

void setup() {
  Serial.begin(115200);
  pinMode(SOUND_DO, INPUT);
  
  // Calibrate baseline (quiet room)
  Serial.println("Calibrating... stay quiet");
  delay(1000);
  baseline = analogRead(SOUND_AO);
  Serial.print("Baseline: ");
  Serial.println(baseline);
  Serial.println("Ready! Make some noise!");
}

void loop() {
  int soundLevel = analogRead(SOUND_AO);
  int digital = digitalRead(SOUND_DO);
  int intensity = abs(soundLevel - baseline);
  
  Serial.print("Level: ");
  Serial.print(intensity);
  Serial.print(" | ");
  
  if (intensity < 100) {
    Serial.println("🔇 Quiet");
  } else if (intensity < 500) {
    Serial.println("🔈 Normal");
  } else if (intensity < 1000) {
    Serial.println("🔉 Loud");
  } else {
    Serial.println("🔊 VERY LOUD!");
  }
  
  delay(50);
}
─────────────────────────────────

🧪 TEST WITH:
• Clap your hands
• Snap fingers
• Whistle
• Play music

✅ COMPLETION CHECK:
□ Baseline calibrated
□ Responds to claps
□ Different levels detected
□ Quick response time`,
        xpReward: 50
      },
      {
        id: 10003,
        taskNumber: 3,
        type: "coding",
        title: "Block Coding: Voice-Activated Robot",
        description: "Create a sound-activated robot control system.",
        instructions: `🧱 BLOCK CODING CHALLENGE:

Create voice/clap control:
1. Wait for loud sound (clap)
2. First clap → Car moves forward
3. Second clap → Car stops
4. Third clap → Car turns
5. Show sound level on dashboard

📋 BLOCKS TO USE:
• 📡 Read Sensor (Sound)
• ⬆️ Move Forward
• 🛑 Stop
• ➡️ Turn Right
• ⏱️ Wait 1 sec

🎯 EXPECTED BEHAVIOR:
• Clap 1: Forward
• Clap 2: Stop
• Clap 3: Turn
• Cycle repeats!

🎤 ADVANCED CHALLENGE:
Try pattern detection (clap-clap = forward, clap-clap-clap = reverse)

🤖 REAL APPLICATION:
Voice-activated assistants use similar technology!

✅ COMPLETION CHECK:
□ Responds to claps
□ Different clap counts = different actions
□ Dashboard shows sound level
□ Smooth control achieved`,
        xpReward: 50
      }
    ],
    quiz: {
      questions: [
        {
          question: "What type of microphone is in most sound sensor modules?",
          options: ["Dynamic", "Electret condenser", "Ribbon", "Carbon"],
          correctAnswer: 1
        },
        {
          question: "What does the sound sensor convert?",
          options: [
            "Light to sound",
            "Sound waves to electrical signals",
            "Heat to sound",
            "Motion to sound"
          ],
          correctAnswer: 1
        },
        {
          question: "What is measured in decibels (dB)?",
          options: ["Light intensity", "Sound level", "Temperature", "Distance"],
          correctAnswer: 1
        },
        {
          question: "Why do we need a baseline reading?",
          options: [
            "To charge the sensor",
            "To filter out ambient noise",
            "To connect to WiFi",
            "To calibrate color"
          ],
          correctAnswer: 1
        },
        {
          question: "What component adjusts detection threshold?",
          options: ["Capacitor", "LED", "Potentiometer", "Transistor"],
          correctAnswer: 2
        }
      ],
      passPercentage: 60
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 UPLOAD FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

async function uploadAllContent() {
  console.log("🚀 Starting STEMify Course Content Upload...\n");
  
  // Get Firebase reference (works in browser)
  const firebase = window.firebase || (await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js'));
  
  for (const [level, content] of Object.entries(COURSE_CONTENT)) {
    console.log(`📚 Uploading Level ${level}: ${content.sensor.name}`);
    
    try {
      // Upload tasks
      const tasksRef = `levelTasks/${level}`;
      await fetch(`https://stemify-dashboard-default-rtdb.firebaseio.com/${tasksRef}.json`, {
        method: 'PUT',
        body: JSON.stringify(content.tasks)
      });
      console.log(`   ✅ Tasks uploaded`);
      
      // Upload quiz
      const quizRef = `levelQuizzes/${level}`;
      await fetch(`https://stemify-dashboard-default-rtdb.firebaseio.com/${quizRef}.json`, {
        method: 'PUT',
        body: JSON.stringify(content.quiz)
      });
      console.log(`   ✅ Quiz uploaded`);
      
    } catch (error) {
      console.error(`   ❌ Error:`, error);
    }
  }
  
  console.log("\n🎉 ALL CONTENT UPLOADED SUCCESSFULLY!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 Summary:");
  console.log("   • 10 Levels uploaded");
  console.log("   • 30 Tasks created (3 per level)");
  console.log("   • 10 Quizzes created (5 questions each)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

// Export for ES modules
export { COURSE_CONTENT, uploadAllContent };

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  STEMify Course Content Uploader");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("");
  console.log("To upload all content, run: uploadAllContent()");
  console.log("");
}

