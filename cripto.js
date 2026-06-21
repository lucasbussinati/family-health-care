/*
 * cripto.js
 * Criptografia client-side para a Anamnese da Família.
 *
 * Tudo roda no navegador. Os dados em texto puro NUNCA saem do seu computador
 * sem estarem criptografados. O GitHub Pages só recebe o arquivo dados.json,
 * que contém apenas o texto cifrado (AES-256-GCM).
 *
 * Esquema:
 *   - Derivação de chave: PBKDF2-SHA256 (muitas iterações p/ dificultar força bruta)
 *   - Cifra: AES-GCM 256 bits (com tag de autenticação)
 *   - salt e iv aleatórios por arquivo
 *
 * Compatível com a Web Crypto API (padrão dos navegadores modernos).
 */
const Cripto = (() => {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  function bufParaB64(buf) {
    const bytes = new Uint8Array(buf);
    let bin = "";
    const passo = 0x8000;
    for (let i = 0; i < bytes.length; i += passo) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + passo));
    }
    return btoa(bin);
  }

  function b64ParaBuf(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }

  async function derivarChave(senha, salt, iteracoes) {
    const chaveBase = await crypto.subtle.importKey(
      "raw",
      enc.encode(senha),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: iteracoes, hash: "SHA-256" },
      chaveBase,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  // Recebe um objeto JS, devolve o "pacote" cifrado pronto p/ salvar como dados.json
  async function criptografar(objeto, senha, iteracoes = 250000) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const chave = await derivarChave(senha, salt, iteracoes);
    const dados = enc.encode(JSON.stringify(objeto));
    const cifrado = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, chave, dados);
    return {
      v: 1,
      kdf: "PBKDF2",
      hash: "SHA-256",
      cifra: "AES-GCM",
      iteracoes,
      salt: bufParaB64(salt),
      iv: bufParaB64(iv),
      conteudo: bufParaB64(cifrado),
    };
  }

  // Recebe o pacote (dados.json) + senha, devolve o objeto JS original.
  // Lança erro se a senha estiver errada (tag de autenticação não confere).
  async function descriptografar(pacote, senha) {
    const salt = new Uint8Array(b64ParaBuf(pacote.salt));
    const iv = new Uint8Array(b64ParaBuf(pacote.iv));
    const chave = await derivarChave(senha, salt, pacote.iteracoes || 250000);
    const cifrado = b64ParaBuf(pacote.conteudo);
    const plano = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, chave, cifrado);
    return JSON.parse(dec.decode(plano));
  }

  return { criptografar, descriptografar, bufParaB64, b64ParaBuf };
})();
