import React, { useState, useRef, useEffect } from "react";
import {
  Layout,
  Menu,
  Popconfirm,
  Dropdown,
  Tooltip,
  Tabs,
  notification,
  TreeSelect,
  Modal,
} from "antd";
import Icon, {
  ExclamationCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  BarsOutlined,
  SettingOutlined,
  CloseOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "./index.less";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  setmenu
} from "@/routes/setRouter"
import logo from "@/assets/images/favicon.png";
import nprogress from "nprogress";
import "@/components/progress/index.less";
import Loading from "@/components/loading";
// import routes from "@/routes";
import ChangePassword from "@/components/users/changePassword/changePassword.jsx";
import Setting from "@/components/Setting";
import Contextmenu from "@/components/Contextmenu";
//用于获取状态
import store from "@/redux/store";
import { setCookies, getCookies, removeCookies } from "@/utils/cookies";
import { dateState } from "@/utils/moment";

const { Header, Content, Footer, Sider } = Layout;

const Commonview = () => {
  let SettingRef = useRef(null);
  let ContextmenuRef = useRef(null);
  //路由加载进度条
  nprogress.start();
  setTimeout(() => {
    nprogress.done();
  }, 200);

  let titleH2 = window.envConfig.ROOT_APP_NAME;
  let navigate = useNavigate();
  let location = useLocation();

  let [current, setCurrent] = useState(location.pathname);
  let [defaultOpenKeys, setDefaultOpenKeys] = useState(location.pathname);
  let [collapsed, setCollapsed] = useState(false);
  let [title, setTitle] = useState(true);
  let [routeList, setRouteList] = useState([]);
  let [Stylebg, setStylebg] = useState("");
  let [pattern, setPattern] = useState("broadside"); //导航模式
  let [styWidth, setStyWidth] = useState(); //内容宽度
  let [styNav, setStyNav] = useState(); //固定导航
  let [fullScreen, setFullScreen] = useState(false); //全屏
  let ThemeStyle = getCookies("ThemeStyle") || "light";
  let patternStyle = getCookies("pattern");
  let widthStyle = getCookies("widthStyle");
  let navStyle = getCookies("navStyle");
  let darkTheme = getCookies("darkTheme")
  let [loading, setLoading] = useState(true)
  let [routes, setRoutes] = useState([])
  useEffect(() => {
    setCurrent(location.pathname)
    const { menuList } = JSON.parse(localStorage.getItem(window.envConfig['ROOT_APP_INFO']))
    // 标签栏
    routerFun(setmenu(menuList))
  }, [location])
  useEffect(() => {
    const { menuList } = JSON.parse(localStorage.getItem(window.envConfig['ROOT_APP_INFO']))

    setRoutes(setmenu(menuList))
    menuList.map(item => {
      if (item.label == "首页") {
        setRouteList([{
          ...item,
          colordisabled: 'true'
        }])
      }
    })

  }, [])
  useEffect(() => {
    const { menuList } = JSON.parse(localStorage.getItem(window.envConfig['ROOT_APP_INFO']))
    // 标签栏
    routerFun(setmenu(menuList))
  }, [])

  useEffect(() => {
    // 判断是否是登录页进入首页
    const Jiaxiaohan = localStorage.getItem("Jiaxiaohan");
    if (Jiaxiaohan) {
      const userInfo = JSON.parse(
        localStorage.getItem(window.envConfig["ROOT_APP_INFO"])
      )?.userInfo;
      notification.success({
        message: userInfo.realname,
        description: "欢迎登录，" + dateState() + "好",
      });
    }
    setTimeout(() => {
      localStorage.removeItem("Jiaxiaohan");
    }, 2000);
  }, []);
  useEffect(() => {
    if (fullScreen) {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      if (
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      ) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  }, [fullScreen]);
  useEffect(() => {
    // 导航模式
    if (patternStyle) setPattern(patternStyle)
    setStyWidth(widthStyle)
    setStyNav(navStyle)
    // 获取导航模式
    store.subscribe(() => {
      const { pattern } = store.getState()
      setPattern(pattern)
    })
    setTimeout(() => {
      setLoading(false)
      loading = false
    }, 0);
    console.log(loading);
    // if (loading == true) return
    // 设置导航颜色
    if (ThemeStyle) {
      setStylebg(ThemeStyle)
      // if (ThemeStyle == "light") {
      //     const sider = document.getElementsByClassName("ant-layout-sider")[0]
      //     sider.style.background = "#fff"

      // } else {
      //     const sider = document.getElementsByClassName("ant-layout-sider")[0]
      //     sider.style.background = "#001529"
      // }
    }
  }, []);

  // 点击菜单
  const onClick = (e) => {
    navigate(e.key);
    setCurrent(e.key);
  };
  // 退出登录
  const logOut = () => {
    Modal.confirm({
      title: "确认退出登录",
      icon: <ExclamationCircleOutlined />,
      content: "退出登录后将清除账号所有本地信息及数据！",
      okText: "确认",
      cancelText: "取消",
      style: {
        top: 200,
      },
      onOk: async () => {
        // await request.logout({});//登出接口
        localStorage.removeItem(window.envConfig["ROOT_APP_INFO"]);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        // notification.success({
        //     message: "账号退出成功",
        //     description: "欢迎下次登录",
        // });
      },
    });
  };


  // 标签栏
  function routerFun(array) {//递归
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      element.colordisabled = 'false'
      if (location.pathname == element?.key) {
        element.colordisabled = 'true'
        // 网页标签名
        document.title = element.label == "首页" ? window.envConfig.ROOT_APP_NAME : element.label + " - " + window.envConfig.ROOT_APP_NAME
        setRouteList((e) => {
          const keys = [...new Set([...e, element].map(item => item.key))]
          const list = keys.map(key => {
            return [...e, element].find(item => item.key == key)
          })
          const i = list.map(item => {
            return {
              ...item,
              colordisabled: location.pathname == item.key ? 'true' : "false"
            }
          })
          console.log(i);
          return i
        })
      }
      if (element.children) routerFun(element.children)

    }


  }
  // 删除标签栏
  const delRouter = (item, index) => {
    if (routeList.length == 1) {
      //仅剩一个停止继续执行
      return;
    }
    if (location.pathname == item.key) {
      //判断点击路由是否为当前路由
      if (index == routeList.length - 1) {
        //点击路由是否为最后一个 如果是删除之前就跳转上一个路由
        navigate(routeList[index - 1].key); //删除前跳转上一个路由
        setCurrent(routeList[index - 1].key); //更新菜单选中标识
      } else {
        navigate(routeList[index + 1].key); //删除前跳转下一个路由
        setCurrent(routeList[index + 1].key); //更新菜单选中标识
      }
    }
    routeList.splice(index, 1); //删除当前路由
    setRouteList(routeList); //更新视图
  };
  // 标签栏跳转
  const toRouter = (item) => {
    navigate(item.key);
    setCurrent(item.key);
  };

  // 后台布局设置
  const setting = () => {
    SettingRef.current.setSettingVisible(true);
  };

  // 标签栏设置
  const tabBar = ({ key }) => {
    let e = {} //当前组件
    let i = 0 // 当前
    routeList.map((item, index) => {
      if (item.key == current) {
        e = item
        i = index
      }
    })

    switch (key) {
      case "1"://关闭当前 
        if (e.label != "首页") delRouter(e, i)
        break;
      case "2": // 关闭其他
        //保存首页
        let home = routeList[0]
        routeList = [home]
        // 追加当前
        routeList.push(e)
        // 去重
        const list = routeList?.filter((item, index, self) =>
          index === self.findIndex((t) => (t.id === item.id))
        )
        setRouteList(list)//更新视图
        break;
      case "3": //关闭所有
        let h = routeList[0]
        routeList = [h]
        setCurrent(h.key)
        navigate(h.key)//跳转首页
        setRouteList(routeList)//更新视图
        break;
      default:
        break;
    }
  }

  // 右键标签
  const onContextmenu = (e) => {
    e.preventDefault()
    ContextmenuRef.current.showContext(e)
  }
  // 关闭左侧
  const closeLeftMenu = (e) => {
    const index = routeList.findIndex(obj => obj.label == e.trim())
    if (index !== -1) {
      const home = routeList.filter(obj => obj.label == '首页')
      const newArray = [...home, ...routeList.slice(index)]
      // 去重
      const list = newArray?.filter((item, index, self) =>
        index === self.findIndex((t) => (t.id === item.id))
      )
      setRouteList(list)
    } else {
      notification.warning({
        message: "系统内部错误",
        description: "Review the commonview component.",
      });
    }

  }
  // 关闭右侧
  const closeRightMenu = (e) => {
    const index = routeList.findIndex(obj => obj.label == e.trim())
    if (index !== -1) {
      const newArray = routeList.slice(0, index + 1)
      const result = routeList.find(obj => obj.label == e.trim())
      navigate(result.key)
      setRouteList(newArray)
    } else {
      notification.warning({
        message: "系统内部错误",
        description: "Review the commonview component.",
      });
    }

  }
  // 关闭其他
  const closeElseMenu = (e) => {
    const home = routeList.filter(obj => obj.label == '首页')
    const result = routeList.find(obj => obj.label == e.trim())
    const newArray = [...home, result]
    navigate(result.key)
    // 去重
    const list = newArray?.filter((item, index, self) =>
      index === self.findIndex((t) => (t.id === item.id))
    )
    setRouteList(list)
  }
  return (
    <>
      {
        loading ? <Loading /> :
          <div className="commonview">
            {pattern == "broadside" ? (
              <Sider
                width={200}
                className="site-layout-background"
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ background: Stylebg == "dark" ? "#001529" : "#fff", }}
              >
                <div className="logo" style={{ background: Stylebg == "dark" ? "#001529" : "#fff", }}>
                  <img src={logo} alt="" className="favicon" />
                  {title ? (
                    <span
                      className="logoTitle"
                      style={{
                        color:
                          ThemeStyle && ThemeStyle == "light" ? "#000000D9" : "",
                      }}
                    >
                      {titleH2}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <Menu
                  theme={Stylebg}
                  onClick={onClick}
                  style={{ width: "100%" }}
                  defaultOpenKeys={[defaultOpenKeys]}
                  selectedKeys={[current]}
                  mode="inline"
                  items={routes}
                />
              </Sider>
            ) : (
              ""
            )}
            <Layout className="site-layout">
              <Header
                className="site-layout-background"
                style={{
                  padding: pattern == "broadside" ? "0 1.5vw 0 0" : 0,
                  position: pattern == "top" && styNav == "true" ? "fixed" : "",
                  minWidth: pattern == "top" && styNav == "true" ? "100%" : "",
                  top: pattern == "top" && styNav == "true" ? "0" : "",
                }}
              >
                {pattern == "broadside"
                  ? React.createElement(
                    collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                    {
                      className: "trigger",
                      onClick: () => {
                        setCollapsed(!collapsed);
                        setTitle(!title);
                      },
                    }
                  )
                  : ""}

                <div
                  className="headBox"
                  style={{
                    // padding: pattern == "broadside" ? 0 : "0 0.5vw",
                    background:
                      Stylebg == "dark" && pattern == "top" ? "#001529" : "#fff",
                    color: Stylebg == "dark" && pattern == "top" ? "#fff" : "#000",
                    padding:
                      pattern == "top" && styWidth == "true" ? `0 10vw` : "0 0.5vw",
                    minWidth:
                      pattern == "top" && styNav == "true" ? "78.13vw" : "100%",
                  }}
                >
                  <span>
                    {pattern == "broadside" ? (
                      "欢迎登录"
                    ) : (
                      <img src={logo} alt="" className="headBox-logo" />
                    )}
                    {titleH2}
                  </span>
                  {pattern == "top" ? (
                    <Menu
                      theme={Stylebg}
                      onClick={onClick}
                      defaultOpenKeys={[defaultOpenKeys]}
                      selectedKeys={[current]}
                      mode="horizontal"
                      items={routes}
                      style={{
                        borderBottom: 0,
                        width: pattern == "top" ? "60%" : "",
                      }}
                    />
                  ) : (
                    ""
                  )}
                  <div className="userinfo">
                    {pattern == "top" ? (
                      ""
                    ) : (
                      <MenuSearch
                        toRouter={(e) => {
                          toRouter(e);
                        }}
                      />
                    )}
                    <Tooltip title={fullScreen ? "退出全屏" : "全屏显示"}>
                      <span
                        className="user-Setting"
                        onClick={() => setFullScreen(!fullScreen)}
                      >
                        {fullScreen ? (
                          <FullscreenExitOutlined />
                        ) : (
                          <FullscreenOutlined />
                        )}
                      </span>
                    </Tooltip>
                    <Tooltip title="后台布局设置">
                      <span className="user-Setting" onClick={setting}>
                        <SettingOutlined spin />
                      </span>
                    </Tooltip>
                    <UserInfo />
                    <span className="tuichu" onClick={logOut}>
                      <LogoutOutlined />
                      退出登录
                    </span>
                    {/* <Popconfirm title="真的要注销登录吗 ?" okText="确认" cancelText="取消" onConfirm={logOut}>
                                    
                                </Popconfirm> */}
                  </div>
                </div>
              </Header>
              {/* 标签栏 */}
              <div
                className="tabsList-box"
                style={{
                  padding:
                    pattern == "top" && styWidth == "true"
                      ? "0 10vw"
                      : "0 0 0 0.5vw",
                  marginTop: pattern == "top" && styNav == "true" ? "3.3vw" : "",
                }}
              >
                <div className="tabsList-box-view">
                  <div className="breadcrumb">
                    <Tabs
                      defaultActiveKey="1"
                      onContextMenu={onContextmenu}
                      items={routeList.map((item, index) => {
                        const id = String(index);
                        return {
                          label: (
                            <div
                              className="breadcrumb-box"
                              style={{
                                color:
                                  item.colordisabled == "true"
                                    ? "var(--main-bg)"
                                    : "",
                              }}
                            >
                              <span>{item.icon}</span>
                              <span
                                onClick={() => {
                                  toRouter(item);
                                }}
                                className="breadcrumbTitle"
                              >
                                {" "}
                                {item.label}
                              </span>
                              {index != 0 ? (
                                <CloseOutlined
                                  onClick={() => {
                                    delRouter(item, index);
                                  }}
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          ),
                          key: id,
                        };
                      })}
                    />
                  </div>
                  <div className="tabBarDetails">
                    <Dropdown
                      menu={{
                        items: [
                          {
                            label: <a> 关闭当前</a>,
                            key: "1",
                          },
                          {
                            label: <a> 关闭其他</a>,
                            key: "2",
                          },
                          {
                            label: <a> 关闭所有</a>,
                            key: "3",
                          },
                        ],
                        onClick: (e) => tabBar(e),
                      }}
                      arrow={{
                        pointAtCenter: true,
                      }}
                    >
                      <BarsOutlined />
                    </Dropdown>
                  </div>
                </div>
              </div>
              <Content
                style={{
                  margin:
                    pattern == "top" && styWidth == "true" ? "1vw 10vw" : "0.5vw",
                }}
              >
                {/* 配置路由子组件 */}
                <Routes>
                  {getRoutes(routes)}
                  {/* 重定向404 */}
                  <Route path="*" element={<Navigate to="/error404" />}></Route>
                </Routes>
              </Content>
              <Author className="author" />
              {/* 设置 */}
              <Setting ref={SettingRef} />
              {/* 标签栏右键 */}
              <Contextmenu
                ref={ContextmenuRef}
                closeLeftMenu={closeLeftMenu}
                closeRightMenu={closeRightMenu}
                closeElseMenu={closeElseMenu}
              />
            </Layout>
          </div>
      }
    </>
  );
};
function Author() {
  return (
    <div className="author">
      <p> React-Ant-Admin © 2025 <a href="https://gitee.com/jiangsihan/React-admin" target="_blank">React-Ant-Admin@v2.0.0  </a>
          @ <a href="https://jiangsihan.cn/" target="_blank">前端江太公</a>  <a href="https://jiangyiming.cn/" target="_blank">江一铭</a> <a href="mailto:jiangyiming621@163.com"> Send email to Yiming-Jiang</a> </p>
    </div>
  )
}
function UserInfo() {
  const userInfo = JSON.parse(
    localStorage.getItem(window.envConfig["ROOT_APP_INFO"])
  )?.userInfo;
  const passwordRef = useRef(null);
  const onMenu = ({ key }) => {
    switch (key) {
      case "1":
        passwordRef.current.setIsModalVisible(true);
        passwordRef.current.form.setFieldsValue({
          username: userInfo.username,
        });
        break;

      default:
        break;
    }
  };
  return (
    <>
      <Dropdown
        menu={{
          items: [
            {
              label: <a> 修改密码</a>,
              key: "1",
            },
          ],
          onClick: (e) => onMenu(e),
        }}
        arrow={{
          pointAtCenter: true,
        }}
      >
        <span className="userName">{userInfo?.realname}</span>
      </Dropdown>
      {/* 修改密码 */}
      <ChangePassword ref={passwordRef} />
    </>
  );
}
// 遍历路由组件
function getRoutes(routes) {
  const routesElement = routes.map((item, index) => {
    return (
      <React.Fragment key={index}>
        <Route
          path={item.key}
          element={
            //  react懒加载，必须要loading
            <React.Suspense fallback={<Loading />}>
              <item.element />
            </React.Suspense>
          }
          key={index}
        ></Route>
        {item.children ? getRoutes(item.children) : null}
      </React.Fragment>
    );
  });
  return routesElement;
}

// 搜索菜单
function MenuSearch(props) {
  let navigate = useNavigate();
  const [value, setValue] = useState(undefined);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const menuList = JSON.parse(
      localStorage.getItem(window.envConfig["ROOT_APP_INFO"])
    )?.menuList;
    function resetMenu(list) {
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        element.title = element.meta.title;
        element.value = element.path;
        if (element.children) resetMenu(element.children);
      }
    }

    resetMenu(menuList);
    console.log(menuList);
    setTreeData(menuList);
  }, []);
  const onChange = (newValue) => {
    var path = "";
    treeData.forEach((element) => {
      if (element.path == newValue && element.children) {
        path = element.children[0].path;
      }
      if (!element.children) {
        path = newValue;
      }
    });
    setValue(path);
    if (path) {
      let i = {
        key: path,
      };
      console.log(i);
      props.toRouter(i);
    }
  };
  // 自定义筛选函数，可以筛选中文内容
  const filterTreeNode = (inputValue, treeNode) => {
    // 使用 title 和 value 属性进行筛选
    return treeNode.title.includes(inputValue);
  };
  return (
    <>
      <TreeSelect
        showSearch
        className="searchmenu"
        value={value}
        dropdownStyle={{
          maxHeight: 400,
          overflow: "auto",
        }}
        placeholder="搜索菜单"
        allowClear
        treeDefaultExpandAll
        filterTreeNode={filterTreeNode} // 使用自定义筛选函数
        onChange={onChange}
        treeData={treeData}
      />
    </>
  );
}

export default Commonview;
