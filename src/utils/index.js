import crypto from "crypto";
import CryptoJS from "crypto-js"; // 👈 si quieres usar mismo algoritmo que en frontend

import CryptoJS from "crypto-js";

const SECRET_KEY = "clave-super-secreta";

function decryptFile(encryptedData) {
  // Desencriptar con AES
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  // Convertir a WordArray (binario)
  const wordArray = bytes;
  // Pasar a Buffer para volver a tener el archivo binario
  const buffer = Buffer.from(wordArray.toString(CryptoJS.enc.Hex), "hex");
  return buffer;
}
