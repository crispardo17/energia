import CryptoJS from "crypto-js";

// Clave secreta para hashear (debe ser la misma en cliente y servidor)
// Esta clave debe ser la misma que usas en el servidor
const SECRET_KEY = "kore_secret_hash_key_2026";

export const hashPassword = (password) => {
  // Usar SHA-256 para hashear la contraseña
  const hashed = CryptoJS.HmacSHA256(password, SECRET_KEY).toString();
  return hashed;
};

// Función para verificar si es un hash válido (para el servidor)
export const verifyPassword = (password, hashedPassword) => {
  const hash = hashPassword(password);
  return hash === hashedPassword;
};
