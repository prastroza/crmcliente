import react, {useState, useEffect, useContext } from 'react';
import Select from 'react-select'
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

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

const AsignarProducto = () => {
    const [productos, setProductos] = useState([]);

    //Context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const {agregarProducto} = pedidoContext;
    
    //Consultar la Base de Datos
    const {data, loading, error} = useQuery(OBTENER_PRODUCTOS);
    // console.log(data);
    // console.log(loading);
    // console.log(error);
    useEffect(()=> {
        //console.log(productos);
        agregarProducto(productos);


    }, [productos])

    const seleccionarProducto = producto => {
        //console.log(producto);
        setProductos(producto);
    }

    //Resultado de la consulta
    if(loading) return null;

    const {obtenerProductos} = data;


    return (
        <>
            <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold' >2.- Selecciona o Busca los Productos</p>
            <Select
                className='mt-3'
                options={obtenerProductos}
                isMulti='true'
                onChange ={ opcion => seleccionarProducto(opcion) }
                getOptionValue ={ (opciones) => opciones.id}
                getOptionLabel ={ (opciones) => `${opciones.nombre} - ${opciones.existencia} Disponibles`}
                placeholder='Busque o Seleccione el Producto'
                noOptionsMessage={ () => 'No hay Resultados'}
            />
        </>
    );
}

export default AsignarProducto;