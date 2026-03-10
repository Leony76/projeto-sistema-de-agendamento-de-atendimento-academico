import crypto from "crypto";

export function provisoryPassword(size = 8):string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(size);
  
  let senha = "";
  for (let i = 0; i < size; i++) {
    senha += characters[bytes[i] % characters.length];
  }

  return senha;
}

