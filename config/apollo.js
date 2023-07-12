import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import {setContext } from 'apollo-link-context';
// import fetch from 'node-fetch';

//Donde se conecte
const httpLink = createHttpLink({
    uri: ' http://localhost:4000/',
});

//Agregamos Header
const authLink = setContext((_, { headers }) => {

    const token = localStorage.getItem('token');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }

});

//Conectamos a Apollo
const client = new ApolloClient({
    connectToDevTools:true,
    cache: new InMemoryCache(),
    link: authLink.concat( httpLink )
});


export default client;