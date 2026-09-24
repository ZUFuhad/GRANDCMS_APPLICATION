import Shell from '@/src/components/Shell'; import {requireUser} from '@/src/lib/auth'; import {db} from '@/src/lib/db'; import SupplierForm from './SupplierForm';

export default async function Page(){
  await requireUser();
  const suppliers = await (await db()).supplier.findMany({orderBy:{createdAt:'desc'}});
  return <Shell title="Suppliers">
    <SupplierForm/>
    <div className="card" style={{marginTop:16}}>
      <h2>All suppliers ({suppliers.length})</h2>
      {suppliers.length===0?<p className="muted">No suppliers yet. Card scan kore add koro.</p>:
      <table className="table"><thead><tr><th>Name</th><th>Company</th><th>Phone</th><th>Email</th></tr></thead>
      <tbody>{suppliers.map(s=><tr key={s.id}><td>{s.name}</td><td>{s.company||'—'}</td><td>{s.phone||'—'}</td><td>{s.email||'—'}</td></tr>)}</tbody></table>}
    </div>
  </Shell>
}
