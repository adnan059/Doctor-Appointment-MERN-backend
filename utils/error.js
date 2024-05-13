const createError = (statusCode, msg) => {
  const err = new Error();
  err.status = statusCode;
  err.message = msg;
  return err;
};

module.exports = createError;
