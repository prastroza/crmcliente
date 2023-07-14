import React, {useState} from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import {useRouter} from 'next/router';

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto ($input: ProductoInput) {
        nuevoProducto (input: $input) {
        id
        nombre
        existencia
        precio
        creado
        }
    }
    `;

    const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            id
            nombre
            precio
            existencia
        }
    }
`;


const NuevoProducto = () => {
     //Mutation para crear nuevos clientes
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, {data: { nuevoProducto }}) {
            // Obtener el objeto de cache que deseamos actualizar
            if(cache.data.data.readQuery.obtenerProductos) {
                const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });

                //Reescribimos el cache (nunca se debe modificar)
                cache.writeQuery({
                    query: OBTENER_PRODUCTOS,
                    data: {
                        obtenerProductos : [...obtenerProductos, nuevoProducto]
                    }
                });
            }
        }
    });

    // Routing
    const router = useRouter();
   //State para el mensaje
   const [mensaje, guardarMensaje] = useState(null);
    //Validación del Formulario.

    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .required('El Nombre es Obligatorio ...'),
            existencia: Yup.number()
                         .required('Agrega cantidad disponible ...')
                         .positive('No se aceptan números Negativos ...')
                         .integer('La existencia deben ser números enteros ...'),
            precio: Yup.number()
                            .required('Precio es Obligatorio ...')
                            .positive('No se aceptan números Negativos ...')
         }),
        onSubmit: async valores => {
            const { nombre, existencia, precio } = valores;

            try {
                const {data} = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            existencia,
                            precio
                        }
                    }
                });
                //console.log(data.nuevoProducto);
                //Producto creado corréctamente
                // guardarMensaje(`Se creó corréctamente el Cliente: ${data.nuevoProducto.nombre}`);

                // setTimeout( () => {
                //     guardarMensaje(null);
                router.push('/productos'); //redireccionar Producto

                // },3000);

                //Redirigir al Cliente
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ',''));

                setTimeout( () => {
                    guardarMensaje(null);

                },2000);
                // console.log(error.message);
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
    
    return(
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo Producto</h1>
            {mensaje && mostrarMensaje() }
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form   className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                            onSubmit={formik.handleSubmit}
                    >
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                                Nombre Producto
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                id='nombre'
                                type='text'
                                placeholder='Nombre Producto'
                                autoComplete='on'
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
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='existencia'>
                                Cantidad Disponible
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                id='existencia'
                                type='number'
                                placeholder='Cantidad Disponible'
                                autoComplete='on'
                                value = {formik.values.existencia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        { formik.touched.existencia && formik.errors.existencia ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.existencia}</p>
                            </div>

                        ) :null }
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='precio'>
                                Precio
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                id='precio'
                                type='number'
                                placeholder='Precio Producto'
                                autoComplete='on'
                                value = {formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        { formik.touched.precio && formik.errors.precio ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.precio}</p>
                            </div>

                        ) :null }                                                       

                        <input
                            type='submit'
                            className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font bold hover:bg-gray-900'
                            value="Registrar Producto"
                        />   
                    </form>

                </div>

            </div>
        </Layout>
    );
}

export default NuevoProducto;