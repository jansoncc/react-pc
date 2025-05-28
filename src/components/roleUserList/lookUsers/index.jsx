import { Drawer, Tabs, Input, message, Button, Table, Popconfirm, Col, Row, Form } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import request from "@/api";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import './index.less'
const LookUsers = forwardRef((props, ref) => {
    let [lookVisible, setLookVisible] = useState(false);
    let [details, setDetails] = useState({});
    let [loading, setLoading] = useState(false)
    let [dataUserList, setDataUserList] = useState([])
    let [userList, setUserList] = useState([])
    let [selectedRowKeys, setSelectedRowKeys] = useState([])
    let [username, setUsername] = useState('')
    let [activeKey, setActiveKey] = useState('1')
    let [record, setRecord] = useState(null)
    //将子组件的方法 暴露给父组件
    useImperativeHandle(ref, () => ({
        setLookVisible, setDetails, getUserlist, getAllUserlist, setActiveKey
    }))

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
    useEffect(() => {
        if (record) getUserlist(record)
    }, [pageIndex, pageSize])
    const columns = [
        {
            title: '用户账号',
            dataIndex: 'username',
            align: "center",
            key: "username"
        },
        {
            title: '用户姓名',
            align: "center",
            dataIndex: 'realname',
            key: "realname"
        },
        {
            title: '工号',
            align: "center",
            key: "workNo",
            dataIndex: 'workNo'
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            title="确定要从此角色移出此用户?"
                            onConfirm={() => deleteUser(record)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <a>移出此用户</a>
                        </Popconfirm>

                    </>
                )
            }
        }
    ]
    // 分页2
    let [total2, setTotal2] = useState(0)
    let [pageIndex2, setPageIndex2] = useState(1)
    let [pageSize2, setPageSize2] = useState(10)
    let pagination2 = {
        current: pageIndex2,
        pageSize: pageSize2,
        pageSizeOptions: ['10', '20', '30', "50", "100"],
        showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: total2,//数据的总条数
        onChange: (pageIndex) => {
            setPageIndex2(pageIndex);
        },
        onShowSizeChange: (current, pageSize) => {
            setPageSize2(pageSize);
            setPageIndex2(1);
        },
    }
    useEffect(() => {
        getAllUserlist()
    }, [pageIndex2, pageSize2])
    const userColumns = [
        {
            title: '用户账号',
            dataIndex: 'username',
            align: "center",
            key: "username"
        },
        {
            title: '用户姓名',
            align: "center",
            dataIndex: 'realname',
            key: "realname"
        },
        {
            title: '工号',
            align: "center",
            key: "workNo",
            dataIndex: 'workNo'
        },
    ]
    // 当前角色用户
    const getUserlist = (item) => {
        setRecord(item)
        setLoading(true)
        let params = {
            roleId: item.id,
            pageNo: pageIndex,
            pageSize
        }
        request.userRoleList(params).then(res => {
            if (res.data.code == 0) {
                setDataUserList(res.data.result.records)
                setTotal(res.data.result.total)
                // let ids = res.data.result.records.map(item => item.id)
                // setSelectedRowKeys(ids)
            }
            setLoading(false)
        })
    }
    // 移出
    const deleteUser = (item) => {
        let params = {
            userId: item.id,
            roleId: details.id,
        }
        request.deleteUserRole(params).then(res => {
            if (res.data.code == 200) {
                message.success(res.data.message)
                getUserlist(details)
            }
        })
    }
    // 所有用户
    const getAllUserlist = () => {
        setLoading(true)
        let params = {
            username,
            pageNo: pageIndex2,
            pageSize: pageSize2
        }
        request.getUserList(params).then(res => {
            if (res.data.code == 0) {
                setUserList(res.data.result.records)
                setTotal2(res.data.result.total)

            }
            setLoading(false)
        })
    }

    // 重置
    const onReset = () => {
        setUsername('')
        setPageIndex2(1)
        username = ''
        pageIndex2 = 1
        getAllUserlist()
    }
    // 多选
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys)
        },
        getCheckboxProps: (record) => ({
            disabled: dataUserList.some(item => item.id === record.id),
        }),
    };
    // 添加用户到当前角色
    const addSysUserRole = () => {
        let params = {
            roleId: details.id,
            userIdList: selectedRowKeys
        }
        request.addSysUserRole(params).then(res => {
            if (res.data.code == 0) {
                message.success(res.data.message)
                setActiveKey("1")
                getUserlist(details)
                setSelectedRowKeys([])
            }
        })
    }
    useEffect(() => {

    }, [pageIndex])
    return (
        <>
            <Drawer title="查看用户" open={lookVisible} closable={false} onClose={() => { setLookVisible(false) }} width='40%'
                footer={null} className="lookUsers">
                <p className="lookUsers-title">
                    <span>当前角色：{details.roleName}</span>
                    <span>当前角色编码：{details.roleCode}</span>
                </p>
                <Tabs className='iconDIV' defaultActiveKey="1" onChange={(e) => { setActiveKey(e) }} activeKey={activeKey} items={[
                    {
                        label: '当前角色用户', key: '1', children: (
                            <Table rowKey={(row) => row.id} dataSource={dataUserList} columns={columns} loading={loading}
                                pagination={pagination} />
                        )
                    },
                    {
                        label: '添加已有用户', key: '2', children: (
                            <>
                                <Row gutter={15}>
                                    <Col md={12} sm={15}>
                                        <Form.Item label="账号">
                                            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="请输入账号" />
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Button type="primary" icon={<SearchOutlined />} onClick={getAllUserlist}>
                                            查询
                                        </Button>
                                        <Button type="primary" icon={<ReloadOutlined />} onClick={onReset} className="searchreset">
                                            重置
                                        </Button>
                                        {selectedRowKeys.length != 0 ? <Button type="primary" icon={<PlusOutlined />} onClick={addSysUserRole} className="searchreset">
                                            添加
                                        </Button> : ""}

                                    </Col>
                                </Row>
                                <Table rowKey={(row) => row.id} dataSource={userList} columns={userColumns} loading={loading}
                                    pagination={pagination2}
                                    rowSelection={{
                                        selectedRowKeys,
                                        ...rowSelection,
                                    }} />
                            </>
                        )
                    },
                ]} />

            </Drawer >
        </>
    )
})
export default LookUsers