import Monument from '../models/Monument.js';
import Institution from '../models/Institution.js';
import Tour from '../models/Tour.js';

class LocationService {
  /**
   * Calcular distancia usando fórmula Haversine
   * @param {number} lat1 - Latitud punto 1
   * @param {number} lng1 - Longitud punto 1
   * @param {number} lat2 - Latitud punto 2
   * @param {number} lng2 - Longitud punto 2
   * @returns {number} Distancia en metros
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }

  /**
   * Obtener monumentos cercanos a una ubicación
   * @param {number} userLat - Latitud del usuario
   * @param {number} userLng - Longitud del usuario
   * @param {number} maxDistance - Distancia máxima en metros (default: 20)
   * @returns {Promise<Array>} Array de monumentos con distancia
   */
  async getNearbyMonuments(userLat, userLng, maxDistance = 20) {
    try {
      // Obtener monumentos disponibles
      const monuments = await Monument.find({ status: 'Disponible' });
      
      // Filtrar por distancia y agregar campo distance
      const nearbyMonuments = monuments
        .filter(monument => {
          if (!monument.location?.lat || !monument.location?.lng) return false;
          
          const distance = this.calculateDistance(
            userLat, userLng,
            monument.location.lat, monument.location.lng
          );
          
          return distance <= maxDistance;
        })
        .map(monument => {
          const distance = this.calculateDistance(
            userLat, userLng,
            monument.location.lat, monument.location.lng
          );
          
          return {
            ...monument.toObject(),
            distance: Math.round(distance * 100) / 100 // Redondear a 2 decimales
          };
        });

      // Ordenar por distancia ascendente
      return nearbyMonuments.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Error getting nearby monuments:', error);
      throw new Error(`Failed to get nearby monuments: ${error.message}`);
    }
  }

  /**
   * Detectar institución actual basada en ubicación del usuario
   * @param {number} userLat - Latitud del usuario
   * @param {number} userLng - Longitud del usuario
   * @returns {Promise<Object|null>} Institución o null si no está dentro de ninguna
   */
  async detectCurrentInstitution(userLat, userLng) {
    try {
      const institutions = await Institution.find();
      
      for (let institution of institutions) {
        if (!institution.location?.lat || !institution.location?.lng) continue;
        
        const distance = this.calculateDistance(
          userLat, userLng,
          institution.location.lat, institution.location.lng
        );
        
        // Verificar si está dentro del radio de la institución
        const radius = institution.location.radius || 100;
        if (distance <= radius) {
          return {
            ...institution.toObject(),
            distance: Math.round(distance * 100) / 100
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error detecting current institution:', error);
      throw new Error(`Failed to detect institution: ${error.message}`);
    }
  }

  /**
   * Obtener tours disponibles para ubicación actual
   * @param {number} userLat - Latitud del usuario
   * @param {number} userLng - Longitud del usuario
   * @returns {Promise<Object>} Objeto con institución y tours
   */
  async getAvailableToursForLocation(userLat, userLng) {
    try {
      // Detectar institución actual
      const currentInstitution = await this.detectCurrentInstitution(userLat, userLng);
      
      if (!currentInstitution) {
        return { institution: null, tours: [] };
      }
      
      // Obtener tours activos de la institución
      const tours = await Tour.find({
        institutionId: currentInstitution._id,
        isActive: true
      }).populate('monuments.monumentId');
      
      return {
        institution: currentInstitution,
        tours
      };
    } catch (error) {
      console.error('Error getting available tours:', error);
      throw new Error(`Failed to get available tours: ${error.message}`);
    }
  }
}

export default new LocationService();
