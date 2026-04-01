# 🔍 DIAGNÓSTICO DEL ERROR 403 - BACKEND

**Problema:** Error 403 Forbidden al crear premios  
**Endpoint:** `POST /api/v1/premios`

---

## 🎯 Posibles Causas del Error 403

### **1. CORS no configurado o mal configurado**

El backend está bloqueando peticiones desde `http://localhost:5173` porque no tiene CORS habilitado.

**Verificación:**
```bash
# Probar endpoint OPTIONS (preflight)
curl -X OPTIONS http://localhost:8080/api/v1/premios \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Authorization,Content-Type" \
  -v
```

**Debe responder:**
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
```

**Si NO responde con estos headers**, el CORS NO está configurado.

---

### **2. Usuario no tiene rol ADMIN**

El endpoint requiere rol `ADMIN` pero el usuario autenticado no lo tiene.

**Verificación:**

Ejecuta en la consola del navegador (F12):
```javascript
// Ver el token decodificado
const token = localStorage.getItem('ticketchecker.admin.token');
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log('Token payload:', payload);
console.log('Roles:', payload.roles || payload.authorities);
```

**Debe mostrar:**
```javascript
{
  sub: "admin",
  roles: ["ROLE_ADMIN"] // o authorities: ["ROLE_ADMIN"]
}
```

**Si NO tiene `ROLE_ADMIN`**, el usuario no tiene permisos.

---

### **3. Token JWT no válido o expirado**

El token que se envía no es válido o ya expiró.

**Verificación:**

En la consola del navegador:
```javascript
const token = localStorage.getItem('ticketchecker.admin.token');
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
const exp = new Date(payload.exp * 1000);
const now = new Date();

console.log('Token expira:', exp);
console.log('Fecha actual:', now);
console.log('¿Expirado?', now > exp);
```

**Si `¿Expirado? = true`**, haz login de nuevo.

---

### **4. Endpoint POST /premios no existe en el backend**

El endpoint no está implementado o la ruta es diferente.

**Verificación:**

Probar con curl:
```bash
# Obtener el token del localStorage del navegador
# Reemplazar TOKEN_AQUI con el token real

curl -X POST http://localhost:8080/api/v1/premios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{
    "nombre": "Test Premio",
    "descripcion": "Premio de prueba",
    "urlFoto": "https://example.com/test.jpg",
    "anio": 2026
  }' \
  -v
