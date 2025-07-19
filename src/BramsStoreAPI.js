const GITHUB_TOKEN = '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'; // Tu token actual
const REPO = 'Lex-Salas/bramsstore-data';
const FILE_PATH = 'products.json';
const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
const BUILD_HOOK_URL = 'https://api.netlify.com/build_hooks/687a9e3cdadc5542da9beee5';

export async function guardarProductosDesdeAdmin(productos) {
  try {
    console.log('🔄 Iniciando guardado en GitHub...', productos);
    
    // Obtener el SHA actual del archivo
    const getResponse = await fetch(API_URL, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!getResponse.ok) {
      throw new Error(`❌ Error obteniendo archivo: ${getResponse.status} ${getResponse.statusText}`);
    }

    const fileData = await getResponse.json();
    const sha = fileData.sha;
    console.log('✅ SHA obtenido:', sha);

    // Preparar el contenido con la estructura correcta
    const productData = {
      metadata: {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        updatedBy: "admin",
        totalProducts: productos.products.length,
        totalValue: productos.products.reduce((sum, p) => sum + p.pricing.price, 0),
        totalStock: productos.products.reduce((sum, p) => sum + p.inventory.stock, 0),
        lowStockThreshold: 5,
        currency: "CRC",
        syncStatus: "synced"
      },
      products: productos.products,
      categories: [
        {
          id: "smartphones",
          name: "Smartphones",
          slug: "smartphones",
          description: "Los mejores smartphones del mercado",
          image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop",
          productCount: productos.products.filter(p => p.category.id === 'smartphones').length,
          active: true,
          featured: true,
          seoTitle: "Smartphones | BramsStore Costa Rica",
          seoDescription: "Compra los mejores smartphones en Costa Rica con garantía y envío gratis."
        },
        {
          id: "laptops",
          name: "Laptops",
          slug: "laptops",
          description: "Laptops de alta gama para profesionales",
          image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=200&fit=crop",
          productCount: productos.products.filter(p => p.category.id === 'laptops').length,
          active: true,
          featured: true,
          seoTitle: "Laptops | BramsStore Costa Rica",
          seoDescription: "Las mejores laptops para trabajo y gaming en Costa Rica."
        },
        {
          id: "accesorios",
          name: "Accesorios",
          slug: "accesorios",
          description: "Accesorios tecnológicos de calidad",
          image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop",
          productCount: productos.products.filter(p => p.category.id === 'accesorios').length,
          active: true,
          featured: false,
          seoTitle: "Accesorios Tecnológicos | BramsStore",
          seoDescription: "Encuentra los mejores accesorios para tus dispositivos Apple."
        }
      ],
      settings: {
        autoSync: true,
        syncInterval: 30,
        backupEnabled: true,
        compressionEnabled: false,
        encryption: false,
        apiVersion: "v1",
        timezone: "America/Costa_Rica"
      }
    };

    // Codificar el contenido en base64
    const contentEncoded = btoa(unescape(encodeURIComponent(JSON.stringify(productData, null, 2))));
    console.log('✅ Contenido codificado');

    // Subir el archivo actualizado
    const putResponse = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `Actualización desde admin - ${new Date().toISOString()}`,
        content: contentEncoded,
        sha
      })
    });

    if (!putResponse.ok) {
      const errorText = await putResponse.text();
      throw new Error(`❌ Error subiendo archivo: ${putResponse.status} ${putResponse.statusText} - ${errorText}`);
    }

    console.log('✅ Archivo subido a GitHub exitosamente');

    // Disparar build en Netlify
    const netlifyResponse = await fetch(BUILD_HOOK_URL, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (netlifyResponse.ok) {
      console.log('✅ Deploy de Netlify iniciado');
    } else {
      console.warn('⚠️ Warning: No se pudo disparar deploy de Netlify');
    }

    return {
      success: true,
      message: 'Productos guardados y deploy iniciado',
      githubCommit: true,
      netlifyDeploy: netlifyResponse.ok
    };

  } catch (error) {
    console.error('❌ Error en guardarProductosDesdeAdmin:', error);
    throw new Error(`Error guardando productos: ${error.message}`);
  }
}
