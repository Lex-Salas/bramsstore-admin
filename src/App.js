import React, { useState, useEffect, useCallback } from 'react';
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
  EyeOff,
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader,
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  MessageCircle
} from 'lucide-react';

const BramsStoreAdmin = () => {
  // Estados de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  // Estados de navegación
  const [currentSection, setCurrentSection] = useState('dashboard');
  
  // Estados del sistema API
  const [apiManager, setApiManager] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [notifications, setNotifications] = useState([]);
  
  // Estados de datos empresariales
  const [enterpriseData, setEnterpriseData] = useState({
    products: { products: [], metadata: null },
    orders: { orders: [], metadata: null },
    analytics: null,
    loading: true,
    error: null
  });

  // Estados de usuarios locales del admin
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

  // Estado para nuevo producto
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
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
  const [editingProduct, setEditingProduct] = useState(null);

  // Configuración de la tienda MEJORADA
  const [storeConfig, setStoreConfig] = useState({
    // Información básica
    storeName: 'BramsStore',
    storeDescription: 'Tu tienda de tecnología de confianza en Costa Rica',
    slogan: 'Tecnología que transforma tu vida',
    
    // Contacto
    address: 'San José, Costa Rica',
    addressComplete: 'Avenida Central, San José, Costa Rica',
    phone: '+506 2222-2222',
    whatsapp: '+506 8888-8888',
    email: 'info@bramsstore.com',
    supportEmail: 'soporte@bramsstore.com',
    
    // Horarios
    businessHours: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Cerrado'
    },
    
    // Redes sociales
    socialMedia: {
      facebook: 'https://facebook.com/bramsstore',
      instagram: 'https://instagram.com/bramsstore',
      tiktok: 'https://tiktok.com/@bramsstore',
      youtube: 'https://youtube.com/@bramsstore'
    },
    
    // Configuración técnica
    currency: 'CRC',
    timezone: 'America/Costa_Rica',
    language: 'es',
    
    // Notificaciones
    notifications: {
      newOrders: true,
      lowStock: true,
      newUsers: false,
      weeklyReports: true
    },
    
    // Métodos de pago expandidos
    paymentMethods: {
      sinpe: {
        enabled: true,
        phone: '+506 8888-8888',
        name: 'BramsStore S.A.',
        cedula: '3-101-XXXXXX',
        instructions: 'Envía el comprobante por WhatsApp después del pago'
      },
      cards: {
        enabled: true,
        processor: 'Stripe',
        types: ['Visa', 'Mastercard', 'American Express'],
        installments: [3, 6, 12]
      },
      paypal: {
        enabled: true,
        email: 'pagos@bramsstore.com',
        link: 'https://paypal.me/bramsstore'
      },
      bankTransfer: {
        enabled: true,
        accounts: [
          { bank: 'BAC', iban: 'CR12345678901234567890', account: '123456789' },
          { bank: 'BCR', iban: 'CR09876543210987654321', account: '987654321' },
          { bank: 'Banco Nacional', iban: 'CR11111111111111111111', account: '111111111' }
        ]
      }
    }
  });

  // Estados para formularios
  const [editingUser, setEditingUser] = useState(null);
  const [configTab, setConfigTab] = useState('store');

  const categories = [
    { id: 'smartphones', name: 'Smartphones' },
    { id: 'laptops', name: 'Laptops' },
    { id: 'accesorios', name: 'Accesorios' },
    { id: 'software', name: 'Software' },
    { id: 'servicios', name: 'Servicios' },
    { id: 'ropa', name: 'Ropa' }
  ];

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

  // Inicializar API Manager Enterprise
  useEffect(() => {
    const initializeAPIManager = async () => {
      try {
        const api = {
          getProducts: async () => {
            const response = await fetch('https://raw.githubusercontent.com/Lex-Salas/bramsstore-data/main/products.json');
            if (!response.ok) throw new Error('Error fetching products');
            return await response.json();
          },
          
          getOrders: async () => {
            const response = await fetch('https://raw.githubusercontent.com/Lex-Salas/bramsstore-data/main/orders.json');
            if (!response.ok) throw new Error('Error fetching orders');
            return await response.json();
          },

          getAnalytics: async () => {
            return {
              totalRevenue: 2175000,
              totalOrders: 3,
              averageOrderValue: 725000,
              topSellingProducts: [
                { name: 'AirPods Pro 2', sales: 78, revenue: 9750000 },
                { name: 'iPhone 15 Pro', sales: 45, revenue: 29250000 },
                { name: 'MacBook Pro 14"', sales: 23, revenue: 27600000 }
              ],
              recentActivity: [
                { type: 'order', message: 'Nuevo pedido BS-2025-001', time: '2 min ago' },
                { type: 'product', message: 'Stock actualizado: AirPods Pro 2', time: '5 min ago' },
                { type: 'system', message: 'Sincronización completada', time: '10 min ago' }
              ]
            };
          },

          on: (event, callback) => {
            console.log(`Escuchando evento: ${event}`);
          },

          startAutoSync: () => {
            console.log('Auto-sync iniciado');
            setLastSync(new Date().toISOString());
          },

          getStatus: () => ({
            isOnline: navigator.onLine,
            lastSync: lastSync,
            cacheSize: 0,
            failedRequests: 0
          })
        };

        setApiManager(api);
        await loadEnterpriseData(api);
        api.startAutoSync();
        addNotification('success', 'Sistema conectado al backend enterprise');
        
      } catch (error) {
        console.error('Error inicializando API Manager:', error);
        addNotification('error', 'Error conectando con el backend de datos');
      }
    };

    if (isLoggedIn) {
      initializeAPIManager();
    }
  }, [isLoggedIn]);

  // Cargar datos enterprise desde GitHub
  const loadEnterpriseData = useCallback(async (api = apiManager) => {
    if (!api) return;

    try {
      setEnterpriseData(prev => ({ ...prev, loading: true, error: null }));
      setSyncStatus('syncing');

      const [products, orders, analytics] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getAnalytics()
      ]);

      setEnterpriseData({
        products,
        orders,
        analytics,
        loading: false,
        error: null
      });

      setSyncStatus('success');
      setLastSync(new Date().toISOString());
      checkLowStockAlerts(products.products);
      
    } catch (error) {
      console.error('Error cargando datos enterprise:', error);
      setEnterpriseData(prev => ({ ...prev, loading: false, error: error.message }));
      setSyncStatus('error');
      addNotification('error', 'Error sincronizando datos');
    }
  }, [apiManager]);

  // Auto-sync cada 30 segundos
  useEffect(() => {
    if (!apiManager || !isLoggedIn) return;

    const interval = setInterval(() => {
      loadEnterpriseData();
    }, 30000);

    return () => clearInterval(interval);
  }, [apiManager, isLoggedIn, loadEnterpriseData]);

  // Verificar alertas de stock bajo
  const checkLowStockAlerts = (products) => {
    const lowStockProducts = products.filter(product => 
      product.inventory.stock <= product.inventory.reorderLevel
    );

    lowStockProducts.forEach(product => {
      addNotification('warning', `Stock bajo: ${product.name} (${product.inventory.stock} unidades)`);
    });
  };

  // Sistema de notificaciones
  const addNotification = (type, message) => {
    const notification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toISOString()
    };

    setNotifications(prev => [notification, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Función de login
  const handleLogin = () => {
    const user = users.find(u => u.username === loginForm.username);
    
    if (loginForm.username === 'admin' && loginForm.password === 'bramsstore2025') {
      const adminUser = users.find(u => u.username === 'admin');
      setCurrentUser(adminUser);
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
    } else if (user && loginForm.password === 'demo123') {
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
    setApiManager(null);
    setEnterpriseData({ products: { products: [], metadata: null }, orders: { orders: [], metadata: null }, analytics: null, loading: true, error: null });
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('currentUser');
  };

  // Verificar permisos
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return currentUser.permissions.includes(permission);
  };

  // Función de sync manual
  const handleManualSync = () => {
    if (apiManager) {
      loadEnterpriseData();
      addNotification('info', 'Sincronización manual iniciada');
    }
  };

  // Función para agregar producto
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.sku) {
      addNotification('error', 'Por favor completa los campos requeridos: Nombre, SKU y Precio');
      return;
    }

    const product = {
      id: `prod_${Date.now()}`,
      sku: newProduct.sku,
      name: newProduct.name,
      description: newProduct.description,
      category: { 
        id: newProduct.category, 
        name: categories.find(c => c.id === newProduct.category)?.name || 'Otros'
      },
      pricing: { 
        price: parseInt(newProduct.price), 
        cost: parseInt(newProduct.cost || '0'),
        profitMargin: newProduct.cost ? ((parseInt(newProduct.price) - parseInt(newProduct.cost)) / parseInt(newProduct.price) * 100).toFixed(1) : 0
      },
      inventory: { 
        stock: parseInt(newProduct.stock || '0'), 
        available: parseInt(newProduct.stock || '0'),
        reorderLevel: 5
      },
      media: { 
        primaryImage: newProduct.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop'
      },
      sales: { 
        totalSold: 0, 
        averageRating: 0,
        revenue: 0
      },
      status: { 
        featured: newProduct.featured 
      },
      timestamps: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
    };

    console.log('Nuevo producto creado:', product);
    addNotification('success', `Producto "${newProduct.name}" creado exitosamente`);
    
    // Limpiar formulario y cerrar modal
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
    setShowNewProductModal(false);
    
    // Recargar datos
    loadEnterpriseData();
  };

  // Función para iniciar edición de producto
  const handleEditProduct = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      category: product.category.id,
      price: product.pricing.price.toString(),
      cost: product.pricing.cost?.toString() || '',
      image: product.media.primaryImage,
      description: product.description || '',
      stock: product.inventory.stock.toString(),
      featured: product.status?.featured || false,
      sku: product.sku
    });
    setShowEditProductModal(true);
  };

  // Función para actualizar producto
  const handleUpdateProduct = () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.sku) {
      addNotification('error', 'Por favor completa los campos requeridos: Nombre, SKU y Precio');
      return;
    }

    console.log('Producto actualizado:', editingProduct);
    addNotification('success', `Producto "${editingProduct.name}" actualizado exitosamente`);
    
    // Cerrar modal
    setShowEditProductModal(false);
    setEditingProduct(null);
    
    // Recargar datos
    loadEnterpriseData();
  };

  // Función para eliminar producto
  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}"?`)) {
      console.log('Producto eliminado:', productId);
      addNotification('success', `Producto "${productName}" eliminado exitosamente`);
      
      // Recargar datos
      loadEnterpriseData();
    }
  };

  // Funciones de usuarios
  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdateUser = () => {
    setUsers(prev =>
      prev.map(u => u.id === editingUser.id ? editingUser : u)
    );
    setEditingUser(null);
    addNotification('success', 'Usuario actualizado exitosamente');
  };

  const handleDeleteUser = (id) => {
    if (id === 1) {
      addNotification('error', 'No puedes eliminar al super administrador');
      return;
    }
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
      addNotification('success', 'Usuario eliminado exitosamente');
    }
  };

  // Formatear precio
  const formatPrice = (price) => `₡${price.toLocaleString()}`;

  // Formatear tiempo relativo
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Nunca';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} horas`;
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

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
            <p className="text-gray-600">Panel de Administración Enterprise</p>
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

  // Dashboard Enterprise
  const DashboardView = () => {
    const { products, orders, analytics, loading, error } = enterpriseData;

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-900">Cargando datos enterprise...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
            <span className="text-red-800">Error cargando datos: {error}</span>
          </div>
        </div>
      );
    }

    const totalRevenue = orders.metadata?.totalRevenue || 0;
    const totalOrders = orders.metadata?.totalOrders || 0;
    const totalProducts = products.metadata?.totalProducts || 0;
    const lowStockCount = products.products?.filter(p => p.inventory.stock <= p.inventory.reorderLevel).length || 0;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Enterprise</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className="text-gray-900">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-gray-900">Última sync: {formatTimeAgo(lastSync)}</span>
            </div>
            
            <button
              onClick={handleManualSync}
              disabled={syncStatus === 'syncing'}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                syncStatus === 'syncing' 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span className="text-gray-900">{syncStatus === 'syncing' ? 'Sincronizando...' : 'Sincronizar'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
                <p className="text-xs text-gray-500 mt-1">Datos en tiempo real</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Pedidos</p>
                <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">Desde GitHub</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Productos</p>
                <p className="text-2xl font-bold text-purple-600">{totalProducts}</p>
                <p className="text-xs text-gray-500 mt-1">Sincronizado</p>
              </div>
              <Package className="w-12 h-12 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Alertas Stock</p>
                <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
                <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>
        </div>

        {hasPermission('orders') && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Pedidos Recientes (GitHub Data)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">ID</th>
                    <th className="text-left py-2">Cliente</th>
                    <th className="text-left py-2">Total</th>
                    <th className="text-left py-2">Estado</th>
                    <th className="text-left py-2">Fecha</th>
                    <th className="text-left py-2">Origen</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.orders?.slice(0, 5).map(order => (
                    <tr key={order.id} className="border-b">
                      <td className="py-2 font-mono text-sm text-gray-900">{order.orderNumber}</td>
                      <td className="py-2 text-gray-900">{order.customer.fullName}</td>
                      <td className="py-2 font-semibold text-gray-900">{formatPrice(order.pricing.total)}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 text-sm text-gray-900">{new Date(order.timestamps.created).toLocaleDateString()}</td>
                      <td className="py-2">
                        <span className="inline-flex items-center text-gray-900">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Enterprise
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Productos Más Vendidos (Enterprise Data)</h3>
          <div className="space-y-4">
            {products.products?.sort((a, b) => b.sales.totalSold - a.sales.totalSold).slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <img src={product.media.primaryImage} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales.totalSold} ventas • SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatPrice(product.sales.revenue)}</p>
                  <p className="text-sm text-gray-500">Rating: {product.sales.averageRating}⭐</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Estado del Sistema Enterprise</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <p className="font-semibold text-green-800">API Conectada</p>
                <p className="text-sm text-green-600">GitHub Backend Activo</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <RefreshCw className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <p className="font-semibold text-blue-800">Auto-Sync</p>
                <p className="text-sm text-blue-600">Cada 30 segundos</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Shield className="w-6 h-6 text-purple-500 mr-3" />
              <div>
                <p className="font-semibold text-purple-800">Datos Seguros</p>
                <p className="text-sm text-purple-600">Encriptación HTTPS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

    const { products, loading } = enterpriseData;

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-900">Cargando productos desde GitHub...</span>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos Enterprise</h2>
          <div className="flex space-x-2">
            <button 
              onClick={handleManualSync}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync GitHub
            </button>
            <button 
              onClick={() => setShowNewProductModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Productos Enterprise (GitHub Data)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Imagen</th>
                  <th className="text-left py-2">Producto</th>
                  <th className="text-left py-2">SKU</th>
                  <th className="text-left py-2">Precio</th>
                  <th className="text-left py-2">Stock</th>
                  <th className="text-left py-2">Ventas</th>
                  <th className="text-left py-2">Estado</th>
                  <th className="text-left py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.products?.map(product => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2">
                      <img src={product.media.primaryImage} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="py-2">
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category.name}</p>
                      </div>
                    </td>
                    <td className="py-2 font-mono text-sm text-gray-900">{product.sku}</td>
                    <td className="py-2">
                      <div>
                        <p className="font-semibold text-gray-900">{formatPrice(product.pricing.price)}</p>
                        <p className="text-xs text-gray-500">Margen: {product.pricing.profitMargin}%</p>
                      </div>
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.inventory.stock <= product.inventory.reorderLevel 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.inventory.available} disponible
                      </span>
                      {product.inventory.stock <= product.inventory.reorderLevel && (
                        <div className="text-xs text-red-600 mt-1">⚠️ Stock bajo</div>
                      )}
                    </td>
                    <td className="py-2">
                      <div>
                        <p className="font-semibold text-gray-900">{product.sales.totalSold}</p>
                        <p className="text-xs text-gray-500">{formatPrice(product.sales.revenue)}</p>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-green-600">GitHub Sync</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded transition-colors"
                          title="Editar producto"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                          title="Eliminar producto"
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

    const { orders, loading } = enterpriseData;

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-900">Cargando pedidos desde GitHub...</span>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Pedidos Enterprise</h2>
          <div className="flex space-x-2">
            <button 
              onClick={handleManualSync}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync GitHub
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pedidos Enterprise (GitHub Data)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Pedido</th>
                  <th className="text-left py-2">Cliente</th>
                  <th className="text-left py-2">Productos</th>
                  <th className="text-left py-2">Total</th>
                  <th className="text-left py-2">Estado</th>
                  <th className="text-left py-2">Pago</th>
                  <th className="text-left py-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.orders?.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="py-2">
                      <div>
                        <p className="font-mono font-semibold text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                    </td>
                    <td className="py-2">
                      <div>
                        <p className="font-semibold text-gray-900">{order.customer.fullName}</p>
                        <p className="text-sm text-gray-600">{order.customer.email}</p>
                        <p className="text-xs text-gray-500">{order.customer.phone}</p>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-gray-500"> x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-2">
                      <div>
                        <p className="font-bold text-gray-900">{formatPrice(order.pricing.total)}</p>
                        <p className="text-xs text-gray-500">
                          Ganancia: {formatPrice(order.pricing.totalProfit)}
                        </p>
                      </div>
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.payment.methodName}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-2">
                      <p className="text-sm text-gray-900">{new Date(order.timestamps.created).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{new Date(order.timestamps.created).toLocaleTimeString()}</p>
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
          <h2 className="text-2xl font-bold text-gray-800">Configuración del Sistema Enterprise</h2>
          <div className="flex gap-2">
            <button 
              onClick={handleManualSync}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Data
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Guardar Todo
            </button>
          </div>
        </div>

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
            {configTab === 'store' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Configuración de la Tienda Enterprise</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-4">Información Básica</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono Principal</label>
                      <input
                        type="tel"
                        value={storeConfig.phone}
                        onChange={(e) => setStoreConfig(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                      <input
                        type="tel"
                        value={storeConfig.whatsapp}
                        onChange={(e) => setStoreConfig(prev => ({ ...prev, whatsapp: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dirección Completa</label>
                      <input
                        type="text"
                        value={storeConfig.addressComplete}
                        onChange={(e) => setStoreConfig(prev => ({ ...prev, addressComplete: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {configTab === 'payments' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Métodos de Pago Enterprise</h3>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-blue-800 flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      SINPE Móvil
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={storeConfig.paymentMethods.sinpe.enabled}
                        onChange={(e) => setStoreConfig(prev => ({
                          ...prev,
                          paymentMethods: {
                            ...prev.paymentMethods,
                            sinpe: { ...prev.paymentMethods.sinpe, enabled: e.target.checked }
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  {storeConfig.paymentMethods.sinpe.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">Número SINPE</label>
                        <input
                          type="tel"
                          value={storeConfig.paymentMethods.sinpe.phone}
                          onChange={(e) => setStoreConfig(prev => ({
                            ...prev,
                            paymentMethods: {
                              ...prev.paymentMethods,
                              sinpe: { ...prev.paymentMethods.sinpe, phone: e.target.value }
                            }
                          }))}
                          className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                          placeholder="+506 8888-8888"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">Nombre Titular</label>
                        <input
                          type="text"
                          value={storeConfig.paymentMethods.sinpe.name}
                          onChange={(e) => setStoreConfig(prev => ({
                            ...prev,
                            paymentMethods: {
                              ...prev.paymentMethods,
                              sinpe: { ...prev.paymentMethods.sinpe, name: e.target.value }
                            }
                          }))}
                          className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                          placeholder="BramsStore S.A."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">Cédula</label>
                        <input
                          type="text"
                          value={storeConfig.paymentMethods.sinpe.cedula}
                          onChange={(e) => setStoreConfig(prev => ({
                            ...prev,
                            paymentMethods: {
                              ...prev.paymentMethods,
                              sinpe: { ...prev.paymentMethods.sinpe, cedula: e.target.value }
                            }
                          }))}
                          className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                          placeholder="3-101-XXXXXX"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {configTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Gestión de Usuarios</h3>
                  <button 
                    onClick={() => setEditingUser({ username: '', email: '', fullName: '', role: 'editor', status: 'active' })}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Nuevo Usuario
                  </button>
                </div>

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
              </div>
            )}

            {configTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Configuración de Seguridad Enterprise</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-4 flex items-center">
                      <Key className="w-5 h-5 mr-2" />
                      Tokens de API
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-2">GitHub Token</label>
                        <input
                          type="password"
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                        />
                        <p className="text-xs text-red-600 mt-1">Para actualizaciones automáticas de productos</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-2">PayPal API Key</label>
                        <input
                          type="password"
                          placeholder="sk_live_xxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Configuraciones de Seguridad
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span className="text-sm text-gray-700">Autenticación de dos factores</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span className="text-sm text-gray-700">Logs de actividad detallados</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span className="text-sm text-gray-700">Backup automático diario</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span className="text-sm text-gray-700">Bloqueo de IP sospechosas</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-4">Estado del Sistema de Seguridad</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center p-3 bg-white rounded border">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium text-green-800">SSL Activo</p>
                        <p className="text-sm text-green-600">Certificado válido</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded border">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium text-green-800">Firewall Activo</p>
                        <p className="text-sm text-green-600">Protección completa</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded border">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium text-green-800">Backups OK</p>
                        <p className="text-sm text-green-600">Último: Hoy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {configTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Sistema de Notificaciones Enterprise</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-800">Notificaciones en tiempo real activas desde GitHub</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EditProductModal = () => showEditProductModal && editingProduct && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-6">Editar Producto</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="iPhone 15 Pro Max"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={editingProduct.sku}
                onChange={(e) => setEditingProduct(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="IP15P-256"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={editingProduct.category}
                onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio de Venta (₡) *
              </label>
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="650000"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Costo (₡)
              </label>
              <input
                type="number"
                value={editingProduct.cost}
                onChange={(e) => setEditingProduct(prev => ({ ...prev, cost: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="500000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Actual
              </label>
              <input
                type="number"
                value={editingProduct.stock}
                onChange={(e) => setEditingProduct(prev => ({ ...prev, stock: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={editingProduct.description}
              onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              rows="3"
              placeholder="Describe las características principales del producto..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de Imagen
            </label>
            <input
              type="url"
              value={editingProduct.image}
              onChange={(e) => setEditingProduct(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="editFeatured"
              checked={editingProduct.featured}
              onChange={(e) => setEditingProduct(prev => ({ ...prev, featured: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="editFeatured" className="text-sm text-gray-700">
              ⭐ Producto destacado (aparecerá en la página principal)
            </label>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleUpdateProduct}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Actualizar Producto
          </button>
          <button
            onClick={() => {
              setShowEditProductModal(false);
              setEditingProduct(null);
            }}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-6">Agregar Nuevo Producto</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="iPhone 15 Pro Max"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={newProduct.sku}
                onChange={(e) => setNewProduct(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="IP15P-256"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio de Venta (₡) *
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="650000"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Costo (₡)
              </label>
              <input
                type="number"
                value={newProduct.cost}
                onChange={(e) => setNewProduct(prev => ({ ...prev, cost: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="500000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Inicial
              </label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              rows="3"
              placeholder="Describe las características principales del producto..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de Imagen
            </label>
            <input
              type="url"
              value={newProduct.image}
              onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={newProduct.featured}
              onChange={(e) => setNewProduct(prev => ({ ...prev, featured: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="featured" className="text-sm text-gray-700">
              ⭐ Producto destacado (aparecerá en la página principal)
            </label>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAddProduct}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Producto
          </button>
          <button
            onClick={() => setShowNewProductModal(false)}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

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
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              notification.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            <div className="flex items-center">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
              {notification.type === 'error' && <AlertTriangle className="w-5 h-5 mr-2" />}
              {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 mr-2" />}
              {notification.type === 'info' && <Bell className="w-5 h-5 mr-2" />}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          </div>
        ))}
      </div>

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
              <p className="text-xs text-gray-500">Enterprise Admin</p>
            </div>
          </div>
          {currentUser && (
            <div className="mt-4 p-2 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-800">{currentUser.fullName}</p>
              <p className="text-xs text-gray-600">{roles.find(r => r.id === currentUser.role)?.name}</p>
              <div className="flex items-center mt-1">
                <div className={`w-2 h-2 rounded-full mr-1 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-600">{isOnline ? 'Conectado' : 'Sin conexión'}</span>
              </div>
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
              {syncStatus === 'syncing' && currentSection === 'dashboard' && (
                <Loader className="w-4 h-4 animate-spin ml-auto" />
              )}
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
                <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {enterpriseData.products.products?.length || 0}
                </span>
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
                <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {enterpriseData.orders.orders?.length || 0}
                </span>
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
          <div className="mb-4 p-2 bg-gray-50 rounded-lg text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Última sync:</span>
              <span className="text-gray-900">{formatTimeAgo(lastSync)}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-600">Estado:</span>
              <span className={`${
                syncStatus === 'success' ? 'text-green-600' :
                syncStatus === 'error' ? 'text-red-600' :
                syncStatus === 'syncing' ? 'text-blue-600' :
                'text-gray-900'
              }`}>
                {syncStatus === 'success' ? 'Sincronizado' :
                 syncStatus === 'error' ? 'Error' :
                 syncStatus === 'syncing' ? 'Sincronizando...' :
                 'Idle'}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <div className="ml-64 p-6">
        {currentSection === 'dashboard' && <DashboardView />}
        {currentSection === 'products' && <ProductsView />}
        {currentSection === 'orders' && <OrdersView />}
        {currentSection === 'settings' && <SettingsView />}
      </div>

      <EditUserModal />
      <NewProductModal />
      <EditProductModal />
    </div>
  );
};

export default BramsStoreAdmin;
