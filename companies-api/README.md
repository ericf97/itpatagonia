# Companies API

API REST construida con NestJS para gestionar empresas y transferencias. Implementa arquitectura hexagonal con MongoDB como base de datos.

## 🚀 Cómo correrlo localmente

### Requisitos previos

- Node.js >= 18
- MongoDB (local o Atlas)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Creá un archivo `.env` en la raíz del proyecto:

```env
DB_CONNECTION_STRING=mongodb://localhost:27017
```

> Para MongoDB Atlas usá tu connection string completo:
> `DB_CONNECTION_STRING=mongodb+srv://user:password@cluster.mongodb.net`

### 3. Levantar la API

```bash
npm run start:dev
```

La API queda disponible en `http://localhost:3000`.  
Swagger disponible en `http://localhost:3000/api`.

### 4. Correr los tests

```bash
npm test
```

## 📡 Endpoints

### `POST /companies`
Registra la adhesión de una nueva empresa.

**Body:**
```json
{
  "name": "Patagonia Tech",
  "type": "Pyme",
  "description": "Opcional"
}
```

Tipos válidos: `Pyme` | `Corporativa`

**Respuesta `201`:**
```json
{
  "id": "uuid",
  "name": "Patagonia Tech",
  "type": "Pyme",
  "createdAt": "2026-04-20T00:00:00.000Z"
}
```

---

### `GET /companies/recent`
Devuelve las empresas que se adhirieron en el mes actual (desde el día 1 a las 00:00:00).

**Respuesta `200`:**
```json
[
  {
    "id": "uuid",
    "name": "Patagonia Tech",
    "type": "Pyme",
    "createdAt": "2026-04-10T12:00:00.000Z"
  }
]
```

---

### `GET /companies/transfers/recent`
Devuelve las empresas que realizaron transferencias en el mes actual.

**Respuesta `200`:**
```json
[
  {
    "id": "uuid",
    "name": "Innovatech",
    "type": "Corporativa",
    "createdAt": "2026-03-15T08:00:00.000Z"
  }
]
```

## 🏗️ Arquitectura

```
src/
├── domain/
│   ├── entities/         # Company, Transfer
│   ├── enums/            # CompanyType
│   └── repositories/     # Interfaces (CompanyRepository, TransferRepository)
├── application/
│   └── use-cases/        # Lógica de negocio y reglas de dominio
├── infrastructure/
│   └── persistence/      # Implementaciones MongoDB + Schemas Mongoose
└── interfaces/
    ├── controllers/      # CompanyController
    └── dto/              # CreateCompanyDto, CompanyResponseDto
```

La lógica de negocio (qué fechas consultar, qué reglas aplicar) vive en los **use cases**. Los repositorios son abstracciones puras de persistencia.
