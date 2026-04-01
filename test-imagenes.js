//# Script de verificación de imágenes
//# Ejecuta esto en la consola del navegador (F12 → Console)

console.log('='.repeat(60));
console.log('🔍 VERIFICACIÓN DE IMÁGENES - INICIO');
console.log('='.repeat(60));

// 1. Verificar que fetch funcione
console.log('\n1️⃣ Probando acceso a la API de premios...');
fetch('http://localhost:8080/api/v1/premios', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(res => res.json())
  .then(data => {
    console.log('✅ Respuesta de la API:', data);

    const premios = data.premios || data;
    if (premios && premios.length > 0) {
      const primerPremio = premios[0];
      console.log('\n📌 PRIMER PREMIO:');
      console.log('   Nombre:', primerPremio.nombre);
      console.log('   urlFoto:', primerPremio.urlFoto);

      if (primerPremio.urlFoto) {
        const urlImagen = primerPremio.urlFoto.startsWith('http')
          ? primerPremio.urlFoto
          : `http://localhost:8080${primerPremio.urlFoto.startsWith('/') ? '' : '/'}${primerPremio.urlFoto}`;

        console.log('   URL completa:', urlImagen);

        console.log('\n2️⃣ Probando acceso directo a la imagen...');
        fetch(urlImagen)
          .then(imgRes => {
            console.log('   Status:', imgRes.status, imgRes.statusText);
            console.log('   Headers:', Object.fromEntries(imgRes.headers.entries()));

            if (imgRes.ok) {
              console.log('   ✅ LA IMAGEN SE CARGA CORRECTAMENTE');
              console.log('\n3️⃣ Abre esta URL en una nueva pestaña para ver la imagen:');
              console.log('   ', urlImagen);
            } else {
              console.log('   ❌ ERROR AL CARGAR LA IMAGEN');
              console.log('   El backend no está sirviendo archivos de /uploads/');
              console.log('\n📝 SOLUCIÓN:');
              console.log('   Configura el backend para servir archivos estáticos.');
              console.log('   Ver: DEBUG_IMAGENES.md → Solución 1');
            }
          })
          .catch(err => {
            console.log('   ❌ ERROR DE RED:', err.message);
            console.log('\n📝 POSIBLES CAUSAS:');
            console.log('   - CORS no configurado para /uploads/');
            console.log('   - Backend no está corriendo');
            console.log('   - Ruta incorrecta');
          });
      } else {
        console.log('   ⚠️ urlFoto está vacío o null');
        console.log('\n📝 CAUSA:');
        console.log('   El premio no tiene imagen asociada.');
        console.log('   Sube una imagen usando el formulario de creación/edición.');
      }
    } else {
      console.log('⚠️ No hay premios en la base de datos');
    }
  })
  .catch(err => {
    console.log('❌ ERROR:', err.message);
    console.log('Verifica que el backend esté corriendo en http://localhost:8080');
  });

console.log('\n' + '='.repeat(60));
console.log('⏳ Esperando resultados...');
console.log('='.repeat(60));

