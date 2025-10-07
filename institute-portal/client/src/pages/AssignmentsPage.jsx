import { useEffect, useState } from 'react'
import axios from 'axios'
import { Form, Button, Table } from 'react-bootstrap'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export default function AssignmentsPage() {
  const [items, setItems] = useState([])
  const [batchId, setBatchId] = useState('')
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' })

  const load = async () => {
    if (batchId) {
      const res = await axios.get(`${API_BASE}/assignments`, { params: { batchId } })
      setItems(res.data)
    }
  }

  useEffect(() => { load() }, [batchId])

  const createItem = async (e) => {
    e.preventDefault()
    await axios.post(`${API_BASE}/assignments`, { ...form, batchId })
    setForm({ title: '', description: '', dueDate: '' })
    load()
  }

  return (
    <div>
      <h4>Assignments</h4>
      <Form className="mb-3" onSubmit={createItem}>
        <Form.Group className="mb-2">
          <Form.Label>Batch ID</Form.Label>
          <Form.Control value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="Enter Batch ID" />
        </Form.Group>
        <div className="d-flex gap-2">
          <Form.Control placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Form.Control placeholder="Due YYYY-MM-DD" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </div>
        <Form.Control as="textarea" rows={3} className="mt-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Button className="mt-2" type="submit">Add Assignment</Button>
      </Form>

      <Table striped bordered>
        <thead>
          <tr>
            <th>Title</th>
            <th>Due</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((n) => (
            <tr key={n._id}>
              <td>{n.title}</td>
              <td>{n.dueDate}</td>
              <td>{n.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
