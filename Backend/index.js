const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow requests from frontend
app.use(bodyParser.json());

// Algorithms and configurations
const aesAlgorithm = "aes-256-cbc";
const desAlgorithm = "des-ede3-cbc";

// Helper function to generate random key
function generateKey(algorithm) {
  return algorithm === "AES"
    ? crypto.randomBytes(32) // AES requires 32-byte key
    : crypto.randomBytes(24); // DES requires 24-byte key
}

// Encrypt using DES
function encryptDES(text, key) {
  const iv = crypto.randomBytes(8); // DES uses 8-byte IV
  const cipher = crypto.createCipheriv(desAlgorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedText: encrypted, iv: iv.toString("hex") };
}

// Decrypt using DES
function decryptDES(encryptedText, key, ivHex) {
  const decipher = crypto.createDecipheriv(
    desAlgorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Encrypt using AES
function encryptAES(text, key) {
  const iv = crypto.randomBytes(16); // AES uses 16-byte IV
  const cipher = crypto.createCipheriv(aesAlgorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedText: encrypted, iv: iv.toString("hex") };
}

// Decrypt using AES
function decryptAES(encryptedText, key, ivHex) {
  const decipher = crypto.createDecipheriv(
    aesAlgorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Encryption route
app.post("/encrypt", (req, res) => {
  const { text, algorithm, key } = req.body;
  let generatedKey, result;

  if (!key) {
    generatedKey = generateKey(algorithm);
  } else {
    generatedKey = Buffer.from(key, "hex");
  }

  if (algorithm === "AES") {
    result = encryptAES(text, generatedKey);
  } else {
    result = encryptDES(text, generatedKey);
  }

  res.json({
    encryptedText: result.encryptedText,
    key: generatedKey.toString("hex"),
    iv: result.iv,
  });
});

// Decryption route
app.post("/decrypt", (req, res) => {
  const { encryptedText, algorithm, key, iv } = req.body;
  const bufferKey = Buffer.from(key, "hex");
  let decryptedText;

  if (algorithm === "AES") {
    decryptedText = decryptAES(encryptedText, bufferKey, iv);
  } else {
    decryptedText = decryptDES(encryptedText, bufferKey, iv);
  }

  res.json({ decryptedText });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
