
const defaultState = {
    reload: false,
    darkTheme: false,//深夜模式
    weakOrGray: false,//色弱/灰色
    ThemeStyle: "light",//导航风格
    pattern: "broadside",//导航模式
}

const reducer = (preState = defaultState, action) => {
    const { type, data } = action

    switch (type) {
        case 'reload':
            return {
                reload: data
            }
        case "darkTheme":
            return {
                darkTheme: data
            }
        case 'weakOrGray':
            return {
                weakOrGray: data
            }
        case 'ThemeStyle':
            return {
                ThemeStyle: data
            }
        case 'pattern':
            return {
                pattern: data
            }
        default:
            return defaultState
    }
}

export default reducer