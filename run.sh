#!/bin/bash

# Run both frontend and backend development servers

echo "Starting ReelsPro development environment..."
echo "=========================================="

# Start backend
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "=========================================="
echo "Backend running on http://localhost:3000"
echo "Frontend running on http://localhost:5173"
echo "=========================================="
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
