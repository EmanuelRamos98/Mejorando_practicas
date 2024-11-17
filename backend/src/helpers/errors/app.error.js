class AppError extends Error {
    constructor(message, status_code) {
        super(message)
        this.status_code = status_code
        //error(sintaxis, err database), fail(no se encontro el producto)
        this.status = String(status_code).startsWith('4') ? 'fail' : 'error'
        //Si debemos responder al con ese error
        //Todos los errores de app deben tener su propia respuesta
        this.is_operational = true

        //Esto captura la traza del error
        Error.captureStackTrace(this, this.constructor)
    }
}

export default AppError