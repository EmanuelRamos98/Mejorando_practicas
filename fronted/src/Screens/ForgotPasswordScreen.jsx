import React from 'react'
import { Link } from 'react-router-dom'
import Forms from '../Componets/Forms'

const ForgotPasswordScreen = () => {
    const actionForgotPassword = async (formState) => {
        const responseHTTP = await fetch('http://localhost:3000/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formState)
        })
        const data = await responseHTTP.json()
        return data
    }

    const form_fields = [
        {
            label_text: 'Ingresa tu email',
            field_component: 'INPUT',
            field_container_props: {
                className: 'row_field'
            },
            field_data_props: {
                name: 'email',
                id: 'email',
                placeholder: 'cosmefulanito@gmail.com',
                type: 'email'
            }
        }
    ]

    const initial_state_form = {
        email: '',
    }

    return (
        <div>
            <h1>Restablecer contraseña </h1>
            <p>Al restablecer tu contraseña se enviara un correo electronico para enviarte las instrucciones de restablecimiento de contraseña</p>
            <Forms action={actionForgotPassword} form_fields={form_fields} initial_state_form={initial_state_form}>
                <button type='submit'>Restablecer</button>
                <Link to='/'>Volver</Link>
            </Forms>
        </div>
    )
}

export default ForgotPasswordScreen