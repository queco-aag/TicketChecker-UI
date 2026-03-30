# Instrucciones para Backend - Actualización Premios por Año

**Fecha:** 2026-03-27  
**Prioridad:** 🔴 Alta  
**Tipo:** Breaking Change  

---

## 📋 Resumen Ejecutivo

El frontend ha sido actualizado para soportar premios asociados a años de sorteo. **El backend debe implementar los cambios correspondientes** para que la funcionalidad sea operativa.

---

## 🗄️ Cambios en Base de Datos

### 1. Agregar columna `anio` a tabla `premio`

```sql
-- Agregar columna (permitir NULL temporalmente para migración)
ALTER TABLE premio 
ADD COLUMN anio INT NULL;

-- Migrar datos existentes (ejemplo: asignar año actual)
UPDATE premio 
SET anio = 2026 
WHERE anio IS NULL;

-- Ahora hacer NOT NULL
ALTER TABLE premio 
ALTER COLUMN anio SET NOT NULL;

-- Índice para mejorar consultas
CREATE INDEX idx_premio_anio ON premio(anio);

-- Foreign key (RECOMENDADO)
ALTER TABLE premio
ADD CONSTRAINT fk_premio_clave_anio 
FOREIGN KEY (anio) REFERENCES clave_sorteo(anio)
ON DELETE RESTRICT;
```

---

## 🏗️ Cambios en Código Backend

### 1. Entidad `Premio`

```java
@Entity
@Table(name = "premio")
public class Premio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    private String descripcion;
    
    @Column(name = "url_foto")
    private String urlFoto;
    
    @Column(nullable = false)  // ⭐ NUEVO CAMPO
    private Integer anio;
    
    @Column(nullable = false)
    private Boolean enviado = false;
    
    // ... getters y setters
}
```

### 2. DTO `CrearPremioRequest`

```java
public class CrearPremioRequest {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    private String descripcion;
    
    private String urlFoto;
    
    @NotNull(message = "El año es obligatorio")  // ⭐ NUEVO CAMPO
    @Min(value = 2000, message = "Año inválido")
    @Max(value = 2100, message = "Año inválido")
    private Integer anio;
    
    // ... getters y setters
}
```

### 3. DTO `PremioResponse`

```java
public class PremioResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private String urlFoto;
    private Integer anio;  // ⭐ NUEVO CAMPO
    private Boolean enviado;
    
    // ... constructor, getters y setters
}
```

---

## 📡 Endpoints a Actualizar

### 1. `POST /api/v1/premios`

**Request esperado:**
```json
{
  "nombre": "PlayStation 5",
  "descripcion": "Consola de videojuegos",
  "urlFoto": "https://example.com/ps5.jpg",
  "anio": 2026
}
```

**Validaciones a agregar:**
```java
@PostMapping
public ResponseEntity<?> crear(@Valid @RequestBody CrearPremioRequest request) {
    // Validar que existe clave para el año
    if (!claveService.existeClaveParaAnio(request.getAnio())) {
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "mensaje", "No existe clave registrada para el año " + request.getAnio()
        ));
    }
    
    Premio premio = new Premio();
    premio.setNombre(request.getNombre());
    premio.setDescripcion(request.getDescripcion());
    premio.setUrlFoto(request.getUrlFoto());
    premio.setAnio(request.getAnio());  // ⭐ NUEVO
    
    premio = premioRepository.save(premio);
    
    return ResponseEntity.status(201).body(mapearAPremioResponse(premio));
}
```

### 2. `PUT /api/v1/premios/{id}`

**Regla importante:** El año **NO debe cambiar** al editar.

```java
@PutMapping("/{id}")
public ResponseEntity<?> actualizar(
    @PathVariable Long id,
    @Valid @RequestBody CrearPremioRequest request
) {
    Premio premio = premioRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Premio no encontrado"));
    
    // ⚠️ VALIDAR: El año no puede cambiar
    if (!premio.getAnio().equals(request.getAnio())) {
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "mensaje", "No se puede cambiar el año de un premio existente"
        ));
    }
    
    premio.setNombre(request.getNombre());
    premio.setDescripcion(request.getDescripcion());
    premio.setUrlFoto(request.getUrlFoto());
    // premio.setAnio() - NO ACTUALIZAR
    
    premio = premioRepository.save(premio);
    
    return ResponseEntity.ok(mapearAPremioResponse(premio));
}
```

