import React, { useContext, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Main from './components/Main'
import { UserContext } from './context/userContext'
import { loginRoute } from './utils/routes'

function App() {
    const { user } = useContext(UserContext)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user && location.pathname === '/') {
            navigate('/login')
        }
    }, [location])
    return (
        <>
            <Header />

            {user ? (
                <Main />
            ) : (
                <Routes>
                    {loginRoute.map((route) => {
                        return (
                            <Route
                                key={route.id}
                                path={route.path}
                                element={route.component}
                            />
                        )
                    })}
                </Routes>
            )}
        </>
    )
}

export default App
