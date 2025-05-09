#!/bin/bash

echo -e "\n📘 Registering a new user..."
USER_ID=$(curl -s -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Habeeb Ismail", 
  "email": "habeeb@gmail.com"
  }' | jq -r '._id')


echo -e "\n✅ User ID: $USER_ID"


echo -e "\n📚 Adding a new book..."
BOOK_ID=$(curl -s -X POST http://localhost:5001/books \
  -H "Content-Type: application/json" \
  -d '{
  "title": "Python for dummy V8", 
  "author": "sam achebe", 
  "isbn": "081132350884", 
  "tags": ["programming", "software", "python", "volume8"]
  }' | jq -r '._id')


echo -e "\n✅ Book ID: $BOOK_ID"


echo -e "\n🔄 Creating a new loan..."
LOAN_ID=$(curl -s -X POST http://localhost:5002/loans \
  -H "Content-Type: application/json" \
  -d "{
  \"userId\": \"$USER_ID\", 
  \"bookId\": \"$BOOK_ID\",
  \"dueDate\": \"2025-06-15T00:00:00Z\"
  }" | jq -r '._id')


echo -e "\n✅ Loan ID: $LOAN_ID"
echo -e "\n⏳ Waiting for LoanCreated event to propagate..."
sleep 10


echo -e "\n📦 Fetching user after loan update..."
curl -s http://localhost:5000/users/$USER_ID | jq

echo -e "\n📦 Fetching book after loan update..."
curl -s http://localhost:5001/books/$BOOK_ID | jq
