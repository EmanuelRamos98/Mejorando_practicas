import jwt from "jsonwebtoken"
import trasnporterEmail from "./emailTransporter.helpers.js"
import ENVIROMENT from "../config/enviroment.js"

const sendValidationEmail = async (config) => {
    const validationToken = jwt.sign(
        { email: config.email },
        ENVIROMENT.SECRET_KEY,
        { expiresIn: '1d' }
    )

    const redirectUrl = `http://localhost:3000/api/auth/verify-email/${validationToken}`

    const result = await trasnporterEmail.sendMail({
        subject: 'Validacion',
        to: config.email,
        html: `
            <h1>Valida tu email</h1>
            <h2>Bienvenido ${config.name}</h2/>
            <p>Para validar tu email da click <a href='${redirectUrl}'>aqui</a>
        `
    })
    return result
}
export default sendValidationEmail