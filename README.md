# Todo Backend

This is the backend service for the Todo application. It is built with **Node.js**, **Express**, and **TypeScript**, and follows a **Domain-Driven Design (DDD)** architecture. It uses **Firebase** as the database, **JWT** for authentication, and **Swagger** for API documentation.

## 📦 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **Firebase Firestore**
- **JSON Web Token (JWT)**
- **Swagger** (API docs)
- **Jest** (unit testing + coverage)
- **Prettier**, **ESLint**, **Husky**, and **Commitlint** for code quality

## 🧠 Project Structure

```bash
todo-backend/
├── src/
│   ├── application/
│   │   └── dtos/
│   │   └── use-cases/
│   │       ├── user/
│   │       │   ├── createUser.ts
│   │       │   └── getUserByEmail.ts
│
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── User.ts
│   │   ├── errors/
│   │   └── repositories/
│   │       ├── IUserRepository.ts
│
│   ├── infrastructure/
│   │   ├── config/
│   │   │   └── firebase.ts
│   │   └── repositories/
│   │       ├── FirebaseUserRepository.ts
│
│   ├── interfaces/
│   │   ├── controllers/
│   │   │   ├── userController.ts
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.ts         
│   │   │   └── validateRequest.ts        
│   │   └── routes/
│   │       └── index.ts            
│   │   └── validators/     
│
│   ├── shared/
│   │   ├── constants/
│   │   ├── helpers/
│   │   ├── types/
│   │   │   └── ApiResponse.ts
│   │   └── utils/
│   │       └── validators.ts
│
│   ├── docs/
│   │   └── generate-token.ts
│
│   └── index.ts                         
│
├── tests/
│   ├── user/
│   └── task/
├── .gitignore
├── .prettierrc
├── .eslintrc.json
├── commitlint.config.js
├── tsconfig.json
├── tsconfig.test.json
├── README.md
├── package.json
└── jest.config.js
```

---

## 📘 API Endpoints

| Method | Endpoint           | Description                    | Middleware                               |
|--------|--------------------|--------------------------------|------------------------------------------|
| POST   | `/users`           | Create a new user              | `createUserValidator`, `validateRequest` |
| GET    | `/users/:email`    | Get user by email              | —                                        |
| POST   | `/tasks`           | Create a new task              | `authMiddleware`, `createTaskValidator`, `validateRequest` |
| PUT    | `/tasks`           | Update an existing task        | `authMiddleware`, `updateTaskValidator`, `validateRequest` |
| DELETE | `/tasks/:id`       | Delete a task by ID            | `authMiddleware`                         |
| GET    | `/tasks/user`      | Get all tasks of the user      | `authMiddleware`                         |


---

## 🧪 Testing

The project uses Jest for unit testing. Coverage reports are generated automatically.

```
npm run test           # Run tests
npm run test:coverage  # Run tests with coverage
```

---

## 🔧 Setup

```
# Install dependencies
npm install

# Start server in dev mode
npm run dev

```

--- 

## 📦 Available Commands

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm run format`| Format code using Prettier               |
| `npm run lint`  | Run ESLint checks                        |
| `npm run commit`| Use Commitizen for conventional commits  |

---

## 🔐 Environments

Use a .env file to define configuration such as Firebase credentials, JWT secrets, etc.

```
PORT=...
JWT_SECRET=...
CORS_ORIGIN=...

FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...

```

---

## 📎 Swagger
Swagger docs available at:

```
GET /docs
This uses the Swagger UI to explore and test the API.
```


---

## 👨‍💻 Author
Created by Roberto Zelaya

---

## 📄 License
This project is licensed under the MIT License.
