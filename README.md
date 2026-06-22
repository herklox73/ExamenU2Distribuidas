# Northwind App — Examen U2

## Nombre del estudiante
Carlos Vicente Calapucha Nacata

## Nombre del proyecto
Northwind App — Gestion de productos con autenticacion Google

## Stack tecnologico
- Backend: Node.js + Express
- Frontend: React + Vite
- Base de datos: PostgreSQL (Northwind)
- Autenticacion: Google OAuth 2.0 + JWT
- Logs: Winston

## Base de datos
PostgreSQL — Northwind con tablas adicionales: users, revoked_tokens, system_logs, purchase_orders, purchase_order_details

## Instrucciones de ejecucion

### 1. Base de datos
Crear la base de datos northwind en PostgreSQL y ejecutar:
- northwind_setup.sql (schema base)
- db_extras.sql (tablas adicionales del sistema)

### 2. Backend
cd backend
cp .env.example .env
npm install
npm run dev

### 3. Frontend
cd frontend
npm install
npm run dev

Backend corre en http://localhost:3001
Frontend corre en http://localhost:5173

## Variables de entorno requeridas
Ver archivo .env.example en la carpeta backend