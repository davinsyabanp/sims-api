const pool = require('../config/database');
const { successResponse, invalidParameterResponse } = require('../utils/response');

/**
 * GET /banner
 * Get all banners
 * 
 * Public Endpoint (No Auth)
 * Response: { status: 0, message: "Sukses", data: [{ banner_name, banner_image, description }] }
 */
const getBanner = async (req, res) => {
  try {
    // Query all banners from database using raw SQL with prepared statement
    // Order by id ASC to maintain order
    const [banners] = await pool.query(
      'SELECT banner_name, banner_image, description FROM banners ORDER BY id ASC'
    );

    // Return array of banners with exact Swagger format
    // Fields: banner_name, banner_image, description
    return successResponse(
      res,
      200,
      'Sukses',
      banners.map(banner => ({
        banner_name: banner.banner_name,
        banner_image: banner.banner_image,
        description: banner.description
      }))
    );

  } catch (error) {
    console.error('Get banner error:', error);
    return invalidParameterResponse(
      res,
      400,
      'Error getting banners'
    );
  }
};

/**
 * GET /services
 * Get all services
 * 
 * Private Endpoint (Requires Auth)
 * Response: { status: 0, message: "Sukses", data: [{ service_code, service_name, service_icon, service_tariff }] }
 */
const getServices = async (req, res) => {
  try {
    // Query all services from database using raw SQL with prepared statement
    // Order by id ASC to maintain Swagger order (maintain seed data order)
    const [services] = await pool.query(
      'SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY id ASC'
    );

    // Return array of services with exact Swagger format
    // Fields: service_code, service_name, service_icon, service_tariff
    return successResponse(
      res,
      200,
      'Sukses',
      services.map(service => ({
        service_code: service.service_code,
        service_name: service.service_name,
        service_icon: service.service_icon,
        service_tariff: Number(service.service_tariff) // Ensure it's a number
      }))
    );

  } catch (error) {
    console.error('Get services error:', error);
    return invalidParameterResponse(
      res,
      400,
      'Error getting services'
    );
  }
};

// Export all controller functions
module.exports = {
  getBanner,
  getServices
};

