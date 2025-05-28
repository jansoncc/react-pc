import React, { usestate, useContext } from "react";
//暴露出方法，让组件使用这个context转换px
const styleToPx = React.createContext();
export function usestyleTopx() {
    return useContext(styleToPx)
}
export function ViewportProvider({ children }) {
    function pxToVw(px) {
        return px / 1920 * 100 + vw
    }
    return (
        <styleToPx.Provider value={pxToVw}>{children}</styleToPx.Provider>
    )
}