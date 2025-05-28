import { Modal, Form, Input, message, Button } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import request from "@/api";
import './index.less'
const AddRole = forwardRef((props, ref) => {
    let [isModalOpen, setIsModalOpen] = useState(false);
    let [title, setTitle] = useState("0");// 0 新增 1编辑
    let [userId, setUserId] = useState(null)
    let [form] = Form.useForm();
    let { TextArea } = Input;
    //将子组件的方法 暴露给父组件
    useImperativeHandle(ref, () => ({
        setIsModalOpen, setEditForm, setTitle, setUserId
    }))

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (title == 0) {
                request.addRole(values).then(res => {
                    if (res.data.code == 200) {
                        message.success(res.data.message)
                        props.getList()
                        setIsModalOpen(false);
                        form.resetFields()
                    }

                })
            } else if (title == 1) {
                values.id = userId
                request.editRole(values).then(res => {
                    if (res.data.code == 200) {
                        message.success(res.data.message)
                        props.getList()
                        setIsModalOpen(false);
                        form.resetFields()
                    }

                })
            }

        } catch (error) {

        }

    };
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields()
    };
    //校验用户名
    const validateUsername = async (rule, value) => {
        const params = {
            tableName: 'sys_role',
            fieldName: 'role_code',
            fieldVal: value,
            dataId: userId
        };
        const res = await request.duplicateCheck(params)
        if (res.data.code == 500) {
            throw new Error("角色编码已存在!")
        }
    }
    // 数据回显
    const setEditForm = (item) => {
        form.setFieldsValue({
            roleCode: item.roleCode,
            roleName: item.roleName,
            description: item.description,
        })
    }
    return (
        <>
            <Modal title={title == 0 ? "新增角色" : "编辑角色"} open={isModalOpen} okText="提交" cancelText="取消" onOk={handleOk} onCancel={handleCancel} className="AddRole" width="50%">
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        label="角色编码"
                        name="roleCode"
                        rules={[{ required: true, message: '请输入角色编码!' }, { validator: validateUsername, }]}
                    >
                        <Input placeholder="请输入角色编码" disabled={title == 1} />
                    </Form.Item>


                    <Form.Item
                        label="角色名称"
                        name="roleName"
                        rules={[{ required: true, message: '请输入角色名称!' }]}
                    >
                        <Input placeholder="请输入角色名称" />
                    </Form.Item>
                    <Form.Item
                        label="描述"
                        name="description"
                        rules={[{ required: false, message: "" }]}
                    >
                        <TextArea rows={4} placeholder="请输入描述" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
})


export default AddRole