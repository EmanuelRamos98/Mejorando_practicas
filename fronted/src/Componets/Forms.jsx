import React from 'react'
import useForm from '../Hooks/useForm'

const Forms = ({ children, action, form_fields, initial_state_form }) => {
    //children hace referencia a el contenido encerrado como hijo de nuestro componente
    const { formState, handleChange, errors, handleErrors } = useForm(initial_state_form)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = await action(formState)
        handleErrors(data)
    }
    return (
        <form onSubmit={handleSubmit}>
            <Field_list form_fields={form_fields}
                handleChange={handleChange}
                form_state={formState} 
                errors={errors}
            />
            {errors.general && <span>{errors.general}</span>}
            {children}
        </form>
    )
}

const Field_list = ({ form_fields, handleChange, form_state, errors }) => {
    return (
        form_fields.map((field, index) => {
            return (
                <Field
                    key={index + field.field_data_props.name}
                    field={field}
                    handleChange={handleChange}
                    state_value={form_state[field.field_data_props.name]}
                    error={errors[field.field_data_props.name]}
                />
            )
        })
    )
}

const Field = ({ field, handleChange, state_value, error }) => {
    return (
        <div {...field.field_container_props}>
            {field.label_text && <label>{field.label_text}</label>}
            <>
                {
                    field.field_component === 'INPUT'
                        ? <input {...field.field_data_props}
                            onChange={handleChange}
                            value={state_value}
                        />
                        :
                        <textarea></textarea>
                }
                {error&&<span>{error}</span>}
            </>
        </div>
    )
}

export default Forms