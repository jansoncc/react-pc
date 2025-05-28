/* @vite-ignore */ 

import React, { lazy } from "react";
//引入antd-icon
import * as Icon from "@ant-design/icons";
// 把接口获取的菜单重写
function setmenu(list) {
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    item.label = item.meta.title;
    item.key = item.path;
    if (item.meta.icon){ item.icon =  iconBC(item.meta.icon)};
    delete item.meta.title;
    delete item.path;
    delete item.meta.icon;
    item.element = lazy(importLocale(item.component));
    if (item.children) setmenu(item.children);
  }
  return list;
}
// 设置组件
function importLocale(locale) {
  // 判断 / 出现次数  用于匹配菜单组件 （pages目录下）
  let n = locale.split("/").length - 1;
  // vite动态导入方法
  let modules = import.meta.glob("@/pages/*/*");

  // 组件层级  0一级 ，1二级，2三级，3四级，4五级
  // pages下一级目录：commonview/index.jsx     login/index.jsx等等
  // pages下二级目录：dashboard/analysis/index.jsx    system/user/index.jsx等等
  switch (n) {
    case 0:
      modules = import.meta.glob("@/pages/*/*");
      break;
    case 1:
      modules = import.meta.glob("@/pages/*/*/*");
      break;
    case 2:
      modules = import.meta.glob("@/pages/*/*/*/*");
      break;
    case 3:
      modules = import.meta.glob("@/pages/*/*/*/*/*");
      break;
    case 4:
      modules = import.meta.glob("@/pages/*/*/*/*/*/*");
      //最多给你5级菜单目录，多了自己加。注意是菜单组件目录不是普通组件，我觉得没哪个傻逼会写好几级目录，菜单是系统设置-菜单管理里面添加的，注意下就行。
      break;
    default:
      break;
  }

  let component = modules[`/src/pages/${locale}/index.jsx`];


  // 一般页面找不到本地组件直接重定向302
  if (!component) component = () => import(`../components/error302`);

  //  系统组件涉及权限及隐私问题找不到本地组件重定向403
  // if (locale.includes('system') && !component) component = () => import(`../components/error403`)

  // const url = import(`../pages/${locale}`)  // vite不支持

  return component;
}
//创建节点的方法
function iconBC(name) {
  return React.createElement(Icon[name]);
}

export { setmenu, iconBC };
