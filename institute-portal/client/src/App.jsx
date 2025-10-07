import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { Container, Navbar, Nav } from 'react-bootstrap'
import AuthPage from './pages/AuthPage.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import TrainerDashboard from './pages/TrainerDashboard.jsx'
import BatchesPage from './pages/BatchesPage.jsx'
import NotesPage from './pages/NotesPage.jsx'
import AssignmentsPage from './pages/AssignmentsPage.jsx'
import TestsPage from './pages/TestsPage.jsx'
import { useAuthStore } from './store/auth.js'

function App() {
  const { user, logout } = useAuthStore()
  const isTrainer = user?.role === 'trainer'

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="sm" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">Institute Portal</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              {user && (
                <>
                  <Nav.Link as={Link} to="/batches">Batches</Nav.Link>
                  <Nav.Link as={Link} to="/notes">Notes</Nav.Link>
                  <Nav.Link as={Link} to="/assignments">Assignments</Nav.Link>
                  <Nav.Link as={Link} to="/tests">Tests</Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              {!user ? (
                <Nav.Link as={Link} to="/auth">Login / Register</Nav.Link>
              ) : (
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mb-5">
        <Routes>
          <Route path="/" element={!user ? <Navigate to="/auth" /> : isTrainer ? <TrainerDashboard /> : <StudentDashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/batches" element={<BatchesPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/tests" element={<TestsPage />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
