# 📚 Microservices Library System

A distributed library management system built with a microservices architecture. This project demonstrates service isolation, asynchronous communication via a message broker, and containerized deployment using Docker Compose.

---

## 🧱 Architecture Overview

- **Style**: Microservices with Service-Oriented Architecture (SOA)
- **Services**: 3 independently deployed services
- **Database**: Separate MongoDB instances per service
- **Communication**: Event-driven via RabbitMQ (swappable with Kafka/NATS)
- **Deployment**: Docker + Docker Compose

---

## 🧩 Microservices Breakdown

### 👤 User Service
- **Framework**: Express.js
- **Responsibilities**: Manage user data
- **MongoDB**: `USERS` collection
- **API**:
  - `POST /users` – Register user
  - `GET /users/{id}` – Fetch user info
- **Consumes Events**:
  - `LoanCreated` – Updates loan/book history
  - `LoanReturned` – Updates current loans

### 📘 Book Service
- **Framework**: Fastify
- **Responsibilities**: Manage books
- **MongoDB**: `BOOKS` collection
- **API**:
  - `POST /books` – Add book
  - `GET /books/{id}` – Fetch book info
- **Consumes Events**:
  - `LoanCreated` – Marks book unavailable
  - `LoanReturned` – Marks book available

### 🔄 Loan Service
- **Framework**: Koa
- **Responsibilities**: Handle loans
- **MongoDB**: `LOANS` collection
- **API**:
  - `POST /loans` – Create loan
  - `GET /loans/{id}/return` – Return book
- **Publishes Events**:
  - `LoanCreated` (userId, bookId, loanId)
  - `LoanReturned` (userId, bookId, loanId)

---

## 🗃️ Data Models (Simplified)

### USERS
- `id`, `name`, `email`, `currentBooks[]`, `loanHistory[]`, `bookHistory[]`, `status`

### BOOKS
- `id`, `title`, `author`, `isbn`, `available`, `currentLoan`, `currentHolder`, `tags[]`

### LOANS
- `_id`, `userId`, `bookId`, `loanedAt`, `dueDate`, `returnedAt`, `status`

---

## 🛠️ Infrastructure

- **Message Broker**: RabbitMQ (central broker, JSON messages)
- **Deployment**: Docker Compose:
  - 3 microservices
  - 3 MongoDB instances
  - 1 RabbitMQ broker

---

> 🎯 Built to demonstrate scalable backend systems, async communication, and fault-tolerant service orchestration.
