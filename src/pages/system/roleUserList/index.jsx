import { useState, useEffect, useRef } from 'react';
import { Button, Form, Input, Col, Row, Select, Table, message, Dropdown, Popconfirm, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, DownloadOutlined, ExportOutlined } from '@ant-design/icons';
import moment from 'moment'
import request from "@/api"
import AddRole from '@/components/roleUserList/addrole';
import LookUsers from '@/components/roleUserList/lookUsers';
import MenuAuthorization from '@/components/roleUserList/menuAuthorization';
import './index.less'
function RoleUserList() {
    let [loading, setLoading] = useState(false)
    let [dataSource, setDataSource] = useState([])
    let [roleName, setRoleName] = useState("")

    let AddRoleRef = useRef(null)
    let LookUsersRef = useRef(null)
    let MenuAuthorizationRef = useRef(null)
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
            title: '角色编码',
            align: 'center',
            dataIndex: 'roleCode'
        },
        {
            title: '角色名称',
            align: 'center',
            dataIndex: 'roleName'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: "center",
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <>
                        <a onClick={() => lookUsers(record)}>查看用户</a>
                        <Dropdown menu={{
                            items: [
                                {
                                    label: (<a> 菜单授权</a>),
                                    key: '1',
                                },
                                {
                                    label: (<a> 编辑角色</a>),
                                    key: '2',
                                },
                                {
                                    label: (
                                        <Popconfirm Popconfirm
                                            title="确定要删除此角色?"
                                            onConfirm={() => deleteRole(record)}
                                            okText="确定"
                                            cancelText="取消"
                                        >
                                            <a > 删除角色</a>
                                        </Popconfirm>
                                    ),
                                    key: '3',
                                    disabled: record.roleCode.includes('admin'),//超管禁止删除
                                },
                            ],
                            onClick: (e) => onMenu(e, record)
                        }}>
                            <a onClick={e => { e.preventDefault() }}>
                                <Space>
                                    更多
                                </Space>
                            </a>
                        </Dropdown >
                    </>
                )
            }
        }

    ];
    // 重置
    const onReset = () => {
        setRoleName('')
        roleName = ''
        getlist()
    }
    // 查询列表
    const getlist = () => {
        setLoading(true)
        let params = {
            roleName,
            pageNo: pageIndex,
            pageSize
        }
        request.queryRoleList(params).then(res => {
            setLoading(false)
            if (res.data.code == 0) {
                setDataSource(res.data.result.records)
                setTotal(res.data.result.total)
            }
        })
    }
    // 添加角色
    const handleAdd = () => {
        AddRoleRef.current.setIsModalOpen(true)
        AddRoleRef.current.setTitle('0')
    }
    // 查看用户
    const lookUsers = (item) => {
        LookUsersRef.current.setLookVisible(true)
        LookUsersRef.current.setDetails(item)
        LookUsersRef.current.getUserlist(item)
        LookUsersRef.current.getAllUserlist()
        LookUsersRef.current.setActiveKey("1")
    }
    // 更多
    const onMenu = ({ key }, record) => {
        switch (key) {
            case '1'://授权
                MenuAuthorizationRef.current.setMenuVisible(true)
                MenuAuthorizationRef.current.setDetails(record)
                MenuAuthorizationRef.current.queryMenuTreeList(record)
                break;
            case '2'://编辑
                AddRoleRef.current.setIsModalOpen(true)
                AddRoleRef.current.setTitle('1')
                AddRoleRef.current.setUserId(record.id)
                AddRoleRef.current.setEditForm(record)
                break;
            default:
                break;
        }
    }
    // 删除
    const deleteRole = (item) => {
        request.roleDelete({ id: item.id }).then(res => {
            if (res.data.code == 200) {
                message.success(res.data.message)
                getlist()
            }
        })
    }
    useEffect(() => {
        getlist()
    }, [pageIndex, pageSize])
    return (
        <>
            <div className="roleUserList">
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item label="角色名称">
                            <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="请输入角色名称" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>

                    </Col>
                </Row>

                <Row justify="space-between" className="searchBar">
                    <Col>
                        <Button type="primary" icon={<SearchOutlined />} onClick={() => { getlist(); setPageIndex(1); setPageSize(10) }}>
                            查询
                        </Button>
                        <Button type="primary" icon={<ReloadOutlined />} onClick={onReset} className="searchreset">
                            重置
                        </Button>

                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            添加角色
                        </Button>
                        {/* <Button type="primary" icon={<ExportOutlined />} onClick={handleAdd}>
                            导入
                        </Button>
                        <Button type="primary" icon={<DownloadOutlined />} onClick={handleAdd}  className="searchreset">
                            导出
                        </Button> */}
                    </Col>
                </Row>
                <Table rowKey={(row) => row.id} dataSource={dataSource} columns={columns} loading={loading}
                    pagination={pagination}
                    expandable={{
                        expandedRowRender: record => <p style={{ margin: 0 }}>描述：{record.description}</p>,
                    }} />

                <AddRole ref={AddRoleRef} getList={getlist} />
                <LookUsers ref={LookUsersRef} />
                <MenuAuthorization ref={MenuAuthorizationRef} />
            </div>
        </>
    )
}

export default RoleUserList