### 3. `GET /api/v1/premios`

**Response esperada:**
```json
[
  {
    "id": 1,
    "nombre": "PlayStation 5",
    "descripcion": "Consola de videojuegos",
    "urlFoto": "https://example.com/ps5.jpg",
    "anio": 2026,
    "enviado": false
  }
]
```

**Implementación:**
```java
@GetMapping
public ResponseEntity<?> listar() {
    List<Premio> premios = premioRepository.findAll();
    List<PremioResponse> responses = premios.stream()
        .map(this::mapearAPremioResponse)
        .collect(Collectors.toList());
    
    return ResponseEntity.ok(responses);
}

private PremioResponse mapearAPremioResponse(Premio premio) {
    PremioResponse response = new PremioResponse();
    response.setId(premio.getId());
    response.setNombre(premio.getNombre());
    response.setDescripcion(premio.getDescripcion());
    response.setUrlFoto(premio.getUrlFoto());
    response.setAnio(premio.getAnio());  // ⭐ INCLUIR
    response.setEnviado(premio.getEnviado());
    return response;
}
```

### 4. `POST /api/v1/premios/cargar-csv`

**Formato CSV actualizado:**
```csv
numero,nombrePremio,descripcionPremio,urlFotoPremio,anio
18422,PlayStation 5,Consola de videojuegos,https://...,2026
32109,Xbox Series X,Consola Microsoft,https://...,2026
```

**Parser actualizado:**
```java
@PostMapping("/cargar-csv")
public ResponseEntity<?> cargarCSV(@RequestParam("file") MultipartFile file) {
    try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(file.getInputStream())
    )) {
        String line;
        boolean isHeader = true;
        int cargados = 0;
        
        while ((line = reader.readLine()) != null) {
            if (isHeader) {
                // Validar header
                if (!line.equals("numero,nombrePremio,descripcionPremio,urlFotoPremio,anio")) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "mensaje", "Formato de CSV inválido. Esperado: numero,nombrePremio,descripcionPremio,urlFotoPremio,anio"
                    ));
                }
                isHeader = false;
                continue;
            }
            
            String[] parts = line.split(",", -1);
            if (parts.length != 5) {  // ⭐ Ahora son 5 columnas
                continue;
            }
            
            String numero = parts[0].trim();
            String nombre = parts[1].trim();
            String descripcion = parts[2].trim();
            String urlFoto = parts[3].trim();
            Integer anio = Integer.parseInt(parts[4].trim());  // ⭐ NUEVO
            
            // Validar que existe clave para el año
            if (!claveService.existeClaveParaAnio(anio)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "mensaje", "No existe clave registrada para el año " + anio + " (línea " + (cargados + 2) + ")"
                ));
            }
            
            // Crear premio
            Premio premio = new Premio();
            premio.setNombre(nombre);
            premio.setDescripcion(descripcion);
            premio.setUrlFoto(urlFoto);
            premio.setAnio(anio);  // ⭐ NUEVO
            premio.setEnviado(false);
            premioRepository.save(premio);
            
            // Crear emparejamiento número-premio
            NumeroPremiado np = new NumeroPremiado();
            np.setNumero(numero);
            np.setPremio(premio);
            np.setReclamado(false);
            numerosPremiadosRepository.save(np);
            
            cargados++;
        }
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "mensaje", "Premios cargados exitosamente",
            "cantidadCargada", cargados
        ));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "mensaje", "Error al procesar CSV: " + e.getMessage()
        ));
    }
}
```

---

## 🧪 Testing Requerido

### Tests Unitarios

```java
@Test
public void testCrearPremioConAnio() {
    CrearPremioRequest request = new CrearPremioRequest();
    request.setNombre("PS5");
    request.setDescripcion("Consola");
    request.setUrlFoto("https://...");
    request.setAnio(2026);
    
    when(claveService.existeClaveParaAnio(2026)).thenReturn(true);
    
    ResponseEntity<?> response = premioController.crear(request);
    
    assertEquals(201, response.getStatusCodeValue());
    PremioResponse premio = (PremioResponse) response.getBody();
    assertEquals(2026, premio.getAnio());
}

@Test
public void testCrearPremioSinClaveParaAnio() {
    CrearPremioRequest request = new CrearPremioRequest();
    request.setNombre("PS5");
    request.setAnio(2099);
    
    when(claveService.existeClaveParaAnio(2099)).thenReturn(false);
    
    ResponseEntity<?> response = premioController.crear(request);
    
    assertEquals(400, response.getStatusCodeValue());
}

@Test
public void testNoPermiteCambiarAnioAlEditar() {
    Premio premioExistente = new Premio();
    premioExistente.setId(1L);
    premioExistente.setAnio(2026);
    
    CrearPremioRequest request = new CrearPremioRequest();
    request.setNombre("PS5");
    request.setAnio(2027);  // Intentar cambiar año
    
    when(premioRepository.findById(1L)).thenReturn(Optional.of(premioExistente));
    
    ResponseEntity<?> response = premioController.actualizar(1L, request);
    
    assertEquals(400, response.getStatusCodeValue());
}
```

