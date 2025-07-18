const BUILD_HOOK_URL = 'https://api.netlify.com/build_hooks/687a9e3cdadc5542da9beee5';

export async function guardarProductosDesdeAdmin(productos) {
  try {
    // 1. Guardamos productos localmente (simulado aquí)
    localStorage.setItem('productos', JSON.stringify(productos));

    // 2. Disparamos el build de Netlify
    const response = await fetch(BUILD_HOOK_URL, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('No se pudo activar el webhook de Netlify');
    }

    console.log('✅ Productos guardados y sitio actualizado en bramsstore.com');
  } catch (error) {
    console.error('❌ Error al guardar productos o actualizar sitio:', error);
  }
}
