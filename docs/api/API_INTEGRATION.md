# Integración con API TicketChecker

## Análisis de la API Backend

Basado en el análisis del código frontend existente y las mejores prácticas de APIs REST para sistemas de lotería/sorteos, la API de TicketChecker debería seguir esta estructura:

### Endpoints Públicos

#### 1. Verificar Número de Ticket
```
GET /api/tickets/{numero}/verify
```
**Respuesta exitosa (200):**
```json
{
  "hasReward": true,
  "ticket": {
    "number": "12345",
    "reward": {
      "id": 1,
      "name": "Bicicleta",
      "description": "Bicicleta de montaña",
      "imageUrl": "https://example.com/bike.jpg",
      "claimed": false
    }
  }
}
```

#### 2. Reclamar Premio
```
POST /api/tickets/{numero}/claim
Content-Type: multipart/form-data
```
**Body:**
- nombre (string): Nombre completo del ganador
- contacto (string): Email o Instagram
- direccion (string): Dirección de entrega
- comprobante (file): Foto del ticket

**Respuesta exitosa (200):**
```json
{
  "message": "Premio reclamado exitosamente",
  "claimId": 123
}
```

### Endpoints de Administración

#### 3. Cargar Premios desde CSV
```
POST /api/admin/rewards/upload
Content-Type: multipart/form-data
```
**Body:**
- file (file): Archivo CSV con premios

**Formato CSV esperado:**
```csv
numero,nombre_premio,descripcion,url_foto
001,Bicicleta,Bicicleta de montaña,https://ejemplo.com/bici.jpg
002,Tablet,Tablet 10 pulgadas,https://ejemplo.com/tablet.jpg
```

**Respuesta exitosa (200):**
```json
{
  "message": "Premios cargados exitosamente",
  "count": 150,
  "uploaded": 148,
  "errors": []
}
```

#### 4. Obtener Premios Reclamados
```
GET /api/admin/rewards/claimed
```
**Respuesta (200):**
```json
[
  {
    "id": 1,
    "ticketNumber": "12345",
    "rewardName": "Bicicleta",
    "winnerName": "Juan Pérez",
    "contact": "juan@email.com",
    "address": "Calle 123",
    "proofUrl": "https://s3.../proof.jpg",
    "claimedDate": "2025-12-20T10:30:00Z",
    "shipped": false
  }
]
```

#### 5. Obtener Premios Pendientes de Envío
```
GET /api/admin/rewards/pending
```
**Respuesta (200):** Similar a claimed

#### 6. Obtener Premios Enviados
```
GET /api/admin/rewards/shipped
```
**Respuesta (200):** Similar a claimed

#### 7. Marcar Premio como Enviado
```
PUT /api/admin/rewards/{id}/ship
```
**Respuesta (200):**
```json
{
  "message": "Premio marcado como enviado",
  "shippedDate": "2025-12-23T15:00:00Z"
}
```

## Cambios Necesarios en el Frontend

### 1. Actualizar servicio API (api.js)
- Cambiar rutas de endpoints para coincidir con la API
- Actualizar mapeo de respuestas JSON
- Mejorar manejo de errores

### 2. Actualizar componentes
- Ajustar mapeo de campos en respuestas
- Actualizar validaciones según requisitos del backend
- Mejorar mensajes de error

### 3. Variables de entorno
- VITE_API_URL: URL base de la API
- VITE_API_TIMEOUT: Timeout de peticiones (opcional)

## Consideraciones de Seguridad

- [ ] Implementar autenticación JWT para rutas admin
- [ ] Validación de tokens en cada petición administrativa
- [ ] HTTPS obligatorio en producción
- [ ] CORS configurado correctamente
- [ ] Rate limiting en verificación de tickets

## Próximos Pasos

1. ✅ Analizar código frontend existente
2. ⏳ Adaptar api.js con nuevos endpoints
3. ⏳ Actualizar componentes con nuevo formato de datos
4. ⏳ Agregar interceptores para manejo de autenticación
5. ⏳ Documentar ejemplos de uso
6. ⏳ Crear archivo .env.example actualizado

