import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useQuery, gql, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'


const OBTENER_CLIENTE = gql`
query obtenerCliente($id:ID!) {
    obtenerCliente(id: $id){
        id
        nombre
        apellido
        empresa
        email
        telefono
    }
    
  }
`;

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id:ID!, $input: ClienteInput) {
        actualizarCliente(id:$id, input:$input) {
            id
            nombre
            apellido
            empresa
            email
            telefono

         }
    }
`;


const EditarCliente = () => {
    //obtener el ID actual
    const router = useRouter();
    const { query: { id } } = router;
    //console.log(id);

    // Consultar para obtener el cliente
    const {data, loading, error} = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });

    // Actualizar Cliente

    const [actualizarCliente] = useMutation( ACTUALIZAR_CLIENTE );


    //Schema de Validación
    const schemaValidacion = Yup.object({
        nombre: Yup.string()
                    .required('El Nombre es Obligatorio ...'),
        apellido: Yup.string()
                     .required('El Apellido es Obligatorio ...'),
        empresa: Yup.string()
                        .required('La Empresa es Obligatoria ...'),                         
        email: Yup.string()
                    .email('El Email es inválido ...')
                    .required('El Email es Obligatorio ...'),
        // telefono: Yup.string()
        //              .(6,'El password debe ser de al menos 6 caracteres ...')
    });

    if(loading) return 'Cargando....';

    if(!data) {
        return 'Acción no Permitida ....';
    }

    //console.log(data.obtenerCliente);

    const {obtenerCliente } = data;

    //Modifica Cliente en la Base de Datos

    const actualizarInfoCliente = async valores => {
        const {nombre, apellido, empresa, email, telefono } = valores;
        try {
            const {data} = await actualizarCliente ({
                variables: {
                    id,
                    input: {
                        nombre,
                        apellido,
                        empresa,
                        email,
                        telefono
                    }
                }
            });
            // Swett alert
            Swal.fire(
                'Actualizado!',
                'El cliente se actualizó corréctamente ...',
                'success'
          )         

            // Redireccionar
            router.push('/');


            //console.log(data);
        } catch (error) {
            console.log(error);
        }

    }
 

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Editar Cliente</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema = { schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerCliente }
                        onSubmit={ ( valores, funciones) => {
                            actualizarInfoCliente(valores);
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
                                            Nombre
                                        </label>
                                        <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                            id='nombre'
                                            type='text'
                                            placeholder='Nombre Cliente'
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
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'>
                                            Apellido
                                        </label>
                                        <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                            id='apellido'
                                            type='text'
                                            placeholder='Apellido Cliente'
                                            autoComplete='on'
                                            value = {props.values.apellido}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    { props.touched.apellido && props.errors.apellido ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.apellido}</p>
                                        </div>

                                    ) :null }
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='empresa'>
                                            Empresa
                                        </label>
                                        <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                            id='empresa'
                                            type='text'
                                            placeholder='Empresa Cliente'
                                            autoComplete='on'
                                            value = {props.values.empresa}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    { props.touched.empresa && props.errors.empresa ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.empresa}</p>
                                        </div>
                                    ) :null }                                                           
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                            Email
                                        </label>
                                        <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                            id='email'
                                            type='email'
                                            placeholder='Email Cliente'
                                            autoComplete='on'
                                            value = {props.values.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}                                   
                                        />
                                    </div>
                                    { props.touched.email && props.errors.email ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.email}</p>
                                        </div>

                                    ) :null }
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='telefono'>
                                            Teléfono
                                        </label>
                                        <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline'
                                            id='telefono'
                                            type='tel'
                                            placeholder='Teléfono Cliente'
                                            autoComplete='on'
                                            value = {props.values.telefono}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {/* { formik.touched.telefono && formik.errors.telefono ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                        </div>

                                    ) :null } */}
                                    <input
                                        type='submit'
                                        className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font bold hover:bg-gray-900'
                                        value="Registrar Cliente"
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

export default EditarCliente;