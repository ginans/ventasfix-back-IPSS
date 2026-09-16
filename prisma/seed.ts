import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos Ventas Fix...');

  // 1. Limpiar datos existentes (idempotencia)
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.client.deleteMany();

  // 2. Crear usuarios con roles RBAC estrictos (ADMIN y VIEWER)
  const hashedAdminPassword = await bcrypt.hash('Admin1234!', 10);
  const hashedViewerPassword = await bcrypt.hash('Viewer1234!', 10);

  const usersData = [
    {
      rut: '11.111.111-1',
      nombre: 'Administrador',
      apellido: 'Principal',
      email: 'admin@ventasfix.cl',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
    {
      rut: '12.345.678-5',
      nombre: 'Visualizador',
      apellido: 'Invitado',
      email: 'viewer@ventasfix.cl',
      password: hashedViewerPassword,
      role: 'VIEWER',
    },
    {
      rut: '15.555.555-6',
      nombre: 'Supervisor',
      apellido: 'Operaciones',
      email: 'supervisor@ventasfix.cl',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
    {
      rut: '14.567.890-0',
      nombre: 'Auditor',
      apellido: 'Contable',
      email: 'auditor@ventasfix.cl',
      password: hashedViewerPassword,
      role: 'VIEWER',
    },
  ];

  for (const user of usersData) {
    await prisma.user.create({ data: user });
    console.log(`Usuario creado: ${user.email} (Rol: ${user.role})`);
  }

  // 3. Crear productos de prueba cubriendo los 4 estados de inventario
  const productsData = [
    {
      sku: 'FIX-001',
      nombre: 'Taladro Percutor Inalámbrico 20V',
      descripcionCorta: 'Taladro percutor profesional con 2 baterías de litio y maletín.',
      descripcionLarga: 'Herramienta de alto rendimiento para perforación en concreto, madera y metal. Cuenta con mandril de 13mm, velocidad variable reversible y luz LED integrada.',
      imagen: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=60',
      precioNeto: 100000,
      precioVenta: 119000,
      stockActual: 25,
      stockMinimo: 5,
      stockBajo: 10,
      stockAlto: 50, // NORMAL
    },
    {
      sku: 'FIX-002',
      nombre: 'Sierra Circular 7-1/4 1800W',
      descripcionCorta: 'Sierra circular para corte longitudinal y transversal en madera.',
      descripcionLarga: 'Motor potente de 1800W, disco de 24 dientes de carburo de tungsteno, base de aluminio reforzado y guía láser para cortes de máxima precisión.',
      imagen: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&auto=format&fit=crop&q=60',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/USMC-02963.jpg/500px-USMC-02963.jpg',
      precioNeto: 80000,
      precioVenta: 95200,
      stockActual: 8,
      stockMinimo: 5,
      stockBajo: 10,
      stockAlto: 30, // BAJO
    },
    {
      sku: 'FIX-003',
      nombre: 'Set Llaves de Impacto 1/2 32 Piezas',
      descripcionCorta: 'Juego de dados y chicharra de cromo vanadio de grado industrial.',
      descripcionLarga: 'Set completo para taller mecánico y mantenimiento industrial. Resistente a alto torque con acabado anticorrosivo negro mate.',
      imagen: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=60',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Socket_wrench_and_sockets.JPG/500px-Socket_wrench_and_sockets.JPG',
      precioNeto: 45000,
      precioVenta: 53550,
      stockActual: 3,
      stockMinimo: 5,
      stockBajo: 10,
      stockAlto: 40, // CRITICO
    },
    {
      sku: 'FIX-004',
      nombre: 'Compresor de Aire 50 Litros 2.5HP',
      descripcionCorta: 'Compresor coaxial monofásico para herramientas neumáticas y pintura.',
      descripcionLarga: 'Tanque reforzado de 50L con doble manómetro, regulador de presión, válvula de seguridad y ruedas para fácil transporte.',
      imagen: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/AirCompressorHusky.JPG/500px-AirCompressorHusky.JPG',
      precioNeto: 150000,
      precioVenta: 178500,
      stockActual: 6,
      stockMinimo: 4,
      stockBajo: 8,
      stockAlto: 25, // BAJO
    },
    {
      sku: 'FIX-005',
      nombre: 'Esmeril Angular 4-1/2 850W',
      descripcionCorta: 'Esmeril compacto para desbaste, lijado y corte en metales.',
      descripcionLarga: 'Diseño ergonómico con empuñadura lateral de 2 posiciones, bloqueo de eje para cambio rápido de disco y guarda de protección ajustable.',
      imagen: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=60',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/AngleGrinder.jpg/500px-AngleGrinder.jpg',
      precioNeto: 38000,
      precioVenta: 45220,
      stockActual: 32,
      stockMinimo: 5,
      stockBajo: 10,
      stockAlto: 50, // NORMAL
    },
    {
      sku: 'FIX-006',
      nombre: 'Set Tornillos Autoperforantes 1000u',
      descripcionCorta: 'Caja surtida de fijaciones zincadas con golilla de estanqueidad.',
      descripcionLarga: 'Fijaciones para cubiertas metálicas y estructuras tubulares de acero. Tratamiento térmico de alta resistencia y punta broca reforzada.',
      imagen: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&auto=format&fit=crop&q=60',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Screws.jpg',
      precioNeto: 15000,
      precioVenta: 17850,
      stockActual: 85,
      stockMinimo: 10,
      stockBajo: 20,
      stockAlto: 60, // ALTO
    },
  ];

  for (const product of productsData) {
    await prisma.product.create({ data: product });
  }
  console.log(`Se insertaron ${productsData.length} productos.`);

  // 4. Crear clientes empresa de prueba con RUTs válidos y rubros variados
  const clientsData = [
    {
      rutEmpresa: '76.086.428-5',
      rubro: 'Construcción e Ingeniería',
      razonSocial: 'Constructora Los Andes SpA',
      telefono: '+56 9 8765 4321',
      direccion: 'Av. Providencia 1234, Of. 501, Santiago',
      nombreContacto: 'Carlos Mendoza',
      emailContacto: 'cmendoza@losandes.cl',
    },
    {
      rutEmpresa: '77.654.321-7',
      rubro: 'Minería y Metalurgia',
      razonSocial: 'Servicios Mineros del Norte S.A.',
      telefono: '+56 9 1234 5678',
      direccion: 'Calle Prat 567, Antofagasta',
      nombreContacto: 'Patricia Valenzuela',
      emailContacto: 'pvalenzuela@mineranorte.cl',
    },
    {
      rutEmpresa: '76.543.210-3',
      rubro: 'Transporte y Logística',
      razonSocial: 'Transportes Pacífico Sur Ltda.',
      telefono: '+56 9 3456 7890',
      direccion: 'Ruta 68 Km 12, Pudahuel, Santiago',
      nombreContacto: 'Rodrigo Fuentes',
      emailContacto: 'rfuentes@pacificosur.cl',
    },
    {
      rutEmpresa: '78.987.654-1',
      rubro: 'Mecánica Automotriz',
      razonSocial: 'Taller Central de Flotas SpA',
      telefono: '+56 9 5678 1234',
      direccion: 'Av. Vicuña Mackenna 4321, San Joaquín',
      nombreContacto: 'Andrea Morales',
      emailContacto: 'amorales@tallercentral.cl',
    },
  ];

  for (const client of clientsData) {
    await prisma.client.create({ data: client });
  }
  console.log(`Se insertaron ${clientsData.length} clientes empresa.`);

  console.log('Seed completado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
