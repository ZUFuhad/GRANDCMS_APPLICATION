'use client';
import {useState} from 'react';

export default function CardScan({onResult}:{onResult:(d:any)=>void}){
  const [front,setFront]=useState<File|null>(null);
  const [back,setBack]=useState<File|null>(null);
  const [busy,setBusy]=useState(false);
  const [err,setErr]=useState('');

  async function scan(){
    if(!front){setErr('Front side er photo dao');return}
    setErr('');setBusy(true);
    const fd=new FormData();fd.append('front',front);if(back)fd.append('back',back);
    try{
      const r=await fetch('/api/scan-card',{method:'POST',body:fd});
      const d=await r.json();
      if(!r.ok) setErr(d.error||'Scan failed');
      else onResult(d);
    }catch{setErr('Network error. Try again.')}
    setBusy(false);
  }

  const pick=(f:File|null)=>f?URL.createObjectURL(f):'';
  return <div className="cardscan">
    <h3>📇 Visiting Card Scan</h3>
    <div className="row">
      <label className="cardslot">{front?<img src={pick(front)} alt="front"/>:<span>Front side<br/>tap to add photo</span>}<input type="file" accept="image/*" capture="environment" hidden onChange={e=>setFront(e.target.files?.[0]||null)}/></label>
      <label className="cardslot">{back?<img src={pick(back)} alt="back"/>:<span>Back side<br/>(optional)</span>}<input type="file" accept="image/*" capture="environment" hidden onChange={e=>setBack(e.target.files?.[0]||null)}/></label>
    </div>
    {err&&<div className="error">{err}</div>}
    <button type="button" className="btn" onClick={scan} disabled={busy}>{busy?'Reading card…':'🔍 Scan card & auto-fill'}</button>
  </div>
}