```

**Respuestas posibles:**
- `403 Forbidden` → Problema de autenticación/autorización
- `404 Not Found` → Endpoint no existe
- `201 Created` → Funciona correctamente
- `400 Bad Request` → Datos inválidos

---

### **5. Spring Security bloqueando la petición**

La configuración de Security no permite el acceso al endpoint.

**Qué buscar en el código del backend:**

```java
// Archivo: SecurityConfig.java o similar

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/numeros/*/verificar").permitAll()
                
                // Endpoints que requieren ADMIN
                .requestMatchers("/api/v1/premios/**").hasRole("ADMIN")  // ← IMPORTANTE
                
                // Resto requiere autenticación
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable())  // ← Debe estar deshabilitado para APIs REST
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            ;
        
        return http.build();
    }
}
```

**Problemas comunes:**
- ❌ `.requestMatchers("/api/v1/premios/**").hasRole("ADMIN")` pero el token tiene `ROLE_ADMIN` (con prefijo)
- ❌ CSRF habilitado (`.csrf()` sin `.disable()`)
- ❌ CORS no configurado

---

### **6. Prefijo ROLE_ en los roles**

Spring Security usa el prefijo `ROLE_` por defecto.

**Problema:**
```java
// En SecurityConfig
.hasRole("ADMIN")  // Espera "ROLE_ADMIN" en el token

// Pero el token tiene
{
  "authorities": ["ADMIN"]  // Sin prefijo
}
```

**Solución:**
```java
// Opción 1: Usar hasAuthority en lugar de hasRole
.hasAuthority("ADMIN")

// Opción 2: Asegurarse de que el token tenga "ROLE_ADMIN"
.hasRole("ADMIN")  // El token debe tener "ROLE_ADMIN"
```

---

## 🔧 SCRIPTS DE DIAGNÓSTICO

### **Script 1: Verificar Token (Navegador)**

Copia y pega en la consola del navegador (F12 → Console):

```javascript
console.clear();
console.log('═══════════════════════════════════════════════════════════════');
console.log('🔍 DIAGNÓSTICO DEL TOKEN');
console.log('═══════════════════════════════════════════════════════════════\n');

const token = localStorage.getItem('ticketchecker.admin.token');

if (!token) {
  console.log('❌ NO HAY TOKEN - Haz login primero');
} else {
  console.log('✅ Token encontrado');
  console.log('Longitud:', token.length);
  
  try {
    const parts = token.split('.');
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    
    console.log('\n📋 HEADER:');
    console.log(header);
    
    console.log('\n📋 PAYLOAD:');
    console.log(payload);
    
    console.log('\n👤 USUARIO:');
    console.log('  Username:', payload.sub || payload.username);
    
    console.log('\n🔑 ROLES/AUTHORITIES:');
    const roles = payload.roles || payload.authorities || payload.auth || [];
    console.log('  Roles:', roles);
    
    if (Array.isArray(roles)) {
      const hasAdmin = roles.some(r => 
        r === 'ADMIN' || 
        r === 'ROLE_ADMIN' || 
        r.authority === 'ADMIN' || 
        r.authority === 'ROLE_ADMIN'
      );
      console.log('  ¿Tiene ADMIN?', hasAdmin ? '✅ SÍ' : '❌ NO');
    }
    
    console.log('\n⏰ EXPIRACIÓN:');
    if (payload.exp) {
      const exp = new Date(payload.exp * 1000);
      const now = new Date();
      const expirado = now > exp;
      
      console.log('  Expira:', exp.toLocaleString());
      console.log('  Ahora:', now.toLocaleString());
      console.log('  ¿Expirado?', expirado ? '❌ SÍ - HAZ LOGIN DE NUEVO' : '✅ NO');
    } else {
      console.log('  No tiene campo de expiración');
    }
    
  } catch (e) {
    console.log('❌ ERROR al decodificar token:', e.message);
    console.log('El token puede estar mal formado');
  }
}

console.log('\n═══════════════════════════════════════════════════════════════');
```

---

### **Script 2: Probar Endpoint (Navegador)**

```javascript
console.clear();
console.log('═══════════════════════════════════════════════════════════════');
console.log('🔍 PROBANDO ENDPOINT POST /premios');
console.log('═══════════════════════════════════════════════════════════════\n');

const token = localStorage.getItem('ticketchecker.admin.token');

if (!token) {
  console.log('❌ NO HAY TOKEN');
} else {
  console.log('Enviando petición...\n');
  
  fetch('http://localhost:8080/api/v1/premios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      nombre: 'Test Premio',
      descripcion: 'Premio de prueba desde consola',
      urlFoto: 'https://example.com/test.jpg',
      anio: 2026
    })
  })
  .then(async response => {
    console.log('📡 RESPUESTA DEL BACKEND:');
    console.log('  Status:', response.status, response.statusText);
    
    console.log('\n📋 HEADERS DE RESPUESTA:');
    for (let [key, value] of response.headers.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    const text = await response.text();
    console.log('\n📄 BODY:');
    
    try {
      const json = JSON.parse(text);
      console.log(json);
      
      if (response.status === 403) {
        console.log('\n❌ ERROR 403 - Posibles causas:');
        console.log('  1. CORS no configurado en el backend');
        console.log('  2. Usuario no tiene rol ADMIN');
        console.log('  3. Token JWT inválido o expirado');
        console.log('  4. Spring Security bloqueando la petición');
      }
      
    } catch (e) {
      console.log(text);
    }
  })
  .catch(error => {
    console.log('\n❌ ERROR DE RED:', error.message);
    console.log('  Posibles causas:');
    console.log('  1. Backend no está corriendo');
    console.log('  2. CORS bloqueando la petición');
  });
}

console.log('\n═══════════════════════════════════════════════════════════════');
```

---

### **Script 3: Verificar CORS (PowerShell)**

```powershell
# Probar preflight request (OPTIONS)
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/premios" `
  -Method OPTIONS `
  -Headers @{
    "Origin" = "http://localhost:5173"
    "Access-Control-Request-Method" = "POST"
    "Access-Control-Request-Headers" = "Authorization,Content-Type"
  } `
  -UseBasicParsing

Write-Host "Status:" $response.StatusCode
Write-Host "`nHeaders de CORS:"
$response.Headers | Format-Table

# Buscar headers específicos
if ($response.Headers["Access-Control-Allow-Origin"]) {
  Write-Host "✅ CORS está configurado"
  Write-Host "Allow-Origin:" $response.Headers["Access-Control-Allow-Origin"]
} else {
  Write-Host "❌ CORS NO está configurado"
}
```

---

## 📋 CHECKLIST DE VERIFICACIÓN

Marca cada ítem:

### En el Frontend:
- [ ] Token se guarda correctamente en localStorage
- [ ] Token NO está expirado
- [ ] Token contiene rol ADMIN (o ROLE_ADMIN)
- [ ] Petición incluye header `Authorization: Bearer {token}`
- [ ] Petición va a `http://localhost:8080/api/v1/premios`

### En el Backend:
- [ ] Backend está corriendo en `localhost:8080`
- [ ] Endpoint `POST /api/v1/premios` está implementado
- [ ] CORS está configurado para `http://localhost:5173`
- [ ] Spring Security permite acceso con rol ADMIN
- [ ] JWT secret key coincide entre frontend y backend
- [ ] CSRF está deshabilitado (`.csrf().disable()`)

### Pruebas:
- [ ] Login funciona correctamente
- [ ] Token se obtiene y guarda
- [ ] Petición OPTIONS retorna headers CORS
- [ ] Petición POST con token válido funciona

---

## 🆘 PRÓXIMOS PASOS

1. **Ejecuta el Script 1** (Verificar Token) en la consola del navegador
2. **Copia todo el output** y compártelo
3. **Ejecuta el Script 2** (Probar Endpoint) en la consola del navegador  
4. **Copia todo el output** y compártelo
5. **Si tienes acceso al backend**, comparte:
   - El contenido de `SecurityConfig.java`
   - El contenido de `PremioController.java`
   - Los logs del backend cuando haces la petición

Con esta información podré decirte exactamente qué está fallando. 🎯

---

**Fecha:** 30 de Marzo, 2026  
**Estado:** Diagnóstico pendiente

