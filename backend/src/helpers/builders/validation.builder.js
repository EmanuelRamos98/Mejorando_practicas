class Validator {
    constructor() {
        this.config = {}
        this.hayErrores = false
    }
    setConfig(config) {
        this.config = config
    }
    veryfyString(field_name, field_value) {
        try {
            if (typeof field_value !== 'string') {
                return { error: `${field_name} debe ser un string` }
            }
        } catch (error) {
            console.error(`Error en verifyString para ${field_name}:`, error)
            return { error: `Error interno al verificar el ${field_name}` }
        }
    }
    veryfyMinLength(field_name, field_value, minLength) {
        try {
            if (field_value.length < minLength) {
                return { error: `${field_name} debe tener al menos ${minLength} caracteres` }
            }
        } catch (error) {
            console.error(`Error en verifyMinLength para ${field_name}:`, error)
            return { error: `Error interno al verificar ${field_name}` }
        }
    }
    veryfyEmail(field_name, field_value) {
        try {
            const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
            if (!emailRegex.test(field_value)) {
                return { error: 'Correo electronico no valido' }
            }
        } catch (error) {
            console.error(`Error en verifyEmail para ${field_name}:`, error)
            return { error: `Error interno al verificar ${field_name}` }
        }
    }
    validate() {
        this.hayErrores = false
        for (let field_name in this.config) {
            for (let validation of this.config[field_name].validation) {
                let result = validation(field_name, this.config[field_name].value)
                if (result) {
                    this.hayErrores = true
                    this.config[field_name].errors.push(result)
                }
            }
        }
        return this.hayErrores
    }
}
export default Validator