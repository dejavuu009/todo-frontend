'use client'

import { useRouter } from 'next/navigation'
import { Button } from 'react-bootstrap'
import { FaSignOutAlt } from 'react-icons/fa'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
      method: 'POST',
    })

    router.push('/')
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
