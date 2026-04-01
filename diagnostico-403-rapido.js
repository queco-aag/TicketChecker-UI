/*
 * SCRIPT DE DIAGNÓSTICO RÁPIDO - Error 403
 * 
 * INSTRUCCIONES:
 * 1. Abre el navegador en http://localhost:5173
 * 2. Haz login
 * 3. Presiona F12 para abrir DevTools
 * 4. Ve a la pestaña "Console"
 * 5. Copia y pega este código completo
 * 6. Presiona Enter
 * 7. Copia TODO el output y compártelo
 */

console.clear();
console.log('═══════════════════════════════════════════════════════════════');
console.log('🔍 DIAGNÓSTICO COMPLETO - ERROR 403');
console.log('═══════════════════════════════════════════════════════════════\n');

const token = localStorage.getItem('ticketchecker.admin.token');

// 1. Verificar token
console.log('1️⃣  VERIFICACIÓN DEL TOKEN:');
if (!token) {
  console.log('   ❌ NO HAY TOKEN - Haz login primero\n');
  console.log('═══════════════════════════════════════════════════════════════');
} else {
  console.log('   ✅ Token encontrado');
  console.log('   Longitud:', token.length, 'caracteres\n');
  
  try {
    // Decodificar token
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    
    console.log('2️⃣  PAYLOAD DEL TOKEN:');
    console.log(payload);
    console.log('');
    
    // Usuario
    console.log('3️⃣  USUARIO:');
    console.log('   Username:', payload.sub || payload.username);
    console.log('');
    
    // Roles
    console.log('4️⃣  ROLES/AUTHORITIES:');
    const roles = payload.roles || payload.authorities || payload.auth || [];
    console.log('   Valor crudo:', roles);
    
    if (Array.isArray(roles)) {
      console.log('   Es un array:', roles.length, 'elementos');
      roles.forEach((r, i) => {
        if (typeof r === 'string') {
          console.log(`   [${i}]:`, r);
        } else if (r.authority) {
          console.log(`   [${i}]: authority =`, r.authority);
        } else {
          console.log(`   [${i}]:`, r);
        }
      });
      
      const hasAdmin = roles.some(r => 
        r === 'ADMIN' || 
        r === 'ROLE_ADMIN' || 
        r?.authority === 'ADMIN' || 
        r?.authority === 'ROLE_ADMIN'
      );
      
      console.log('   ⭐ ¿Tiene ADMIN?', hasAdmin ? '✅ SÍ' : '❌ NO');
      
      if (!hasAdmin) {
        console.log('   ⚠️ PROBLEMA: El usuario NO tiene rol ADMIN');
        console.log('   Esto causa el error 403');
      }
    } else {
      console.log('   ⚠️ No es un array, tipo:', typeof roles);
    }
    console.log('');
    
    // Expiración
    console.log('5️⃣  EXPIRACIÓN:');
    if (payload.exp) {
      const exp = new Date(payload.exp * 1000);
      const now = new Date();
      const expirado = now > exp;
      
      console.log('   Expira:', exp.toLocaleString());
      console.log('   Ahora:', now.toLocaleString());
      console.log('   ¿Expirado?', expirado ? '❌ SÍ - HAZ LOGIN DE NUEVO' : '✅ NO');
      
      if (expirado) {
        console.log('   ⚠️ PROBLEMA: El token está EXPIRADO');
        console.log('   Esto causa el error 403');
      }
    } else {
      console.log('   No tiene campo de expiración');
    }
    console.log('');
    
    // Probar endpoint
    console.log('6️⃣  PROBANDO ENDPOINT POST /premios:');
    console.log('   Enviando petición...');
    
    fetch('http://localhost:8080/api/v1/premios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre: 'Test Premio Diagnóstico',
        descripcion: 'Premio de prueba desde script de diagnóstico',
        urlFoto: 'https://example.com/test.jpg',
        anio: 2026
      })
    })
    .then(async response => {
      console.log('');
      console.log('7️⃣  RESPUESTA DEL BACKEND:');
      console.log('   Status:', response.status, response.statusText);
      console.log('');
      
      console.log('   📋 Headers de respuesta:');
      const headers = {};
      for (let [key, value] of response.headers.entries()) {
        headers[key] = value;
        console.log(`      ${key}:`, value);
      }
      console.log('');
      
      // Verificar CORS
      if (headers['access-control-allow-origin']) {
        console.log('   ✅ CORS está configurado');
        console.log('      Allow-Origin:', headers['access-control-allow-origin']);
      } else {
        console.log('   ⚠️ CORS NO está configurado en el backend');
        console.log('      Esto puede causar problemas');
      }
      console.log('');
      
      const text = await response.text();
      console.log('   📄 Body de la respuesta:');
      
      try {
        const json = JSON.parse(text);
        console.log(json);
      } catch (e) {
        console.log(text);
      }
      console.log('');
      
      // Diagnóstico según status
      if (response.status === 403) {
        console.log('   ❌ ERROR 403 FORBIDDEN - DIAGNÓSTICO:');
        console.log('');
        console.log('   Posibles causas:');
        console.log('   1. El usuario no tiene rol ADMIN');
        console.log('      → Verificar roles en el payload del token (arriba)');
        console.log('   2. Spring Security espera "ROLE_ADMIN" pero el token tiene "ADMIN"');
        console.log('      → Problema de prefijo ROLE_');
        console.log('   3. El token es inválido o no se está enviando');
        console.log('      → Verificar header Authorization arriba');
        console.log('   4. CORS bloqueando la petición');
        console.log('      → Configurar CORS en el backend');
        console.log('   5. El endpoint requiere permisos específicos');
        console.log('      → Revisar SecurityConfig.java en el backend');
        console.log('');
        console.log('   🔧 SOLUCIÓN MÁS PROBABLE:');
        console.log('   El backend espera "ROLE_ADMIN" pero el token tiene "ADMIN"');
        console.log('   O viceversa.');
        console.log('');
      } else if (response.status === 201 || response.status === 200) {
        console.log('   ✅ ¡FUNCIONA! El premio se creó correctamente');
      } else if (response.status === 404) {
        console.log('   ❌ ERROR 404 - El endpoint POST /premios NO EXISTE en el backend');
      } else if (response.status === 401) {
        console.log('   ❌ ERROR 401 - Token inválido o expirado');
      } else {
        console.log('   ⚠️ Status inesperado:', response.status);
      }
      
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('');
      console.log('📋 RESUMEN:');
      console.log('   • Token:', token ? 'Presente' : 'Ausente');
      console.log('   • Roles:', roles.length ? roles.join(', ') : 'Ninguno');
      console.log('   • Expirado:', payload.exp ? (new Date() > new Date(payload.exp * 1000) ? 'Sí' : 'No') : 'N/A');
      console.log('   • Status:', response.status);
      console.log('   • CORS:', headers['access-control-allow-origin'] ? 'Configurado' : 'No configurado');
      console.log('');
      console.log('📌 COPIA TODO ESTE OUTPUT Y COMPÁRTELO');
      console.log('═══════════════════════════════════════════════════════════════');
    })
    .catch(error => {
      console.log('');
      console.log('   ❌ ERROR DE RED:', error.message);
      console.log('');
      console.log('   Posibles causas:');
      console.log('   1. Backend NO está corriendo en localhost:8080');
      console.log('   2. CORS está bloqueando completamente la petición');
      console.log('   3. Firewall o antivirus bloqueando la conexión');
      console.log('');
      console.log('   🔧 Verifica:');
      console.log('   • Backend está corriendo: http://localhost:8080');
      console.log('   • CORS configurado en el backend para http://localhost:5173');
      console.log('');
      console.log('═══════════════════════════════════════════════════════════════');
    });
    
  } catch (e) {
    console.log('   ❌ ERROR al decodificar token:', e.message);
    console.log('   El token puede estar mal formado');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
  }
}

