import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, Row, Col, Button, Modal, Form } from 'react-bootstrap'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export default function TrainerDashboard() {
  const [batches, setBatches] = useState([])
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })

  const load = () => axios.get(`${API_BASE}/batches/mine`).then((res) => setBatches(res.data))

  useEffect(() => { load() }, [])

  const createBatch = async (e) => {
    e.preventDefault()
    await axios.post(`${API_BASE}/batches`, form)
    setShow(false)
    setForm({ name: '', description: '' })
    load()
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3>Your Batches</h3>
        <Button onClick={() => setShow(true)}>Create Batch</Button>
      </div>
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

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Batch</Modal.Title>
        </Modal.Header>
        <Form onSubmit={createBatch}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}
