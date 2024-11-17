
//Recibe req, res y next
//El next es una funcion que va a indecar que la consulta puede seguir al siguente middlewre o controlador
const testMiddleware = (req, res, next) => {
    console.log('Middleware ejecutado')
    if (.5 < Math.random()) {
        res.status(400).json({ message: 'Error no tuviste suerte' })
    } else {
        //Cuando active next estoy pasando al siguiente middleware o controlador
        next()
    }
}
export default testMiddleware