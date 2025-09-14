
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup(){
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try{
      await signup(name, email, password)
      navigate('/')
    }catch(e){
      setError(e.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className='card' style={{maxWidth:480, margin:'40px auto'}}>
      <h2>Signup</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={onSubmit}>
        <input className='input' placeholder='Name' value={name} onChange={e=>setName(e.target.value)} />
        <input className='input' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input className='input' placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
        <small>Password must be 8+ chars, include a number and a special char.</small>
        <br/>
        <button className='btn' type='submit'>Create Account</button>
      </form>
    </div>
  )
}
