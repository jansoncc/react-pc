import { Modal, Form, Input, message, } from "antd"
import { forwardRef, useImperativeHandle, useState } from "react";
import request from "@/api";
import "./changePassword.less"
import { passwordEncryption } from "@/utils/passwordEncryption";
const ChangePassword = forwardRef((props, ref) => {
    let [isModalVisible, setIsModalVisible] = useState(false)
    let [form] = Form.useForm();
    let [userId, setUserId] = useState(null)
    //将子组件的方法 暴露给父组件
    useImperativeHandle(ref, () => ({
        setIsModalVisible, form, setUserId
    }))

    const handleOk = async (values) => {
        try {
            const values = await form.validateFields();
            values.password = passwordEncryption(values.password)
            values.confirmpassword = passwordEncryption(values.confirmpassword)
            request.changePassword({ ...values, id: userId }).then(res => {
                if (res.data.code == 200) {
                    message.success(res.data.message)
                    setIsModalVisible(false)
                    form.resetFields()
                }
            })

        } catch (errorInfo) {
            //    错误
        }
    }

    return (
        <>
            <Modal title="重新设定密码" open={isModalVisible} okText='确认' cancelText='取消' onOk={handleOk} onCancel={() => { setIsModalVisible(false); form.resetFields() }} width='60%' className="passwordchange">
                <Form name="basic" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} autoComplete="off" initialValues={{ remember: true }} form={form}>
                    <Form.Item
                        label="用户账号" name="username">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="登录密码"
                        name="password"
                        rules={[{ required: true, message: '请输入登录密码!' }, { pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{6,}$/, message: '密码由至少6位数字、大小写字母和特殊符号组成!' }]}
                    >
                        <Input.Password placeholder='请输入密码' />
                    </Form.Item>
                    <Form.Item
                        label="确认密码"
                        name="confirmpassword"
                        rules={[
                            { required: true, message: '请确认密码!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject('两次密码不一致，请重新输入');
                                    }
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder='请确认密码' />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
})

export default ChangePassword