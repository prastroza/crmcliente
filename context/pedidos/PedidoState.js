import React, { useReducer } from 'react';
import PedidoContext from './pedidocontext';
import PedidoReducer from './PedidoReducer';

import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTOS,
    ACTUALIZAR_TOTAL
} from '../../types'

const PedidoState = ({children}) => {
    // State de Pedidos
    const initialState = {
        cliente: {},
        productos: [],
        total: 0
    }

    const [state, dispach] = useReducer(PedidoReducer, initialState);

    //Modifica Cliente
    const agregarCliente = cliente => {
        //console.log(cliente);

        dispach({
            type: SELECCIONAR_CLIENTE,
            payload: cliente

        })
    }

    const agregarProducto = productosSeleccionados => {
        //console.log(cliente);
        let nuevoState;
        if(state.productos.length > 0){
            // Tomar del segundo arrteglo, una copia para asignarlo al primero
            nuevoState = productosSeleccionados.map(producto => {
                const nuevoObjeto = state.productos.find( productoState => productoState.id === producto.id )
                return{...producto,...nuevoObjeto}
            })
            
        } else {
            nuevoState = productosSeleccionados;
        }

        dispach({
            type: SELECCIONAR_PRODUCTO,
            payload: nuevoState

        })
    }

    //Modifica las cantidades de los productos

    const cantidadProductos = (nuevoProducto) => {
        dispach({
            type: CANTIDAD_PRODUCTOS,
            payload: nuevoProducto

        })
    }

    const actualizarTotal = () => {
        dispach({
            type: ACTUALIZAR_TOTAL

        })
    }

    return (
        <PedidoContext.Provider
            value = {{
                    cliente: state.cliente,
                    productos: state.productos,
                    total: state.total,
                    agregarCliente,
                    agregarProducto,
                    cantidadProductos,
                    actualizarTotal
            }}
        > {children}

        </PedidoContext.Provider>

    )
}

export default PedidoState;