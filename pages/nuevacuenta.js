import React, {useState} from 'react';
import {useRouter} from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
// import { useQuery, gql } from '@apollo/client';

// const QUERY = gql`
//     query obtenerProductos {
//         obtenerProductos {
//             id
//             nombre
//             existencia
//             precio
//             creado
//         }
//     }
// `; 
const NUEVA_CUENTA = gql`
    mutation nuevoUsuario ($input: UsuarioInput) {
        nuevoUsuario(input: $input) {
            id
            nombre
            apellido
            email
        }
    }
`;

const NuevaCuenta = () => {

    // Obtener Productos de Graphql
    // const {data, loading, error} = useQuery(QUERY);
    // console.log(data);
    // console.log(loading);
    // console.log(error);

    //State para el mensaje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation para crear nuevos usuarios
    const [nuevoUsuario] = useMutation(NUEVA_CUENTA);

    // Routing
    const router = useRouter();




    //Validación del Formulario.
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                       .required('El Nombre es Obligatorio ...'),
            apellido: Yup.string()
                         .required('El Apellido es Obligatorio ...'),
            email: Yup.string()
                      .email('El Email es inválido ...')
                      .required('El Email es Obligatorio ...'),
            password: Yup.string()
                         .required('El Password no puede ir vacío ...')
                         .min(6,'El password debe ser de al menos 6 caracteres ...')
        }),
        onSubmit: async valores => {
            // console.log('Enviando ...');
            // console.log(valores);

            const { nombre, apellido, email, password } = valores;


            try {
                const {data} = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                });
                // console.log(data);
                //Usuariuo creado corréctamente
                guardarMensaje(`Se creó corréctamente el Usuario: ${data.nuevoUsuario.nombre}`);

                setTimeout( () => {
                    guardarMensaje(null);
                    router.push('/login');

                },3000);

                //Redirigir al usuario para crear session                
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ',''));

                setTimeout( () => {
                    guardarMensaje(null);

                },3000);
                // console.log(error.message);
            }
        }
    });

    // if(loading) return 'Cargando...';

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
                <h1 className="text-center text-2xl text-white font-light">Crear Nueva Cuenta</h1>
                {mensaje && mostrarMensaje() }
                <div className="flex justify-center mt-5">
                    <div 
                        className="w-full max-w-sm"
                    >
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={formik.handleSubmit}
                         >
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                                Nombre
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                   id='nombre'
                                   type='text'
                                   placeholder='Nombre Usuario'
                                   value = {formik.values.nombre}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.nombre && formik.errors.nombre ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>

                        ) :null }

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'>
                                Apellido
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                   id='apellido'
                                   type='text'
                                   placeholder='Apellido Usuario'
                                   value = {formik.values.apellido}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                            />
                        </div> 

                            { formik.touched.apellido && formik.errors.apellido ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.apellido}</p>
                            </div>

                        ) :null }                      
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                Email
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                   id='email'
                                   type='email'
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
                            value="Crear Cuenta"
                        />                    
                        </form>
                    </div>
                </div>
            </Layout>
        </>
     );
}

export default NuevaCuenta;