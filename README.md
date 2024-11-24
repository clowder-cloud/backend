<h1 align="center">☁ Clowder - Backend</h1>
<p align="center">
<img src="https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB">
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff">
<img src="https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white">
<img src="https://img.shields.io/badge/Jira-0052CC?logo=jira&logoColor=fff">
<img src="https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white">
</p>

---

## Setting up for local development

> [!IMPORTANT]  
> This README assumes you have Docker installed. If you do not, please read [this](https://docs.docker.com/engine/install/) manual, based on your operating system. It will cover setting up and testing your very own Docker instance (lucky you!)

### Requirements
Node: `7.0.1`
<br/>
Docker: `27.3.1`

### Steps

#### Cloning and initial setup

1. Clone the repository with
```bash
git clone https://github.com/clowder-cloud/backend.git
```
2. Enter the cloned repository locally, typically with
```bash
cd backend
```
3. Install all dependencies with
```bash
npm i
```

#### Setting up the database

1. Ensure your Docker instance is started by running
```bash
docker info
```
2. Compose the Docker container with
```bash
npm run setup-db
```
3. Copy the containers IP, which is retrieved by running
```bash
npm run get-docker-ip
```

#### Creating the environment

1. Create a new `.env` file at the root of the project
2. Refer to the `example.env` for what KEY:VALUE pairs you need
    1. For `DATABASE_URL`, the `DATABASE`, `USERNAME` and `PASSWORD` can be found in `docker-compose.local.yaml`. The `HOST` will be the result of `npm run get-docker-ip`

> [!WARNING]  
> If you are using Docker Desktop (primarily for Windows and MacOS), you should change `HOST` to `localhost` and `PORT` to `54320`

#### Migration and Seeding

1. Run all of the migrations by executing
```
npx prisma migrate dev
```
2. Seed the database with 
```
npx prisma db seed
```
3. You can check the database is migrated and seeded by running 
```
npx prisma studio
```

#### Running the server
1. You can start the development server with
```
npm run dev
```

---

## Teardown of the container
In order to kill and delete the Docker container, you can run
```
npm run docker-delete
```

---
<p align="center">Made with <img height="14" src="https://emoji.lgbt/assets/svg/gay-heart.svg"/> by the Clowder team</p>

