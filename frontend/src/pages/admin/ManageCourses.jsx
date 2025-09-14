
import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function ManageCourses(){
  const [courses, setCourses] = useState([])
  const [form, setForm] = useState({ title:'', description:'' })

  const load = async ()=>{
    const { data } = await api.get('/api/courses/all')
    setCourses(data.courses)
  }
  useEffect(()=>{ load() },[])

  const create = async ()=>{
    await api.post('/api/courses', form)
    setForm({ title:'', description:'' })
    load()
  }

  const update = async (c)=>{
    await api.put(`/api/courses/${c._id}`, { title:c.title, description:c.description, isActive:c.isActive })
    load()
  }

  const remove = async (id)=>{
    if (!confirm('Delete this course?')) return
    await api.delete(`/api/courses/${id}`)
    load()
  }

  return (
    <div>
      <h2>Manage Courses</h2>
      <div className='card row'>
        <input className='input' placeholder='Title' value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <input className='input' placeholder='Description' value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <button className='btn' onClick={create}>Add</button>
      </div>

      <div className='card'>
        <table className='table'>
          <thead><tr><th>Title</th><th>Description</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {courses.map(c=> (
              <tr key={c._id}>
                <td><input className='input' value={c.title} onChange={e=>setCourses(prev=>prev.map(x=>x._id===c._id?{...x, title:e.target.value}:x))} /></td>
                <td><input className='input' value={c.description||''} onChange={e=>setCourses(prev=>prev.map(x=>x._id===c._id?{...x, description:e.target.value}:x))} /></td>
                <td><input type='checkbox' checked={c.isActive} onChange={e=>setCourses(prev=>prev.map(x=>x._id===c._id?{...x, isActive:e.target.checked}:x))} /></td>
                <td className='row'>
                  <button className='btn secondary' onClick={()=>update(c)}>Save</button>
                  <button className='btn danger' onClick={()=>remove(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
