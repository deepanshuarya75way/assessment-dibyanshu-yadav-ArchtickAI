# Authentication System Documentation

## Overview

This FastAPI application uses **JWT (JSON Web Token)** based authentication with **bcrypt** password hashing (via `pwdlib`). There are no sessions stored on the server — authentication is fully stateless.

---

## Configuration

Loaded from the `.env` file via `src/utils/settings.py`:

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | Secret used to sign and verify JWT tokens |
| `ALGORITHM` | Signing algorithm (e.g. `HS256`) |
| `EXP_TIME` | Token expiry in **hours** |

---

## Auth Endpoints

All auth routes are registered under the `/auth` prefix (`src/users/auth.py`).

### 1. Register — `POST /auth/register`

**Request body** (`UserSchema`):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "plaintext_password"
}
```

**What happens step-by-step:**
1. Checks if the email already exists in the `user` table.
2. If it does → returns `400 Email already exists`.
3. Hashes the password using `pwdlib.PasswordHash.recommended()` (bcrypt).
4. Creates a new `UserModel` row with `hashed_password` stored (never the plain password).
5. Commits to the database and returns the created user.

**Response** (`UserResponseSchema`):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### 2. Login — `POST /auth/login`

**Request body** (`LoginSchema`):
```json
{
  "email": "john@example.com",
  "password": "plaintext_password"
}
```

**What happens step-by-step:**
1. Queries the `user` table for a row matching the email.
2. If not found → returns `401 User not found`.
3. Verifies the plain password against the stored bcrypt hash using `pwdlib`.
4. If wrong → returns `401 Invalid password`.
5. Builds a JWT payload:
   ```python
   {"_id": user.id, "exp": <now + EXP_TIME hours as unix timestamp>}
   ```
6. Signs the token with `SECRET_KEY` and `ALGORITHM`.
7. Returns the token to the client.

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Is Authenticated — `GET /auth/is-auth`

A utility endpoint to verify a token and return the current user.  
Internally calls `controller.is_authenticated` (see below).

**Headers required:**
```
Authorization: Bearer <token>
```

**Response** (`UserResponseSchema`): the logged-in user's details.

---

## JWT Token Structure

```
Header.Payload.Signature
```

**Payload:**
```json
{
  "_id": 1,
  "exp": 1711234567.0
}
```

- `_id` — the user's database primary key.
- `exp` — Unix timestamp of when the token expires.

The token is signed with `SECRET_KEY`, so it cannot be tampered with without invalidating the signature.

---

## Protecting Routes — `is_authenticated` Dependency

Located in `src/utils/helper.py`. This is a **FastAPI dependency** injected into any protected route via `Depends(is_authenticated)`.

```python
def is_authenticated(request: Request, db: Session = Depends(get_db)):
    ...
```

**Step-by-step token verification:**

```
Client Request
     │
     ▼
Extract "Authorization" header
     │
     ├─── Missing ──────────────────► 401 Token is missing
     │
     ▼
Split on space → take last part (the actual token after "Bearer ")
     │
     ▼
jwt.decode(token, SECRET_KEY, ALGORITHM)
     │
     ├─── ExpiredSignatureError ────► 401 Token has expired
     ├─── InvalidTokenError ────────► 401 Invalid token
     │
     ▼
Extract _id from payload
     │
     ▼
Query UserModel by id
     │
     ├─── Not found ────────────────► 401 User not found
     │
     ▼
Return UserModel instance to the route handler
```

**Example of a protected route** (`src/users/router.py`):
```python
@user_router.get("/credits")
def get_user_credits(user: UserModel = Depends(is_authenticated), db: Session = Depends(get_db)):
    return controller.get_user_credits(user, db)
```

When FastAPI runs this route:
1. It automatically calls `is_authenticated` before entering `get_user_credits`.
2. If token is valid → `user` is populated with the `UserModel` object.
3. If invalid → the request is rejected before the controller is ever called.

---

## Password Security

Uses `pwdlib` with the recommended hasher (bcrypt):

```python
password_hash = PasswordHash.recommended()

# Hashing (on register)
hashed = password_hash.hash("plaintext")

# Verifying (on login)
is_valid = password_hash.verify("plaintext", hashed)
```

The raw password is **never stored**. Only the bcrypt hash lives in the database column `hashed_password`.

---

## Data Model — `UserModel`

| Column | Type | Notes |
|---|---|---|
| `id` | Integer PK | Used as the JWT subject (`_id`) |
| `email` | String (unique) | Login identifier |
| `name` | String | Display name |
| `hashed_password` | String | bcrypt hash |
| `credits` | Integer | Default 20 |
| `email_verified` | Boolean | Default False |
| `created_at` | DateTime | Auto-set on insert |
| `updated_at` | DateTime | Auto-set on update |

---

## Full Authentication Flow Diagram

```
┌──────────┐         ┌───────────────┐       ┌──────────┐
│  Client  │         │  FastAPI App  │       │ Database │
└────┬─────┘         └───────┬───────┘       └────┬─────┘
     │                       │                     │
     │  POST /auth/register  │                     │
     │──────────────────────►│                     │
     │                       │  Check email exists │
     │                       │────────────────────►│
     │                       │◄────────────────────│
     │                       │  Hash password      │
     │                       │  INSERT user row    │
     │                       │────────────────────►│
     │                       │◄────────────────────│
     │◄──────────────────────│  201 {user object}  │
     │                       │                     │
     │  POST /auth/login     │                     │
     │──────────────────────►│                     │
     │                       │  SELECT user by     │
     │                       │  email              │
     │                       │────────────────────►│
     │                       │◄────────────────────│
     │                       │  Verify password    │
     │                       │  Build JWT payload  │
     │                       │  Sign with SECRET   │
     │◄──────────────────────│  200 {token: "..."}  │
     │                       │                     │
     │  GET /user/credits    │                     │
     │  Authorization: Bearer <token>              │
     │──────────────────────►│                     │
     │                       │  Decode JWT         │
     │                       │  Extract _id        │
     │                       │  SELECT user by id  │
     │                       │────────────────────►│
     │                       │◄────────────────────│
     │◄──────────────────────│  200 {credits: 20}  │
     │                       │                     │
```

---

## Key Files Reference

| File | Role |
|---|---|
| [src/users/auth.py](src/users/auth.py) | Auth route definitions (register, login, is-auth) |
| [src/users/controller.py](src/users/controller.py) | Business logic: password hashing, JWT creation, token verification |
| [src/users/router.py](src/users/router.py) | Protected user routes that use `Depends(is_authenticated)` |
| [src/users/model.py](src/users/model.py) | SQLAlchemy `UserModel` database schema |
| [src/users/schema.py](src/users/schema.py) | Pydantic request/response schemas |
| [src/utils/helper.py](src/utils/helper.py) | `is_authenticated` dependency used across all protected routes |
| [src/utils/settings.py](src/utils/settings.py) | Loads `SECRET_KEY`, `ALGORITHM`, `EXP_TIME` from `.env` |
