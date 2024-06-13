# EAR Development Challenge

A simple login system built with Node.js, Express, Pug, MongoDB, and Tailwind CSS. This project includes user registration, login, and user dashboard page with session management using `express-session`.

## Features

- User registration and login
- User account page
- Session management
- Styled using Tailwind CSS
- Docker support for easy setup

## Prerequisites

- Node.js >= 18
- Docker (optional for backend, mandatory for the mongodb server)

_Otherwise you'll need to provide a server URI_

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ear-challenge.git
cd ear-challenge
```

2. Install dependencies:

```
yarn install
```

3. Build the Tailwind CSS:

```
yarn build
```

4. Set up environment variables:

Create .env.development and .env.production files based on the provided sample:

```
.env.development
NODE_ENV=development
MONGO_INITDB_ROOT_USERNAME=system_admin
MONGO_INITDB_ROOT_PASSWORD=9MFY3dKBfQc6d
MONGO_DATABASE=dev
```

```
.env.production
NODE_ENV=production
MONGO_INITDB_ROOT_USERNAME=system_admin
MONGO_INITDB_ROOT_PASSWORD=9MFY3dKBfQc6d
MONGO_DATABASE=prod
```

## Running the Application

### Using Node.js

Start the development server:

```
yarn dev
```

Start the production server:

```
yarn start
```

### Using Docker

Build and start the backend container:

```
yarn backend
```

Start the database container:

```
yarn database:start
```

Stop the containers:

```
yarn docker:down
```

## Project Structure

```
ear-challenge/
│
├── backend/
│ └── Dockerfile
├── database/
│ └── docker-compose.yml
├── src/
│ ├── config/
│ │ └── index.ts
│ ├── models/
│ │ └── User.ts
│ ├── scripts/
│ │ └── addUser.ts
│ ├── views/
│ │ ├── account.pug
│ │ ├── home.pug
│ │ ├── layout.pug
│ │ ├── login.pug
│ │ └── register.pug
│ ├── public/
│ │ ├── tailwind.css
│ │ └── tailwind-built.css
│ └── index.ts
├── .env.development
├── .env.production
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Routes

```
/ - Home page with links to login and register
/login - Login page
/register - Registration page
/my-account - User account page (protected route)
/logout - Logout route
```

## Middleware

express-session - For session management
bcrypt - For password hashing
License

_This project is licensed under the MIT License._
