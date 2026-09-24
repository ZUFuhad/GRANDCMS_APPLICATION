import { cookies } from 'next/headers';
import { db } from './db';

function newToken(){ const b = crypto.getRandomValues(new Uint8Array(32)); return [...b].map(x => x.toString(16).padStart(2,'0')).join(''); }

export async function createSession(userId:string){
  const token = newToken();
  await (await db()).session.create({data:{token, userId, expiresAt:new Date(Date.now()+1000*60*60*24*7)}});
  (await cookies()).set('grand_session', token, {httpOnly:true, secure:true, sameSite:'lax', path:'/', maxAge:60*60*24*7});
}
export async function getSession(){
  const token = (await cookies()).get('grand_session')?.value;
  if(!token) return null;
  const s = await (await db()).session.findUnique({where:{token}, include:{user:true}});
  if(!s || s.expiresAt < new Date()){ if(s) await (await db()).session.delete({where:{id:s.id}}); return null; }
  return s.user;
}
export async function requireUser(){ const u = await getSession(); if(!u) throw new Error('UNAUTHORIZED'); return u; }
