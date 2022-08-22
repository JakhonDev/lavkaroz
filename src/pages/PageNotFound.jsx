import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function PageNotFound() {
    const navigate = useNavigate()
    return (
        <Result
            status='404'
            title='404'
            subTitle='Sorry, the page you visited does not exist.'
            extra={
                <Button type='primary' onClick={() => navigate('/')}>
                    Back Home
                </Button>
            }
        />
    )
}

export function PageNotFoundLogin() {
    const navigate = useNavigate()
    return (
        <Result
            status='404'
            title='404'
            subTitle='Sorry, the page you visited does not exist.'
            extra={
                <Button type='primary' onClick={() => navigate('/login')}>
                    Back Login
                </Button>
            }
        />
    )
}

export default PageNotFound
