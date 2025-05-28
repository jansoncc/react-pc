import { useState, useEffect } from 'react';
import { Table } from 'antd';
import request from "@/api"
import './index.less'

function DeptNew() {
    let [data, setData] = useState([])
    let [loading, setLoading] = useState(false)
    let [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState(['00'])
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
            getDeptTree()
        },
        onShowSizeChange: (current, pageSize) => {
            setPageSize(pageSize);
            setPageIndex(1);
            getDeptTree()
        },
    }
    const columns = [
        {
            title: "机构名称",
            width: 400,
            align: "center",
            dataIndex: "title",
        },
        {
            title: "机构编码",
            align: "center",
            dataIndex: "key",
        },
        {
            title: '操作',
            align: "center",
            dataIndex: 'action',
            render: (text, record, index) => {
                return (
                    <>
                        {record.isChilden ? <a onClick={() => rowExpand(record)}>查看下级</a> : ""}
                    </>
                )
            }
        }
    ];
    useEffect(() => {
        getDeptTree()
    }, [pageIndex])
    // 查询
    const getDeptTree = async (record = null) => {
        setLoading(true)
        request.getDeptTree({ deptNo: record ? record.key : null }).then(res => {
            if (res.data.errCode == 0) {
                let deptTree = JSON.parse(res.data.bizContent)?.deptTree || res.data.deptTree
                // children返回为布尔值，不是array，报错，删除
                for (let i = 0; i < deptTree.length; i++) {
                    const element = deptTree[i];
                    element.isChilden = element.children  //是否有下级
                    if (element.children == true || element.children == false) delete element.children
                }
                if (!record) {
                    setData(deptTree)
                } else {
                    record.children = deptTree
                    setData([record])
                    setDefaultExpandedRowKeys(["00"])
                }
            }

            setLoading(false)
        })
    }
    // 展开查询
    const rowExpand = (record) => {
        if (record.isChilden) getDeptTree(record);
    }
    return (
        <div className='DeptNew'>
            <Table rowKey={(row) => row.key} dataSource={data} columns={columns} loading={loading}
                pagination={pagination} expandable={{
                    defaultExpandedRowKeys: defaultExpandedRowKeys,
                }} />
        </div>
    )
}

export default DeptNew