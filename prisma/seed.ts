import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos Ventas Fix...');

  // 1. Limpiar datos existentes (idempotencia)
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.client.deleteMany();

  // 2. Crear usuario administrador
  const hashedPassword = await bcrypt.hash('Admin1234!', 10);
  const admin = await prisma.user.create({
    data: {
      rut: '11.111.111-1',
      nombre: 'Administrador',
      apellido: 'VentasFix',
      email: 'admin@ventasfix.cl',
      password: hashedPassword,
    },
  });
  console.log(`Usuario administrador creado: ${admin.email}`);

  // 3. Crear productos de prueba
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
      stockAlto: 50,
    },
    {
      sku: 'FIX-002',
      nombre: 'Sierra Circular 7-1/4 1800W',
      descripcionCorta: 'Sierra circular para corte longitudinal y transversal en madera.',
      descripcionLarga: 'Motor potente de 1800W, disco de 24 dientes de carburo de tungsteno, base de aluminio reforzado y guía láser para cortes de máxima precisión.',
      imagen: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&auto=format&fit=crop&q=60',
      precioNeto: 80000,
      precioVenta: 95200,
      stockActual: 8,
      stockMinimo: 5,
      stockBajo: 10,
      stockAlto: 30,
    },
    {
      sku: 'FIX-003',
      nombre: 'Set Llaves de Impacto 1/2 32 Piezas',
      descripcionCorta: 'Juego de dados y chicharra de cromo vanadio de grado industrial.',
      descripcionLarga: 'Set completo para taller mecánico y mantenimiento industrial. Resistente a alto torque con acabado anticorrosivo negro mate.',
      imagen: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=60',
      precioNeto: 45000,
      precioVenta: 53550,
      stockActual: 3,
      stockMinimo: 5,
      stockBajo: 10,
      stockAlto: 40,
    },
  ];

  for (const product of productsData) {
    await prisma.product.create({ data: product });
  }
  console.log(`Se insertaron ${productsData.length} productos.`);

  // 4. Crear clientes empresa de prueba con RUTs válidos
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

