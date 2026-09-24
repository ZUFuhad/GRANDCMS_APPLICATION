import {NextResponse} from 'next/server'; import {cookies} from 'next/headers'; import {db} from '@/src/lib/db';
export async function GET(){const c=await cookies(),t=c.get('grand_session')?.value;if(t)await (await db()).session.deleteMany({where:{token:t}});c.delete('grand_session');return NextResponse.redirect(new URL('/login',process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000'))}
