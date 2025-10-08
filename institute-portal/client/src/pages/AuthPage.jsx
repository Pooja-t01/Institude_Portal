import { useState } from 'react'
import { Container, Row, Col, Form, Button, Card, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { useAuthStore } from '../store/auth.js'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, register } = useAuthStore()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register({ name: form.name, email: form.email, password: form.password, role })
      }
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-3">{mode === 'login' ? 'Login' : 'Register'}</Card.Title>
              {error && <div className="alert alert-danger">{error}</div>}
              <Form onSubmit={onSubmit}>
                {mode === 'register' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </Form.Group>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </Form.Group>
                {mode === 'register' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <div>
                      <ToggleButtonGroup type="radio" name="role" value={role} onChange={setRole}>
                        <ToggleButton id="role-student" value={'student'} variant="outline-primary">Student</ToggleButton>
                        <ToggleButton id="role-trainer" value={'trainer'} variant="outline-secondary">Trainer</ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  </Form.Group>
                )}
                <div className="d-flex justify-content-between align-items-center">
                  <Button type="submit" disabled={loading}>{loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}</Button>
                  <Button variant="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                    {mode === 'login' ? 'Create account' : 'Have an account? Login'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
