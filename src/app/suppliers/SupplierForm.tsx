'use client';
import {useState} from 'react'; import {useRouter} from 'next/navigation'; import CardScan from '@/src/components/CardScan';

const empty={name:'',designation:'',company:'',email:'',phone:'',address:'',taxId:'',notes:''};

export default function SupplierForm(){
  const [f,setF]=useState({...empty}); const [msg,setMsg]=useState(''); const [busy,setBusy]=useState(false);
  const r=useRouter();
  const set=(k:string,v:string)=>setF(p=>({...p,[k]:v}));
  const fill=(d:any)=>{setF(p=>({...p,
    name:d.name||p.name, designation:d.designation||p.designation, company:d.company||p.company,
    email:d.email||p.email, phone:d.phone||p.phone, address:d.address||p.address,
    notes:d.website?('Website: '+d.website+(p.notes?'
'+p.notes:'')):p.notes}));setMsg('✅ Card read hoyeche. Check kore Save koro.')};

  async function save(){
    if(!f.name){setMsg('Name lagbe minimum');return}
    setBusy(true);
    const r2=await fetch('/api/suppliers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)});
    setBusy(false);
    if(r2.ok){setF({...empty});setMsg('✅ Supplier saved');r.refresh()}
    else setMsg('Save failed. Try again.');
  }

  return <div className="card">
    <CardScan onResult={fill}/>
    <h3 style={{marginTop:16}}>Supplier details</h3>
    <div className="form">
      <input placeholder="Name *" value={f.name} onChange={e=>set('name',e.target.value)}/>
      <input placeholder="Designation" value={f.designation} onChange={e=>set('designation',e.target.value)}/>
      <input placeholder="Company" value={f.company} onChange={e=>set('company',e.target.value)}/>
      <div className="row"><input placeholder="Phone" value={f.phone} onChange={e=>set('phone',e.target.value)}/><input placeholder="Email" value={f.email} onChange={e=>set('email',e.target.value)}/></div>
      <input placeholder="Address" value={f.address} onChange={e=>set('address',e.target.value)}/>
      <input placeholder="TIN / Tax ID" value={f.taxId} onChange={e=>set('taxId',e.target.value)}/>
      <textarea placeholder="Notes" value={f.notes} onChange={e=>set('notes',e.target.value)}/>
      {msg&&<div className="muted">{msg}</div>}
      <button className="btn" onClick={save} disabled={busy}>{busy?'Saving…':'Save supplier'}</button>
    </div>
  </div>
}
