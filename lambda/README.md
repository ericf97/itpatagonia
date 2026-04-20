# Lambda Function: Create Company Application

Función AWS Lambda que recibe una solicitud de adhesión de empresa, valida los datos y los almacena en la colección `applications` de MongoDB con estado `pending`.

## 📖 Funcionamiento

### Flujo de Procesamiento

1. **Recepción del evento**: La función recibe una solicitud HTTP POST con los datos de la empresa
2. **Parseo**: Se extrae y parsea el body JSON de la solicitud
3. **Validación**: Se validan los campos requeridos (name, type) y opcionales (description)
4. **Verificación de duplicados**: Se busca si ya existe una solicitud pendiente para la misma empresa
5. **Generación de ID**: Se crea un ID único para la solicitud (formato: APP_timestamp_random)
6. **Almacenamiento**: Se inserta el documento en la colección `applications` de MongoDB con estado `pending`
7. **Respuesta**: Se retorna la solicitud creada o un error correspondiente

### Validaciones Realizadas

- **name**: Requerido, debe tener entre 3 y 255 caracteres
- **type**: Requerido, debe ser uno de: `Pyme`, `Corporativa`
- **description**: Opcional, máximo 1000 caracteres
- **Duplicados**: Verifica que no exista otra solicitud pendiente con el mismo nombre de empresa

## 📡 Ejemplos de Request y Response

### Ejemplo 1: Request Mínimo (Válido)

**Input:**
```json
{
  "name": "Patagonia Tech",
  "type": "Pyme"
}
```

**Output (201 Created):**
```json
{
  "success": true,
  "message": "Solicitud de adhesión recibida exitosamente",
  "data": {
    "applicationId": "APP_1713607200000_a1b2c3d4",
    "name": "Patagonia Tech",
    "type": "Pyme",
    "status": "pending",
    "createdAt": "2024-04-20T14:30:00.000Z"
  }
}
```

### Ejemplo 2: Request Completo

**Input:**
```json
{
  "name": "Innovatech Solutions",
  "type": "Pyme",
  "description": "Soluciones tecnológicas para empresas del sector turístico"
}
```

**Output (201 Created):**
```json
{
  "success": true,
  "message": "Solicitud de adhesión recibida exitosamente",
  "data": {
    "applicationId": "APP_1713607300000_b2c3d4e5",
    "name": "Innovatech Solutions",
    "type": "Pyme",
    "description": "Soluciones tecnológicas para empresas del sector turístico",
    "status": "pending",
    "createdAt": "2024-04-20T14:31:40.000Z"
  }
}
```

### Ejemplo 3: Error de Validación

**Input:**
```json
{
  "name": "XY",
  "type": "INVALID"
}
```

**Output (400 Bad Request):**
```json
{
  "success": false,
  "message": "Datos inválidos",
  "errors": [
    "El nombre debe tener al menos 3 caracteres",
    "El tipo de empresa debe ser: Pyme o Corporativa"
  ]
}
```

### Ejemplo 4: Solicitud Duplicada

**Input:**
```json
{
  "name": "Patagonia Tech",
  "type": "Pyme"
}
```

**Output (409 Conflict):**
```json
{
  "success": false,
  "message": "Ya existe una solicitud de adhesión pendiente para esta empresa",
  "applicationId": "APP_1713607200000_a1b2c3d4"
}
```

### Ejemplo 5: Error del Servidor

**Output (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Error interno del servidor",
  "error": "Error details..."
}
```

## 🗄️ Documento en MongoDB

Colección: `applications` — Base de datos: `itpatagonia`

```json
{
  "id": "APP_1713607200000_a1b2c3d4",
  "name": "Patagonia Tech",
  "type": "Pyme",
  "description": "...",
  "status": "pending",
  "createdAt": "2024-04-20T14:30:00.000Z"
}
```

## 🧪 Testing Local

### Compilar
```bash
npm run build
```

### Ejecutar servidor local
```bash
npm run start:local
```

### Probar con cURL
```bash
curl -X POST http://localhost:3000/dev/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Patagonia Tech",
    "type": "Pyme"
  }'
```

## 📊 Monitoreo

Accede a CloudWatch para monitorear:

- **Invocaciones**: Número total de llamadas
- **Errores**: Tasa de error
- **Duración**: Tiempo de ejecución
- **Logs**: Detalle de cada invocación

## 💡 Flujo de Integración

```
Cliente Web
    ↓ (POST solicitud)
API Gateway
    ↓ (evento Lambda)
Lambda Function
    ├─ Valida datos
    ├─ Conecta MongoDB
    └─ Almacena solicitud (status: pending)
MongoDB — colección: applications
    ↓ (consulta)
API Pública
    └─ Solicitudes disponibles para revisión
```

## 🔮 Implementación Futura: Aprobación de Solicitudes

Una vez que las solicitudes se almacenan con `status: pending`, el flujo natural siguiente es que un cliente administrador las revise y, al aprobarlas, se genere automáticamente la empresa en la colección `companies`.

### Flujo completo

```
Empresa envía solicitud
    ↓ (POST /dev/companies — esta Lambda)
applications → status: pending

Panel de administración
    ↓ (GET /applications?status=pending)
Lista todas las solicitudes pendientes

Admin acepta una solicitud
    ↓ (PATCH /applications/:id/approve)
Nueva Lambda o endpoint de la API
    ├─ Actualiza applications → status: 'approved'
    └─ Inserta automáticamente en companies

MongoDB — colección: companies
    ↓
companies-api (GET /companies/recent)
    └─ Empresa disponible en los listados del mes
```

### Qué insertaría en `companies`

Al aprobar una solicitud, el documento creado en `companies` tomaría los datos de la solicitud original:

```json
{
  "id": "COMP_1713607200000_a1b2c3d4",
  "name": "Patagonia Tech",
  "type": "Pyme",
  "description": "...",
  "createdAt": "<fecha de aprobación>"
}
```

> El `id` de la empresa se generaría nuevo en el momento de la aprobación, no se reutiliza el `applicationId`.

### Actualización del documento en `applications`

```json
{
  "id": "APP_1713607200000_a1b2c3d4",
  "name": "Patagonia Tech",
  "type": "Pyme",
  "status": "approved",
  "approvedAt": "<fecha de aprobación>",
  "companyId": "COMP_1713607200000_a1b2c3d4"
}
```

### Consideraciones

- La operación de aprobación debe ser **atómica**: si falla el insert en `companies`, no se actualiza el status en `applications`
- Una solicitud rechazada quedaría con `status: 'rejected'` sin generar empresa
- La `companies-api` ya expone `GET /companies/recent` que devuelve empresas del mes actual, por lo que la empresa aparecería automáticamente tras la aprobación

## 🐛 Troubleshooting

### Error: "Connection timeout"

- Verificar `MONGODB_URI` en `.env`
- Verificar IP whitelist en MongoDB Atlas
- Verificar que Lambda tiene acceso a internet (VPC)

### Error: "El nombre debe tener al menos 3 caracteres"

- Asegurar que `name` tiene al menos 3 caracteres
- Revisar que no haya espacios en blanco extra

### Error 409: "Ya existe una solicitud pendiente"

- Ya hay una solicitud con ese nombre en estado `pending`
- Usar el `applicationId` que devuelve el error para hacer seguimiento

### CloudWatch vacío

- Esperar a que se creen los logs (hasta 1 minuto)
- Verificar que el stage sea el correcto (dev, prod, etc.)