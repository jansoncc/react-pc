//用于获取状态
import store from "@/redux/store";
import { message } from "antd"
import { setDayNight } from "@/utils/moment"
// import defaultTheme from "@/styles/theme/theme-default.less";
// import darkTheme from "@/styles/theme/theme-dark.less";
/**
 * @description 全局主题设置
 * */
import { setCookies, getCookies, removeCookies } from '@/utils/cookies'
const useTheme = () => {
	// 通知切换模式
	store.subscribe(() => {
		const { weakOrGray, darkTheme, autoTheme } = store.getState()
		// 灰色 色弱
		switch (weakOrGray) {
			case "gray":
				document.body.style.filter = "grayscale(1)";
				setCookies('weakOrGray', weakOrGray, 365)
				window.location.reload()
				break;
			case "weak":
				document.body.style.filter = "invert(80%)";
				setCookies('weakOrGray', weakOrGray, 365)
				window.location.reload()
				break;
			case false:
				document.body.style.removeProperty("filter");
				removeCookies("weakOrGray", 365)
				window.location.reload()
				break;
			default:
				break;
		}
		// 深夜模式
		if (darkTheme) {
			setCookies('darkTheme', darkTheme, 365)
			import("@/styles/theme/theme-dark.less")
			message.loading("正在切换深夜模式，请稍后")
			window.location.reload()
		} else if (darkTheme == false) {
			import("@/styles/theme/theme-default.less")
			removeCookies("darkTheme", 365)
			message.loading("正在切换白天模式，请稍后")
			window.location.reload()
		}
	})
	// 灰色 色弱
	switch (getCookies("weakOrGray")) {
		case "gray":
			document.body.style.filter = "grayscale(1)";
			break;
		case "weak":
			document.body.style.filter = "invert(80%)";
			break;
		default:
			document.body.style.removeProperty("filter");
			break;
	}
	// 深夜
	if (getCookies("darkTheme")) {
		import("@/styles/theme/theme-dark.less")
	}

};

export default useTheme;
