import mongoose from 'mongoose';
import Institution from '../models/Institution.js';
import { config } from 'dotenv';

config();

const sampleInstitutions = [
  {
    name: 'Museo Nacional de Arqueología, Antropología e Historia del Perú',
    type: 'Museo',
    description: 'El museo más importante del Perú en términos de patrimonio arqueológico y antropológico.',
    district: 'Pueblo Libre',
    address: 'Plaza Bolívar s/n, Pueblo Libre',
    contactEmail: 'informes@mnaahp.cultura.gob.pe',
    phone: '(01) 463-5070',
    website: 'https://mnaahp.cultura.gob.pe',
    schedule: {
      monday: { closed: true },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '09:00', close: '17:00' }
    }
  },
  {
    name: 'Museo Larco',
    type: 'Museo',
    description: 'Museo privado de arte precolombino peruano fundado por Rafael Larco Hoyle.',
    district: 'Pueblo Libre',
    address: 'Av. Simón Bolívar 1515, Pueblo Libre',
    contactEmail: 'info@museolarco.org',
    phone: '(01) 461-1312',
    website: 'https://www.museolarco.org',
    schedule: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '22:00' },
      saturday: { open: '09:00', close: '22:00' },
      sunday: { open: '09:00', close: '22:00' }
    }
  },
  {
    name: 'Municipalidad de Miraflores',
    type: 'Municipalidad',
    description: 'Gobierno local del distrito de Miraflores, encargado de la gestión de sitios arqueológicos locales.',
    district: 'Miraflores',
    address: 'Av. Larco 400, Miraflores',
    contactEmail: 'cultura@miraflores.gob.pe',
    phone: '(01) 617-7272',
    website: 'https://www.miraflores.gob.pe',
    schedule: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    }
  },
  {
    name: 'Universidad Nacional Mayor de San Marcos',
    type: 'Universidad',
    description: 'La universidad más antigua de América, con importantes investigaciones arqueológicas.',
    district: 'Lima Centro',
    address: 'Av. Universitaria s/n, Lima',
    contactEmail: 'arqueologia@unmsm.edu.pe',
    phone: '(01) 619-7000',
    website: 'https://www.unmsm.edu.pe',
    schedule: {
      monday: { open: '07:00', close: '22:00' },
      tuesday: { open: '07:00', close: '22:00' },
      wednesday: { open: '07:00', close: '22:00' },
      thursday: { open: '07:00', close: '22:00' },
      friday: { open: '07:00', close: '22:00' },
      saturday: { open: '08:00', close: '18:00' },
      sunday: { closed: true }
    }
  }
];

async function seedInstitutions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing institutions
    await Institution.deleteMany({});
    console.log('Cleared existing institutions');

    // Create sample institutions
    const institutions = await Institution.insertMany(sampleInstitutions);
    console.log(`Created ${institutions.length} institutions:`);
    
    institutions.forEach(institution => {
      console.log(`- ${institution.name} (${institution.type})`);
    });

  } catch (error) {
    console.error('Error seeding institutions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedInstitutions();