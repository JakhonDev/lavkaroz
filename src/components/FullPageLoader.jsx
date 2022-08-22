import { Spin } from 'antd'
import React from 'react'

function FullPageLoader() {
    return (
        <div className='loaderPage'>
            {' '}
            <Spin size='large' />
        </div>
    )
}

export default FullPageLoader
