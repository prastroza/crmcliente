import React from 'react'
import Swal from 'sweetalert2'
import { useMutation, gql } from '@apollo/client'
import Router from 'next/router'

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto ($id: ID! ) {
        eliminarProducto (id: $id) 
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

const Producto = ({producto}) => {

    //Mutation Para eliminar Productos
    const [eliminarProducto] =useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            //Obtener una copia del objeto de cache
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });

            // Reescribir Caché
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos : obtenerProductos.filter(productoActual => productoActual.id !== id)
                }
            })

        }
    });

    const { nombre, existencia, precio, id } = producto;
    // Eliminar un cliente
    const confirmarEliminarProducto = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este Producto?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText:  'No, Cancelar'
          }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    //Eliminar por ID
                    const { data } = await eliminarProducto({
                        variables: {
                            id
                        }
                    });
                    //console.log(data);

                    //Mostrar una alerta
                    Swal.fire(
                        'Correcto!',
                        data.eliminarProducto,
                        'success'
                  )                    
                } catch (error) {
                    console.log(error);
                }
            }
          })
     }

     const editarProducto = () => {
        Router.push ({
            pathname: '/editarproducto/[id]',
            query: { id: id },
        })

     }
    
    return (
        <tr>
            <td className='border px-4 py-2'>{nombre}</td>
            <td className='border px-4 py-2'>{existencia} Unidades</td>
            <td className='border px-4 py-2'>${precio}</td>
            <td className='border px-4 py-2'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => confirmarEliminarProducto()}
                >
                    Eliminar
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 ml-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg>

                </button>
            </td>
            <td className='border px-4 py-2'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => editarProducto()}
                >
                    Editar
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 ml-2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                </button>
            </td>
        </tr>
    );
}

export default Producto;