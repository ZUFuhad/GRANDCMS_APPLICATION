import {NextResponse} from 'next/server';
import {requireUser} from '@/src/lib/auth';

const PROMPT = `You are reading a business/visiting card. The user gives you the FRONT image, and optionally the BACK image of the same card.
Extract the contact details. Rules:
- "name" = the person's full name (not the company). If unclear, best guess.
- "company" = company/organization name. Keep official spelling.
- "designation" = job title if present.
- "phone" = primary mobile/phone number, digits with country code if shown (e.g. +880...). If multiple, pick the first/mobile one.
- "email" = email address, lowercase.
- "address" = full address if present.
- "website" = website if present.
- "tags" = 1-3 short keywords about the business type (e.g. "printing", "events", "logistics").
Return ONLY a JSON object with keys: name, company, designation, phone, email, address, website, tags. Use empty string "" or empty array for anything not found. No markdown, no explanation.`;

export async function POST(req:Request){
  await requireUser();
  const key = process.env.OPENAI_API_KEY;
  if(!key) return NextResponse.json({error:'AI provider not configured. Add OPENAI_API_KEY to .env'},{status:503});
  const form = await req.formData();
  const front = form.get('front'), back = form.get('back');
  if(!front || typeof front==='string' || front.size===0) return NextResponse.json({error:'Front card photo required'},{status:400});
  const imgs:any[] = [];
  const push = async (f:any)=>imgs.push({type:'image_url',image_url:{url:`data:${f.type};base64,${Buffer.from(await f.arrayBuffer()).toString('base64')}`}});
  await push(front);
  if(back && typeof back!=='string' && back.size>0) await push(back);
  try{
    const r = await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model:'gpt-4o-mini',response_format:{type:'json_object'},messages:[{role:'user',content:[{type:'text',text:PROMPT},...imgs]}]})});
    if(!r.ok) return NextResponse.json({error:`OCR provider error (${r.status})`},{status:502});
    const j = await r.json();
    const text = j.choices?.[0]?.message?.content || '{}';
    return NextResponse.json(JSON.parse(text));
  }catch(e){return NextResponse.json({error:'Scan failed. Try a clearer photo.'},{status:500})}
}
