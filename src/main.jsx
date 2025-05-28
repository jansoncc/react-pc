import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import en_US from 'antd/lib/locale-provider/en_US';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn'; //不加这个切换中文时，日期组件年是中文，月是英文。。。。
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ConfigProvider locale={zh_CN}>
    <App />
  </ConfigProvider>
  // </React.StrictMode>,
)
