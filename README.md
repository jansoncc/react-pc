# React-admin-vite

本项目使用前端新型构建工具vite ， 更换了以往的webpack。

开箱即用，使其开发效率提高，编译速度更快，减少复杂配置。

在正式启动项目前，请检查本地环境版本。如若启动失败，请升级node。

react-admin-vite 适用于后台管理 web 项目的二次开发。让开发人员快速搭建后台管理项目。

请仔细阅读本文档以后再进行使用！

访问地址：<a target="_blank" href="https://jiangsihan.cn/frontend/reactadmin">https://jiangsihan.cn/frontend/reactadmin</a>

完整文档：<a target="_blank" href="https://jiangsihan.gitee.io/react-admin-vite-press">https://jiangsihan.gitee.io/react-admin-vite-press</a>

代码仓库：<a target="_blank" href="https://gitee.com/jiangsihan/react-admin-vite">https://gitee.com/jiangsihan/react-admin-vite</a>
## 技术分解

- react@18
- antd@4.24
- react-dom@18
- react-router-dom@6.3
- react-scripts@5.0
- react-Hooks
- redux
- vite
- axios
- less
- echarts
- eslint
- antv

## 技术文档

- react：https://react.docschina.org/
- vite：https://cn.vitejs.dev/guide/
- antd：https://4x.ant.design/components/button-cn/
- antv：http://antv.antfin.com/zh-cn/g2/3.x/demo/index.htm

## 环境版本

- node：v16.16.0   
- npm：v8.11.0
- react-scripts：v5.0.1
- vite：v4.1.0

## 目录说明

```
react-admin-vite 
│
└── public 
│
└── src
│   ├── api  ： 请求与接口配置文件
│   ├── assets ： 静态资源文件
│   ├── components  ： 公共组件存放文件
│   ├── hooks  ： hooks
│   └───pages  ： view视图组件文件
│       ├── Commonview  公共视图组件 包含菜单导航页面
│       ├── dashboard  首页
│       ├── login  登录
│       └───system  系统管理
│           ├── deptNew  机构管理
│           ├── permission  菜单管理
│           ├── roleUserList  角色管理
│           └───user  用户管理
│   	   
│   ├── redux  ： redux
│   ├── router  ： 路由菜单
│   ├── styles  ： 公共样式
│   ├── utils   ： 工具库
│   └───App.jsx  ： 入口文件
│
└── vite.config.js  ： vite配置
```

## 开始使用

git仓库

```
https://gitee.com/jiangsihan/react-admin-vite.git
```

安装依赖包

```
npm i  |  cnpm i 
```

项目启动

```
npm run dev
```

项目打包

```
npm run build
```

## 项目图片



![https://gitee.com/jiangsihan/react-admin-vite-press/raw/master/docs/pbulic/login.png](https://gitee.com/jiangsihan/react-admin-vite-press/raw/master/docs/pbulic/login.png)



![https://gitee.com/jiangsihan/react-admin-vite-press/raw/master/docs/pbulic/home.png](https://gitee.com/jiangsihan/react-admin-vite-press/raw/master/docs/pbulic/home.png)



![https://gitee.com/jiangsihan/react-admin-vite-press/raw/master/docs/pbulic/menu.png](https://gitee.com/jiangsihan/react-admin-vite-press/raw/master/docs/pbulic/menu.png)



![https://gitee.com/jiangsihan/react-admin-vite-press/raw/master/docs/pbulic/setting.png](https://gitee.com/jiangsihan/react-admin-vite-press/raw/master/docs/pbulic/setting.png)





项目构建日期：2023/03/15

jiangyiming621@163.com

Yiming_Jiang