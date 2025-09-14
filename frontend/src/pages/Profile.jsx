
import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Profile(){
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({ name:'', email:'', phone:'', dob:'', address:'', avatarUrl:'' })
  const [pwd, setPwd] = useState({ currentPassword:'', newPassword:'' })
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    (async()=>{
      const { data } = await api.get('/api/profile/me')
      const u = data.user
      setForm({ name:u.name||'', email:u.email||'', phone:u.phone||'', dob:u.dob?u.dob.slice(0,10):'', address:u.address||'', avatarUrl:u.avatarUrl||'' })
    })()
  },[])

  const save = async ()=>{
    const payload = { name: form.name, phone: form.phone, dob: form.dob, address: form.address }
    const { data } = await api.put('/api/profile', payload)
    setUser(prev => ({ ...prev, name: data.user.name }))
    localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), name: data.user.name }))
    setMsg('Profile updated')
  }

  const changePwd = async ()=>{
    await api.put('/api/profile/password', pwd)
    setMsg('Password changed'); setPwd({ currentPassword:'', newPassword:'' })
  }

  const onAvatar = async (e)=>{
    const file = e.target.files[0]; if (!file) return
    const formData = new FormData(); formData.append('avatar', file)
    const { data } = await api.post('/api/profile/avatar', formData, { headers:{ 'Content-Type': 'multipart/form-data' }})
    setForm(f => ({ ...f, avatarUrl: data.url }))
  }

  return (
    <div>
      <h2>My Profile</h2>
      {msg && <div className='card' style={{borderColor:'#bbf7d0'}}>✅ {msg}</div>}
      <div className='card'>
        <div className='row'>
          <div style={{width:120}}>
            {form.avatarUrl ? <img src={form.avatarUrl} style={{width:100, height:100, objectFit:'cover', borderRadius:8}}/> : <div style={{width:100, height:100, background:'#e5e7eb', borderRadius:8}}/>}
            <input type='file' onChange={onAvatar} style={{marginTop:8}} />
          </div>
          <div style={{flex:1}}>
            <label>Name</label>
            <input className='input' value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <label>Email (read-only)</label>
            <input className='input' value={form.email} readOnly />
            <label>Phone</label>
            <input className='input' value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
            <label>Date of Birth</label>
            <input className='input' type='date' value={form.dob} onChange={e=>setForm({...form, dob:e.target.value})} />
            <label>Address</label>
            <textarea className='input' rows='3' value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
            <button className='btn' onClick={save}>Save</button>
          </div>
        </div>
      </div>

      <div className='card'>
        <h3>Change Password</h3>
        <div className='row'>
          <input className='input' placeholder='Current password' type='password' value={pwd.currentPassword} onChange={e=>setPwd({...pwd, currentPassword:e.target.value})} />
          <input className='input' placeholder='New password' type='password' value={pwd.newPassword} onChange={e=>setPwd({...pwd, newPassword:e.target.value})} />
          <button className='btn' onClick={changePwd}>Update</button>
        </div>
        <small>Password must be 8+ chars, include a number and a special char.</small>
      </div>
    </div>
  )
}
