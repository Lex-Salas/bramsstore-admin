const GITHUB_TOKEN = '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'; // Reemplazá esto por tu token
const REPO = 'Lex-Salas/bramsstore-data';
const FILE_PATH = 'products.json';
const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
const BUILD_HOOK_URL = 'https://api.netlify.com/build_hooks/687a9e3cdadc5542da9beee5';

export async function guardarProductosDesdeAdmin(productos) {
  try {
    const getResponse = await fetch(API_URL, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`
      }
    });

    if (!getResponse.ok) {
      throw new Error('❌ No se pudo obtener el SHA del archivo.');
    }

    const fileData = await getResponse.json();
    const sha = fileData.sha;

    const contentEncoded = btoa(unescape(encodeURIComponent(JSON.stringify(productos, null, 2))));

    const putResponse = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Actualización desde admin',
        content: contentEncoded,
        sha
      })
    });

    if (!putResponse.ok) {
      throw new Error('❌ Error al subir productos al repositorio');
    }

    // Dispara build en Netlify
    await fetch(BUILD_HOOK_URL, { method: 'POST' });

    alert('✅ Productos guardados y deploy iniciado en Netlify');
  } catch (error) {
    console.error(error);
    alert('⚠️ Hubo un error al guardar los productos');
  }
}
