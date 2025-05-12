'use client'


import LogoutButton from '../auth/LogoutButton'
import { Container, Navbar, Nav } from 'react-bootstrap'
import Link from 'next/link';
import { FaRegClipboard } from 'react-icons/fa';

export default function DashboardHeader() {
  return (
    <Navbar
      style={{
        backgroundColor: '#92BB9D',
      }}
      data-bs-theme="light"
    >
      <Container>
      <Navbar.Brand className="me-auto" as={Link} href="/dashboard"><FaRegClipboard size={24} /> <p className="d-none d-md-inline">Ania ToDo</p></Navbar.Brand>

        <Nav className="me-auto">
        <Nav.Link as={Link} href="/dashboard">Home</Nav.Link>
          <Nav.Link as={Link} href="/alltodo">All Todos</Nav.Link>
          <Nav.Link as={Link} href="/calendar">Calendar</Nav.Link>
        </Nav>

        <LogoutButton />
      </Container>
    </Navbar>
  )
}
