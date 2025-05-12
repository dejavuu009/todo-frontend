'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async () => {
    // Walidacja hasła
    const hasUppercase = /[A-Z]/.test(password)
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

    if (!acceptTerms) {
      setError('Musisz zaakceptować warunki.')
      return
    }

    if (password.length < 6 || !hasUppercase || !hasSpecialChar) {
      setError('Hasło musi mieć min. 6 znaków, 1 dużą literę i znak specjalny')
      return
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.push('/') // albo /dashboard jak chcesz
    } else {
      const { error } = await res.json()
      setError(error || 'Coś poszło nie tak')
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '3rem auto', padding: '1rem' }}>
      <h1>📝 Zarejestruj się</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />

      <label style={{ display: 'block', marginBottom: '1rem' }}>
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={e => setAcceptTerms(e.target.checked)}
          style={{ marginRight: '0.5rem' }}
        />
        Akceptuję warunki korzystania
      </label>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={handleRegister}
        style={{ padding: '0.5rem 1rem', background: '#198754', color: 'white', border: 'none', borderRadius: '6px' }}
      >
        Zarejestruj się
      </button>

      <p style={{ marginTop: '1rem' }}>
        Masz już konto? <a href="/">Zaloguj się</a>
      </p>
    </main>
  )
}
