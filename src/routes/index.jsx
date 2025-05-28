import { UserOutlined, HomeOutlined } from '@ant-design/icons';
// 使用路由懒加载
import React, { lazy } from "react";
import getMenu from "@/routes/routerConfig";
//用于获取状态
import store from "@/redux/store";

import {
    setmenu
} from "@/routes/setRouter"



// 基础菜单
let routes = [
    {
        label: "首页",
        key: "/dashboard/analysis",
        element: lazy(() => import("@/pages/dashboard/analysis")),
        icon: <HomeOutlined />,
        disabled: false,
    },
    {
        label: "系统管理",
        key: "/system",
        element: "",
        icon: <UserOutlined />,
        children: [
            {
                label: "用户管理",
                key: "/system/user",
                element: lazy(() => import("@/pages/system/user")),
                icon: null,
                disabled: false,
            },
            {
                label: "角色管理",
                key: "/system/roleUserList",
                element: lazy(() => import("@/pages/system/roleUserList")),
                icon: null,
                disabled: false,
            },
            {
                label: "菜单管理",
                key: "/system/permission",
                element: lazy(() => import("@/pages/system/permission")),
                icon: null,
                disabled: false,
            },
            {
                label: "机构管理",
                key: "/system/deptNew",
                element: lazy(() => import("@/pages/system/deptNew")),
                icon: null,
                disabled: false,
            },
        ],
        disabled: false,
    },
]


// 登录后刷新页面
store.subscribe(() => {
    const { reload } = store.getState()
    // if (reload) location.reload()
})
console.log(1234);

const token = JSON.parse(localStorage.getItem(window.envConfig['ROOT_APP_INFO']))?.token
const menu = JSON.parse(localStorage.getItem(window.envConfig['ROOT_APP_INFO']))?.menuList
if (token) getMenu();

// 从接口请求菜单
if (token && menu) {
    // routes = setmenu(await getMenu())
    routes = setmenu(menu)
    // function setIcon(res) {
    //     for (let i = 0; i < res.length; i++) {
    //         const element = res[i];
    //         let IconItem = element.icon
    //         // element.icon = < Icon component={IconItem} />
    //         if (IconItem) element.icon = iconBC(IconItem)
    //         if (element.children) setIcon(element.children)
    //     }
    // }
    // setIcon(routes)

}
export default routes