### Tests de Integración

```java
@Test
@Sql("/test-data/claves.sql")  // Crear clave para año 2026
public void testIntegrationCrearPremioConAnio() throws Exception {
    mockMvc.perform(post("/api/v1/premios")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", "Bearer " + adminToken)
        .content("""
            {
              "nombre": "PlayStation 5",
              "descripcion": "Consola de videojuegos",
              "urlFoto": "https://example.com/ps5.jpg",
              "anio": 2026
            }
            """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.anio").value(2026));
}
```

---

## 📊 Queries Útiles

### Consultar premios por año:
```java
@Query("SELECT p FROM Premio p WHERE p.anio = :anio ORDER BY p.nombre")
List<Premio> findByAnio(@Param("anio") Integer anio);
```

### Estadísticas por año:
```java
@Query("SELECT p.anio, COUNT(p) FROM Premio p GROUP BY p.anio ORDER BY p.anio DESC")
List<Object[]> contarPremiosPorAnio();
```

### Verificar si existen premios para un año:
```java
boolean existsByAnio(Integer anio);
```

---

## ✅ Checklist de Implementación

### Base de Datos
- [ ] Agregar columna `anio` a tabla `premio`
- [ ] Migrar datos existentes
- [ ] Crear índice en `anio`
- [ ] Agregar foreign key a `clave_sorteo`

### Código
- [ ] Actualizar entidad `Premio`
- [ ] Actualizar `CrearPremioRequest`
- [ ] Actualizar `PremioResponse`
- [ ] Actualizar endpoint POST `/premios`
- [ ] Actualizar endpoint PUT `/premios/{id}`
- [ ] Actualizar endpoint GET `/premios`
- [ ] Actualizar parser CSV
- [ ] Agregar validación: año existe en claves
- [ ] Agregar validación: año no cambia al editar

### Testing
- [ ] Tests unitarios de creación con año
- [ ] Tests de validación (año no existe)
- [ ] Tests de edición (año inmutable)
- [ ] Tests de carga CSV
- [ ] Tests de integración

### Documentación
- [ ] Actualizar OpenAPI spec (`openapi.yaml`)
- [ ] Actualizar ejemplos en Swagger
- [ ] Documentar migración de datos

---

## 🚨 Consideraciones Importantes

### Migración de Datos en Producción

Si ya hay premios en la base de datos:

```sql
-- Opción 1: Asignar año actual a todos
UPDATE premio SET anio = 2026 WHERE anio IS NULL;

-- Opción 2: Asignar año basado en fecha de creación (si existe)
UPDATE premio 
SET anio = EXTRACT(YEAR FROM fecha_creacion)
WHERE anio IS NULL;

-- Opción 3: Asignar año por defecto y luego corregir manualmente
UPDATE premio SET anio = 2025 WHERE anio IS NULL;
-- Luego corregir manualmente en admin panel
```

### Foreign Key Constraint

⚠️ **IMPORTANTE:** Si se agrega FK a `clave_sorteo`:
- Primero asegurar que existen claves para los años usados
- Considerar usar `ON DELETE RESTRICT` para evitar eliminación accidental
- Documentar procedimiento para eliminar año completo

---

## 📞 Soporte

Para dudas técnicas sobre la implementación frontend:
- Ver: `docs/operacion/ACTUALIZACION_PREMIOS_POR_AÑO.md`
- Revisar: `docs/operacion/RESUMEN_ACTUALIZACION_PREMIOS_AÑO.md`

---

**Fecha de implementación esperada:** Coordinado con frontend  
**Prioridad:** 🔴 Alta - Requerido para operación completa  
**Estado:** ⏳ Pendiente de implementación backend

