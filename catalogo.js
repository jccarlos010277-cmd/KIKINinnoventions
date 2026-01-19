// catalogo-mx.js - Catálogo de respaldo para KIKIN Innoventions México

const catalogo = {
  productos: [
    // --- CAFÉS ESPECIALES ---
    { id: 1, name: 'Café Geisha de Panamá', price: 850, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", description: 'Café de altísima calidad, considerado el mejor del mundo.', specificDetails: 'Hacienda Esmeralda • Panamá', category: 'Cafés Especiales', department: 'mercado', status: 'available' },
    { id: 2, name: 'Café Blue Mountain Jamaica', price: 720, image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=400", description: 'Café suave y aromático de las montañas de Jamaica.', specificDetails: 'Wallensford • Jamaica', category: 'Cafés Especiales', department: 'mercado', status: 'available' },
    { id: 3, name: 'Café Etiopía Yirgacheffe', price: 380, image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400", description: 'Café africano con notas florales y cítricas.', specificDetails: 'Origen Directo • Etiopía', category: 'Cafés Especiales', department: 'mercado', status: 'available' },
    
    // --- CHOCOLATES PREMIUM ---
    { id: 4, name: 'Chocolate Belga 85% Cacao', price: 320, image: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=400", description: 'Chocolate artesanal con alto porcentaje de cacao.', specificDetails: 'Callebaut • Bélgica', category: 'Chocolates Premium', department: 'mercado', status: 'available' },
    { id: 5, name: 'Chocolate Suizo Lindt', price: 280, image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400", description: 'Chocolate suave y cremoso de la famosa marca suiza.', specificDetails: 'Lindt • Suiza', category: 'Chocolates Premium', department: 'mercado', status: 'available' },
    { id: 6, name: 'Chocolate Francés Valrhona', price: 420, image: "https://images.unsplash.com/photo-1606313564209-5d1d5d2d8b24?w=400", description: 'Chocolate de pastelería profesional de alta calidad.', specificDetails: 'Valrhona • Francia', category: 'Chocolates Premium', department: 'mercado', status: 'available' },
    
    // --- ACEITES Y VINAGRES ---
    { id: 7, name: 'Aceite de Oliva Extra Virgen', price: 450, image: "https://images.unsplash.com/photo-1533050487297-09b450131914?w=400", description: 'Primera prensada en frío, intenso aroma afrutado.', specificDetails: 'Carbonell • España', category: 'Aceites y Vinagres', department: 'mercado', status: 'available' },
    { id: 8, name: 'Aceite de Trufa Blanca', price: 890, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", description: 'Aceite infusionado con trufas blancas italianas.', specificDetails: 'Urbani • Italia', category: 'Aceites y Vinagres', department: 'mercado', status: 'available' },
    { id: 9, name: 'Vinagre Balsámico de Módena', price: 580, image: "https://images.unsplash.com/photo-1589923186741-7d1d6ccee3c3?w=400", description: 'Vinagre envejecido 12 años, denso y aromático.', specificDetails: 'Acetaia • Italia', category: 'Aceites y Vinagres', department: 'mercado', status: 'available' },
    
    // --- ESPECIAS Y CONDIMENTOS ---
    { id: 10, name: 'Azafrán Español', price: 1250, image: "https://images.unsplash.com/photo-1596048502285-0d21e8f0e4c2?w=400", description: 'Azafrán puro de La Mancha, el mejor del mundo.', specificDetails: 'DOP La Mancha • España', category: 'Especias y Condimentos', department: 'mercado', status: 'available' },
    { id: 11, name: 'Pimienta Negra de Tellicherry', price: 320, image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400", description: 'Pimienta gorda de la costa de Malabar, India.', specificDetails: 'Origen India • Grano entero', category: 'Especias y Condimentos', department: 'mercado', status: 'available' },
    { id: 12, name: 'Sal Maldon', price: 280, image: "https://images.unsplash.com/photo-1559838814-7d4d6d8b8c0b?w=400", description: 'Sal en escamas naturales de Inglaterra.', specificDetails: 'Maldon • Reino Unido', category: 'Especias y Condimentos', department: 'mercado', status: 'available' },
    
    // --- QUESOS INTERNACIONALES ---
    { id: 13, name: 'Queso Parmesano Reggiano', price: 680, image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=400", description: 'Queso italiano añejado 24 meses, DOP certificado.', specificDetails: 'Reggiano • Italia', category: 'Quesos Internacionales', department: 'mercado', status: 'available' },
    { id: 14, name: 'Queso Brie Francés', price: 420, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", description: 'Queso cremoso de pasta blanda con corteza comestible.', specificDetails: 'Fromagerie • Francia', category: 'Quesos Internacionales', department: 'mercado', status: 'available' },
    { id: 15, name: 'Queso Manchego Español', price: 520, image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400", description: 'Queso de oveja manchego añejado 6 meses.', specificDetails: 'DOP Manchego • España', category: 'Quesos Internacionales', department: 'mercado', status: 'available' },
    
    // --- VINOS Y ESPUMOSOS ---
    { id: 16, name: 'Vino Tinto Rioja Reserva', price: 850, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400", description: 'Rioja reserva 2018, añejado en barrica de roble.', specificDetails: 'DOCa Rioja • España', category: 'Vinos y Espumosos', department: 'mercado', status: 'available' },
    { id: 17, name: 'Champagne Brut', price: 1250, image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400", description: 'Champagne francés brut, perfecto para celebraciones.', specificDetails: 'AOC Champagne • Francia', category: 'Vinos y Espumosos', department: 'mercado', status: 'available' },
    { id: 18, name: 'Vino Blanco Sauvignon Blanc', price: 480, image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400", description: 'Vino blanco chileno fresco con notas cítricas.', specificDetails: 'Valle de Casablanca • Chile', category: 'Vinos y Espumosos', department: 'mercado', status: 'available' },
    
    // --- SNACKS GOURMET ---
    { id: 19, name: 'Trufas de Chocolate', price: 380, image: "https://images.unsplash.com/photo-1590099033615-be195f8d575c?w=400", description: 'Trufas artesanales rellenas de ganache de chocolate.', specificDetails: 'Artisanal • 12 unidades', category: 'Snacks Gourmet', department: 'mercado', status: 'available' },
    { id: 20, name: 'Galletas Francesas de Mantequilla', price: 220, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", description: 'Galletas sablés francesas con mantequilla de Normandía.', specificDetails: 'Bretón • Francia', category: 'Snacks Gourmet', department: 'mercado', status: 'available' },
    { id: 21, name: 'Almendras Marcona Tostadas', price: 320, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", description: 'Almendras españolas tostadas con sal marina.', specificDetails: 'Marcona • España', category: 'Snacks Gourmet', department: 'mercado', status: 'available' },
    
    // --- PRODUCTOS ORGÁNICOS ---
    { id: 22, name: 'Miel Orgánica de Manuka', price: 950, image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400", description: 'Miel de Nueva Zelanda con propiedades beneficiosas.', specificDetails: 'UMF 10+ • Nueva Zelanda', category: 'Productos Orgánicos', department: 'mercado', status: 'available' },
    { id: 23, name: 'Mermelada Orgánica de Frutos Rojos', price: 280, image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400", description: 'Mermelada sin conservantes, 100% fruta.', specificDetails: 'Certificado Orgánico • Francia', category: 'Productos Orgánicos', department: 'mercado', status: 'available' },
    { id: 24, name: 'Té Verde Matcha Orgánico', price: 420, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", description: 'Matcha ceremonial grado premium de Japón.', specificDetails: 'Uji • Japón', category: 'Productos Orgánicos', department: 'mercado', status: 'available' },
    
    // --- PANADERÍA Y REPOSTERÍA ---
    { id: 25, name: 'Pan Brioche Artesanal', price: 180, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", description: 'Pan brioche esponjoso con mantequilla francesa.', specificDetails: 'Hecho diario • Francia', category: 'Panadería y Repostería', department: 'mercado', status: 'available' },
    { id: 26, name: 'Croissants de Mantequilla', price: 45, image: "https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=400", description: 'Croissants artesanales con mantequilla AOP.', specificDetails: 'Unidad • Francia', category: 'Panadería y Repostería', department: 'mercado', status: 'available' },
    { id: 27, name: 'Macarons Franceses', price: 320, image: "https://images.unsplash.com/photo-1569929238190-869826b1bb05?w=400", description: 'Caja de 6 macarons con sabores variados.', specificDetails: 'Ladurée • Francia', category: 'Panadería y Repostería', department: 'mercado', status: 'available' },
    
    // --- BEBIDAS NO ALCOHÓLICAS ---
    { id: 28, name: 'Agua Mineral Fiji', price: 85, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400", description: 'Agua natural de acuífero subterráneo en Fiji.', specificDetails: 'Fiji Water • Islas Fiji', category: 'Bebidas No Alcohólicas', department: 'mercado', status: 'available' },
    { id: 29, name: 'Jugo de Naranja Recién Exprimido', price: 120, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400", description: 'Jugo fresco sin conservantes ni aditivos.', specificDetails: 'Presión en frío • 1L', category: 'Bebidas No Alcohólicas', department: 'mercado', status: 'available' },
    { id: 30, name: 'Té Helado Artesanal', price: 95, image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400", description: 'Té negro infusionado con frutas naturales.', specificDetails: 'Botella 500ml • Sin azúcar', category: 'Bebidas No Alcohólicas', department: 'mercado', status: 'available' },
    
    // --- CARNES Y EMBUTIDOS ---
    { id: 31, name: 'Jamón Ibérico de Bellota', price: 1850, image: "https://images.unsplash.com/photo-1602471619520-38a0a8ce23ee?w=400", description: 'Jamón 100% ibérico de bellota, curado 36 meses.', specificDetails: 'D.O. Jabugo • España', category: 'Carnes y Embutidos', department: 'mercado', status: 'available' },
    { id: 32, name: 'Salmón Noruego Ahumado', price: 680, image: "https://images.unsplash.com/photo-1599084993091-1cd6c3e8aaa4?w=400", description: 'Salmón salvaje de Noruega ahumado en frío.', specificDetails: 'Norway Royal Salmon • Noruega', category: 'Carnes y Embutidos', department: 'mercado', status: 'available' },
    { id: 33, name: 'Prosciutto di Parma', price: 720, image: "https://images.unsplash.com/photo-1604503468505-6f8c7e6f8c7e?w=400", description: 'Jamón crudo italiano curado 18 meses.', specificDetails: 'DOP Parma • Italia', category: 'Carnes y Embutidos', department: 'mercado', status: 'available' },
    
    // --- PRODUCTOS SIN GLUTEN ---
    { id: 34, name: 'Pasta Sin Gluten', price: 180, image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400", description: 'Pasta de arroz y maíz, ideal para celíacos.', specificDetails: 'Certificado Sin Gluten • Italia', category: 'Productos Sin Gluten', department: 'mercado', status: 'available' },
    { id: 35, name: 'Harina de Almendra', price: 320, image: "https://images.unsplash.com/photo-1623241895006-755b4f5c6c1d?w=400", description: 'Harina fina de almendra para repostería.', specificDetails: 'Sin Gluten • USA', category: 'Productos Sin Gluten', department: 'mercado', status: 'available' },
    { id: 36, name: 'Galletas Sin Gluten', price: 220, image: "https://images.unsplash.com/photo-1563805042-7684c019e3cb?w=400", description: 'Galletas de avena sin gluten y sin azúcar añadido.', specificDetails: 'Orgánico • Alemania', category: 'Productos Sin Gluten', department: 'mercado', status: 'available' }
  ],

  // Función auxiliar para obtener producto por ID
  obtenerPorId: function(id) {
    return this.productos.find(p => p.id === id);
  }
};

// ✅ Hacer disponible globalmente
window.catalogo = catalogo;
console.log('✅ catálogo-mx.js cargado - 36 productos premium para KIKIN Innoventions');