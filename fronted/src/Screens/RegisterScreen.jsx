import React from 'react'
import Forms from '../Componets/Forms'

const RegisterScreen = () => {
    const actionRegistrer = async (formState) => {
        const responseHTTP = await fetch('http://localhost:3000/api/auth/register', {
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
            label_text: 'Ingresa tu Nombre',
            field_component: 'INPUT',
            field_container_props: {
                className: 'row_field'
            },
            field_data_props: {
                name: 'name',
                id: 'name',
                placeholder: 'Cosme Fulanito',
                type: 'text'
            }
        },
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
        },
        {
            label_text: 'Ingresa nueva contraseña:',
            field_component: 'INPUT',
            field_container_props: {
                className: 'row_field'
            },
            field_data_props: {
                name: 'password',
                id: 'password',
                placeholder: '',
                type: 'password'
            }
        }
    ]
    const initial_state_form = {
        name: '',
        email: '',
        password: ''
    }
    return (
        <div>
            <h1>Registrate en Brand Name</h1>
            <Forms action={actionRegistrer} form_fields={form_fields} initial_state_form={initial_state_form}>
                <button type='submit'>Registrar</button>
            </Forms>
        </div>
    )
}

export default RegisterScreen