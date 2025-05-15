'use client'

import { useRouter } from 'next/navigation'
import { Button } from 'react-bootstrap'
import { FaSignOutAlt } from 'react-icons/fa'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Wywołanie endpointu logout na backendzie
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include', // jeśli używasz cookies
      })
    } catch (err) {
      console.error('Logout failed:', err)
    }

    // Usunięcie userId z localStorage
    localStorage.removeItem('userId')

    // Przekierowanie na stronę logowania
    router.push('/login')
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
