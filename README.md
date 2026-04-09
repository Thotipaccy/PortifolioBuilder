# 🚀 Portfolio Builder: The Ultimate Developer Showcase Platform

[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

**Portfolio Builder** is a premium, full-stack platform designed for developers to create stunning, professional portfolio websites in minutes. It combines the power of a custom CMS with a high-performance public-facing portfolio, all hosted on a modern tech stack.

---

## ✨ Key Features

### 🎨 Premium Visual Experience
- **Dynamic Theme Engine**: Seamlessly switch between polished Light and Dark modes.
- **Advanced Skills Grid**: A state-of-the-art skills section featuring automated **DevIcon** mapping and premium card-based layouts.
- **Responsive by Design**: Every element is optimized for mobile, tablet, and desktop viewing.

### 🛠️ Developer-First Control
- **Dynamic Portfolio Routing**: Access portfolios instantly via clean, public URLs (e.g., `/:username`).
- **Interactive Dashboard**: Manage projects, education, and work experience through an intuitive admin interface.
- **Secure Authentication**: Robust user management using JWT (JSON Web Tokens) for data protection.

### 🏗️ Robust Architecture
- **Full-Stack Power**: Built on the solid foundation of React (Vite) and Node.js (Express).
- **Persistent Data**: Powered by **PostgreSQL** with **Prisma ORM** for reliable and fast data operations.
- **Docker-Ready**: One-command deployment using Docker Compose for both development and production environments.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Bootstrap 5, Lucide Icons, DevIcons |
| **Backend** | Node.js, Express, JSON Web Tokens (JWT), Bcrypt |
| **Database** | PostgreSQL, Prisma ORM |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 🚀 Getting Started

### Prerequisites
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/) installed OR
- [Node.js](https://nodejs.org/) and a [PostgreSQL](https://www.postgresql.org/) instance.

### Option A: The Docker Way (Recommended)
Launch the entire ecosystem with a single command:
```bash
docker-compose up --build -d
```
*   **Web Portal:** `http://localhost`
*   **API Documentation:** `http://localhost:5001/api`

### Option B: Local Development

#### 1. Configure Environment
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/portfolio_db?schema=public"
JWT_SECRET="your-secure-dev-key"
```

#### 2. Initialize Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

#### 3. Launch Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Roadmap & Upcoming Features
- [ ] Drag-and-drop section reordering.
- [ ] Multiple premium CSS templates.
- [ ] One-click export to PDF (Resume generation).
- [ ] Integration with GitHub API for automatic project importing.

---

## 📄 License
This project is licensed under the MIT License.

*Built with ❤️ for the developer community.*
