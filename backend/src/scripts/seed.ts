import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Sede } from '../models/Sede';
import { Service } from '../models/Service';
import { Schedule } from '../models/Schedule';
import { Appointment } from '../models/Appointment';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('🧹 Limpiando DB...');
  await User.deleteMany({});
  await Sede.deleteMany({});
  await Service.deleteMany({});
  await Schedule.deleteMany({});
  await Appointment.deleteMany({});

  console.log('🌱 Sembrando datos...');

  // 1. Usuarios
  const admin = await User.create({
    email: 'admin@kinaf.com', password: 'admin123', firstName: 'Admin', lastName: 'User', role: 'admin'
  });

  const pro = await User.create({
    email: 'pro@kinaf.com', password: 'pro123', firstName: 'Juan', lastName: 'Kinesiologo', role: 'professional'
  });

  const client = await User.create({
    email: 'cliente@kinaf.com', password: 'client123', firstName: 'Maria', lastName: 'Cliente', role: 'client'
  });

  // 2. Sedes
  const sedes = await Sede.create([
    { name: 'Kinaf Central', slug: 'central', address: 'Calle Falsa 123' },
    { name: 'Kinaf Club', slug: 'club', address: 'Av. Siempre Viva 742' }
  ]);

  // 3. Servicios
  const services = await Service.create([
    { name: 'Kinesiología', duration: 60, price: 5000 },
    { name: 'Pilates', duration: 60, price: 3000 }
  ]);

  // 4. Horarios (Schedule) - El Pro trabaja Lun-Vie 09-17 en Central haciendo Kinesio
  const days = [1, 2, 3, 4, 5]; // Lun a Vie
  const schedules = days.map(day => ({
    professionalId: pro._id,
    sedeId: sedes[0]._id, // Central
    serviceId: services[0]._id, // Kinesio
    dayOfWeek: day,
    startTime: '09:00',
    endTime: '17:00'
  }));
  await Schedule.insertMany(schedules);

  console.log('✅ Datos actualizados con Horarios y Profesionales');
  process.exit(0);
};
seed();
