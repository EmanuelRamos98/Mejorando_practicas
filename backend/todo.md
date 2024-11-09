## Registro/autentificacion de nuestro proyecto

- Entrar a el formulario de registro donde ingresara sus datos
    - Nombre
    - Email
    - Contraseña

- El front enviara este formulario (fetch) a nuestro servidor (Endpoint: /api/auth/register) 

- El back validara los datos y si todo esta bien enviara al email registrado un mail de verificacion 
    - 1. 1 Validar los datos que viene del formulario
    - 1. 2 Validar que ese email no exista en mi DB
    - 2. Crear un token de validacion firmado con una clave secreta desde nuestro backend y se lo enviaremos al mail del usuario(aun falta definir como se hace esto)
    - 3. Encriptar/hasear la contraseña y se guardara en la DB (data-base)
    - 4. Guardamos en la DB al usuario
    - 5. Respondo al front 
    
