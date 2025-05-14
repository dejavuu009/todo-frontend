'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form } from 'react-bootstrap'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token); 
      window.location.href = '/dashboard'
    } else {
      const { error } = await res.json()
      setError(error || 'Nieprawidłowe dane logowania')
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("/login-bg.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <main
        className="shadow"
        style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '2rem',
          borderRadius: '12px',
          backdropFilter: 'blur(4px)',
        }}
      >
        <h1 className="mb-4 text-center">Sign in</h1>

        <Form.Floating className="mb-3">
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email address</label>
        </Form.Floating>

        <Form.Floating className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </Form.Floating>

        {error && <p className="text-danger">{error}</p>}

        <button onClick={handleLogin} className="btn btn-primary w-100">
          Login
        </button>
      </main>
    </div>
  )
}
