export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly errors?: any[] | undefined;

  constructor(message: string, statusCode: number, errors?: any[] | undefined) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = "Request tidak valid", errors?: any[]) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = "Tidak terautentikasi") {
    super(message, 401);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = "Akses ditolak") {
    super(message, 403);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Data tidak ditemukan") {
    super(message, 404);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = "Terjadi konflik data") {
    super(message, 409);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = "Terjadi kesalahan internal server") {
    super(message, 500);
  }
}
