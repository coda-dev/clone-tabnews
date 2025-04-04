import { InternalServerError, MethodNotAllowdedError } from "infra/errors";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowdedError();
  response.status(publicErrorObject.StatusCode).json(publicErrorObject);
}

// essa funcao captura os erros gerados no metodo da nossa api
function onErrorHandler(error, request, response) {
  const publicServerError = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicServerError);

  response.status(publicServerError.StatusCode).json(publicServerError);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
