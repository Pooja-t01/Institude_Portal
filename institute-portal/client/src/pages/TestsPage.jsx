import { useEffect, useState } from 'react'
import axios from 'axios'
import { Form, Button, Table } from 'react-bootstrap'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export default function TestsPage() {
  const [tests, setTests] = useState([])
  const [batchId, setBatchId] = useState('')
  const [form, setForm] = useState({ title: '', date: '' })
  const [marks, setMarks] = useState('')

  const load = async () => {
    if (batchId) {
      // load tests? For simplicity, not implementing tests list by batch filter API here
    }
  }

  useEffect(() => { load() }, [batchId])

  const createTest = async (e) => {
    e.preventDefault()
    const res = await axios.post(`${API_BASE}/tests`, { ...form, batchId })
    setTests([res.data, ...tests])
    setForm({ title: '', date: '' })
  }

  const saveMarks = async (testId) => {
    try {
      const parsed = marks.split('\n').map((line) => {
        const [studentId, score] = line.split(',')
        return { studentId: studentId.trim(), marks: Number(score) }
      })
      await axios.post(`${API_BASE}/tests/${testId}/marks`, { marks: parsed })
      alert('Marks saved')
    } catch (e) {
      alert('Invalid marks format. Use: studentId,score per line')
    }
  }

  return (
    <div>
      <h4>Tests</h4>
      <Form className="mb-3" onSubmit={createTest}>
        <Form.Group className="mb-2">
          <Form.Label>Batch ID</Form.Label>
          <Form.Control value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="Enter Batch ID" />
        </Form.Group>
        <div className="d-flex gap-2">
          <Form.Control placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Form.Control placeholder="Date YYYY-MM-DD" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <Button className="mt-2" type="submit">Create Test</Button>
      </Form>

      <Table bordered>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t) => (
            <tr key={t._id}>
              <td>{t.title}</td>
              <td>{t.date}</td>
              <td>
                <Form className="d-flex gap-2" onSubmit={(e) => { e.preventDefault(); saveMarks(t._id) }}>
                  <Form.Control as="textarea" rows={2} placeholder="studentId,score per line" value={marks} onChange={(e) => setMarks(e.target.value)} />
                  <Button type="submit">Save Marks</Button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
