class Validator {
    constructor() {
        this.config = {}
        this.hayErrores = false
    }
    setConfig(config) {
        this.config = config
    }
    veryfyString(field_name, field_value) {
        if (typeof field_value !== 'string') {
            return { error: `${field_name} debe ser un string` }
        }
    }
    veryfyMinLength(field_name, field_value, minLength) {
        if (field_value.length < minLength) {
            return { error: `${field_name} debe tener al menos ${minLength} caracteres` }
        }
    }
    veryfyEmail(field_name, field_value) {
        const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        if (!emailRegex.test(field_value)) {
            return { error: 'Correo electronico no valido' }
        }
    }
    validate() {
        this.hayErrores = false
        const errores = []
        for (let field_name in this.config) {
            for (let validation of this.config[field_name].validation) {
                let result = validation(field_name, this.config[field_name].value)
                if (result) {
                    this.hayErrores = true
                    this.config[field_name].errors.push(result)
                    errores.push(result.error)
                }
            }
        }
        return errores.length > 0 ? errores : null
    }
}
export default Validator