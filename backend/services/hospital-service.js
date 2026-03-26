const axios = require('axios');

/**
 * Hospital Service - Interacts with OpenStreetMap Overpass API
 * to find nearby healthcare facilities.
 */
class HospitalService {
  /**
   * Find nearby hospitals and clinics based on coordinates
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {number} radius - Search radius in meters (default 5000)
   */
  async findNearbyHospitals(lat, lon, radius = 10000) {
    try {
      console.log(`🔍 Searching for hospitals near ${lat}, ${lon} with radius ${radius}m...`);
      
      // Expanded Overpass API Query
      // Includes amenity=hospital|clinic|doctors and healthcare=hospital|clinic|doctor
      const query = `[out:json];(
        node["amenity"~"hospital|clinic|doctors|pharmacy"](around:${radius},${lat},${lon});
        way["amenity"~"hospital|clinic|doctors|pharmacy"](around:${radius},${lat},${lon});
        relation["amenity"~"hospital|clinic|doctors|pharmacy"](around:${radius},${lat},${lon});
        node["healthcare"~"hospital|clinic|doctor|pharmacy"](around:${radius},${lat},${lon});
        way["healthcare"~"hospital|clinic|doctor|pharmacy"](around:${radius},${lat},${lon});
        relation["healthcare"~"hospital|clinic|doctor|pharmacy"](around:${radius},${lat},${lon});
      );out center;`;
      
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const response = await axios.get(url, { timeout: 15000 });
      
      if (!response.data || !response.data.elements) {
        console.log('⚠️ No elements found in Overpass response');
        return [];
      }

      console.log(`✅ Found ${response.data.elements.length} healthcare facilities`);

      // Map To a cleaner format and filter duplicates
      const seen = new Set();
      return response.data.elements
        .filter(el => {
          const key = `${el.lat || el.center?.lat}-${el.lon || el.center?.lon}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map(element => {
          const coords = element.type === 'node' 
            ? { lat: element.lat, lon: element.lon }
            : { lat: element.center.lat, lon: element.center.lon };
            
          return {
            id: element.id,
            name: element.tags.name || element.tags['name:en'] || 'Healthcare Facility',
            type: element.tags.amenity || element.tags.healthcare || 'medical',
            lat: coords.lat,
            lon: coords.lon,
            address: element.tags['addr:full'] || element.tags['addr:street'] || 'Address not available',
            phone: element.tags['contact:phone'] || element.tags.phone || null,
            website: element.tags.website || null,
            emergency: element.tags.emergency === 'yes' || element.tags.amenity === 'hospital'
          };
        });
    } catch (error) {
      console.error('Hospital Service Error:', error.message);
      throw new Error('Failed to fetch nearby hospitals');
    }
  }
}

module.exports = new HospitalService();
