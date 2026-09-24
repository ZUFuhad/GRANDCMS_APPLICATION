import {db} from './db';
export async function audit(userId:string,action:string,entity:string,entityId?:string,metadata?:unknown){await (await db()).auditLog.create({data:{userId,action,entity,entityId,metadata:metadata===undefined?undefined:JSON.stringify(metadata)}})}
