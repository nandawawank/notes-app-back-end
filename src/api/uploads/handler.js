const ClientError = require('../../exceptions/ClientError');

class UploadHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { data } = request.payload;
      this._validator.validateImageHeaders(data.hapi.headers);

      const fileLocation = await this._service.writeFile(data, data.hapi);
      const response = h.response({
        status: 'success',
        data: {
          // fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
          fileLocation,
        },
      });
      response.code(201);
      return response;
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: err.message,
        });

        response.code(err.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(err);
      return response;
    }
  }
}

module.exports = UploadHandler;
