const { ValidationError } = require("express-json-validator-middleware");

exports.validation_error_middleware = (error, _ , response, next) => {
	if (response.headersSent) {
		return next(error);
	}
	const isValidationError = error instanceof ValidationError;
	if (!isValidationError) {
		return next(error);
	}
	response.status(400).json({
		errors: error.validationErrors,
	});
	next();
}

exports.schema_body_update = {
    "type": "object",
    "properties": {
      "id": {"type": "number"},
      "name": {"type": "string"},
      "phone": {"type": "string"},
      "email": {"type": "string"},
      "city": {"type": "string"},
      "address": {"type": "string"},
    },
    "required": [ "id","name", "phone", "email", "city", "address"]
  };


exports.schema_body_add = {
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "phone": {"type": "string"},
      "email": {"type": "string"},
      "city": {"type": "string"},
      "address": {"type": "string"},
    },
    "required": [ "name", "phone", "email", "city", "address"]
  };

exports.schema_id = {
    "type": "object",
    "properties": {
      "id": {
        "type": "string"
      },
    },
    "required": ["id"]
  }