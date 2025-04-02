export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Um erro internto não esperado aconteceu.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com suporte.";
    this.StatusCode = 500;
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
