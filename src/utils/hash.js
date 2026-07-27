import CryptoJS from "crypto-js";

const SECRET_KEY = "kore_secret_hash_key_2026";

export const hashPassword = (password) => {
  const hashed = CryptoJS.HmacSHA256(password, SECRET_KEY).toString();
  console.log("🔐 Hash generado en cliente:", hashed.substring(0, 20) + "...");
  return hashed;
};

export const verifyPassword = (password, hashedPassword) => {
  const hash = hashPassword(password);
  return hash === hashedPassword;
};
