import CryptoJS from "crypto-js";

// DEBE SER LA MISMA CLAVE QUE EN LA API
const SECRET_KEY = "kore_secret_hash_key_2026";

export const hashPassword = (password) => {
  const hashed = CryptoJS.HmacSHA256(password, SECRET_KEY).toString();
  console.log("🔐 hashPassword() - Input:", password);
  console.log("🔐 hashPassword() - Output:", hashed);
  console.log("🔐 hashPassword() - Longitud:", hashed.length);
  return hashed;
};

export const verifyPassword = (password, hashedPassword) => {
  const hash = hashPassword(password);
  return hash === hashedPassword;
};
