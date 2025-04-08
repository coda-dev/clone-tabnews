export class InternalServerError extends Error {
  constructor({ cause, StatusCode }) {
    super("Um erro internto não esperado aconteceu.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com suporte.";
    this.StatusCode = StatusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.StatusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Serviço indisponível no momento.", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Verifique o serviço se está disponível.";
    this.StatusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.StatusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Erro de validação ocorreu.", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Verifique os dados enviados e tente novamente.";
    this.StatusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.StatusCode,
    };
  }
}

export class MethodNotAllowdedError extends Error {
  constructor() {
    super("Método não permitido para este endpoint.");
    this.name = "MethodNotAllowdedError";
    this.action = "Método HTTP para endpoint não é válido.";
    this.StatusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.StatusCode,
    };
  }
}
