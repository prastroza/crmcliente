import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useQuery, gql, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'


const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto (id:$id) {
        id
        nombre
        existencia
        precio
        }
    
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id:ID!, $input: ProductoInput) {
        actualizarProducto(id:$id, input:$input) {
        id
        nombre
        existencia
        precio
        }
    
    }
`;


const EditarProducto = () => {
    //obtener el ID actual
    const router = useRouter();
    const { query: { id } } = router;
    //console.log(id);

    // Consultar para obtener el cliente
    const {data, loading, error} = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });

    // Actualizar Cliente

    const [actualizarProducto] = useMutation( ACTUALIZAR_PRODUCTO );


    //Schema de Validación
    const schemaValidacion = Yup.object({
        nombre: Yup.string()
                    .required('El Nombre es Obligatorio ...'),
        existencia: Yup.number()
                     .required('Agrega cantidad disponible ...')
                     .positive('No se aceptan números Negativos ...')
                     .integer('La existencia deben ser números enteros ...'),
        precio: Yup.number()
                        .required('Precio es Obligatorio ...')
                        .positive('No se aceptan números Negativos ...')
     });

    if(loading) return 'Cargando....';

    //console.log(data.obtenerCliente);

    const {obtenerProducto } = data;

    if(!data) {
        return 'Acción no Permitida ....';
    }

    //Modifica Producto en la Base de Datos

    const actualizarInfoProducto = async valores => {
        const {nombre, existencia, precio } = valores;
        try {
            const {data} = await actualizarProducto ({
                variables: {
                    id,
                    input: {
                        nombre,
                        existencia,
                        precio
                    }
                }
            });
            // Swett alert
            Swal.fire(
                'Actualizado!',
                'El Producto se actualizó corréctamente ...',
                'success'
          )         

            // Redireccionar
            router.push('/productos');


            //console.log(data);
        } catch (error) {
            console.log(error);
        }

    }
 

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Editar Producto</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema = { schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerProducto }
                        onSubmit={ ( valores, funciones) => {
                            actualizarInfoProducto(valores);
                        }}

                    >
                        {props => {
                            //console.log(props);
                            return (
                                <form   className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                                        onSubmit={props.handleSubmit}
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
                                            value = {props.values.nombre}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    { props.touched.nombre && props.errors.nombre ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.nombre}</p>
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
                                            value = {props.values.existencia}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    { props.touched.existencia && props.errors.existencia ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.existencia}</p>
                                        </div>

                                    ) :null }
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='precio'>
                                            precio
                                        </label>
                                        <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                            id='precio'
                                            type='number'
                                            placeholder='Precio Producto'
                                            autoComplete='on'
                                            value = {props.values.precio}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    { props.touched.precio && props.errors.precio ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.precio}</p>
                                        </div>
                                    ) :null }                                                           
                                    <input
                                        type='submit'
                                        className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font bold hover:bg-gray-900'
                                        value="Registrar Producto"
                                    />   
                                </form>
                            )
                        }}
                    </Formik>

                </div>

            </div>
        </Layout>

    );
}

export default EditarProducto;