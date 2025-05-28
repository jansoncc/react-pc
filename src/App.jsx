import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import AutnToken from "@/components/autnToken"
import Commonview from "@/pages/commonview";
import { ViewportProvider } from "@/components/toStylePx"
import Login from "@/pages/login";
import Error from "@/components/error404";
import '@/App.css'

import useTheme from './hooks/useTheme';
import { setCookies, getCookies, removeCookies } from '@/utils/cookies'
function App() {
  useTheme()
  // 主题配色
  let ThemeBgColor = getCookies("ThemeBgColor") || window.envConfig['ROOT_APP_COLOR']
  // 如果本地没有主题色字段，默认加载
  if (!ThemeBgColor) {
    // import("@/styles/root.css")
  } else {
    switch (ThemeBgColor) {
      case '#2f54eb'://深海蓝
        import("@/styles/theme/2f54eb.less")
        break;
      case '#f5222d'://火山红
        import("@/styles/theme/f5222d.less")
        break;
      case '#fa541c'://浅红
        import("@/styles/theme/fa541c.less")
        break;
      case "#faad14"://日暮
        import("@/styles/theme/faad14.less")
        break;
      case "#13C2C2"://明青
        import("@/styles/theme/13C2C2.less")
        break;
      case "#52c41a": //草绿
        import("@/styles/theme/52c41a.less")
        break;
      case "#a876ed": //熏紫
        import("@/styles/theme/a876ed.less")
        break;
      default:
        break;
    }
  }
  return (
    <ViewportProvider>
      <HashRouter>
        {/* 只匹配一个，匹配成功就不往下匹配，效率高, react-router-dom v6写法 ：父/根路径需要指定 * 通配符*/}
        <Routes>

          {/* 指定首屏 */}
          <Route path="/" element={<Navigate to="/dashboard/analysis" />} />

          {/* 登录页 */}
          <Route path="/login" element={<Login />}></Route>

          {/*   react-router-dom v6写法 ：父/根路径需要指定 * 通配符   */}
          <Route path="/*" element={<AutnToken><Commonview /></AutnToken>}></Route>
          {/*配置404页面*/}
          <Route path="/error404" element={<Error />}></Route>
        </Routes>
      </HashRouter>
    </ViewportProvider>
  )
}


console["\x6c\x6f\x67"](`%c ${window["\x65\x6e\x76\x43\x6f\x6e\x66\x69\x67"]['\x52\x4f\x4f\x54\x5f\x41\x50\x50\x5f\x4e\x41\x4d\x45']} %c 2023-04-26 <Yiming_Jiang> %c`, '\x62\x61\x63\x6b\x67\x72\x6f\x75\x6e\x64\x3a\x23\x33\x35\x34\x39\x35\x65 \x3b \x70\x61\x64\x64\x69\x6e\x67\x3a \x31\x70\x78\x3b \x62\x6f\x72\x64\x65\x72\x2d\x72\x61\x64\x69\x75\x73\x3a \x33\x70\x78 \x30 \x30 \x33\x70\x78\x3b  \x63\x6f\x6c\x6f\x72\x3a \x23\x66\x66\x66\x3b\x66\x6f\x6e\x74\x2d\x73\x69\x7a\x65\x3a\x32\x30\x70\x78', '\x62\x61\x63\x6b\x67\x72\x6f\x75\x6e\x64\x3a\x23\x34\x31\x62\x38\x38\x33 \x3b \x70\x61\x64\x64\x69\x6e\x67\x3a \x31\x70\x78\x3b \x62\x6f\x72\x64\x65\x72\x2d\x72\x61\x64\x69\x75\x73\x3a \x30 \x33\x70\x78 \x33\x70\x78 \x30\x3b  \x63\x6f\x6c\x6f\x72\x3a \x23\x66\x66\x66\x3b\x66\x6f\x6e\x74\x2d\x73\x69\x7a\x65\x3a\x32\x30\x70\x78', '\x62\x61\x63\x6b\x67\x72\x6f\x75\x6e\x64\x3a\x74\x72\x61\x6e\x73\x70\x61\x72\x65\x6e\x74\x3b')
console["\x6c\x6f\x67"](window["\x65\x6e\x76\x43\x6f\x6e\x66\x69\x67"]);
export default App
