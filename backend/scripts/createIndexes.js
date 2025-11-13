#!/usr/bin/env node
/**
 * Script para crear índices en MongoDB
 * 
 * Uso: node scripts/createIndexes.js
 * 
 * Este script crea todos los índices necesarios para optimizar queries
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from '../src/models/Tour.js';
import QuizAttempt from '../src/models/QuizAttempt.js';
import UserPreferences from '../src/models/UserPreferences.js';
import ModelVersion from '../src/models/ModelVersion.js';
import Quiz from '../src/models/Quiz.js';
import Institution from '../src/models/Institution.js';
import Monument from '../src/models/Monument.js';

dotenv.config();

async function createIndexes() {
  try {
    console.log('\n🔧 Creating database indexes...\n');
    console.log(`MongoDB URI: ${process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***@')}`);
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Crear índices para cada modelo
    const models = [
      { name: 'Tour', model: Tour },
      { name: 'QuizAttempt', model: QuizAttempt },
      { name: 'UserPreferences', model: UserPreferences },
      { name: 'ModelVersion', model: ModelVersion },
      { name: 'Quiz', model: Quiz },
      { name: 'Institution', model: Institution },
      { name: 'Monument', model: Monument }
    ];

    for (const { name, model } of models) {
      try {
        console.log(`Creating indexes for ${name}...`);
        await model.createIndexes();
        console.log(`✓ ${name} indexes created`);
      } catch (error) {
        console.error(`✗ Error creating indexes for ${name}:`, error.message);
      }
    }

    console.log('\n✓ All indexes created successfully!\n');
    
    // Mostrar información de índices
    console.log('Index information:');
    for (const { name, model } of models) {
      const indexes = await model.collection.getIndexes();
      console.log(`\n${name}:`);
      Object.keys(indexes).forEach(indexName => {
        console.log(`  - ${indexName}`);
      });
    }

  } catch (error) {
    console.error('\n✗ Error creating indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Connection closed');
  }
}

// Verificar que MONGODB_URI esté configurado
if (!process.env.MONGODB_URI) {
  console.error('✗ Error: MONGODB_URI environment variable is not set');
  console.error('Please configure your .env file with MONGODB_URI');
  process.exit(1);
}

createIndexes();
