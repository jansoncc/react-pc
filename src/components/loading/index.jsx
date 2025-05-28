import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

import "./index.less";
import { Space, Spin } from 'antd';

const Loading = () => {
    // location.reload()
    return (
        <>
            <div className="loading">
                <Space>
                    <Spin size="large" />
                </Space>
            </div>
        </>
    )
}

export default Loading;