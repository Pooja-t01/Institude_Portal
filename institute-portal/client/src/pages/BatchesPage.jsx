import { useEffect, useState } from 'react'
import axios from 'axios'
import { Table } from 'react-bootstrap'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export default function BatchesPage() {
  const [batches, setBatches] = useState([])

  useEffect(() => {
    axios.get(`${API_BASE}/batches/mine`).then((res) => setBatches(res.data))
  }, [])

  return (
    <div>
      <h4>Your Batches</h4>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((b) => (
            <tr key={b._id}>
              <td>{b.name}</td>
              <td>{b.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
