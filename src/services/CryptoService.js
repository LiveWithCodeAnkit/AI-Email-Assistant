// CryptoService: AES-GCM encryption/decryption for small secrets using Web Crypto
// Derives a key from a passphrase via PBKDF2. For client-side convenience only.

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

async function deriveKey(passphrase, salt) {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

const CryptoService = {
  async encryptString(plaintext, passphrase) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await deriveKey(passphrase, salt);
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      textEncoder.encode(plaintext)
    );
    const payload = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
    payload.set(salt, 0);
    payload.set(iv, salt.length);
    payload.set(new Uint8Array(ciphertext), salt.length + iv.length);
    return btoa(String.fromCharCode(...payload));
  },

  async decryptString(b64, passphrase) {
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const data = bytes.slice(28);
    const key = await deriveKey(passphrase, salt);
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    return textDecoder.decode(new Uint8Array(plaintext));
  }
};

export default CryptoService;
