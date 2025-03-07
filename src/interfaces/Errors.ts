export class ErrorResponse{
    message = '';
    errorCode = 500;
    getMessage =()=> this.message;
    getCode =()=> this.errorCode;
}

/**
 * Para cuando el token no es valido o está vencido
 */
class Unauthorized extends ErrorResponse{
    message = 'El token no es valido';
    errorCode = 401;
}

/**
 * Para cuando el usuario no tiene permisos por su Rol, pero si tiene acceso al resto de las rutas
 */
class Forbidden extends ErrorResponse{
    message = 'No tienes permiso para acceder a esa acción';
    errorCode = 403;
}

class NotFound extends ErrorResponse{
    message = 'La ruta no existe';
    errorCode = 404;
}

class Conflict extends ErrorResponse{
    message = 'El recurso ya existe';
    errorCode = 409;
}

class BadRequest extends ErrorResponse{
    message = 'La solicitud no es valida';
    errorCode = 400;
}

class InternalServerError extends ErrorResponse{
    message = 'Error interno del servidor, contacta con soporte si el problema persiste';
    errorCode = 500;
}


export default class Errors{
    static Unauthorized:Unauthorized = new Unauthorized();
    static Forbidden:Forbidden = new Forbidden();
    static NotFound:NotFound = new NotFound();
    static Conflict:Conflict = new Conflict();
    static BadRequest:BadRequest = new BadRequest();
    static InternalServerError:InternalServerError = new InternalServerError();
}

export type ErrorType = Unauthorized | Forbidden | NotFound | Conflict | BadRequest | InternalServerError;