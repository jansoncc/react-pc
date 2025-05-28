import { Space, Switch, Table, Modal, Popconfirm, Button, Col, Row, message } from 'antd';
//引入antd-icon
import * as Icon from '@ant-design/icons';
import { DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import React, { useState, useEffect, useRef } from 'react';
import request from "@/api"
import { service } from '@/api/service';
import "./index.less"
import PermissionModule from "./permissionModule"
//用于获取状态
import store from "@/redux/store";
import getMenu from "@/routes/routerConfig";

function RoleUserList() {
    let [loading, setLoading] = useState(false)
    let [data, setData] = useState([])
    let [checkStrictly, setCheckStrictly] = useState(false);
    let [selectedRowKeys, setSelectedRowKeys] = useState([])
    let PermissionModuleRef = useRef(null);
    // 禁止删除的菜单
    let menu = ["首页", "系统管理", "用户管理", "角色管理", "菜单管理", "机构管理"]
    // 分页
    let [total, setTotal] = useState(0)
    let [pageIndex, setPageIndex] = useState(1)
    let [pageSize, setPageSize] = useState(10)
    let pagination = {
        current: pageIndex,
        pageSize,
        pageSizeOptions: ['10', '20', '30', "50", "100"],
        showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total,//数据的总条数
        onChange: (pageIndex) => {
            setPageIndex(pageIndex);

        },
        onShowSizeChange: (current, pageSize) => {
            setPageSize(pageSize);
            setPageIndex(1);

        },
    }
    const columns = [
        {
            title: '菜单名称',
            dataIndex: 'name',
            align: "center",
            key: 'name',
            width: 260,
        },
        {
            title: '菜单类型',
            dataIndex: 'menuType',
            align: "center",
            key: 'menuType',
            render: function (text) {
                if (text == 0) {
                    return '菜单'
                } else if (text == 1) {
                    return '菜单'
                } else if (text == 2) {
                    return '按钮/权限'
                } else {
                    return text
                }
            }
        },
        /*{
          title: '权限编码',
          dataIndex: 'perms',
            align: "center",
          key: 'permissionCode',
        },*/
        {
            title: 'icon',
            dataIndex: 'icon',
            align: "center",
            key: 'icon',
            render: function (text) {
                //创建节点的方法
                function iconBC(name) { return React.createElement(Icon[name]); }
                return (
                    text ? iconBC(text) : text
                )
            }
        },
        {
            title: '组件',
            dataIndex: 'component',
            align: "center",
            key: 'component',
            scopedSlots: { customRender: 'component' }
        },
        {
            title: '路径',
            dataIndex: 'url',
            align: "center",
            key: 'url',
            scopedSlots: { customRender: 'url' }
        },
        {
            title: '排序',
            dataIndex: 'sortNo',
            align: "center",
            key: 'sortNo'
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
            align: 'center',
            width: 250,
            render: (text, record, index) => {
                return (
                    <>
                        <Button type="link" disabled={record.name == "首页"} onClick={() => edit(record)}>编辑</Button>

                        <Popconfirm
                            title="确定要删除此菜单?"
                            onConfirm={() => confirm(record)}
                            okText="确定"
                            cancelText="取消"
                            disabled={menu.includes(record.name)}
                        >
                            <Button type="link" disabled={menu.includes(record.name)}>删除</Button>
                        </Popconfirm>

                        <Button type="link" onClick={() => addMenu(record)}>添加下级</Button>
                    </>
                )
            }
        }
    ]

    useEffect(() => {
        getmenulist()
    }, [pageIndex, pageSize])

    // 获取列表
    const getmenulist = async () => {
        setLoading(true)
        const res = await request.getmenulist({ pageIndex, pageSize })
        if (res.data.code == 0) {
            setData(res.data.result)
            setTotal(res.data.result.total)
        }

        setLoading(false)
    }
    // 新增菜单
    const newUser = () => {
        PermissionModuleRef.current.setOpen(true)
        PermissionModuleRef.current.setRadioValue("0")
        PermissionModuleRef.current.setTitle("新增菜单")
        let list = data
        setList(list)
        function setList(e) {
            e.forEach(item => {
                item.value = item.key
                if (item.children) setList(item.children)
            })
        }

        PermissionModuleRef.current.setTreeData(list)
    }
    // 编辑
    const edit = (item) => {
        PermissionModuleRef.current.setOpen(true)
        PermissionModuleRef.current.setTitle("编辑菜单")
        PermissionModuleRef.current.entiForm(item)
        let list = data
        setList(list)
        function setList(e) {
            e.forEach(item => {
                item.value = item.key
                if (item.children) setList(item.children)
            })
        }

        PermissionModuleRef.current.setTreeData(list)
    }
    //添加下级
    const addMenu = (item) => {
        PermissionModuleRef.current.setOpen(true)
        PermissionModuleRef.current.setRadioValue("1")
        PermissionModuleRef.current.setTitle("添加下级菜单")
        PermissionModuleRef.current.childenForm(item)
        let list = data
        setList(list)
        function setList(e) {
            e.forEach(item => {
                item.value = item.key
                if (item.children) setList(item.children)
            })
        }

        PermissionModuleRef.current.setTreeData(list)
    }
    //删除
    const confirm = async (record) => {
        const res = await request.deletePermission({ id: record.id })
        if (res.data.code == 200) {
            setReload(record)
            message.success(res.data.message)
            getmenulist()
        }
    };
    // 删除对比菜单，操作后刷新页面
    const setReload = (record) => {
        let menu = JSON.parse(localStorage.getItem(window.envConfig['ROOT_APP_INFO']))?.menuList
        function menuFun(i) {
            i.forEach((item) => {
                if (item.id == record.id) {
                    message.loading("正在更新菜单，请稍后")
                    getMenu().then(res => {
                        window.location.reload()
                    })
                }
                if (item.children) menuFun(item.children)
            })
        }
        menuFun(menu)
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys)
        },
        getCheckboxProps: (record) => ({
            disabled: menu.some(item => item === record.title),
        }),
    };
    // 批量删除
    const confirmModal = () => {
        Modal.confirm({
            title: '确认删除',
            icon: <ExclamationCircleOutlined />,
            content: '是否删除选中数据?',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                let ids = selectedRowKeys.join(",")
                const res = await request.deleteAllPermission({ ids })
                if (res.data.code == 200) {
                    deleteAllReload(selectedRowKeys)
                    message.success(res.data.message)
                    getmenulist()
                    setSelectedRowKeys([])
                }
            }
        });
    };
    // 批量删除对比菜单，操作后刷新页面
    const deleteAllReload = (arrId) => {
        let menu = JSON.parse(localStorage.getItem(window.envConfig['ROOT_APP_INFO']))?.menuList
        // 对比选中菜单与本地菜单，只要有一个相同就刷新页面
        const checkId = (arr, targetId) => {
            for (const item of arr) {
                if (item.id === targetId) {
                    message.loading("正在更新菜单，请稍后")
                    getMenu().then(res => {
                        window.location.reload()
                    })
                    return true;
                }
                if (item.children) {
                    const found = checkId(item.children, targetId);
                    if (found) return true;
                }
            }
            return false;
        };

        for (const id of arrId) {
            if (checkId(menu, id)) break;
        }
    }
    return (
        <>
            <div id="permission">
                <Row justify="space-between" className="searchBar">
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={newUser}> 新增</Button>
                        {
                            selectedRowKeys.length != 0 ? <Button icon={<DeleteOutlined />} onClick={confirmModal} className="searchreset"> 批量删除</Button> : ""
                        }
                    </Col>
                    <Col>
                        <Space
                            align="center"
                            style={{
                                marginBottom: 16,
                            }}
                        >
                            父子关联: <Switch checked={checkStrictly} onChange={setCheckStrictly} />
                        </Space>
                    </Col>
                </Row>
                <div className="alert">
                    <p>
                        批量删除已选择<span>{selectedRowKeys.length}</span>项
                        <a onClick={() => setSelectedRowKeys([])}>
                            清空选项
                        </a>
                    </p>
                    <p>
                        【{menu.join('、')}】
                        禁止删除
                    </p>
                </div>
                <Table
                    columns={columns}
                    rowSelection={{
                        selectedRowKeys,
                        ...rowSelection,
                        checkStrictly: !checkStrictly,

                    }}
                    dataSource={data}
                    loading={loading}
                    pagination={pagination}
                />

                <PermissionModule ref={PermissionModuleRef} getlist={getmenulist} />
            </div>
        </>
    )
}

export default RoleUserList