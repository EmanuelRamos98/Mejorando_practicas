import ENVIROMENT from "../config/enviroment.js"
import ResponseBuilder from "../helpers/builders/response.builder.js"
import Validator from "../helpers/builders/validation.builder.js"
import trasnporterEmail from "../helpers/emailTransporter.helpers.js"
import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerController = async (req, res) => {
    try {
        const { name, password, email } = req.body
        const validaciones = new Validator()
        const config = {
            name: {
                value: name,
                errors: [],
                validation: [
                    (field_name, field_value) => validaciones.veryfyString(field_name, field_value),
                    (field_name, field_value) => validaciones.veryfyMinLength(field_name, field_value, 4)
                ]
            },
            password: {
                value: password,
                errors: [],
                validation: [
                    (field_name, field_value) => validaciones.veryfyString(field_name, field_value),
                    (field_name, field_value) => validaciones.veryfyMinLength(field_name, field_value, 8)
                ]
            },
            email: {
                value: email,
                errors: [],
                validation: [
                    (field_name, field_value) => validaciones.veryfyEmail(field_name, field_value)
                ]
            }
        }

        validaciones.setConfig(config)
        if (validaciones.validate()) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Validation Error')
                .setPayload({
                    state: config
                })
                .build()
            return res.status(400).json(response)
        }

        const hasedpassword = await bcrypt.hash(config.password.value, 10)

        const validationToken = jwt.sign(
            { email: config.email.value },
            ENVIROMENT.SECRET_KEY,
            { expiresIn: '1d' }
        )

        const redirectUrl = 'http://localhost:3000/api/auth/verify-email/' + validationToken

        const result = await trasnporterEmail.sendMail({
            subject: 'Validacion',
            to: config.email.value,
            html: `
                <h1>Valida tu email</h1>
                <h2>Bienvenido ${config.name.value}</h2/>
                <p>Para validar tu email da click <a href='${redirectUrl}'>aqui</a>
            `
        })

        const userCreated = new User({
            name: config.name.value,
            email: config.email.value,
            password: hasedpassword,
            verificationToken: ''
        })
        await userCreated.save()

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Exitosa request')
            .setPayload({
                state: 'Usuario creado con exito'
            })
            .build()
        return res.status(200).json(response)

    } catch (error) {
        if (error.code === 11000) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(500)
                .setMessage('ERROR SERVER')
                .setPayload({
                    state: 'El correo ya esta en uso'
                })
                .build()
            return res.status(500).json(response)
        }
        response
            .setPayload({
                state: error.message
            })
            .build()
        return res.status(500).json(response)
    }
}

export const verifyEmailController = async (req, res) => {
    try {
        const { validation_token } = req.params
        const payload = jwt.verify(validation_token, ENVIROMENT.SECRET_KEY)
        const email_to_verify = payload.email
        const usuario_a_verificar = await User.findOne({ email: email_to_verify })
        usuario_a_verificar.emailVerified = true
        await usuario_a_verificar.save()
        res.sendStatus(200)

    } catch (error) {
        console.error(error.message)
        res.sendStatus(500)
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        const validaciones = new Validator()
        const config = {
            email: {
                value: email,
                errors: [],
                validation: [
                    (field_name, field_value) => validaciones.veryfyEmail(field_name, field_value)
                ]
            },
            password: {
                value: password,
                errors: [],
                validation: [
                    (field_name, field_value) => validaciones.veryfyString(field_name, field_value),
                    (field_name, field_value) => validaciones.veryfyMinLength(field_name, field_value, 8)
                ]
            }
        }
        validaciones.setConfig(config)
        if (validaciones.validate()) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Validation Error')
                .setPayload({
                    state: config
                })
                .build()
            return res.status(400).json(response)
        }
        const user = await User.findOne({ email: email })
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Validation Error')
                .setPayload({ state: 'El email no existe' })
                .build()
            return res.status(404).json(response)
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password)
        if (!isCorrectPassword) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(401)
                .setMessage('Validation Error')
                .setPayload({ state: 'La password no es correcta' })
                .build()
            return res.status(401).json(response)
        }
        if (!user.emailVerified) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(403)
                .setMessage('Validation Error')
                .setPayload({ state: 'El usuario tiene acceso restringido' })
                .build()
            return res.status(403).json(response)
        }
        const accesToken = jwt.sign(
            {
                user_id: user.id,
                name: user.name,
                email: user.email
            },
            ENVIROMENT.SECRET_KEY,
            { expiresIn: '1d' }//esto cuanto dura la sesion
        )
        const successResponse = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Logged success')
            .setPayload({
                accesToken: accesToken,
                user_info: {
                    user_id: user.id,
                    name: user.name,
                    email: user.email
                }
            })
            .build()
        return res.status(200).json(successResponse)
    } catch (error) {
        const errorResponse = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('ERROR SERVER')
            .setPayload({ state: error.message })
            .build();
        return res.status(500).json(errorResponse);
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body
        const validaciones = new Validator()
        const config = {
            email: {
                value: email,
                errors: [],
                validation: [
                    (field_name, field_value) => validaciones.veryfyEmail(field_name, field_value)
                ]
            }
        }
        validaciones.setConfig(config)
        if (validaciones.validate()) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Validation Error')
                .setPayload({
                    state: config
                })
                .build()
            return res.status(400).json(response)
        }
        const user = await User.findOne({ email: email })

        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Error')
                .setPayload({
                    state: 'El usuario no existe'
                })
                .build()
            return res.status(404).json(response)
        }
        const reset_token = jwt.sign({
            email: user.email
        }, ENVIROMENT.SECRET_KEY,
            { expiresIn: '1d' })

        const resetUrl = `${ENVIROMENT.URL_FRONTEND}/auth/recovery-password/${reset_token}`

        const result = await trasnporterEmail.sendMail({
            subject: 'Recuperar Contraseña',
            to: user.email,
            html: `
                <h1>Recuperar Contraseña</h1>
                <p>Para recuperar tu contraseña da click <a href='${resetUrl}'>aqui</a></p>
            `
        })
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Correo de recuperacion enviado')
            .setPayload({
                state: user.email
            })
            .build()
        return res.status(200).json(response)
    } catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('SERVER ERROR')
            .setPayload({
                state: error.message
            })
            .build()
        return res.status(500).json(response)
    }
}

export const recoveryPasswordController = async (req, res) => {
    try {
        const validaciones = new Validator()
        const { reset_token } = req.params
        const { password } = req.body
        const config = {
            password: {
                value: password,
                errors: [],
                validation: [
                    (field_name, field_value) => validaciones.veryfyString(field_name, field_value),
                    (field_name, field_value) => validaciones.veryfyMinLength(field_name, field_value, 8)
                ]
            }
        }
        validaciones.setConfig(config)
        if (validaciones.validate()) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Validation Error')
                .setPayload({
                    state: config.password.errors
                })
                .build()
            return res.status(400).json(response)
        }
        const codificado = jwt.verify(reset_token, ENVIROMENT.SECRET_KEY)
        const user = await User.findOne({ email: codificado.email })
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Error')
                .setPayload({
                    state: 'El usuario no existe'
                })
                .build()
            return res.status(404).json(response)
        }
        
        const hasedpassword = await bcrypt.hash(password, 10)
        user.password = hasedpassword
        await user.save()

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Usuario encontrado')
            .setPayload({
                state: `La password se cambio con exito al correo ${user.email}`
            })
            .build()
        return res.status(200).json(response)
    } catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('Error')
            .setPayload({
                state: error.message
            })
            .build()
        return res.status(500).json(response)
    }

}