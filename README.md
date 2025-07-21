## Installation and startup

1. Clone the repository

```sh
  git clone https://github.com/PskProduction/mrg-data.git
```

2. Fill in .env in the mrg_data folder


3. Assemble and launch the containers

```sh
  docker compose up --build
```

or in the background:

```sh
  docker compose up --build -d
```

4. Check the work
    - 🔗 Frontend (Vue3 dev-server):
      http://localhost:5173
    - 🔗 Backend (NestJS):
      http://localhost:3000


5. Local development (without Docker)

- Backend

```sh
  cd server
  npm install
  npm run start:dev
```

- Frontend

```sh
   cd mrg_data
   npm install
   npm run dev
```