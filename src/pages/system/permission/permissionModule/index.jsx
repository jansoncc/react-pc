import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button, Drawer, Form, Input, TreeSelect, Alert, Radio, InputNumber, Switch, message, Tooltip } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
//引入antd-icon
import * as Icon from '@ant-design/icons';

import request from "@/api"
import "./index.less"
import Marquee from 'react-fast-marquee';
import IconModule from "./iconModule"
//用于获取状态
import store from "@/redux/store";
import getMenu from "@/routes/routerConfig";
const PermissionModule = forwardRef((props, ref) => {
    let [iconName, setIconName] = useState("")

    let [form] = Form.useForm();
    let [title, setTitle] = useState("")
    let [open, setOpen] = useState(false);
    let [radioValue, setRadioValue] = useState("0");
    let [value, setValue] = useState(undefined);
    let [treeData, setTreeData] = useState([]);
    let [route, setRoute] = useState(true);
    let [hidden, setHidden] = useState(false);
    let [keepAlive, setKeepAlive] = useState(false);
    let [alwaysShow, setAlwaysShown] = useState(false);
    let [internalOrExternal, setInternalOrExternal] = useState(false);
    let [id, setId] = useState(null)
    let [childenDisabled, setChildenDisabled] = useState(false)
    let IconModuleRef = useRef(null)
    //将子组件的方法 暴露给父组件
    useImperativeHandle(ref, () => ({
        setOpen, setTitle, setTreeData, entiForm, setRadioValue, childenForm
    }))

    const onChange = (newValue) => {
        setValue(newValue);
    };
    // 选择图标
    const selectIcons = () => {
        IconModuleRef.current.setIsModalOpen(true)
    }
    // 确认
    const submit = async () => {
        try {
            const values = await form.validateFields();
            let params = { ...values, menuType: radioValue, route, hidden, keepAlive, alwaysShow, internalOrExternal, parentId: radioValue == 1 ? value : null }
            if (title == '新增菜单' || title == '添加下级菜单') {
                const res = await request.addPermission(params)
                resSet(res)
            } else if (title == '编辑菜单') {
                params.id = id
                const res = await request.editPermission(params)
                resSet(res)
                setReload(params)
            }
            function resSet(res) {
                if (res.data.code == 200) {
                    message.success(res.data.message)
                    props.getlist()
                    setOpen(false)
                    form.resetFields()
                    setRoute(true)
                    setHidden(false)
                    setKeepAlive(false)
                    setAlwaysShown(false)
                    setInternalOrExternal(false)
                    setChildenDisabled(false)
                }
            }
        } catch (errorInfo) {
            //    错误
        }
    }
    // 确认编辑后对比本地菜单，做刷新操作
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
    //编辑
    const entiForm = (data) => {
        form.setFieldsValue({
            name: data.name,
            url: data.url,
            component: data.component,
            icon: data.icon,
            sortNo: data.sortNo,
            menuType: data.menuType == 1 ? data.parentId : null
        })
        setId(data.id)
        data.menuType == 1 ? setValue(data.parentId) : null
        setRadioValue(String(data.menuType))
        setIconName(data.icon)
        setRoute(data.route)
        setHidden(data.hidden)
        setKeepAlive(data.keepAlive)
        setAlwaysShown(data.alwaysShow)
        setInternalOrExternal(data.internalOrExternal)
    }
    const childenForm = (data) => {
        form.setFieldsValue({
            menuType: data.id
        })
        setValue(data.id)
        setChildenDisabled(true)
    }
    return (
        <>
            <Drawer title={title} placement="right" onClose={() => {
                setOpen(false); form.resetFields(); setRoute(true); setHidden(false); setKeepAlive(false); setAlwaysShown(false); setInternalOrExternal(false); setChildenDisabled(false); setIconName("")
            }} open={open} closable={false} width="35%" className='permissionModule' footer={
                <>
                    <Button onClick={() => setOpen(false)} style={{ marginRight: ".5vw" }}>
                        取消
                    </Button>
                    <Button type="primary" onClick={submit}>
                        确认
                    </Button>
                </>
            }>
                <Alert banner
                    closeText="取消"
                    message={<Marquee pauseOnHover gradient={false}>
                        新增以后请在前端工程pages目录下添加该组件，例如：pages/dashboard/analysis/index.jsx。
                    </Marquee>}
                />
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item label="菜单类型" >
                        <Radio.Group value={radioValue} onChange={(e) => setRadioValue(e.target.value)} disabled={childenDisabled}>
                            <Radio value="0"> 一级菜单 </Radio>
                            <Radio value="1"> 子菜单 </Radio>
                        </Radio.Group>
                    </Form.Item>
                    {radioValue == 1 ?
                        <Form.Item
                            label="上级菜单"
                            name="menuType"
                            rules={[{ required: true, message: '请输入菜单名称!' }]}
                        >
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                value={value}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="请选择上级菜单"
                                allowClear
                                treeDefaultExpandAll
                                onChange={onChange}
                                treeData={treeData}
                                disabled={childenDisabled}
                            />
                        </Form.Item>
                        : ""}
                    <Form.Item
                        label="菜单名称"
                        name="name"
                        rules={[{ required: true, message: '请输入菜单名称!' }]}
                    >
                        <Input placeholder="请输入菜单名称" allowClear />
                    </Form.Item>

                    <Form.Item
                        label="菜单路径"
                        name="url"
                        rules={[{ required: true, message: '请输入菜单路径!' }]}
                    >
                        <Input placeholder="请输入菜单路径，示例：/dashboard/analysis" allowClear />
                    </Form.Item>
                    <Form.Item
                        label="前端组件"
                        name="component"
                        rules={[{ required: true, message: '请输入前端组件!' }]}
                    >
                        <Input placeholder="请输入前端组件，示例：dashboard/analysis" allowClear />
                    </Form.Item>
                    {
                        radioValue == 0 ? <Form.Item
                            label="默认跳转地址"
                            name="redirect"
                            rules={[{ required: false, message: '请输入默认跳转地址!' }]}
                        >
                            <Input placeholder="请输入默认跳转地址 redirect" allowClear />
                        </Form.Item> : ""
                    }
                    <Form.Item
                        label="菜单图标"
                        name="icon"
                        rules={[{ required: false, message: '请选择菜单图标!' }]}
                    >
                        <Input placeholder="请选择菜单图标"
                            onClick={selectIcons}
                            addonBefore={iconName ?
                                <Tooltip title="当前图标">
                                    {
                                        React.createElement(Icon[iconName])
                                    }
                                </Tooltip>
                                : ""}
                            addonAfter={
                                <Tooltip title="设置图标">
                                    <SettingOutlined onClick={selectIcons} />
                                </Tooltip>
                            }
                            allowClear
                            onChange={(e) => {
                                if (!e.target.value) setIconName("")
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="菜单排序"
                        name="sortNo"
                        rules={[{ required: false, message: '' }]}
                    >
                        <InputNumber placeholder="请输入菜单排序" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="是否路由菜单"
                        name="route"
                        rules={[{ required: false, message: '' }]}
                    >
                        <Switch defaultChecked checkedChildren="是" unCheckedChildren="否" checked={route} onChange={(e) => setRoute(e)} />
                    </Form.Item>
                    <Form.Item
                        label="隐藏路由"
                        name="hidden"
                        rules={[{ required: false, message: '' }]}
                    >
                        <Switch checkedChildren="是" unCheckedChildren="否" checked={hidden} onChange={(e) => setHidden(e)} />
                    </Form.Item>
                    <Form.Item
                        label="是否缓存路由"
                        name="keepAlive"
                        rules={[{ required: false, message: '' }]}
                    >
                        <Switch checkedChildren="是" unCheckedChildren="否" checked={keepAlive} onChange={(e) => setKeepAlive(e)} />
                    </Form.Item>
                    <Form.Item
                        label="聚合路由"
                        name="alwaysShow"
                        rules={[{ required: false, message: '' }]}
                    >
                        <Switch checkedChildren="是" unCheckedChildren="否" checked={alwaysShow} onChange={(e) => setAlwaysShown(e)} />
                    </Form.Item>
                    <Form.Item
                        label="打开方式"
                        name="internalOrExternal"
                        rules={[{ required: false, message: '' }]}
                    >
                        <Switch checkedChildren="外部" unCheckedChildren="内部" checked={internalOrExternal} onChange={(e) => setInternalOrExternal(e)} />
                    </Form.Item>
                </Form>
            </Drawer>
            <IconModule ref={IconModuleRef} setIcon={(e) => {
                form.setFieldsValue({ icon: e })
                setIconName(e)
            }} />
        </>
    )
})

export default PermissionModule