//Logica de conexion con la DB
import mongoose from "mongoose"

const MONGO_URL = 'mongodb://localhost:27017/TN_PWA_PRUEBA_MONGOOSE'

//.connect se utiliza para establecer una conexion con la DB
//Recibe un connection_string (url de la DB) y un objeto de configuracion
mongoose.connect(MONGO_URL, {})
    .then(
        () => {
            console.log('Se establecio la conexion con mongoDB')

        }
    )
    .catch(
        (error) => {
            console.error('La conexion con mongoDB ha fallado', error)
        }
    )
    .finally(
        () => {
            console.log('El proceso de conexion con la DB esta finalizado')
        }
    )
//de esta forma se puede exportar
export default mongoose