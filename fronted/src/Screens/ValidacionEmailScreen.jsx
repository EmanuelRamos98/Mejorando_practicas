import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ValidacionEmailScreen = () => {
    const navegador = useNavigate()
    const [email, setEmail] = useState()

    useEffect(() => {
        const getEmail = sessionStorage.getItem('email-sin-verificar')
        if (getEmail) {
            setEmail(getEmail)
        } else {
            navegador('/')
        }
    }, [])

    const handleValidation = async () => {
        const response = await fetch(`http://localhost:3000/api/auth/revalidation/${email}`, {
            method: 'POST'
        })
        const data = await response.json()
    }
    return (
        <div>
            <h1>Falta verificar tu identidad</h1>
            <p>Se envio un correo de verificacion a tu direccion de email</p>
            <button onClick={handleValidation}>Reenviar Email</button>
            <Link to={'/'}>Ingresar</Link>
        </div>
    )
}

export default ValidacionEmailScreen