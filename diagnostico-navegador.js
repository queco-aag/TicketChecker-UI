/*
 * SCRIPT DE DIAGNÓSTICO - Ejecutar en la consola del navegador
 * 
 * Copia y pega este código completo en la consola del navegador (F12 → Console)
 * y pega aquí el resultado completo
 */

console.clear();
console.log('═══════════════════════════════════════════════════════════════');
console.log('🔍 DIAGNÓSTICO DEL SISTEMA');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. Verificar token
const token = localStorage.getItem('ticketchecker.admin.token');
const user = localStorage.getItem('ticketchecker.admin.user');

console.log('1️⃣  VERIFICACIÓN DEL TOKEN:');
console.log('   Token guardado:', token ? '✅ SÍ' : '❌ NO');
if (token) {
  console.log('   Longitud del token:', token.length);
  console.log('   Primeros 20 caracteres:', token.substring(0, 20) + '...');
} else {
  console.log('   ⚠️ NO HAY TOKEN - El login falló o no se completó');
}
console.log('');

// 2. Verificar usuario
console.log('2️⃣  VERIFICACIÓN DEL USUARIO:');
console.log('   Usuario guardado:', user ? '✅ SÍ' : '❌ NO');
if (user) {
  try {
    const userData = JSON.parse(user);
    console.log('   Username:', userData.username);
    console.log('   Email:', userData.email);
    console.log('   Nombre completo:', userData.fullName);
  } catch (e) {
    console.log('   ⚠️ ERROR al parsear usuario:', e.message);
  }
}
console.log('');

// 3. Verificar configuración de la API
console.log('3️⃣  CONFIGURACIÓN DE LA API:');
console.log('   VITE_API_URL:', import.meta.env?.VITE_API_URL || 'No definida');
console.log('   Origin actual:', window.location.origin);
console.log('   URL completa:', window.location.href);
console.log('');

// 4. Probar petición con el token
console.log('4️⃣  PRUEBA DE PETICIÓN AUTENTICADA:');
console.log('   Intentando GET /api/v1/premios...');

if (token) {
  fetch('/api/v1/premios', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('   Status:', response.status, response.statusText);
    console.log('   Headers de respuesta:');
    for (let [key, value] of response.headers.entries()) {
      console.log('     -', key + ':', value);
    }
    return response.json();
  })
  .then(data => {
    console.log('   ✅ Respuesta exitosa:');
    console.log('   Data:', data);
  })
  .catch(error => {
    console.log('   ❌ Error en la petición:');
    console.log('   Error:', error.message);
    console.log('   Stack:', error.stack);
  });
} else {
  console.log('   ⚠️ NO SE PUEDE PROBAR - No hay token');
}

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('5️⃣  INSTRUCCIONES:');
console.log('   1. Copia TODO el output de esta consola');
console.log('   2. Pégalo en el chat');
console.log('   3. También ve a Network → premios → Response');
console.log('   4. Copia el contenido de la respuesta');
console.log('═══════════════════════════════════════════════════════════════');

