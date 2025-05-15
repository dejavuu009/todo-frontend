'use client'

import { useRouter } from 'next/navigation'
import { Button } from 'react-bootstrap'
import { FaSignOutAlt } from 'react-icons/fa'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include', // ważne, jeśli używasz cookie
      })

      // 🧹 Usuń userId z localStorage
      localStorage.removeItem('userId')

      // 🔁 Przekieruj na /login
      router.push('/login')
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error)
    }
  }

  return (
    <Button
      variant="outline-light"
      onClick={handleLogout}
      className="d-flex align-items-center"
    >
      <span className="d-none d-md-inline">Logout</span>
      <FaSignOutAlt className="d-md-none" />
    </Button>
  )
}
