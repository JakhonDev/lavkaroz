import Attributes from '../pages/Attributes'
import Categories from '../pages/Categories'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Orders from '../pages/Orders'
import PageNotFound, { PageNotFoundLogin } from '../pages/PageNotFound'
import ProductAdd from '../pages/ProductAdd'
import Products from '../pages/Products'

export const mainRoute = [
    {
        id: 1,
        component: <Home />,
        path: '/',
    },
    {
        id: 2,
        component: <Products />,
        path: '/products',
    },
    {
        id: 3,
        component: <Categories />,
        path: '/categories',
    },
    {
        id: 4,
        component: <ProductAdd />,
        path: '/product-add',
    },
    {
        id: 5,
        component: <Orders />,
        path: '/orders',
    },
    {
        id: 6,
        component: <Attributes />,
        path: '/attributes',
    },
    {
        id: 7,
        component: <PageNotFound />,
        path: '*',
    },
]

export const loginRoute = [
    {
        id: 1,
        component: <Login />,
        path: '/login',
    },
    {
        id: 2,
        component: <PageNotFoundLogin />,
        path: '*',
    },
]
