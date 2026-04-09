# 📖 API Documentation

This document provides a comprehensive overview of the available API endpoints for the Portfolio Builder platform.

## Base URL

`http://localhost:5000/api` (or `http://localhost:5001/api` if using Docker)

## Authentication

Most endpoints require a **Bearer Token**. You can obtain this token by logging in.
Include it in your request headers:
`Authorization: Bearer <your_token>`

---

## 🔐 Auth Endpoints

### Register

- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:

```json
{ "name": "...", "email": "...", "password": "..." }
```

### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:

```json
{ "email": "...", "password": "..." }
```

### Get My Info

- **URL**: `/auth/me`
- **Method**: `GET`
- **Access**: Private

---

## 🎨 Portfolio Endpoints

### Get My Portfolio

- **URL**: `/portfolios/me`
- **Method**: `GET`
- **Access**: Private

### Create Portfolio

- **URL**: `/portfolios`
- **Method**: `POST`
- **Body**:

```json
{ "username": "...", "templateId": "..." }
```

### Update Portfolio

- **URL**: `/portfolios/me`
- **Method**: `PUT`
- **Body**:

```json
{
  "username": "...",
  "theme": { "primaryColor": "...", "secondaryColor": "...", "font": "...", "darkMode": true },
  "seoTitle": "...",
  "seoDescription": "...",
  "seoKeywords": "...",
  "customDomain": "..."
}
```

### Public Portfolio

- **URL**: `/portfolios/:username`
- **Method**: `GET`
- **Access**: Public

### Contact Message

- **URL**: `/portfolios/:username/contact`
- **Method**: `POST`
- **Body**:

```json
{ "name": "...", "email": "...", "message": "..." }
```

---

## 🏗️ Project Endpoints

### Add Project

- **URL**: `/projects`
- **Method**: `POST`
- **Body**:

```json
{ "title": "...", "description": "...", "techStack": ["..."], "githubUrl": "..." }
```

### Update Project

- **URL**: `/projects/:id`
- **Method**: `PUT`

### Delete Project

- **URL**: `/projects/:id`
- **Method**: `DELETE`

---

## 🎓 Education & Experience

Similar CRUD operations are available at `/education` and `/experience` endpoints.

---

## 🛠️ Admin Endpoints

### Get System Stats

- **URL**: `/admin/stats`
- **Method**: `GET`
- **Access**: Admin only

### Manage Users

- **URL**: `/admin/users`
- **Method**: `GET`, `DELETE`
- **Access**: Admin only
