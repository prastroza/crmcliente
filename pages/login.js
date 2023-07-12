import React, {useState} from 'react';
import {useRouter} from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput) {
        autenticarUsuario(input: $input){
        token
        }
    }
`;



const Login = () => {

    //State para el mensaje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation para Login de Usuarios en apollo
    const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

   // Routing
   const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                      .email('El Email es inválido ...')
                      .required('El Email es Obligatorio ...'),
            password: Yup.string()
                         .required('El Password no puede ir vacío ...')
                         .min(6,'El password debe ser de al menos 6 caracteres ...')
        }),
        onSubmit: async valores => {
            // console.log(valores);

            const { email, password } = valores;

            try {
                const {data} = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });
                //console.log(data);
                // Usuariuo creado corréctamente
                guardarMensaje('Autenticando ...');

                //Guardar el Token en Localstorage


                setTimeout(() => {
                    const {token} = data.autenticarUsuario;
                    localStorage.setItem('token', token);
                },1000)
 


                //Redirecionar hacia clientes

                setTimeout( () => {
                    guardarMensaje(null);
                    router.push('/');
                },3000);

            } catch (error) {
                // console.log(error);
                guardarMensaje(error.message.replace('GraphQL error: ',''));

                setTimeout( () => {
                    guardarMensaje(null);

                },3000);
            }

        }        
    });

    const mostrarMensaje = () => {
        return(
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <>
            <Layout>
                <h1 className="text-center text-2xl text-white font-light">Login</h1>
                {mensaje && mostrarMensaje() }
                <div className="flex justify-center mt-5">
                    <div 
                        className="w-full max-w-sm"
                    >
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                                onSubmit={formik.handleSubmit}
                        >
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                Email
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                   id='email'
                                   type='email'
                                   autoComplete='on'
                                   placeholder='Email Usuario'
                                   value = {formik.values.email}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                            />
                        </div>
                        { formik.touched.email && formik.errors.email ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.email}</p>
                            </div>

                        ) :null }

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                                Password
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                   id='password'
                                   type='password'
                                   placeholder='Password Usuario'
                                   value = {formik.values.password}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                            />
                        </div>
                        { formik.touched.password && formik.errors.password ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.password}</p>
                            </div>

                        ) :null }   
                        <input
                            type='submit'
                            className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                            value="Iniciar Sesión"
                        />                    
                        </form>
                    </div>
                </div>
            </Layout>
        </>
     );
}


export default Login;