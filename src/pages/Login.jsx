import React, { useContext } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, Card, Row } from 'antd'
import $host from '../utils/https'
import { login } from '../utils/urls'
import { UserContext } from '../context/userContext'

function Login() {
    const { setUser } = useContext(UserContext)
    const onFinish = ({ username, password }) => {
        $host
            .post(login, {
                username,
                password,
            })
            .then(function (response) {
                if (response.data.isOk) {
                    localStorage.setItem(
                        'access_token',
                        response.data.accessToken
                    )
                    localStorage.setItem(
                        'refresh_token',
                        response.data.refreshToken
                    )
                    localStorage.setItem('user', true)

                    setUser(true)
                }
                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    return (
        <Row justify='center' align='middle' style={{ height: '85%' }}>
            <Card title='Login' bordered={true} style={{ width: 300 }}>
                <Form
                    name='normal_login'
                    className='login-form'
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name='username'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input
                            prefix={
                                <UserOutlined className='site-form-item-icon' />
                            }
                            placeholder='Username'
                        />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={
                                <LockOutlined className='site-form-item-icon' />
                            }
                            type='password'
                            placeholder='Password'
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='login-form-button'
                            style={{ width: '100%' }}
                        >
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Row>
    )
}

export default Login
