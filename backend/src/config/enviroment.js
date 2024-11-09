//Modulo con la logica de las varibles de entorno de nuestra aplicacion
import dotenv from 'dotenv'

//process es una variable global que guarda datos del proceso de ejecucion de node
//configutamos en process.env las vairables del archivo evn
dotenv.config()

const ENVIROMENT = {
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_USER: process.env.EMAIL_USER,
    SECRET_KEY: process.env.SECRET_KEY,
    URL_FRONTEND: process.env.URL_FRONTEND
}

export default ENVIROMENT