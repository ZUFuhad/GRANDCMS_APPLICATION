import {PrismaClient} from '@prisma/client';
import {PrismaD1} from '@prisma/adapter-d1';
import {getCloudflareContext} from '@opennextjs/cloudflare';

declare global { var __granddb: PrismaClient | undefined }

export async function db(){
  if(!globalThis.__granddb){
    const {env} = await getCloudflareContext();
    globalThis.__granddb = new PrismaClient({adapter: new PrismaD1((env as any).DB)});
  }
  return globalThis.__granddb;
}
