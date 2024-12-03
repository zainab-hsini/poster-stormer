# Backend Stage
FROM python:3.9 AS backend

# Set working directory for backend
WORKDIR /backend

# Copy backend-related files
COPY backend ./backend
COPY requirements.txt .

# Install backend dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose backend port
EXPOSE 8000

# Command to run backend server
CMD ["uvicorn", "backend.embeddingsFetch:app", "--host", "0.0.0.0", "--port", "8000"]

# Frontend Stage
FROM node:18 AS frontend

# Set working directory for frontend
WORKDIR /frontend

# Copy frontend-related files
COPY package*.json ./
COPY public ./public
COPY src ./src

# Install frontend dependencies
RUN npm install

# Expose frontend port
EXPOSE 3000

# Command to run frontend server
CMD ["npm", "start"]

# docker-compose up --build to run
