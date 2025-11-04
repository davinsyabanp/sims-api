const successResponse = (res, httpStatus = 200, message, data = null) => {
  return res.status(httpStatus).json({
    status: 0,
    message: message,
    data: data
  });
};

const invalidParameterResponse = (res, httpStatus = 400, message) => {
  return res.status(httpStatus).json({
    status: 102,
    message: message,
    data: null
  });
};

const invalidCredentialsResponse = (res, httpStatus = 401, message) => {
  return res.status(httpStatus).json({
    status: 103,
    message: message,
    data: null
  });
};

const unauthorizedResponse = (res, httpStatus = 401, message) => {
  return res.status(httpStatus).json({
    status: 108,
    message: message,
    data: null
  });
};

const errorResponse = (res, httpStatus, statusCode, message) => {
  return res.status(httpStatus).json({
    status: statusCode,
    message: message,
    data: null
  });
};

module.exports = {
  successResponse,
  invalidParameterResponse,
  invalidCredentialsResponse,
  unauthorizedResponse,
  errorResponse
};

