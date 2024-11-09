import { useState } from "react"

const useForm = (form) => {
    const [formState, setFormState] = useState(form)
    const [errors, setErrors] = useState({})
    const handleChange = (evento) => {
        const field_name = evento.target.name
        const field_value = evento.target.value

        setFormState((prevFormState) => ({
            ...prevFormState,
            [field_name]: field_value
        }))
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field_name]: ''
        }))
    }

    const handleErrors = (data) => {
        const newErrorState = {}
        const register = data.payload.state

        setErrors({})

        if (typeof register === 'string') {
            setErrors((prevState) => ({
                ...prevState,
                general: register
            }))
        } else if (typeof register === 'object') {
            for (const field in register) {
                if (register[field].errors.length > 0) {
                    newErrorState[field] = register[field].errors[0].error
                }
            }
            setErrors((prevState) => ({
                ...prevState, ...newErrorState
            }))
        }
    }
    return {
        formState,
        handleChange,
        errors,
        handleErrors
    }
}

export default useForm


