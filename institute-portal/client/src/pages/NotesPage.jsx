import { useEffect, useState } from 'react'
import axios from 'axios'
import { Form, Button, Table } from 'react-bootstrap'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [batchId, setBatchId] = useState('')
  const [form, setForm] = useState({ title: '', content: '', date: '' })

  const load = async () => {
    if (batchId) {
      const res = await axios.get(`${API_BASE}/notes`, { params: { batchId } })
      setNotes(res.data)
    }
  }

  useEffect(() => { load() }, [batchId])

  const createNote = async (e) => {
    e.preventDefault()
    await axios.post(`${API_BASE}/notes`, { ...form, batchId })
    setForm({ title: '', content: '', date: '' })
    load()
  }

  return (
    <div>
      <h4>Notes</h4>
      <Form className="mb-3" onSubmit={createNote}>
        <Form.Group className="mb-2">
          <Form.Label>Batch ID</Form.Label>
          <Form.Control value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="Enter Batch ID" />
        </Form.Group>
        <div className="d-flex gap-2">
          <Form.Control placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Form.Control placeholder="Date YYYY-MM-DD" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <Form.Control as="textarea" rows={3} className="mt-2" placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <Button className="mt-2" type="submit">Add Note</Button>
      </Form>

      <Table striped bordered>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((n) => (
            <tr key={n._id}>
              <td>{n.title}</td>
              <td>{n.date}</td>
              <td>{n.content}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
