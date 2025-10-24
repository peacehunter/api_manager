# StockPilot API Documentation

This document provides an overview of the backend API for the StockPilot application. The API is built using Next.js API Routes and allows for interaction with inventory items and sales data.

## Base URL

All API endpoints are relative to your application's base URL.

- **Development**: `http://localhost:9002`
- **Production**: Your production domain

## Authentication

The API is secured using JSON Web Tokens (JWT). To interact with protected endpoints (all CRUD operations for items and sales), you must first authenticate and include the received token in your requests.

### 1. Authenticate to get a JWT

Send a `POST` request with a registered user's credentials to the `/api/auth/login` endpoint.

```bash
curl -X POST http://localhost:9002/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
           "email": "test@example.com",
           "password": "password123"
         }'
```

If successful, the API will return a JWT.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQi..."
}
```

### 2. Make Authenticated Requests

For all protected endpoints, you must include the JWT in the `Authorization` header.

```bash
curl -X GET http://localhost:9002/api/items \
     -H "Authorization: Bearer <your_jwt_token>"
```

---

## Auth API

The Auth API manages user registration and login.

### 1. Register a New User

- **Endpoint**: `POST /api/auth/register`
- **Description**: Creates a new user account.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your-secure-password"
  }
  ```
- **Success Response (201 Created)**: Returns the new user object without the password.
  ```json
  {
    "id": 1,
    "email": "user@example.com"
  }
  ```
- **Error Response (409 Conflict)**: If the user already exists.
  ```json
  { "message": "User already exists." }
  ```

### 2. Log In a User

- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticates a user and returns a JWT.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your-secure-password"
  }
  ```
- **Success Response (200 OK)**: Returns the JWT.
  ```json
  {
    "token": "your.jwt.token"
  }
  ```
- **Error Response (401 Unauthorized)**: If credentials are invalid.
  ```json
  { "message": "Invalid credentials." }
  ```

---

## Items API

The Items API is used to manage the inventory items. **Authentication is required for all endpoints.**

### 1. Get All Items

- **Endpoint**: `GET /api/items`
- **Description**: Retrieves a list of all inventory items, sorted in descending order by their creation date.
- **Request Body**: None.
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "item-1721248437844",
      "name": "Artisan Coffee Beans",
      "description": "1kg bag of single-origin, medium-roast artisan coffee beans.",
      "purchasePrice": 15,
      "sellingPrice": 25,
      "quantity": 50,
      "lowStockThreshold": 10,
      "imageUrl": "https://images.unsplash.com/photo-1613574203646-ffdae46ce3e9?...",
      "imageHint": "product box"
    }
  ]
  ```
- **Error Response (401 Unauthorized)**: If the auth token is missing or invalid.
- **Error Response (500 Internal Server Error)**:
  ```json
  { "message": "Failed to retrieve items." }
  ```

### 2. Add a New Item

- **Endpoint**: `POST /api/items`
- **Description**: Adds a new item to the inventory.
- **Request Body**:
  ```json
  {
    "name": "New Awesome Product",
    "description": "A description of this new awesome product.",
    "purchasePrice": 10.50,
    "sellingPrice": 20.00,
    "quantity": 100,
    "lowStockThreshold": 15
  }
  ```
- **Success Response (201 Created)**: Returns the newly created item object.
- **Error Response (400 Bad Request)**: If validation fails.
- **Error Response (401 Unauthorized)**: If the auth token is missing or invalid.

### 3. Delete an Item

- **Endpoint**: `DELETE /api/items/[id]`
- **Description**: Deletes a specific item from the inventory.
- **URL Parameter**:
  - `id` (string): The ID of the item to delete.
- **Success Response (200 OK)**:
  ```json
  { "message": "Item deleted successfully." }
  ```
- **Error Response (401 Unauthorized)**: If the auth token is missing or invalid.
- **Error Response (500 Internal Server Error)**:
  ```json
  { "message": "Failed to delete item." }
  ```

---

## Sales API

The Sales API is used for managing sales records. **Authentication is required for all endpoints.**

### 1. Get All Sales

- **Endpoint**: `GET /api/sales`
- **Description**: Retrieves a list of all sales records, sorted in descending order by date.
- **Request Body**: None.
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "sale-1721248459424",
      "itemId": "item-1721248437844",
      "itemName": "Artisan Coffee Beans",
      "quantity": 2,
      "pricePerItem": 25,
      "totalPrice": 50,
      "date": "2024-07-17T20:34:19.424Z"
    }
  ]
  ```
- **Error Response (401 Unauthorized)**: If the auth token is missing or invalid.
- **Error Response (500 Internal Server Error)**:
  ```json
  { "message": "Failed to retrieve sales." }
  ```

### 2. Record a New Sale

- **Endpoint**: `POST /api/sales`
- **Description**: Records a new sale, which also decrements the stock quantity of the corresponding item.
- **Request Body**:
  ```json
  {
    "itemId": "item-1721248437844",
    "quantity": 2
  }
  ```
- **Success Response (201 Created)**: Returns the newly created sale object.
- **Error Response (400 Bad Request)**: If validation fails or there is not enough stock.
- **Error Response (401 Unauthorized)**: If the auth token is missing or invalid.

---

## AI Trends Analysis

The AI-powered trend analysis is not exposed via a traditional REST API endpoint. Instead, it is implemented as a **Next.js Server Action**. This action is called directly from the frontend and does not require a separate authentication token as it runs on the server within the user's session context.

- **File**: `src/lib/actions.ts`
- **Function**: `generateTrendsAnalysisAction()`
