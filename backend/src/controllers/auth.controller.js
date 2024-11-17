import ENVIROMENT from "../config/enviroment.js"
import ResponseBuilder from "../helpers/builders/response.builder.js"
import Validator from "../helpers/builders/validation.builder.js"
import trasnporterEmail from "../helpers/emailTransporter.helpers.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import AppError from '../helpers/errors/app.error.js'
import UserRepository from "../repositories/users.repository.js"
import sendValidationEmail from "../helpers/sendValidationEmail.js"

export const registerController = async (req, res, next) => {
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
        const errores = validaciones.validate()
        if (errores) {
            return next(new AppError(errores.join('. '), 400))
        }

        const dataSend = {
            email: config.email.value,
            name: config.name.value
        }

        await sendValidationEmail(dataSend)

        const hasedpassword = await bcrypt.hash(config.password.value, 10)


        const new_user = {
            name: config.name.value,
            email: config.email.value,
            password: hasedpassword,
            verificationToken: ''
        }
        await UserRepository.createUser(new_user)

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
            return next(new AppError('El correo ya se encuentra en uso', 500))
        }
        return next(error)
    }
}

export const verifyEmailController = async (req, res, next) => {
    try {
        const { validation_token } = req.params
        if (!validation_token) {
            return next(new AppError('No se encontro Validation_token'), 404)
        }
        const payload = jwt.verify(validation_token, ENVIROMENT.SECRET_KEY)
        if (!payload.email) {
            return next(new AppError('Error de token'), 404)
        }

        const email_to_verify = payload.email
        const usuario_a_verificar = await UserRepository.getUserByEmail(email_to_verify)

        if (!usuario_a_verificar) {
            return next(new AppError('El usuario no existe'), 404)
        }

        const updateData = { emailVerified: true }
        await UserRepository.userUpdateByEmail(email_to_verify, updateData)

        res.sendStatus(200)
    } catch (error) {
        next(error)
    }
}

export const loginController = async (req, res, next) => {
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
        const errores = validaciones.validate()
        if (errores) {
            return next(new AppError(errores.join('. '), 400))
        }
        const user = await UserRepository.getUserByEmail(email)

        if (!user) {
            return next(new AppError('El usuario no existe'), 400)
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password)
        if (!isCorrectPassword) {
            return next(new AppError('La contraseña no es correcta'), 401)
        }
        if (!user.emailVerified) {
            const dataSend = {
                email: config.email.value,
                name: user.name
            }
            await sendValidationEmail(dataSend)
            return next(new AppError('Usuario no veirficado'), 403)
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
        next(error)
    }
}

export const forgotPasswordController = async (req, res, next) => {
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
        const errores = validaciones.validate()
        if (errores) {
            return next(new AppError(errores.join('. '), 400))
        }

        const user = await UserRepository.getUserByEmail(email)
        if (!user) {
            return next(new AppError('El usuario no exite'), 400)
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
        next(error)
    }
}

export const recoveryPasswordController = async (req, res, next) => {
    try {
        const validaciones = new Validator()
        const { reset_token } = req.params
        if (!reset_token) {
            return next(new AppError('No hay reset_token'), 400)
        }
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
        const errores = validaciones.validate()
        if (errores) {
            return next(new AppError(errores.join('. '), 400))
        }

        const codificado = jwt.verify(reset_token, ENVIROMENT.SECRET_KEY)
        const user = await UserRepository.getUserByEmail(codificado.email)
        if (!user) {
            return next(new AppError('El usuario no existe'), 400)
        }

        const hasedpassword = await bcrypt.hash(password, 10)
        const updateData = { password: hasedpassword }
        await UserRepository.userUpdateByEmail(codificado.email, updateData)

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
        next(error)
    }
}

export const revalidatioEmailController = async (req, res, next) => {
    try {
        const { email } = req.params
        if (!email) {
            return next(new AppError('No se encontro email'), 400)
        }
        const user = await UserRepository.getUserByEmail(email)
        if (!user) {
            return next(new AppError('El usuario no existe'), 400)
        }
        if (user) {
            const dataSend = {
                email: user.email,
                name: user.name
            }
            await sendValidationEmail(dataSend)
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Enviado')
            .setPayload({ detail: 'Enviado con exito' })
            .build()
        return res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}