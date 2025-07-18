import React, { useEffect, useState } from 'react';
import ProductGrid from './ProductGrid';
import { guardarProductosDesdeAdmin } from './api/BramsStoreAPI';

function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Cargar productos desde localStorage si hay (solo como respaldo visual)
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
    }
  }, []);

  const handleInputChange = (index, field, value) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index][field] = value;
    setProductos(nuevosProductos);
  };

  const agregarProducto = () => {
    setProductos([
      ...productos,
      {
        id: Date.now(),
        title: '',
        description: '',
        price: '',
        image: '',
        category: '',
      },
    ]);
  };

  const eliminarProducto = (id) => {
    const nuevos = productos.filter((prod) => prod.id !== id);
    setProductos(nuevos);
  };

  const guardarCambios = async () => {
    await guardarProductosDesdeAdmin(productos);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Panel de Productos - Bramsstore Admin</h1>

      <button
        onClick={agregarProducto}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        ➕ Agregar Producto
      </button>

      <ProductGrid
        productos={productos}
        onChange={handleInputChange}
        onDelete={eliminarProducto}
      />

      <div className="text-center mt-6">
        <button
          onClick={guardarCambios}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          💾 Guardar productos y actualizar sitio
        </button>
      </div>
    </div>
  );
}

export default App;
