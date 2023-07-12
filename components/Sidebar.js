import React from 'react';
// import { isTypeAliasDeclaration } from 'typescript';
import Link from 'next/link';
import {useRouter} from 'next/router';

const Sidebar = () => {
    //Routing de next

    const router = useRouter();
    // console.log(router.pathname);
    
    return (
        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5" >
            <div>
                <p className='text-white text-2xl font-black'>CRM clientes</p>
            </div>
            <nav className="mt-5 list-none">
                <li className={router.pathname === "/" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link className="text-white block" href="/">
                          Clientes
                       </Link>
                </li>
                <li className={router.pathname === "/pedidos" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link className="text-white block" href="/pedidos">
                            Pedidos
                    </Link>
                </li>
                <li className={router.pathname === "/productos" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link className="text-white block" href="/productos">
                            Productos
                    </Link>
                </li>                
            </nav>

            <div className='sm:mt-10'>
                <p className='text-white text-2xl font-black'>Otras Opciones</p>
            </div>
            <nav className="mt-5 list-none">
               <li className={router.pathname === "/mejoresvendedores" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link className="text-white block" href="/mejoresvendedores">
                          Mejores Vendedores
                    </Link>
                </li>
                <li className={router.pathname === "/mejoresclientes" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link className="text-white block" href="/mejoresclientes">
                          Mejores Clientes
                    </Link>
                </li>
            </nav>
        </aside>
    );
}

export default Sidebar;