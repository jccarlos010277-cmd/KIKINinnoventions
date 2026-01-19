// catalogo-dinamico-mx.js - Versión adaptada para KIKIN Innoventions México
// Optimizado para CSV desde GitHub con configuración mexicana

const CatalogoDinamico = {
  // 🔗 URL de tu CSV en GitHub - AJUSTAR A TU REPOSITORIO
  csvURL: 'https://github.com/jccarlos010277-cmd/KIKINinnoventions/blob/main/productos.csv',
  
  // ⚙️ Configuración PARA MÉXICO
  config: {
    cacheHoras: 2,
    timeout: 10000,
    autoRefresh: 60,
    version: 'mx-2.0',
    currency: 'MXN',
    currencySymbol: '$',
    taxRate: 0.16, // IVA 16%
    minOrder: 299, // Mínimo de compra
    deliveryBaseFee: 49, // Tarifa base
    freeDeliveryThreshold: 599, // Envío gratis arriba de
    decimalSeparator: '.',
    thousandSeparator: ','
  },
  
  // 📦 Datos en memoria
  productos: [],
  categorias: [],
  cargado: false,
  fuente: 'none',
  ultimaVersionCSV: null,
  
  // ==================== ZONAS DE ENTREGA MONTERREY ====================
  zonasEntrega: [
    { id: 'spgg', name: 'San Pedro Garza García', fee: 49, time: '60-90 min' },
    { id: 'valle', name: 'Valle Oriente', fee: 49, time: '60-90 min' },
    { id: 'centro', name: 'Centro Monterrey', fee: 59, time: '90-120 min' },
    { id: 'cumbres', name: 'Cumbres', fee: 69, time: '90-120 min' },
    { id: 'apodaca', name: 'Apodaca', fee: 89, time: '120-150 min' }
  ],
  
  // ==================== MÉTODOS DE MONEDA MEXICANA ====================
  formatoMoneda: function(monto) {
    return this.config.currencySymbol + monto.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },
  
  calcularIVA: function(subtotal) {
    return subtotal * this.config.taxRate;
  },
  
  calcularTotal: function(subtotal, envio) {
    const iva = this.calcularIVA(subtotal);
    return subtotal + iva + envio;
  },
  
  // ==================== INICIALIZACIÓN PRINCIPAL ====================
  inicializar: function() {
    console.log('⚡ KIKIN Innoventions - Inicializando catálogo México...');
    console.log('📍 Servicio: Monterrey, NL');
    
    // 1. Intentar desde caché
    if (this.cargarDesdeCache()) {
      console.log('💾 Catálogo cargado desde caché (', this.productos.length, 'productos)');
      this.fuente = 'cache';
      this.finalizarCarga();
      
      // Actualizar en segundo plano
      setTimeout(() => {
        this.verificarActualizaciones();
      }, 3000);
      
      this.iniciarAutoRefresco();
      return;
    }
    
    // 2. Cargar desde GitHub CSV
    console.log('🌐 Intentando cargar desde GitHub CSV...');
    this.cargarDesdeGitHub()
      .then(() => {
        console.log('✅ CSV cargado desde GitHub:', this.productos.length, 'productos');
        this.fuente = 'github';
        this.guardarEnCache();
        this.finalizarCarga();
        this.iniciarAutoRefresco();
      })
      .catch((error) => {
        console.warn('⚠️ Error cargando desde GitHub:', error.message);
        this.usarRespaldoLocal();
      });
  },
  
  // ==================== CARGAR DESDE GITHUB CSV ====================
  cargarDesdeGitHub: function() {
    return new Promise((resolve, reject) => {
      this.obtenerUltimaVersionCSV()
        .then(versionHash => {
          console.log('🔄 Última versión CSV:', versionHash.substring(0, 8));
          
          const urlConVersion = this.csvURL + '?v=' + versionHash;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error('Timeout: El servidor tardó demasiado'));
          }, this.config.timeout);
          
          fetch(urlConVersion, { signal: controller.signal })
            .then(response => {
              clearTimeout(timeoutId);
              
              if (!response.ok) {
                throw new Error('Error HTTP ' + response.status + ': ' + response.statusText);
              }
              
              return response.text();
            })
            .then(csvText => {
              if (!csvText || csvText.trim().length === 0) {
                throw new Error('CSV vacío recibido');
              }
              
              console.log('📄 CSV recibido (' + csvText.length + ' caracteres)');
              this.procesarCSV(csvText);
              this.ultimaVersionCSV = versionHash;
              resolve();
            })
            .catch(error => {
              clearTimeout(timeoutId);
              console.error('❌ Fetch error:', error);
              reject(error);
            });
        })
        .catch(error => {
          console.warn('⚠️ No se pudo obtener versión, usando timestamp:', error.message);
          const urlConTimestamp = this.csvURL + '?t=' + Date.now();
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error('Timeout: El servidor tardó demasiado'));
          }, this.config.timeout);
          
          fetch(urlConTimestamp, { signal: controller.signal })
            .then(response => {
              clearTimeout(timeoutId);
              if (!response.ok) throw new Error('Error HTTP ' + response.status);
              return response.text();
            })
            .then(csvText => {
              if (!csvText) throw new Error('CSV vacío');
              this.procesarCSV(csvText);
              resolve();
            })
            .catch(err => {
              clearTimeout(timeoutId);
              reject(err);
            });
        });
    });
  },
  
  // ==================== OBTENER ÚLTIMA VERSIÓN CSV ====================
  obtenerUltimaVersionCSV: function() {
    return new Promise((resolve, reject) => {
      // AJUSTAR A TU REPOSITORIO
      const apiURL = 'https://api.github.com/repos/kikin-innovations/mexico/commits?path=productos.csv&per_page=1';
      
      fetch(apiURL)
        .then(response => {
          if (!response.ok) {
            reject(new Error('No se pudo obtener versión de GitHub'));
            return;
          }
          return response.json();
        })
        .then(data => {
          if (data && data[0] && data[0].sha) {
            resolve(data[0].sha);
          } else {
            reject(new Error('No se encontró información de versión'));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  
  // ==================== VERIFICAR ACTUALIZACIONES ====================
  verificarActualizaciones: function() {
    console.log('🔍 Verificando actualizaciones en segundo plano...');
    
    this.obtenerUltimaVersionCSV()
      .then(nuevaVersion => {
        const versionActual = this.ultimaVersionCSV || localStorage.getItem('csvVersionHash');
        
        if (versionActual && versionActual !== nuevaVersion) {
          console.log('🔄 ¡Hay una nueva versión del CSV! Actualizando...');
          
          this.cargarDesdeGitHub()
            .then(() => {
              this.guardarEnCache();
              this.generarCategorias();
              
              window.dispatchEvent(new CustomEvent('catalogoActualizado', {
                detail: {
                  productos: this.productos,
                  categorias: this.categorias,
                  fuente: 'github',
                  timestamp: Date.now(),
                  nuevaVersion: true
                }
              }));
              
              console.log('✅ Catálogo actualizado a nueva versión');
              if (typeof showCartToast === 'function') {
                showCartToast('¡Catálogo actualizado!');
              }
            })
            .catch(err => {
              console.log('⚠️ No se pudo actualizar:', err.message);
            });
        } else {
          console.log('📊 CSV ya está actualizado');
        }
      })
      .catch(error => {
        console.log('ℹ️ No se pudo verificar actualizaciones:', error.message);
      });
  },
  
  // ==================== PROCESAR CSV ====================
  procesarCSV: function(csvText) {
    this.productos = [];
    
    if (csvText.length > 0) {
      const preview = csvText.substring(0, 200).replace(/\n/g, ' ');
      console.log('👁️ Preview CSV:', preview + '...');
    }
    
    const lineas = csvText.split('\n').filter(linea => linea.trim() !== '');
    
    if (lineas.length < 2) {
      console.error('❌ CSV tiene menos de 2 líneas');
      throw new Error('CSV vacío o sin datos');
    }
    
    console.log('📊 Líneas en CSV:', lineas.length);
    
    // Encabezados
    const encabezados = lineas[0].split(',').map(h => {
      return h.trim()
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_');
    });
    
    console.log('🏷️ Encabezados detectados:', encabezados);
    
    // Buscar índices de columnas
    const idxId = this.obtenerIndice(encabezados, ['id', 'codigo', 'numero']);
    const idxNombre = this.obtenerIndice(encabezados, ['nombre', 'name', 'producto']);
    const idxCategoria = this.obtenerIndice(encabezados, ['categoria', 'category', 'tipo']);
    const idxPrecio = this.obtenerIndice(encabezados, ['precio', 'price', 'costo', 'precio_mxn']);
    const idxImagen = this.obtenerIndice(encabezados, ['imagen', 'image', 'foto', 'url']);
    const idxDescripcion = this.obtenerIndice(encabezados, ['descripcion', 'description']);
    const idxMarca = this.obtenerIndice(encabezados, ['marca', 'brand']);
    const idxOrigen = this.obtenerIndice(encabezados, ['origen', 'origin', 'pais']);
    const idxStock = this.obtenerIndice(encabezados, ['stock', 'cantidad']);
    const idxActivo = this.obtenerIndice(encabezados, ['activo', 'active']);
    
    console.log('📍 Índices encontrados:', {
      id: idxId, nombre: idxNombre, categoria: idxCategoria,
      precio: idxPrecio, imagen: idxImagen, descripcion: idxDescripcion,
      marca: idxMarca, origen: idxOrigen, stock: idxStock, activo: idxActivo
    });
    
    // Procesar productos
    let productosProcesados = 0;
    let productosError = 0;
    let productosInactivos = 0;
    
    for (let i = 1; i < lineas.length; i++) {
      try {
        const valores = this.parsearLineaCSV(lineas[i]);
        
        const minColumnas = Math.max(idxId, idxNombre, idxPrecio, idxImagen, 0) + 1;
        if (valores.length < minColumnas) {
          console.warn(`⚠️ Línea ${i+1} ignorada - pocas columnas (${valores.length} < ${minColumnas})`);
          productosError++;
          continue;
        }
        
        // Obtener valores
        const idVal = valores[idxId] || (i).toString();
        const nombreVal = valores[idxNombre] || 'Producto ' + i;
        const categoriaVal = valores[idxCategoria] || 'General';
        const precioVal = valores[idxPrecio] || '0';
        const imagenVal = valores[idxImagen] || 'https://via.placeholder.com/300x300/E8F5E8/2C5530?text=KIKIN';
        const descripcionVal = valores[idxDescripcion] || '';
        const marcaVal = valores[idxMarca] || '';
        const origenVal = valores[idxOrigen] || 'Importado';
        const stockVal = valores[idxStock] || '1';
        const activoVal = valores[idxActivo] || 'true';
        
        // Limpiar y convertir
        const id = parseInt(idVal) || i;
        const nombre = this.limpiarTexto(nombreVal);
        const categoria = this.limpiarTexto(categoriaVal);
        const precio = parseFloat(precioVal.replace(/[^0-9.]/g, '')) || 0;
        const imagen = this.limpiarURL(imagenVal);
        const descripcion = this.limpiarTexto(descripcionVal);
        const marca = this.limpiarTexto(marcaVal);
        const origen = this.limpiarTexto(origenVal);
        const stock = parseInt(stockVal) || 0;
        
        // Determinar disponibilidad
        const estaActivo = this.esActivo(activoVal);
        const tieneStock = stock > 0;
        const disponible = estaActivo && tieneStock;
        
        // Crear producto (estructura para México)
        const producto = {
          id: id,
          name: nombre,
          price: precio,
          image: imagen,
          description: descripcion,
          specificDetails: marca ? `${marca} • ${origen}` : origen,
          category: categoria,
          department: 'mercado',
          stock: stock,
          status: disponible ? 'available' : 'unavailable',
          brand: marca,
          origin: origen,
          requiresRefrigeration: descripcion.toLowerCase().includes('refrigerado') || false
        };
        
        if (producto.name && producto.name !== 'Producto ' + i && producto.price > 0) {
          this.productos.push(producto);
          productosProcesados++;
          
          if (!disponible) {
            productosInactivos++;
          }
        } else {
          productosError++;
        }
        
      } catch (error) {
        console.error(`❌ Error procesando línea ${i+1}:`, error.message);
        productosError++;
      }
    }
    
    console.log(`📈 Resultado: ${productosProcesados} productos OK, ${productosError} errores, ${productosInactivos} inactivos`);
    
    if (this.productos.length === 0) {
      throw new Error('No se pudo procesar ningún producto del CSV');
    }
  },
  
  // ==================== PARSER CSV ====================
  parsearLineaCSV: function(linea) {
    const valores = [];
    let dentroDeComillas = false;
    let valorActual = '';
    
    for (let i = 0; i < linea.length; i++) {
      const char = linea[i];
      
      if (char === '"') {
        dentroDeComillas = !dentroDeComillas;
      } else if (char === ',' && !dentroDeComillas) {
        valores.push(valorActual.trim());
        valorActual = '';
      } else {
        valorActual += char;
      }
    }
    
    valores.push(valorActual.trim());
    return valores;
  },
  
  // ==================== FUNCIONES AUXILIARES ====================
  obtenerIndice: function(encabezados, nombresPosibles) {
    for (const nombre of nombresPosibles) {
      const idx = encabezados.indexOf(nombre);
      if (idx !== -1) return idx;
    }
    
    for (const nombre of nombresPosibles) {
      for (let i = 0; i < encabezados.length; i++) {
        if (encabezados[i].includes(nombre) || nombre.includes(encabezados[i])) {
          return i;
        }
      }
    }
    return -1;
  },
  
  limpiarTexto: function(texto) {
    if (!texto || texto === 'null' || texto === 'undefined') return '';
    
    let textoLimpio = texto.toString();
    
    const reemplazos = {
      'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
      'Ã±': 'ñ', 'Ã¼': 'ü', 'Ã': 'Á', 'Ã‰': 'É', 'Ã': 'Í',
      'Ã“': 'Ó', 'Ãš': 'Ú', 'Ã‘': 'Ñ', 'Ãœ': 'Ü',
      'Â¿': '¿', 'Â¡': '¡', 'Ã§': 'ç', 'Ã£': 'ã'
    };
    
    for (const [mal, bien] of Object.entries(reemplazos)) {
      textoLimpio = textoLimpio.replace(new RegExp(mal, 'g'), bien);
    }
    
    try {
      textoLimpio = decodeURIComponent(escape(textoLimpio));
    } catch (e) {}
    
    return textoLimpio.trim();
  },
  
  limpiarURL: function(url) {
    if (!url || url === 'null' || url === 'undefined') {
      return 'https://via.placeholder.com/300x300/E8F5E8/2C5530?text=KIKIN+Innoventions';
    }
    
    let urlLimpia = url.toString().trim();
    
    if (!urlLimpia.startsWith('http://') && !urlLimpia.startsWith('https://')) {
      urlLimpia = 'https://' + urlLimpia;
    }
    
    return urlLimpia;
  },
  
  esActivo: function(valor) {
    if (!valor) return true;
    
    const valorStr = valor.toString().toLowerCase().trim();
    const activos = ['true', 't', 'yes', 'y', 'si', 'sí', '1', 'activado', 'on'];
    const inactivos = ['false', 'f', 'no', 'n', '0', 'desactivado', 'off'];
    
    if (activos.includes(valorStr)) return true;
    if (inactivos.includes(valorStr)) return false;
    
    return true;
  },
  
  // ==================== CACHÉ ====================
  cargarDesdeCache: function() {
    try {
      const cacheKey = 'catalogoCache_KIKIN_MX';
      const versionKey = 'csvVersionHash_KIKIN';
      const cache = localStorage.getItem(cacheKey);
      const versionCache = localStorage.getItem(versionKey);
      
      if (!cache) {
        console.log('💭 No hay caché previo');
        return false;
      }
      
      const data = JSON.parse(cache);
      
      if (data.version !== this.config.version) {
        console.log('🔄 Versión de código diferente, ignorando caché');
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(versionKey);
        return false;
      }
      
      const horasCache = this.config.cacheHoras;
      const msCache = horasCache * 60 * 60 * 1000;
      const cacheValido = Date.now() - data.timestamp < msCache;
      
      if (cacheValido && data.productos && data.productos.length > 0) {
        this.productos = data.productos;
        this.categorias = data.categorias || [];
        this.fuente = 'cache';
        this.ultimaVersionCSV = versionCache;
        return true;
      } else {
        console.log('⏰ Caché expirado o inválido');
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(versionKey);
      }
    } catch (e) {
      console.warn('⚠️ Error leyendo caché:', e.message);
      try {
        localStorage.removeItem('catalogoCache_KIKIN_MX');
        localStorage.removeItem('csvVersionHash_KIKIN');
      } catch (e2) {}
    }
    return false;
  },
  
  guardarEnCache: function() {
    try {
      const cacheData = {
        productos: this.productos,
        categorias: this.categorias,
        timestamp: Date.now(),
        version: this.config.version,
        fuente: this.fuente
      };
      
      localStorage.setItem('catalogoCache_KIKIN_MX', JSON.stringify(cacheData));
      
      if (this.ultimaVersionCSV) {
        localStorage.setItem('csvVersionHash_KIKIN', this.ultimaVersionCSV);
      }
      
      console.log('💾 Catálogo guardado en caché (válido por ' + this.config.cacheHoras + ' horas)');
    } catch (e) {
      console.warn('No se pudo guardar en caché');
    }
  },
  
  // ==================== RESPALDO LOCAL ====================
  usarRespaldoLocal: function() {
    console.log('🔄 Intentando cargar respaldo local...');
    
    if (typeof window.catalogo !== 'undefined' && window.catalogo.productos) {
      this.productos = window.catalogo.productos;
      this.fuente = 'local';
      this.finalizarCarga();
      console.log('🛡️ Catálogo cargado desde respaldo local');
      return;
    }
    
    this.crearCatalogoEmergencia();
  },
  
  crearCatalogoEmergencia: function() {
    console.log('🚨 Creando catálogo de emergencia para México...');
    
    this.productos = [
      {
        id: 1,
        name: "Café Geisha de Panamá",
        price: 850,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
        description: "Café de altísima calidad, considerado el mejor del mundo",
        specificDetails: "Hacienda Esmeralda • Panamá",
        category: "Café Especial",
        department: "mercado",
        stock: 10,
        status: "available",
        brand: "Hacienda Esmeralda",
        origin: "Panamá"
      },
      {
        id: 2,
        name: "Aceite de Oliva Extra Virgen",
        price: 450,
        image: "https://images.unsplash.com/photo-1533050487297-09b450131914?w-400",
        description: "Primera prensada en frío, intenso aroma afrutado",
        specificDetails: "Carbonell • España",
        category: "Aceites",
        department: "mercado",
        stock: 15,
        status: "available",
        brand: "Carbonell",
        origin: "España"
      },
      {
        id: 3,
        name: "Chocolate Belga 85% Cacao",
        price: 320,
        image: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=400",
        description: "Chocolate artesanal con alto porcentaje de cacao",
        specificDetails: "Callebaut • Bélgica",
        category: "Chocolates",
        department: "mercado",
        stock: 20,
        status: "available",
        brand: "Callebaut",
        origin: "Bélgica"
      }
    ];
    
    this.fuente = 'emergencia';
    this.finalizarCarga();
    console.log('🆘 Catálogo de emergencia creado (3 productos premium)');
  },
  
  // ==================== FINALIZAR CARGA ====================
  finalizarCarga: function() {
    this.cargado = true;
    this.generarCategorias();
    this.despacharEventoCarga();
    
    console.log('🎉 Catálogo ' + this.fuente + ' listo:', this.productos.length, 'productos');
    
    const fuenteDisplay = {
      'github': '🌐 GitHub CSV',
      'cache': '💾 Caché Local',
      'local': '🛡️ Respaldo Local',
      'emergencia': '🚨 Emergencia',
      'none': '❓ Desconocida'
    };
    
    console.log('📊 Fuente:', fuenteDisplay[this.fuente] || this.fuente);
  },
  
  // ==================== CATEGORÍAS ====================
  generarCategorias: function() {
    const cats = new Set();
    this.productos.forEach(p => {
      if (p.category && p.category.trim() !== '') {
        cats.add(p.category);
      }
    });
    this.categorias = Array.from(cats).sort();
    console.log('🏷️ Categorías generadas:', this.categorias.length);
  },
  
  // ==================== AUTO-REFRESCO ====================
  iniciarAutoRefresco: function() {
    const minutos = this.config.autoRefresh;
    const msRefresh = minutos * 60 * 1000;
    
    console.log('🔄 Auto-refresco configurado cada ' + minutos + ' minutos');
    
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Actualizando catálogo en segundo plano...');
        this.verificarActualizaciones();
      }
    }, msRefresh);
  },
  
  // ==================== EVENTOS ====================
  despacharEventoCarga: function() {
    const event = new CustomEvent('catalogoCargado', {
      detail: {
        productos: this.productos,
        categorias: this.categorias,
        fuente: this.fuente,
        timestamp: Date.now(),
        totalProductos: this.productos.length,
        versionCSV: this.ultimaVersionCSV,
        currency: this.config.currency
      }
    });
    window.dispatchEvent(event);
  },
  
  // ==================== MÉTODOS DE CONSULTA ====================
  obtenerPorId: function(id) {
    return this.productos.find(p => p.id === id);
  },
  
  obtenerPorCategoria: function(categoria) {
    return this.productos.filter(p => p.category === categoria);
  },
  
  obtenerTodos: function() {
    return this.productos;
  },
  
  obtenerCategorias: function() {
    return this.categorias;
  },
  
  buscarProductos: function(termino) {
    if (!termino || termino.trim() === '') return this.productos;
    
    const busqueda = this.limpiarTexto(termino).toLowerCase();
    return this.productos.filter(p =>
      this.limpiarTexto(p.name).toLowerCase().includes(busqueda) ||
      this.limpiarTexto(p.description).toLowerCase().includes(busqueda) ||
      this.limpiarTexto(p.category).toLowerCase().includes(busqueda) ||
      (p.brand && this.limpiarTexto(p.brand).toLowerCase().includes(busqueda)) ||
      (p.origin && this.limpiarTexto(p.origin).toLowerCase().includes(busqueda))
    );
  },
  
  // ==================== ZONAS DE ENTREGA ====================
  obtenerZonaPorId: function(zonaId) {
    return this.zonasEntrega.find(z => z.id === zonaId);
  },
  
  // ==================== INFORMACIÓN DEL SISTEMA ====================
  getInfo: function() {
    return {
      version: this.config.version,
      cargado: this.cargado,
      fuente: this.fuente,
      totalProductos: this.productos.length,
      totalCategorias: this.categorias.length,
      urlCSV: this.csvURL,
      cacheHoras: this.config.cacheHoras,
      ultimaVersionCSV: this.ultimaVersionCSV,
      currency: this.config.currency,
      taxRate: this.config.taxRate
    };
  },
  
  // ==================== FORZAR RECARGA ====================
  forzarRecarga: function() {
    console.log('🔄 Forzando recarga del catálogo...');
    this.cargado = false;
    this.productos = [];
    this.categorias = [];
    
    try {
      localStorage.removeItem('catalogoCache_KIKIN_MX');
      localStorage.removeItem('csvVersionHash_KIKIN');
    } catch (e) {}
    
    this.inicializar();
    return true;
  },
  
  // ==================== ACTUALIZACIÓN MANUAL ====================
  actualizarAhora: function() {
    console.log('⚡ Actualización manual solicitada...');
    return this.cargarDesdeGitHub()
      .then(() => {
        this.guardarEnCache();
        this.finalizarCarga();
        console.log('✅ Catálogo actualizado manualmente');
        return true;
      })
      .catch(error => {
        console.error('❌ Error en actualización manual:', error);
        return false;
      });
  }
};

// ==================== INICIALIZACIÓN AUTOMÁTICA ====================
(function() {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('📄 DOM listo - Iniciando KIKIN Innoventions...');
      CatalogoDinamico.inicializar();
    });
  } else {
    console.log('📄 DOM ya listo - Iniciando KIKIN Innoventions...');
    CatalogoDinamico.inicializar();
  }
  
  // Métodos globales
  window.iniciarCatalogo = function() {
    console.log('🔄 Iniciando catálogo manualmente...');
    CatalogoDinamico.inicializar();
  };
  
  window.actualizarCatalogo = function() {
    console.log('🔄 Actualizando catálogo manualmente...');
    return CatalogoDinamico.actualizarAhora();
  };
})();

// ==================== HACER DISPONIBLE GLOBALMENTE ====================
window.CatalogoDinamico = CatalogoDinamico;

// ==================== FALBACK ULTRA-RÁPIDO ====================
setTimeout(function() {
  if (!CatalogoDinamico.cargado || CatalogoDinamico.productos.length === 0) {
    console.log('⏱️  Timeout: Catálogo no cargó en 10 segundos');
    
    if (CatalogoDinamico.productos.length === 0) {
      CatalogoDinamico.crearCatalogoEmergencia();
    }
  }
}, 10000);


console.log('✅ catalogo-dinamico-mx.js v2.0 cargado y listo para KIKIN Innoventions');
