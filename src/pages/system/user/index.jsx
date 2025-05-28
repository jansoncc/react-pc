import { useState, useEffect, useRef } from 'react';
import { Button, Form, Input, Col, Row, Select, Table, message, Dropdown, Popconfirm, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, } from '@ant-design/icons';
import './index.less'
import { useNavigate } from 'react-router-dom'
import request from "@/api"
import Addusers from "@/components/users/addusers";
import ChangePassword from "@/components/users/changePassword/changePassword.jsx"

const { Option } = Select;

function Users() {
    let [username, setUsername] = useState('')
    let [sex, setSex] = useState(undefined)
    let [realname, setRealname] = useState('')
    let [phone, setPhone] = useState('')
    let [status, setStatus] = useState(undefined)
    let [dataSource, setDataSource] = useState([])
    let [loading, setLoading] = useState(false)
    const childRef = useRef(null);
    const passwordRef = useRef(null);

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
            title: '性别',
            align: "center",
            dataIndex: 'sex',
            key: "sex",
            render: (data) => {
                switch (data) {
                    case 1:
                        return '男'
                    case 2:
                        return '女'
                    default:
                        return data
                }
            }
        },
        {
            title: '生日',
            align: "center",
            key: "birthday",
            dataIndex: 'birthday'
        },
        {
            title: '手机号码',
            align: "center",
            dataIndex: 'phone',
            key: "phone",
        },
        {
            title: '机构',
            align: "center",
            key: "orgCodeTxt",
            dataIndex: 'orgCodeTxt'
        },
        {
            title: '状态',
            align: "center",
            key: "status",
            dataIndex: 'status',
            render: (data) => {
                switch (data) {
                    case 1:
                        return '正常'
                    case 2:
                        return '冻结'
                    default:
                        return data
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        <a onClick={() => enti(record)}>编辑</a>
                        <Dropdown menu={{
                            items: [
                                {
                                    label: (<a> 详情</a>),
                                    key: '1',
                                },
                                {
                                    label: (
                                        // <>
                                        <Popconfirm
                                            title="确定要删除此用户?"
                                            onConfirm={() => deleteUser(record)}
                                            okText="确定"
                                            cancelText="取消"
                                        >
                                            <a> 删除</a>
                                        </Popconfirm>
                                        // </>
                                    ),
                                    key: '2',
                                    disabled: record.username.includes('admin'),//超管禁止删除
                                },
                                {
                                    label: (<a> 修改密码</a>),
                                    key: '3',
                                },
                            ],
                            onClick: (e) => onMenu(e, record)
                        }}>

                            <a onClick={e => { e.preventDefault() }}>
                                <Space>
                                    更多
                                </Space>
                            </a>

                        </Dropdown>
                    </>
                )
            }
        }

    ];
    // 删除用户
    const deleteUser = (record) => {
        request.userDelete({ id: record.id }).then(res => {
            if (res.data.code == 200) {
                message.success(res.data.message)
                getUserlist()
            }
        })
    }
    // 更多
    const onMenu = ({ key }, record) => {
        switch (key) {
            case '1'://详情
                childRef.current.setIsModalVisible(true)
                childRef.current.entiForm(record)
                childRef.current.queryUserRole()
                childRef.current.getDeptTree()
                childRef.current.setShowEle(false)
                childRef.current.setIsStatus(3)
                break;
            case '2'://删除

                break;
            case '3'://修改密码
                passwordRef.current.setIsModalVisible(true)
                passwordRef.current.form.setFieldsValue({
                    username: record.username,
                })
                passwordRef.current.setUserId(record.id)
                break;
            default:
                break;
        }
    }
    // 编辑
    const enti = (e) => {
        childRef.current.setIsModalVisible(true)
        childRef.current.entiForm(e)
        childRef.current.queryUserRole()
        childRef.current.getDeptTree()
        childRef.current.setShowEle(false)
        childRef.current.setIsStatus(2)
    }
    // 添加用户
    const onAdduser = () => {
        childRef.current.setIsModalVisible(true)
        childRef.current.queryUserRole()
        childRef.current.getDeptTree()
        childRef.current.setShowEle(true)
        childRef.current.setIsStatus(1)
    };
    useEffect(() => {
        getUserlist()
    }, [pageIndex, pageSize])

    // 重置
    const onReset = () => {
        setUsername('')
        setSex(undefined)
        setRealname('')
        setPhone('')
        setStatus(undefined)
        setPageIndex(1)
        username = realname = phone = ''
        sex = undefined
        status = undefined
        pageIndex = 1
        getUserlist()
    }
    // 获取列表
    const getUserlist = async () => {
        setLoading(true)
        let params = {
            username,
            sex,
            realname,
            phone,
            status,
            pageNo: pageIndex,
            pageSize
        }
        const res = await request.getUserList(params)
        if (res.data.code == 0) {
            setDataSource(res.data.result.records)
            setTotal(res.data.result.total)
        }
        setLoading(false)
    }
    //上传文件
    const props = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        accept: ".xlsx,",
        customRequest: async (file) => {
            const res = await request.upLoadFileNew('sys/iseInfo/issueImport', { file })
            if (res?.data?.code == 200) { }
        },
    };
    return (
        <>
            <div className="userList">
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item label="用户账号">
                            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="请输入账号" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="用户姓名">
                            <Input value={realname} placeholder='请输入用户姓名' onChange={(e) => setRealname(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="性别">
                            <Select defaultValue={sex} value={sex} onChange={(e) => {
                                setSex(e)
                            }} placeholder='请选择性别' >
                                <Option value="1">男</Option>
                                <Option value="2">女</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="手机号码">
                            <Input value={phone} placeholder='请输入手机号码' onChange={(e) => setPhone(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="状态">
                            <Select defaultValue={status} value={status} onChange={(e) => {
                                setStatus(e)
                            }} placeholder='请选择用户状态' >
                                <Option value="1">正常</Option>
                                <Option value="2">冻结</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="space-between" className="searchBar">
                    <Col>
                        <Button type="primary" icon={<SearchOutlined />} onClick={() => { getUserlist(); setPageIndex(1); setPageSize(10) }}>
                            查询
                        </Button>
                        <Button type="primary" icon={<ReloadOutlined />} onClick={onReset} className="searchreset">
                            重置
                        </Button>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={onAdduser}>
                            添加用户
                        </Button>
                    </Col>
                </Row>

                <Table rowKey={(row) => row.id} dataSource={dataSource} columns={columns} loading={loading}
                    pagination={pagination} />

                {/* 添加  编辑 用户 */}
                <Addusers ref={childRef} getlist={getUserlist} />
                {/* 修改密码 */}
                <ChangePassword ref={passwordRef} />
            </div>
        </>
    );
}

export default Users;

