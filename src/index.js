import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'antd/dist/antd.min.css'
import './assets/style/main.css'
import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from './context/userContext'

const root = ReactDOM.createRoot(document.querySelector('.wrapper'))
root.render(
    <BrowserRouter>
        <UserContextProvider>
            <App />
        </UserContextProvider>
    </BrowserRouter>
)
