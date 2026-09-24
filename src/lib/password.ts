const enc = new TextEncoder();
const b64 = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf as ArrayBuffer)));
const unb64 = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0));

export async function hashPassword(pw: string){
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({name:'PBKDF2', hash:'SHA-256', salt: salt as any, iterations: 100000}, key, 256);
  return `pbkdf2$100000$${b64(salt)}$${b64(bits)}`;
}

export async function verifyPassword(pw: string, stored: string){
  try{
    const [alg, it, saltB, hashB] = stored.split('$');
    if(alg !== 'pbkdf2') return false;
    const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({name:'PBKDF2', hash:'SHA-256', salt: unb64(saltB) as any, iterations: Number(it)}, key, 256);
    const a = unb64(b64(bits)), b = unb64(hashB);
    if(a.length !== b.length) return false;
    let d = 0; for(let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
    return d === 0;
  }catch{ return false }
}
