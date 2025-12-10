import mongoose from 'mongoose';
import Category from '../models/Category.js';
import { config } from 'dotenv';

config();

const sampleCategories = [
  {
    name: 'Arqueológico',
    description: 'Sitios y monumentos de culturas precolombinas y arqueológicas',
    color: '#8B5CF6',
    icon: 'Castle',
    isActive: true
  },
  {
    name: 'Colonial',
    description: 'Arquitectura y monumentos del período colonial español',
    color: '#F59E0B',
    icon: 'Church',
    isActive: true
  },
  {
    name: 'Republicano',
    description: 'Monumentos y edificaciones del período republicano',
    color: '#10B981',
    icon: 'Landmark',
    isActive: true
  },
  {
    name: 'Contemporáneo',
    description: 'Monumentos y sitios de interés histórico moderno',
    color: '#3B82F6',
    icon: 'Building',
    isActive: true
  }
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Create sample categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`Created ${categories.length} categories:`);

    categories.forEach(category => {
      console.log(`- ${category.name} (${category.color}) - ${category.icon}`);
    });

    return categories;

  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Ejecutar si se llama directamente
seedCategories();

export default seedCategories;