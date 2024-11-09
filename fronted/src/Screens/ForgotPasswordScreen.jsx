import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useForm from '../Hooks/useForm'

const ForgotPasswordScreen = () => {
    const { formState, handleChange } = useForm({
        email: ''
    })
    const [errorsState, setErrorsState] = useState({
        name: '',
        email: '',
        password: '',
        general: ''
    })

    const handleForgotPassword = async (e) => {
        e.preventDefault()

        const responseHTTP = await fetch('http://localhost:3000/api/auth/forgot-password',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formState)
        })
        const data = await responseHTTP.json()
        console.log(data);
        if (!data.ok) {
            const newErrorState = {}
            const register = data.payload.state
            if (typeof register === 'string') {
                return setErrorsState((prevState)=>({
                    ...prevState, 
                    general: register
                }))
            }
            for (const field in register) {
                if (register[field].errors.length > 0) {
                    newErrorState[field] = register[field].errors[0].error
                }
            }
            setErrorsState((prevState) => ({
                ...prevState, ...newErrorState
            }))
        }else{
            console.log('enviado con exito');
        }
    }
    
    return (
        <div>
            <h1>Restablecer contraseña </h1>
            <p>Al restablecer tu contraseña se enviara un correo electronico para enviarte las instrucciones de restablecimiento de contraseña</p>
            <form onSubmit={handleForgotPassword}>

                <div>
                    <label>Ingresa tu email:</label>
                    <input
                        name='email'
                        id='email'
                        placeholder='cosmefulanito@gmail.com'
                        type='email'
                        onChange={handleChange}
                        value={formState.email}
                    />
                    {
                        errorsState.email && <span>{errorsState.email}</span>
                    }
                </div>
                {
                    errorsState.general && <span>{errorsState.general}</span>
                }
                <button type='submit'>Restablecer</button>
                <Link to='/login'>Iniciar sesion</Link>
            </form>
        </div>
    )
}

export default ForgotPasswordScreen