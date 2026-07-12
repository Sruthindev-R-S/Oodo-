const { Like } = require('typeorm');

/**
 * Builds a TypeORM-compatible where clause from query parameters.
 * @param {Object} queryParams - The req.query object
 * @param {Array<string>} allowedFilters - Allowed exact match fields
 * @param {Object} searchMapping - Mapping of search term to multiple fields
 */
const buildWhereClause = (queryParams, allowedFilters = [], searchMapping = null) => {
  const exactFilters = {};

  // Exact matches
  allowedFilters.forEach((filter) => {
    if (queryParams[filter] !== undefined && queryParams[filter] !== '') {
      exactFilters[filter] = queryParams[filter];
    }
  });

  // Search query mapping (TypeORM uses an array of objects for OR conditions)
  if (queryParams.search && searchMapping) {
    const searchVal = `%${queryParams.search}%`;
    return searchMapping.fields.map((field) => ({
      ...exactFilters,
      [field]: Like(searchVal)
    }));
  }

  return exactFilters;
};

module.exports = buildWhereClause;
