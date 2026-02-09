# AWS Node MySQL CRUD

## Overview
Production-ready Node.js CRUD scaffold using Express, MySQL, Winston logging, and a simple HTML frontend.

## Tech Stack
- Node.js + Express
- MySQL (mysql2)
- Winston logging (console + file)
- Vanilla JS frontend served by `express.static`

## Setup
1. Create the database and table in MySQL.
2. Update `.env` with your database credentials.
3. Install dependencies and start the server.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Environment Variables
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=aws_node_mysql_crud
```

## MySQL Table
```sql
CREATE DATABASE IF NOT EXISTS aws_node_mysql_crud;
USE aws_node_mysql_crud;

CREATE TABLE IF NOT EXISTS users1 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

## Logs
Application logs are written to `src/logs/app.log`.

## AWS Notes
- Ensure `PORT` is set in your environment (Elastic Beanstalk/EC2).
- Use an RDS MySQL instance and update the `.env` values accordingly.
- Configure security groups to allow inbound traffic to your app and database.
