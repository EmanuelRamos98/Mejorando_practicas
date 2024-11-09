import { useState } from "react"
import { useNavigate } from "react-router-dom"

const useErrors = () => {
    const [errorsState, setErrorsState] = useState({
        name: '',
        email: '',
        password: '',
        general: ''
    })
    const navigate = useNavigate()

    const handleValidations = async (responseHTTP, formState) => {
        const data = await responseHTTP.json()
        console.log(data);

        if (!data.ok) {
            const register = data.payload.state
            const newErrorState = {}
            for (const field in register) {
                if (register[field].errors.length > 0) {
                    newErrorState[field] = register[field].errors[0].error
                }
            }
            setErrorsState((prevState) => ({
                ...prevState = newErrorState
            }))
        }else{
            navigate('/login')
        }
    }
    return { errorsState, handleValidations }
}

export default useErrors