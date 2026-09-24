import {redirect} from 'next/navigation'; import {getSession} from '@/src/lib/auth';
export default async function Home(){const u=await getSession();redirect(u?'/dashboard':'/login')}
