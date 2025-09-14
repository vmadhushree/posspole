
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login(){
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try{
      const user = await login(email, password)
      navigate(user.role==='admin' ? '/admin' : '/')
    }catch(e){
      setError(e.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className='card' style={{maxWidth:420, margin:'40px auto'}}>
      <h2>Login</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={onSubmit}>
        <input className='input' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input className='input' placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
        <button className='btn' type='submit'>Login</button>
      </form>
    </div>
  )
}
