# Institute Portal (MERN)

A teaching-ready MERN stack project for an Institute Portal. Includes:
- Student and Trainer authentication
- Trainer: create batches, add students, upload notes, assignments, tests, record marks, mark attendance
- Student: view enrolled batches, notes, assignments, attendance, test marks

## Tech
- Server: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT auth, Zod
- Client: React (Vite), React Router, React Bootstrap, Zustand, Axios

## Monorepo Layout
```
/institute-portal
  /server
  /client
```

## Setup
1. Install dependencies (root runs workspace installs):
```bash
cd institute-portal
npm install
```

2. Configure environment variables:
- Server: copy `.env.example` to `.env` and adjust
```bash
cp server/.env.example server/.env
# edit server/.env as needed
```
- Client (optional): copy `.env.example` to `.env`
```bash
cp client/.env.example client/.env
# adjust VITE_API_BASE if server runs elsewhere
```

3. Run dev servers concurrently:
```bash
npm run dev
```
- API at `http://localhost:4000`
- Web at `http://localhost:5173`

## Seed and Test Quickly
1. Register a trainer:
```bash
curl -X POST http://localhost:4000/api/auth/register -H 'Content-Type: application/json' \
  -d '{"name":"Trainer One","email":"t1@example.com","password":"password","role":"trainer"}'
```
2. Register a student:
```bash
curl -X POST http://localhost:4000/api/auth/register -H 'Content-Type: application/json' \
  -d '{"name":"Student One","email":"s1@example.com","password":"password","role":"student"}'
```
3. Login as trainer and create batch (use token from trainer login):
```bash
curl -X POST http://localhost:4000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"t1@example.com","password":"password"}'
# copy token
curl -X POST http://localhost:4000/api/batches -H 'Authorization: Bearer <TOKEN>' -H 'Content-Type: application/json' \
  -d '{"name":"MERN Batch A","description":"Weekend batch"}'
```

## Scripts
- `npm run dev`: run client and server
- `npm run client`: run client only
- `npm run server`: run server only
- `npm run build`: build server and client

## Notes
- This is a teaching reference with minimal validation and security hardening. Add RBAC and input validation where needed.
- MongoDB connection defaults to `mongodb://localhost:27017/institute_portal`.
