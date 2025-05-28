import { Drawer, Tree, message, Button, Dropdown, Col, Row, Spin } from "antd"
import { UpOutlined, CheckOutlined } from '@ant-design/icons';
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import request from "@/api";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import './index.less'
import getMenu from "../../../routes/routerConfig";
//用于获取状态
import store from "../../../redux/store";
const MenuAuthorization = forwardRef((props, ref) => {
    let [loading, setLoading] = useState(false);
    let [menuVisible, setMenuVisible] = useState(false)
    let [details, setDetails] = useState({})
    let [treeData, setTreeData] = useState([])
    let [checkedKeys, setCheckedKeys] = useState([]) //复选框选中菜单
    let [allTreeKeys, setAllTreeKeys] = useState([])//展开所有
    let [expandedKeys, setExpandedKeys] = useState([]) //控制展开
    let [lastpermissionIds, setLastpermissionIds] = useState([]) //上一次
    let [checkStrictly, setCheckStrictly] = useState(true)//true取消关联 false关联
    const roleInfo = JSON.parse(localStorage.getItem(window.envConfig['ROOT_APP_INFO']))?.roleInfo
    //将子组件的方法 暴露给父组件
    useImperativeHandle(ref, () => ({
        setMenuVisible, queryMenuTreeList, setDetails
    }))

    const handleOk = () => {
        let params = {
            lastpermissionIds: lastpermissionIds.join(","),
            permissionIds: checkedKeys.join(","),
            roleId: details.id
        }
        request.saveRolePermission(params).then(res => {
            if (res.data.code == 200) {
                if (roleInfo.roleCode == details.roleCode) {
                    //通知reducer页面数据变化了
                    if (roleInfo.roleCode == details.roleCode) {
                        message.loading("正在初始化菜单，请稍后")
                        getMenu().then(res => {
                            window.location.reload()
                        })
                    }
                } else {
                    message.success(res.data.message)
                }
            }
            queryRolePermission(details)
            setMenuVisible(false)

        })
    }
    // 菜单树
    const queryMenuTreeList = (item = null) => {
        setLoading(true)
        request.queryMenuTreeList().then(res => {
            if (res.data.code == 0) {
                let list = setTreeList(res.data.result.treeList)
                // 超管禁止选择系统管理下属菜单（默认选中，禁止删掉admin系统权限）
                let menu = ["首页", "系统管理", "用户管理", "角色管理", "菜单管理", "机构管理"]
                if (item && item.roleCode == "admin") setdisabled(list)
                function setdisabled(list) {
                    for (let i = 0; i < list.length; i++) {
                        const element = list[i];
                        if (menu.includes(element.title)) {
                            element.disabled = true
                        }
                        if (element.children) setdisabled(element.children)
                    }
                }
                setTreeData(list)
                setExpandedKeys(res.data.result.ids) //ids返回所有菜单key
                setAllTreeKeys(res.data.result.ids)
                queryRolePermission(item)
            }
        })
    }
    // 权限树数据处理
    const setTreeList = (array) => {
        array.forEach(element => {
            element.title = element.slotTitle
            if (element.children) setTreeList(element.children)
        })
        return array
    }
    // 菜单角色key
    const queryRolePermission = (item) => {
        request.queryRolePermission({ roleId: item.id }).then(res => {
            setLoading(false)
            if (res.data.code == 0) {
                setCheckedKeys(res.data.result)
                setLastpermissionIds(res.data.result)

            }
        })
    }

    const onCheck = (keys, info) => {
        keys = Array.isArray(keys) ? keys : keys.checked
        setCheckedKeys(keys)
    };
    // 展开收起
    const onExpand = (expandedKeys) => {
        setExpandedKeys(expandedKeys)
    }
    // 树操作
    const onMenu = ({ key }) => {
        switch (key) {
            case '1':
                setCheckStrictly(false)

                break;
            case '2':
                setCheckStrictly(true)
                break;
            case '3':
                setCheckedKeys(allTreeKeys)
                break;
            case '4':
                setCheckedKeys([])
                break;
            case '5':
                setExpandedKeys(allTreeKeys)
                break;
            case '6':
                setExpandedKeys([])
                break;

            default:
                break;
        }
    }
    return (
        <>
            <Drawer title="菜单角色权限配置" open={menuVisible} closable={false} onClose={() => { setMenuVisible(false) }} width='40%' className="MenuAuthorization" footer={
                <>
                    <Row justify="space-between" className="searchBar">
                        <Col>
                            <Dropdown trigger={['click']} menu={{
                                items: [
                                    {
                                        label: (<a> 父子关联 {!checkStrictly ? <CheckOutlined /> : ""}</a>),
                                        key: '1',
                                    },
                                    {
                                        label: (<a> 取消关联 {checkStrictly ? <CheckOutlined /> : ""}</a>),
                                        key: '2',
                                    },
                                    {
                                        label: (<a> 全部勾选 {checkedKeys.length == allTreeKeys.length ? <CheckOutlined /> : ""}</a>),
                                        key: '3',
                                    },
                                    {
                                        label: (<a> 取消全选 {checkedKeys.length != allTreeKeys.length ? <CheckOutlined /> : ""}</a>),
                                        key: '4',
                                    },
                                    {
                                        label: (<a> 展开所有 {expandedKeys.length == allTreeKeys.length ? <CheckOutlined /> : ""}</a>),
                                        key: '5',
                                    },
                                    {
                                        label: (<a> 合并所有 {expandedKeys.length != allTreeKeys.length ? <CheckOutlined /> : ""}</a>),
                                        key: '6',
                                    },
                                ],
                                onClick: (e) => onMenu(e)
                            }}>
                                <a onClick={e => { e.preventDefault() }}>
                                    <Button>
                                        树操作<UpOutlined />
                                    </Button>
                                </a>
                            </Dropdown>
                        </Col>
                        <Col>
                            <Button onClick={() => { setMenuVisible(false) }} style={{ marginRight: ".5vw" }}>
                                取消
                            </Button>
                            <Button type="primary" onClick={handleOk}>
                                提交
                            </Button>
                        </Col>
                    </Row>
                </>
            }>
                <Spin spinning={loading}>
                    <Tree
                        checkable
                        onCheck={onCheck}
                        treeData={treeData}
                        checkedKeys={checkedKeys}
                        expandedKeys={expandedKeys}
                        checkStrictly={checkStrictly}
                        onExpand={onExpand}
                    />
                </Spin>
            </Drawer >
        </>
    )
})
export default MenuAuthorization