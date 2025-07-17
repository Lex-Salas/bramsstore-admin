import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  LogOut,
  Upload,
  Save,
  Search,
  Filter,
  Download
} from 'lucide-react';

const BramsStoreAdmin = () => {
  // Estados de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  // Estados de navegación
  const [currentSection, setCurrentSection] = useState('dashboard');
  
  // Estados de productos
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro",
      category: "smartphones",
      price: 650000,
      cost: 500000,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
      description: "Último modelo con chip A17 Pro, 128GB de almacenamiento, cámara profesional",
      stock: 15,
      featured: true,
      sku: "IP15P-128",
      sales: 45,
      profit: 6750000
    },
    {
      id: 2,
      name: "MacBook Pro 14\"",
      category: "laptops",
      price: 1200000,
      cost: 900000,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop",
      description: "M3 chip, 16GB RAM, 512GB SSD, pantalla Retina",
      stock: 8,
      featured: true,
      sku: "MBP14-M3",
      sales: 23,
      profit: 6900000
    },
    {
      id: 3,
      name: "AirPods Pro 2",
      category: "accesorios",
      price: 125000,
      cost: 80000,
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop",
      description: "Cancelación de ruido activa, estuche de carga MagSafe",
      stock: 25,
      featured: false,
      sku: "APP2-WHITE",
      sales: 78,
      profit: 3510000
    }
  ]);

  // Estados de pedidos
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'María González',
      email: 'maria@email.com',
      phone: '8888-9999',
      total: 775000,
      status: 'pendiente',
      date: '2025-01-15',
      items: ['iPhone 15 Pro', 'AirPods Pro 2'],
      paymentMethod: 'SINPE Móvil'
    },
    {
      id: 'ORD-002',
      customer: 'Carlos Rodríguez',
      email: 'carlos@email.com',
      phone: '7777-8888',
      total: 1200000,
      status: 'completado',
      date: '2025-01-14',
      items: ['MacBook Pro 14"'],
      paymentMethod: 'Tarjeta'
    },
    {
      id: 'ORD-003',
      customer: 'Ana Jiménez',
      email: 'ana@email.com',
      phone: '6666-7777',
      total: 250000,
      status: 'enviado',
      date: '2025-01-13',
      items: ['AirPods Pro 2 x2'],
      paymentMethod: 'PayPal'
    }
  ]);

  // Estados para formularios
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'smartphones',
    price: '',
    cost: '',
    image: '',
    description: '',
    stock: '',
    featured: false,
    sku: ''
  });

  const categories = [
    { id: 'smartphones', name: 'Smartphones' },
    { id: 'laptops', name: 'Laptops' },
    { id: 'accesorios', name: 'Accesorios' },
    { id: 'software', name: 'Software' },
    { id: 'servicios', name: 'Servicios' },
    { id: 'ropa', name: 'Ropa' }
  ];

  // Función de login
  const handleLogin = () => {
    // Credenciales temporales (en producción usar autenticación real)
    if (loginForm.username === 'admin' && loginForm.password === 'bramsstore2025') {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  // Verificar login al cargar
  useEffect(() => {
    const savedLogin = localStorage.getItem('adminLoggedIn');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Función de logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
  };

  // Funciones de productos
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product = {
        ...newProduct,
        id: Math.max(...products.map(p => p.id)) + 1,
        price: parseInt(newProduct.price),
        cost: parseInt(newProduct.cost) || 0,
        stock: parseInt(newProduct.stock) || 0,
        sales: 0,
        profit: 0
      };
      setProducts(prev => [...prev, product]);
      setNewProduct({
        name: '',
        category: 'smartphones',
        price: '',
        cost: '',
        image: '',
        description: '',
        stock: '',
        featured: false,
        sku: ''
      });
      alert('Producto agregado exitosamente!');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = () => {
    setProducts(prev =>
      prev.map(p => p.id === editingProduct.id ? editingProduct : p)
    );
    setEditingProduct(null);
    alert('Producto actualizado exitosamente!');
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Calcular estadísticas
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 5).length;

  // Formatear precio
  const formatPrice = (price) => `₡${price.toLocaleString()}`;

  // Pantalla de login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="text-blue-600">Brams</span>
              <span className="text-orange-500">Store</span> Admin
            </h1>
            <p className="text-gray-600">Panel de Administración</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Usuario"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-orange-600 transition-all duration-300"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Demo:</strong><br />
              Usuario: admin<br />
              Contraseña: bramsstore2025
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Pedidos</p>
              <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
            </div>
            <ShoppingCart className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Productos</p>
              <p className="text-2xl font-bold text-purple-600">{totalProducts}</p>
            </div>
            <Package className="w-12 h-12 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Stock Bajo</p>
              <p className="text-2xl font-bold text-red-600">{lowStockProducts}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Pedidos recientes */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Pedidos Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Cliente</th>
                <th className="text-left py-2">Total</th>
                <th className="text-left py-2">Estado</th>
                <th className="text-left py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="border-b">
                  <td className="py-2">{order.id}</td>
                  <td className="py-2">{order.customer}</td>
                  <td className="py-2">{formatPrice(order.total)}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completado' ? 'bg-green-100 text-green-800' :
                      order.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Productos más vendidos */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Productos Más Vendidos</h3>
        <div className="space-y-4">
          {products.sort((a, b) => b.sales - a.sales).slice(0, 5).map(product => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} ventas</p>
                </div>
              </div>
              <p className="font-bold text-green-600">{formatPrice(product.profit)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Vista de productos
  const ProductsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </button>
      </div>

      {/* Formulario agregar producto */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Agregar Nuevo Producto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={newProduct.name}
            onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="SKU"
            value={newProduct.sku}
            onChange={(e) => setNewProduct(prev => ({ ...prev, sku: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Precio de venta"
            value={newProduct.price}
            onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Costo"
            value={newProduct.cost}
            onChange={(e) => setNewProduct(prev => ({ ...prev, cost: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            placeholder="URL de imagen"
            value={newProduct.image}
            onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Descripción"
            value={newProduct.description}
            onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
            className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-20 resize-none"
          />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newProduct.featured}
              onChange={(e) => setNewProduct(prev => ({ ...prev, featured: e.target.checked }))}
              className="mr-2"
            />
            Producto destacado
          </label>
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </button>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Productos Existentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Imagen</th>
                <th className="text-left py-2">Nombre</th>
                <th className="text-left py-2">SKU</th>
                <th className="text-left py-2">Precio</th>
                <th className="text-left py-2">Stock</th>
                <th className="text-left py-2">Ventas</th>
                <th className="text-left py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b">
                  <td className="py-2">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="py-2">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </td>
                  <td className="py-2">{product.sku}</td>
                  <td className="py-2">{formatPrice(product.price)}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stock < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-2">{product.sales}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Vista de pedidos
  const OrdersView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">ID Pedido</th>
                <th className="text-left py-2">Cliente</th>
                <th className="text-left py-2">Contacto</th>
                <th className="text-left py-2">Total</th>
                <th className="text-left py-2">Estado</th>
                <th className="text-left py-2">Pago</th>
                <th className="text-left py-2">Fecha</th>
                <th className="text-left py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b">
                  <td className="py-2 font-mono">{order.id}</td>
                  <td className="py-2">
                    <div>
                      <p className="font-semibold">{order.customer}</p>
                      <p className="text-sm text-gray-600">{order.email}</p>
                    </div>
                  </td>
                  <td className="py-2">{order.phone}</td>
                  <td className="py-2 font-bold">{formatPrice(order.total)}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completado' ? 'bg-green-100 text-green-800' :
                      order.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2">{order.paymentMethod}</td>
                  <td className="py-2">{order.date}</td>
                  <td className="py-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Modal de edición
  const EditModal = () => editingProduct && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Editar Producto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={editingProduct.name}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
            placeholder="Nombre"
          />
          <input
            type="text"
            value={editingProduct.sku}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, sku: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
            placeholder="SKU"
          />
          <input
            type="number"
            value={editingProduct.price}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
            className="px-4 py-2 border rounded-lg"
            placeholder="Precio"
          />
          <input
            type="number"
            value={editingProduct.cost}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
            className="px-4 py-2 border rounded-lg"
            placeholder="Costo"
          />
          <input
            type="number"
            value={editingProduct.stock}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
            className="px-4 py-2 border rounded-lg"
            placeholder="Stock"
          />
          <input
            type="url"
            value={editingProduct.image}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, image: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
            placeholder="URL de imagen"
          />
          <textarea
            value={editingProduct.description}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
            className="md:col-span-2 px-4 py-2 border rounded-lg h-20 resize-none"
            placeholder="Descripción"
          />
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={editingProduct.featured}
              onChange={(e) => setEditingProduct(prev => ({ ...prev, featured: e.target.checked }))}
              className="mr-2"
            />
            Producto destacado
          </label>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleUpdateProduct}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </button>
          <button
            onClick={() => setEditingProduct(null)}
            className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-30">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">
                <span className="text-blue-600">Brams</span>
                <span className="text-orange-500">Store</span>
              </h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => setCurrentSection('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentSection === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentSection('products')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentSection === 'products' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Productos</span>
            </button>
            <button
              onClick={() => setCurrentSection('orders')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentSection === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Pedidos</span>
            </button>
            <button
              onClick={() => setCurrentSection('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentSection === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Configuración</span>
            </button>
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {currentSection === 'dashboard' && <DashboardView />}
        {currentSection === 'products' && <ProductsView />}
        {currentSection === 'orders' && <OrdersView />}
        {currentSection === 'settings' && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuración</h2>
            <p className="text-gray-600">Panel de configuración en desarrollo...</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditModal />
    </div>
  );
};

export default BramsStoreAdmin;
