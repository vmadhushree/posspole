
import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function ManageStudents(){
  const [q, setQ] = useState('')
  const [data, setData] = useState({ items:[], page:1, pages:1, total:0 })

  const load = async (page=1)=>{
    const { data } = await api.get(`/api/admin/users?search=${encodeURIComponent(q)}&page=${page}&limit=10`)
    setData(data)
  }

  useEffect(()=>{ load(1) },[])

  const act = async (id, action)=>{
    await api.patch(`/api/admin/users/${id}/${action}`)
    load(data.page)
  }

  const del = async (id)=>{
    if (!confirm('Delete this user?')) return
    await api.delete(`/api/admin/users/${id}`)
    load(data.page)
  }

  return (
    <div>
      <h2>Manage Students</h2>
      <div className='card row'>
        <input className='input' placeholder='Search name or email' value={q} onChange={e=>setQ(e.target.value)} />
        <button className='btn' onClick={()=>load(1)}>Search</button>
      </div>
      <div className='card'>
        <table className='table'>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Blocked</th><th>Actions</th></tr></thead>
          <tbody>
            {data.items.map(u=> (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isBlocked? 'Yes':'No'}</td>
                <td className='row'>
                  {u.isBlocked ? (
                    <button className='btn secondary' onClick={()=>act(u._id, 'unblock')}>Unblock</button>
                  ) : (
                    <button className='btn secondary' onClick={()=>act(u._id, 'block')}>Block</button>
                  )}
                  <button className='btn danger' onClick={()=>del(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='row'>
          <button className='btn secondary' disabled={data.page<=1} onClick={()=>load(data.page-1)}>Prev</button>
          <div>Page {data.page} / {data.pages}</div>
          <button className='btn secondary' disabled={data.page>=data.pages} onClick={()=>load(data.page+1)}>Next</button>
        </div>
      </div>
    </div>
  )
}
