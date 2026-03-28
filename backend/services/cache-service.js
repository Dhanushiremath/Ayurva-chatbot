const NodeCache = require('node-cache');

// Create cache with 1 hour TTL (Time To Live)
const cache = new NodeCache({ 
  stdTTL: 3600, // 1 hour in seconds
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false // Better performance
});

/**
 * Get cached response for a query
 * @param {string} query - User's medical query
 * @returns {string|null} - Cached response or null
 */
function getCachedResponse(query) {
  try {
    // Normalize query: lowercase, trim, remove extra spaces
    const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, ' ');
    const cached = cache.get(normalizedQuery);
    
    if (cached) {
      console.log('✅ Cache HIT:', normalizedQuery.substring(0, 50));
      return cached;
    }
    
    console.log('❌ Cache MISS:', normalizedQuery.substring(0, 50));
    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Store response in cache
 * @param {string} query - User's medical query
 * @param {string} response - AI generated response
 */
function setCachedResponse(query, response) {
  try {
    // Normalize query
    const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, ' ');
    cache.set(normalizedQuery, response);
    console.log('💾 Cached response for:', normalizedQuery.substring(0, 50));
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * Clear all cached responses
 */
function clearCache() {
  cache.flushAll();
  console.log('🗑️ Cache cleared');
}

/**
 * Get cache statistics
 */
function getCacheStats() {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    hitRate: cache.getStats().hits / (cache.getStats().hits + cache.getStats().misses) || 0
  };
}

module.exports = {
  getCachedResponse,
  setCachedResponse,
  clearCache,
  getCacheStats
};
