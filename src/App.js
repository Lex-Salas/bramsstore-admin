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
  Download,
  User,
  Shield,
  Bell,
  CreditCard,
  Store,
  Key,
  UserPlus,
  Crown,
  EyeOff
} from 'lucide-react';

const BramsStoreAdmin = () => {
  // Estados de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  // Estados de navegación
  const [currentSection, setCurrentSection] = useState('dashboard');
  
  // Estados de usuarios y roles
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'admin',
      email: 'admin@bramsstore.com',
      fullName: 'Administrador Principal',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2025-01-17',
      permissions: ['all']
    },
    {
      id: 2,
      username: 'carlos_manager',
      email: 'carlos@bramsstore.com',
      fullName: 'Carlos Rodríguez',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-01-16',
      permissions: ['products', 'orders', 'customers']
    },
    {
      id: 3,
      username: 'ana_editor',
      email: 'ana@bramsstore.com',
      fullName: 'Ana Jiménez',
      role: 'editor',
      status: 'active',
      lastLogin: '2025-01-15',
      permissions: ['products']
    }
  ]);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    role: 'editor',
    permissions: []
  });

  // Configuración de la tienda
  const [storeConfig, setStoreConfig] = useState({
    storeName: 'BramsStore',
    storeDescription: 'Tu tienda de tecnología de confianza',
    address: 'San José, Costa Rica',
    phone: '+506 8888-9999',
    email: 'info@bramsstore.com',
    currency: 'CRC',
    timezone: 'America/Costa_Rica',
    language: 'es',
    notifications: {
      newOrders: true,
      lowStock: true,
      newUsers: false,
      weeklyReports: true
    },
    paymentMethods: {
      sinpe: true,
      cards: true,
      paypal: true,
      bankTransfer: false
    }
  });

  // Roles disponibles
  const roles = [
    {
      id: 'super_admin',
      name: 'Super Admin',
      description: 'Acceso completo al sistema',
      icon: Crown,
      color: 'text-purple-600',
      permissions: ['all']
    },
    {
      id: 'admin',
      name: 'Administrador',
      description: 'Gestión de productos, pedidos y clientes',
      icon: Shield,
      color: 'text-blue-600',
      permissions: ['products', 'orders', 'customers', 'reports']
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Solo edición de productos',
      icon: Edit,
      color: 'text-green-600',
      permissions: ['products']
    },
    {
      id: 'viewer',
      name: 'Visor',
      description: 'Solo lectura de estadísticas',
      icon: Eye,
      color: 'text-gray-600',
      permissions: ['dashboard']
    }
  ];

  // Estados de productos (existente)
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

  // Estados de pedidos (existente)
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
  const [editingUser, setEditingUser] = useState(null);
  const [configTab, setConfigTab] = useState('store');
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

  // Función de login actualizada
  const handleLogin = () => {
    const user = users.find(u => u.username === loginForm.username);
    
    // Verificar credenciales
    if (loginForm.username === 'admin' && loginForm.password === 'bramsstore2025') {
      const adminUser = users.find(u => u.username === 'admin');
      setCurrentUser(adminUser);
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
    } else if (user && loginForm.password === 'demo123') { // Password demo para otros usuarios
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      alert('Credenciales incorrectas');
    }
  };

  // Verificar login al cargar
  useEffect(() => {
    const savedLogin = localStorage.getItem('adminLoggedIn');
    const savedUser = localStorage.getItem('currentUser');
    if (savedLogin === 'true' && savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Función de logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('currentUser');
  };

  // Verificar permisos
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return currentUser.permissions.includes(permission);
  };

  // Funciones de usuarios
  const handleAddUser = () => {
    if (newUser.username && newUser.email && newUser.password) {
      const user = {
        ...newUser,
        id: Math.max(...users.map(u => u.id)) + 1,
        status: 'active',
        lastLogin: 'Nunca',
        permissions: roles.find(r => r.id === newUser.role)?.permissions || []
      };
      setUsers(prev => [...prev, user]);
      setNewUser({
        username: '',
        email: '',
        fullName: '',
        password: '',
        role: 'editor',
        permissions: []
      });
      alert('Usuario agregado exitosamente!');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdateUser = () => {
    setUsers(prev =>
      prev.map(u => u.id === editingUser.id ? editingUser : u)
    );
    setEditingUser(null);
    alert('Usuario actualizado exitosamente!');
  };

  const handleDeleteUser = (id) => {
    if (id === 1) {
      alert('No puedes eliminar al super administrador');
      return;
    }
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  // Funciones de productos (existentes)
  const handleAddProduct = () => {
    if (!hasPermission('products')) {
      alert('No tienes permisos para agregar productos');
      return;
    }
    
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
    if (!hasPermission('products')) {
      alert('No tienes permisos para editar productos');
      return;
    }
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
    if (!hasPermission('products')) {
      alert('No tienes permisos para eliminar productos');
      return;
    }
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
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
      {hasPermission('orders') && (
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
      )}

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

  // Vista de productos (existente con verificación de permisos)
  const ProductsView = () => {
    if (!hasPermission('products')) {
      return (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <EyeOff className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Acceso Denegado</h3>
          <p className="text-gray-600">No tienes permisos para acceder a la gestión de productos.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
          <button 
            onClick={() => setCurrentSection('products')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="SKU"
              value={newProduct.sku}
              onChange={(e) => setNewProduct(prev => ({ ...prev, sku: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <input
              type="number"
              placeholder="Costo"
              value={newProduct.cost}
              onChange={(e) => setNewProduct(prev => ({ ...prev, cost: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <input
              type="url"
              placeholder="URL de imagen"
              value={newProduct.image}
              onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <textarea
              placeholder="Descripción"
              value={newProduct.description}
              onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
              className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-20 resize-none text-gray-900 placeholder-gray-500"
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
  };

  // Vista de pedidos (existente con verificación de permisos)
  const OrdersView = () => {
    if (!hasPermission('orders')) {
      return (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <EyeOff className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Acceso Denegado</h3>
          <p className="text-gray-600">No tienes permisos para acceder a la gestión de pedidos.</p>
        </div>
      );
    }

    return (
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
  };

  // Nueva vista de configuración completa
  const SettingsView = () => {
    if (!hasPermission('all')) {
      return (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <EyeOff className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Acceso Denegado</h3>
          <p className="text-gray-600">Solo los Super Administradores pueden acceder a la configuración.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Configuración del Sistema</h2>
          <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Guardar Todo
            </button>
          </div>
        </div>

        {/* Tabs de configuración */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'store', name: 'Tienda', icon: Store },
                { id: 'users', name: 'Usuarios', icon: Users },
                { id: 'notifications', name: 'Notificaciones', icon: Bell },
                { id: 'payments', name: 'Pagos', icon: CreditCard },
                { id: 'security', name: 'Seguridad', icon: Key }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setConfigTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                      configTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Tab de Tienda */}
            {configTab === 'store' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Configuración de la Tienda</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Tienda</label>
                    <input
                      type="text"
                      value={storeConfig.storeName}
                      onChange={(e) => setStoreConfig(prev => ({ ...prev, storeName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
                    <input
                      type="email"
                      value={storeConfig.email}
                      onChange={(e) => setStoreConfig(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={storeConfig.phone}
                      onChange={(e) => setStoreConfig(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      value={storeConfig.address}
                      onChange={(e) => setStoreConfig(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción de la Tienda</label>
                    <textarea
                      value={storeConfig.storeDescription}
                      onChange={(e) => setStoreConfig(prev => ({ ...prev, storeDescription: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-20 resize-none text-gray-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab de Usuarios */}
            {configTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Gestión de Usuarios</h3>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Nuevo Usuario
                  </button>
                </div>

                {/* Formulario nuevo usuario */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-4">Agregar Nuevo Usuario</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre de usuario"
                      value={newUser.username}
                      onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    />
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    />
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddUser}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar
                    </button>
                  </div>
                </div>

                {/* Lista de usuarios */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Usuario</th>
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Rol</th>
                        <th className="text-left py-2">Estado</th>
                        <th className="text-left py-2">Último Acceso</th>
                        <th className="text-left py-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => {
                        const userRole = roles.find(r => r.id === user.role);
                        const RoleIcon = userRole?.icon || User;
                        return (
                          <tr key={user.id} className="border-b">
                            <td className="py-2">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ${userRole?.color}`}>
                                  <RoleIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-semibold">{user.fullName}</p>
                                  <p className="text-sm text-gray-600">@{user.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2">{user.email}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${userRole?.color} bg-opacity-10`}>
                                {userRole?.name}
                              </span>
                            </td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status === 'active' ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td className="py-2">{user.lastLogin}</td>
                            <td className="py-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                {user.id !== 1 && (
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Información de roles */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-4">Roles y Permisos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map(role => {
                      const RoleIcon = role.icon;
                      return (
                        <div key={role.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                          <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${role.color}`}>
                            <RoleIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold">{role.name}</p>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab de Notificaciones */}
            {configTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Configuración de Notificaciones</h3>
                <div className="space-y-4">
                  {Object.entries(storeConfig.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {key === 'newOrders' && 'Nuevos Pedidos'}
                          {key === 'lowStock' && 'Stock Bajo'}
                          {key === 'newUsers' && 'Nuevos Usuarios'}
                          {key === 'weeklyReports' && 'Reportes Semanales'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {key === 'newOrders' && 'Recibir notificación cuando llegue un nuevo pedido'}
                          {key === 'lowStock' && 'Alertas cuando el stock de productos esté bajo'}
                          {key === 'newUsers' && 'Notificar cuando se registre un nuevo usuario'}
                          {key === 'weeklyReports' && 'Resumen semanal de ventas y estadísticas'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setStoreConfig(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, [key]: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab de Pagos */}
            {configTab === 'payments' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Métodos de Pago</h3>
                <div className="space-y-4">
                  {Object.entries(storeConfig.paymentMethods).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {key === 'sinpe' && 'SINPE Móvil'}
                          {key === 'cards' && 'Tarjetas de Crédito/Débito'}
                          {key === 'paypal' && 'PayPal'}
                          {key === 'bankTransfer' && 'Transferencia Bancaria'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {key === 'sinpe' && 'Pagos a través de SINPE Móvil'}
                          {key === 'cards' && 'Visa, MasterCard, American Express'}
                          {key === 'paypal' && 'Pagos internacionales con PayPal'}
                          {key === 'bankTransfer' && 'Transferencias bancarias directas'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setStoreConfig(prev => ({
                            ...prev,
                            paymentMethods: { ...prev.paymentMethods, [key]: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab de Seguridad */}
            {configTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Configuración de Seguridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Sesiones Activas</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-semibold text-green-800">Sesión Actual</p>
                        <p className="text-sm text-green-600">Chrome - Windows • IP: 192.168.1.100</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Últimas Actividades</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">• Login exitoso - Hoy 14:30</p>
                      <p className="text-gray-600">• Producto agregado - Hoy 13:15</p>
                      <p className="text-gray-600">• Usuario creado - Ayer 16:45</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Modal de edición de producto
  const EditProductModal = () => editingProduct && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Editar Producto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={editingProduct.name}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
            className="px-4 py-2 border rounded-lg text-gray-900"
            placeholder="Nombre"
          />
          <input
            type="text"
            value={editingProduct.sku}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, sku: e.target.value }))}
            className="px-4 py-2 border rounded-lg text-gray-900"
            placeholder="SKU"
          />
          <input
            type="number"
            value={editingProduct.price}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
            className="px-4 py-2 border rounded-lg text-gray-900"
            placeholder="Precio"
          />
          <input
            type="number"
            value={editingProduct.cost}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
            className="px-4 py-2 border rounded-lg text-gray-900"
            placeholder="Costo"
          />
          <input
            type="number"
            value={editingProduct.stock}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
            className="px-4 py-2 border rounded-lg text-gray-900"
            placeholder="Stock"
          />
          <input
            type="url"
            value={editingProduct.image}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, image: e.target.value }))}
            className="px-4 py-2 border rounded-lg text-gray-900"
            placeholder="URL de imagen"
          />
          <textarea
            value={editingProduct.description}
            onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
            className="md:col-span-2 px-4 py-2 border rounded-lg h-20 resize-none text-gray-900"
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

  // Modal de edición de usuario
  const EditUserModal = () => editingUser && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-6">Editar Usuario</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={editingUser.username}
                onChange={(e) => setEditingUser(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="usuario123"
                disabled={editingUser.id === 1}
              />
              {editingUser.id === 1 && (
                <p className="text-xs text-gray-500 mt-1">El super admin no se puede cambiar</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="usuario@bramsstore.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={editingUser.fullName}
                onChange={(e) => setEditingUser(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Juan Pérez"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol del Usuario
              </label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={editingUser.id === 1}
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name} - {role.description}
                  </option>
                ))}
              </select>
              {editingUser.id === 1 && (
                <p className="text-xs text-gray-500 mt-1">El super admin siempre mantiene todos los permisos</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={editingUser.status}
                onChange={(e) => setEditingUser(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={editingUser.id === 1}
              >
                <option value="active">✅ Activo - Puede acceder al sistema</option>
                <option value="inactive">❌ Inactivo - Acceso bloqueado</option>
              </select>
              {editingUser.id === 1 && (
                <p className="text-xs text-gray-500 mt-1">El super admin siempre está activo</p>
              )}
            </div>
          </div>
          
          {/* Información actual del rol */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Permisos del Rol Seleccionado:</h4>
            <div className="text-sm text-blue-700">
              {(() => {
                const role = roles.find(r => r.id === editingUser.role);
                if (role?.id === 'super_admin') return '🔓 Acceso completo a todo el sistema';
                if (role?.id === 'admin') return '📦 Productos, Pedidos, Clientes, Reportes';
                if (role?.id === 'editor') return '✏️ Solo edición de productos';
                if (role?.id === 'viewer') return '👁️ Solo lectura del dashboard';
                return 'Permisos limitados';
              })()}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleUpdateUser}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </button>
          <button
            onClick={() => setEditingUser(null)}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
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
          {currentUser && (
            <div className="mt-4 p-2 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-800">{currentUser.fullName}</p>
              <p className="text-xs text-gray-600">{roles.find(r => r.id === currentUser.role)?.name}</p>
            </div>
          )}
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
            
            {hasPermission('products') && (
              <button
                onClick={() => setCurrentSection('products')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  currentSection === 'products' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Productos</span>
              </button>
            )}
            
            {hasPermission('orders') && (
              <button
                onClick={() => setCurrentSection('orders')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  currentSection === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Pedidos</span>
              </button>
            )}
            
            {hasPermission('all') && (
              <button
                onClick={() => setCurrentSection('settings')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  currentSection === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Configuración</span>
              </button>
            )}
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
        {currentSection === 'settings' && <SettingsView />}
      </div>

      {/* Modales */}
      <EditProductModal />
      <EditUserModal />
    </div>
  );
};

export default BramsStoreAdmin;
