/*
 * ═══════════════════════════════════════════════════════════════════
 * STEMify ESP8266 WiFi Controller
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Board: NodeMCU 1.0 (ESP-12E Module)
 * 
 * Ye code ESP8266 mai upload karo
 * WiFi + Firebase handle karta hai
 * Commands Arduino ko bhejta hai Serial se
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <SoftwareSerial.h>

// ═══════════════════════════════════════════════════════════════════
// 🔧 CONFIGURATION - CHANGE THESE 3 VALUES!
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// STEMify ESP8266 (ESP-12E) Configuration
// Generated for: asif
// Generated at: 09/12/2025, 05:48:13
// ═══════════════════════════════════════════════════════════════════

// WiFi Credentials - Auto-generated from STEMify Dashboard
const char* WIFI_SSID = "Cyber net";
const char* WIFI_PASSWORD = "112233445";

// Student User ID (for Firebase connection)
String STUDENT_USER_ID = "q01JTLBfQaULW1zAB9Wz4fAi7Im2";

// Firebase Database URL
const char* FIREBASE_URL = "https://stemify-dashboard-default-rtdb.firebaseio.com";

// ═══════════════════════════════════════════════════════════════════
// INSTRUCTIONS:
// 1. Open ESP8266_WiFi_Module.ino in Arduino IDE
// 2. Replace the placeholder values at the top with these values
// 3. Upload to your ESP-12E module
// 4. Make sure Arduino_Car_Controller.ino is uploaded to Arduino
// ═══════════════════════════════════════════════════════════════════

// Firebase URL (Don't change this)
const char* FIREBASE_HOST = "stemify-dashboard-default-rtdb.firebaseio.com";

// ═══════════════════════════════════════════════════════════════════
// PIN CONFIGURATION - ARDUINO COMMUNICATION
// ═══════════════════════════════════════════════════════════════════

#define ARDUINO_RX 13  // D7 - ESP RX ← Arduino TX
#define ARDUINO_TX 15  // D8 - ESP TX → Arduino RX

SoftwareSerial arduinoSerial(ARDUINO_RX, ARDUINO_TX);

// LED PIN
#define LED_PIN 2  // D4 - Built-in LED

// ═══════════════════════════════════════════════════════════════════
// VARIABLES
// ═══════════════════════════════════════════════════════════════════

unsigned long lastCommandCheck = 0;
unsigned long lastStatusUpdate = 0;
const unsigned long COMMAND_CHECK_INTERVAL = 1000;
const unsigned long STATUS_UPDATE_INTERVAL = 5000;

bool executingBlockCode = false;
int currentBlockIndex = 0;
unsigned long blockStartTime = 0;
DynamicJsonDocument blockCodeDoc(4096);

WiFiClientSecure wifiClient;

// Sensor data from Arduino
int lastDistance = 0;
int lastLight = 0;
int lastGas = 0;

// ═══════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════

void setup() {
  Serial.begin(115200);
  arduinoSerial.begin(9600);
  
  delay(1000);
  
  Serial.println("\n");
  Serial.println("╔═══════════════════════════════════════════╗");
  Serial.println("║   STEMify ESP8266 WiFi Controller         ║");
  Serial.println("╚═══════════════════════════════════════════╝");
  
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);
  
  connectWiFi();
  
  wifiClient.setInsecure();
  
  updateCarStatus(true);
  
  Serial.println("\n✅ Setup complete!\n");
}

// ═══════════════════════════════════════════════════════════════════
// WIFI CONNECTION
// ═══════════════════════════════════════════════════════════════════

void connectWiFi() {
  Serial.print("📶 Connecting to WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi Connected!");
    Serial.print("   IP: ");
    Serial.println(WiFi.localIP());
    
    for (int i = 0; i < 3; i++) {
      digitalWrite(LED_PIN, LOW);
      delay(100);
      digitalWrite(LED_PIN, HIGH);
      delay(100);
    }
  } else {
    Serial.println("\n❌ WiFi Failed!");
  }
}

// ═══════════════════════════════════════════════════════════════════
// MAIN LOOP
// ═══════════════════════════════════════════════════════════════════

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ WiFi lost! Reconnecting...");
    connectWiFi();
    return;
  }
  
  unsigned long now = millis();
  
  if (now - lastCommandCheck >= COMMAND_CHECK_INTERVAL) {
    lastCommandCheck = now;
    checkForCommands();
    checkForBlockCode();
  }
  
  if (executingBlockCode) {
    executeNextBlock();
  }
  
  if (now - lastStatusUpdate >= STATUS_UPDATE_INTERVAL) {
    lastStatusUpdate = now;
    sendToArduino("READ_DISTANCE");
    delay(100);
    checkArduinoResponse();
    updateCarStatus(true);
  }
  
  checkArduinoResponse();
}

// ═══════════════════════════════════════════════════════════════════
// ARDUINO COMMUNICATION
// ═══════════════════════════════════════════════════════════════════

void sendToArduino(String command) {
  Serial.print("📤 → Arduino: ");
  Serial.println(command);
  arduinoSerial.println(command);
}

void checkArduinoResponse() {
  while (arduinoSerial.available()) {
    String response = arduinoSerial.readStringUntil('\n');
    response.trim();
    
    if (response.length() > 0) {
      Serial.print("📥 ← Arduino: ");
      Serial.println(response);
      
      if (response.startsWith("DIST:")) {
        lastDistance = response.substring(5).toInt();
      }
      else if (response.startsWith("LIGHT:")) {
        lastLight = response.substring(6).toInt();
      }
      else if (response.startsWith("GAS:")) {
        lastGas = response.substring(4).toInt();
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// FIREBASE COMMUNICATION
// ═══════════════════════════════════════════════════════════════════

void checkForCommands() {
  HTTPClient http;
  String url = "https://" + String(FIREBASE_HOST) + "/cars/" + STUDENT_USER_ID + "/command.json";
  
  http.begin(wifiClient, url);
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    String response = http.getString();
    
    if (response != "null" && response.length() > 2) {
      DynamicJsonDocument doc(512);
      DeserializationError error = deserializeJson(doc, response);
      
      if (!error && doc.containsKey("cmd")) {
        String cmd = doc["cmd"].as<String>();
        Serial.print("\n📥 Command: ");
        Serial.println(cmd);
        
        sendToArduino(cmd);
        clearCommand();
      }
    }
  }
  http.end();
}

void checkForBlockCode() {
  if (executingBlockCode) return;
  
  HTTPClient http;
  String url = "https://" + String(FIREBASE_HOST) + "/cars/" + STUDENT_USER_ID + "/blockCode.json";
  
  http.begin(wifiClient, url);
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    String response = http.getString();
    
    if (response != "null" && response.length() > 10) {
      DeserializationError error = deserializeJson(blockCodeDoc, response);
      
      if (!error && blockCodeDoc.containsKey("blocks")) {
        JsonArray blocks = blockCodeDoc["blocks"].as<JsonArray>();
        
        if (blocks.size() > 0) {
          Serial.println("\n🧱 Block code received!");
          Serial.print("   Blocks: ");
          Serial.println(blocks.size());
          
          executingBlockCode = true;
          currentBlockIndex = 0;
          blockStartTime = millis();
          
          clearBlockCode();
        }
      }
    }
  }
  http.end();
}

void executeNextBlock() {
  JsonArray blocks = blockCodeDoc["blocks"].as<JsonArray>();
  
  if (currentBlockIndex >= (int)blocks.size()) {
    executingBlockCode = false;
    sendToArduino("STOP");
    Serial.println("\n✅ Block code complete!\n");
    return;
  }
  
  if (millis() - blockStartTime < 1000 && currentBlockIndex > 0) {
    return;
  }
  
  JsonObject block = blocks[currentBlockIndex];
  String code = block["code"].as<String>();
  
  Serial.print("   ▶️ Block ");
  Serial.print(currentBlockIndex + 1);
  Serial.print(": ");
  Serial.println(code);
  
  sendToArduino(code);
  
  currentBlockIndex++;
  blockStartTime = millis();
}

void clearCommand() {
  HTTPClient http;
  String url = "https://" + String(FIREBASE_HOST) + "/cars/" + STUDENT_USER_ID + "/command.json";
  http.begin(wifiClient, url);
  http.addHeader("Content-Type", "application/json");
  http.PUT("null");
  http.end();
}

void clearBlockCode() {
  HTTPClient http;
  String url = "https://" + String(FIREBASE_HOST) + "/cars/" + STUDENT_USER_ID + "/blockCode.json";
  http.begin(wifiClient, url);
  http.addHeader("Content-Type", "application/json");
  http.PUT("null");
  http.end();
}

void updateCarStatus(bool isConnected) {
  HTTPClient http;
  String url = "https://" + String(FIREBASE_HOST) + "/cars/" + STUDENT_USER_ID + ".json";
  
  String json = "{";
  json += "\"connected\":" + String(isConnected ? "true" : "false") + ",";
  json += "\"status\":\"" + String(isConnected ? "CONNECTED" : "DISCONNECTED") + "\",";
  json += "\"distance\":" + String(lastDistance) + ",";
  json += "\"light\":" + String(lastLight) + ",";
  json += "\"sensorValue\":" + String(lastDistance) + ",";
  json += "\"lastUpdate\":" + String(millis());
  json += "}";
  
  http.begin(wifiClient, url);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.PUT(json);
  
  if (httpCode == 200) {
    Serial.println("📡 Status updated");
  }
  
  http.end();
}

/*
 * ═══════════════════════════════════════════════════════════════════
 * WIRING:
 * 
 * ESP8266 to Arduino:
 * D7 (GPIO13) ← Arduino D11 (TX)
 * D8 (GPIO15) → Arduino D10 (RX)
 * GND         → GND
 * 
 * Power:
 * VIN ← 5V from L298N or USB
 * ═══════════════════════════════════════════════════════════════════
 */
