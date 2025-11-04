const pool = require('../config/database');
const { successResponse, invalidParameterResponse } = require('../utils/response');

const getBanner = async (req, res) => {
  try {
    const [banners] = await pool.query(
      'SELECT banner_name, banner_image, description FROM banners ORDER BY id ASC'
    );

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

const getServices = async (req, res) => {
  try {
    const [services] = await pool.query(
      'SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY id ASC'
    );

    return successResponse(
      res,
      200,
      'Sukses',
      services.map(service => ({
        service_code: service.service_code,
        service_name: service.service_name,
        service_icon: service.service_icon,
        service_tariff: Number(service.service_tariff)
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

module.exports = {
  getBanner,
  getServices
};

