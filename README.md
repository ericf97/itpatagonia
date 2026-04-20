# It Patagonia - Arquitectura de Microservicios

Proyecto que demuestra una arquitectura de microservicios con API REST y funciones serverless para gestión de empresas.

## 🏗️ Arquitectura General

```
itpatagonia/
├── companies-api/     # API REST con NestJS
│   ├── src/
│   ├── test/
│   └── package.json
│
└── lambda/            # Función serverless
    ├── src/
    ├── serverless.yml
    └── package.json
```

## 🎯 Decisiones Arquitectónicas

### 1. Lambda guarda directamente en MongoDB

La Lambda recibe la solicitud de adhesión, valida los datos y los persiste directamente en la colección `applications` de MongoDB Atlas.

```typescript
// Lambda → MongoDB Atlas (colección: applications)
const db = await getDatabase();
await db.collection('applications').insertOne({
  id: generateApplicationId(),
  name, type, description,
  status: 'pending',
  createdAt: new Date(),
});
```

**Por qué conexión directa a DB:**
- ✅ **Menor latencia**: Sin overhead de HTTP adicional
- ✅ **Menos puntos de falla**: Una sola conexión a DB
- ✅ **Simplicidad**: Menos código y dependencias
- ✅ **Performance**: Sin serialización HTTP intermedia
- ⚠️ **Validación duplicada**: Las reglas de validación se mantienen en ambos servicios por separado

### 2. Estructura de Carpetas Separadas

**¿Por qué no un monorepo?**

**Estructura actual (Separada):**
```
companies-api/package.json
lambda/package.json
```

**Posible monorepo:**
```
packages/
├── api/package.json
└── lambda/package.json
shared/
├── validations.ts
└── types.ts
```

**Decisión tomada: Carpetas separadas**
- ✅ **Despliegue independiente**: API y Lambda pueden deployarse por separado
- ✅ **Tecnologías diferentes**: NestJS vs Serverless Framework
- ✅ **Escalabilidad**: Pueden evolucionar independientemente
- ✅ **Simplicidad**: Menos configuración de monorepo
- ❌ **Duplicación de código**: Validaciones repetidas

**Alternativa futura: Monorepo con Nx**
- Compartir validaciones, tipos y utilidades
- Build pipeline unificado
- Mejor DX para desarrollo

### 3. Validaciones Compartidas

**Problema actual:**
```typescript
// companies-api/src/utils/validators.ts
export function validateCompany(data) { ... }

// lambda/src/utils/validators.ts
export function validateCompany(data) { ... } // Duplicado
```

**Solución futura:**
```typescript
// shared/validators.ts
export function validateCompany(data) { ... }

// companies-api/src/validators.ts
export { validateCompany } from '../../../shared/validators';

// lambda/src/validators.ts
export { validateCompany } from '../shared/validators';
```

### 4. Deploy con Serverless Framework

**Ventajas del approach actual:**
- ✅ **Serverless Framework**: Gestión completa de infraestructura
- ✅ **Offline development**: `serverless offline` para testing local
- ✅ **Multi-stage**: dev/prod environments
- ✅ **Auto-scaling**: Lambda escala automáticamente
- ✅ **Pay-per-use**: Solo pagas por ejecución

**Configuración actual:**
```yaml
# serverless.yml
functions:
  createCompany:
    handler: dist/handlers/create-company.handler
    events:
      - http:
          path: companies
          method: post
```

### 5. Swagger en la API

**Decisión: Usar Swagger/OpenAPI**
- ✅ **Documentación automática**: Generada desde código
- ✅ **Interfaz interactiva**: Testing directo desde browser
- ✅ **Cliente SDK**: Generar clientes automáticamente
- ✅ **Contratos API**: Especificación clara de endpoints
- ✅ **Developer experience**: Fácil para otros devs

**Configuración:**
```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('Companies API')
  .setDescription('API for managing companies')
  .setVersion('1.0')
  .build();
SwaggerModule.setup('api', app, config);
```

## 🚀 Inicio Rápido

### API REST
```bash
cd companies-api
npm install
npm run start:dev
# Swagger: http://localhost:3000/api
```

### Lambda Function
```bash
cd lambda
npm install
npm run build
npm run start:local
# Endpoint: http://localhost:3000/dev/companies
```

## 🔄 Flujo de Datos

**Solicitud de adhesión (Lambda):**
```
Cliente → Lambda Function → MongoDB Atlas (applications)
                ↓
         Solicitud guardada con status: pending
```

**Consulta de empresas y transferencias (API REST):**
```
Cliente → API REST (NestJS) → MongoDB Atlas (companies / applications)
                ↓
         Respuesta con datos del mes actual
```

## 🔮 Evolución Futura

1. **Monorepo**: Unificar con Nx para compartir código
2. **Shared Library**: Validaciones, tipos y utilidades comunes
3. **API Gateway**: Routing centralizado
4. **Event Sourcing**: Eventos entre servicios
5. **CQRS**: Separar comandos de queries

## 📝 Notas

- **Base de datos**: MongoDB Atlas compartida
- **Lenguaje**: TypeScript en ambos servicios
- **Testing**: Jest para unit tests
- **CI/CD**: GitHub Actions para deployments