import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/auth.js'
import { Card, Row, Col } from 'react-bootstrap'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const [batches, setBatches] = useState([])

  useEffect(() => {
    axios.get(`${API_BASE}/batches/mine`).then((res) => setBatches(res.data))
  }, [])

  return (
    <div>
      <h3>Welcome, {user?.name}</h3>
      <Row className="mt-3">
        {batches.map((b) => (
          <Col key={b._id} md={6} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{b.name}</Card.Title>
                <Card.Text>{b.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
