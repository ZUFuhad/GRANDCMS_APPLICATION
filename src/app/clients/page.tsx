import Shell from '@/src/components/Shell'; import {requireUser} from '@/src/lib/auth'; import {db} from '@/src/lib/db'; import ClientForm from './ClientForm';

export default async function Page(){
  await requireUser();
  const clients = await (await db()).client.findMany({orderBy:{createdAt:'desc'}});
  return <Shell title="Clients">
    <ClientForm/>
    <div className="card" style={{marginTop:16}}>
      <h2>All clients ({clients.length})</h2>
      {clients.length===0?<p className="muted">No clients yet. Card scan kore first ta add koro.</p>:
      <table className="table"><thead><tr><th>Name</th><th>Company</th><th>Phone</th><th>Email</th></tr></thead>
      <tbody>{clients.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.company||'—'}</td><td>{c.phone||'—'}</td><td>{c.email||'—'}</td></tr>)}</tbody></table>}
    </div>
  </Shell>
}
