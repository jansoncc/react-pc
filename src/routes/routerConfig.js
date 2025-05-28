import request from '@/api'
import { lazy } from "react";
import routes from "@/assets/router.json";
const getMenu = () => {
    // 模拟登录
    return new Promise((resolve,rejec)=>{
        let appInfo = JSON.parse(localStorage.getItem(window.envConfig['ROOT_APP_INFO']))
        appInfo.menuList = routes.result.menu
        localStorage.setItem(window.envConfig['ROOT_APP_INFO'], JSON.stringify(appInfo))
        resolve(routes.result.menu)
        return routes.result.menu
    })

    
    // 真实登录 返回数据参考router.json
    return request.getMenuBar({ _t: "1682558421" }).then((res) => {
        if (res.data.code = 200) {
            let list = res.data.result.menu
            let appInfo = JSON.parse(localStorage.getItem(window.envConfig['ROOT_APP_INFO']))
            appInfo.menuList = res.data.result.menu
            localStorage.setItem(window.envConfig['ROOT_APP_INFO'], JSON.stringify(appInfo))
            return list
        }
    })
}

export default getMenu