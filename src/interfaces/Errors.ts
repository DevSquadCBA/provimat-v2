export class ErrorResponse extends Error{
    message = '';
    errorCode = 500;
    getMessage =()=> this.message;
    getCode =()=> this.errorCode;
}

/**
 * Para cuando el token no es valido o está vencido
 */
export class Unauthorized extends ErrorResponse{
    constructor(message:string){
        super(message)
    }
    message = 'El token no es valido';
    errorCode = 401;
}

/**
 * Para cuando el usuario no tiene permisos por su Rol, pero si tiene acceso al resto de las rutas
 */
export class Forbidden extends ErrorResponse{
    constructor(message:string){
        super(message)
    }
    message = 'No tienes permiso para acceder a esa acción';
    errorCode = 403;
}

export class NotFound extends ErrorResponse{
    constructor(message:string){
        super(message)
    }
    message = 'La ruta no existe';
    errorCode = 404;
}

export class Conflict extends ErrorResponse{
    constructor(message:string){
        super(message)
    }
    message = 'El recurso ya existe';
    errorCode = 409;
}

export class BadRequest extends ErrorResponse{
    constructor(message:string){
        super(message)
    }
    message = 'La solicitud no es valida';
    errorCode = 400;
}

export class InternalServerError extends ErrorResponse{
    constructor(message:string){
        super(message)
    }
    message = 'Error interno del servidor, contacta con soporte si el problema persiste';
    errorCode = 500;
}


export type ErrorType = Unauthorized | Forbidden | NotFound | Conflict | BadRequest | InternalServerError;