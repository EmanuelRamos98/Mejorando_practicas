import React, { useState } from 'react'
import useForm from '../Hooks/useForm'
import useErrors from '../Hooks/useErrors'
import { useNavigate } from 'react-router-dom'

const RegisterScreen = () => {
    const navigate = useNavigate()
    //cuando invoco a useform se crea otro estado y me devuelve dicho estado una funcion para asociar a cada input del form
    const { formState, handleChange } = useForm({
        name: '',
        email: '',
        password: ''
    })

    //Custom hook de validaciones
    const [errorsState, setErrorsState] = useState({
        name: '',
        email: '',
        password: '',
        general: ''
    })


    const handleRegistrer = async (event) => {
        event.preventDefault()
        console.log('Formulario registro enviado')

        //Que hace fetch?
        //Nos permite hacer consultas HTTP
        const responseHTTP = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formState)
        })
        const data = await responseHTTP.json()
        console.log(data);
        
        if (!data.ok) {
            const register = data.payload.state
            const newErrorState = {}
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
                ...prevState = newErrorState
            }))
        }else{
            console.log('enviado con exito');
        }
    }
    return (
        <div>
            <h1>Registrate en Brand Name</h1>
            <form onSubmit={handleRegistrer}>
                <div>
                    <label>Ingresa tu nombre: </label>
                    <input
                        type="text"
                        name='name'
                        id='name'
                        placeholder='cosme fulanito'
                        onChange={handleChange}
                        value={formState.name}
                    />
                    {
                        errorsState.name && <span>{errorsState.name}</span>
                    }
                </div>
                <div>
                    <label>Ingresa tu email: </label>
                    <input
                        type="email"
                        name='email'
                        id='email'
                        placeholder='cosmefulanito@gmail.com'
                        onChange={handleChange}
                        value={formState.email}
                    />
                    {
                        errorsState.email && <span>{errorsState.email}</span>
                    }
                </div>
                <div>
                    <label>Ingresa tu password: </label>
                    <input
                        type="password"
                        name='password'
                        id='password'
                        placeholder='password'
                        onChange={handleChange}
                        value={formState.password}
                    />
                    {
                        errorsState.password && <span>{errorsState.password}</span>
                    }
                </div>
                {
                    errorsState.general && <span>{errorsState.general}</span>
                }
                <button type='submit'>Registrar</button>
            </form>
        </div>
    )
}

export default RegisterScreen