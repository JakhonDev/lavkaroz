import React from 'react'
import { PageHeader, Image, Select } from 'antd'
import logo from '../assets/images/logo.svg'
import { Option } from 'antd/lib/mentions'                                                                 

function Header() {
    return (
        <div>
            <PageHeader
                className='header'
                title={<Image src={logo} preview={false} />}
                extra={[
                    <Select defaultValue={'uz'} style={{ width: 120 }}>
                        <Option value='uz'>Uzbek</Option>
                        <Option value='ru'>Rus</Option>
                    </Select>,
                ]}
            />
        </div>
    )
}

export default Header
