import {
    HomeOutlined,
    AppstoreOutlined,
    AppstoreAddOutlined,
    UnorderedListOutlined,
    ApartmentOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { mainRoute } from '../utils/routes'
const { Content, Sider } = Layout

function Main() {
    const navigate = useNavigate()
    const [activeMenu, setActiveMenu] = useState([])
    const location = useLocation()

    const menuData = [
        {
            id: 1,
            label: 'Home',
            icon: <HomeOutlined />,
            path: '/',
        },

        {
            id: 2,
            label: 'Products',
            icon: <AppstoreOutlined />,
            path: '/products',
        },

        {
            id: 3,
            label: 'Product Add',
            icon: <AppstoreAddOutlined />,
            path: '/product-add',
        },

        {
            id: 4,
            label: 'Categories',
            icon: <UnorderedListOutlined />,
            path: '/categories',
        },

        {
            id: 5,
            label: 'Attributes',
            icon: <ApartmentOutlined />,
            path: '/attributes',
        },

        {
            id: 6,
            label: 'Orders',
            icon: <ShoppingCartOutlined />,
            path: '/orders',
        },
    ]

    const items2 = menuData.map((item) => {
        return {
            key: item.id,
            icon: item.icon,
            label: <Link to={item.path}>{item.label}</Link>,
        }
    })

    useEffect(() => {
        if (location.pathname === '/login') {
            navigate('/')
        }
        for (let route of menuData) {
            if (location.pathname === route.path) {
                setActiveMenu([`${route.id}`])
            }
        }
    }, [location])

    return (
        <Layout>
            <Sider width={200}>
                <Menu
                    mode='inline'
                    selectedKeys={activeMenu}
                    style={{
                        height: '100%',
                    }}
                    items={items2}
                />
            </Sider>
            <Content
                style={{
                    padding: '0 24px',
                    minHeight: 280,
                    backgroundColor: '#fff',
                }}
            >
                <Routes>
                    {mainRoute.map((route) => {
                        return (
                            <Route
                                key={route.id}
                                path={route.path}
                                element={route.component}
                            />
                        )
                    })}
                </Routes>
            </Content>
        </Layout>
    )
}

export default Main
