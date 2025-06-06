/*
 * @Author: 李彦桥 14802633+lee-bridge@user.noreply.gitee.com
 * @Date: 2025-04-10 18:58:26
 * @LastEditors: 李彦桥 14802633+lee-bridge@user.noreply.gitee.com
 * @LastEditTime: 2025-04-14 14:31:03
 * @FilePath: \front3\my-app\src\pages\page1.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styles from './index.less';
import { Table, Pagination } from "antd"
import { useEffect, useState } from 'react';
import type { PaginationProps } from 'antd';
export default function HomePage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
  ]



  useEffect(() => {
    const queryParams = new URLSearchParams({
      pageNum: pageNum.toString(),
      pageSize: pageSize.toString(),
    })

    fetch(`/api/bookManageSystem/user/getList?${queryParams}`)
      .then(response => response.json())
      .then(data => { setData(data.data.list), setTotal(data.data.total) })
      .catch(error => console.error('Error:', error));
  }, [pageNum, pageSize]);

  // 添加 key
  const dataSource = Array.isArray(data) ? data?.map((item, index) => ({
    ...(typeof item === 'object' && item !== null ? item : {}),
    // 假设 item 是一个包含 id 属性的对象，需要指定 useState 的泛型类型
    key: typeof item === 'object' && item !== null && 'id' in item ? (item as { id: string | number }).id : index,
  })) : [];

  //页面数据条数
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    console.log(current, pageSize);
    setPageSize(pageSize);
  };

  //页码选择
  const onChange: PaginationProps['onChange'] = (page) => {

    setPageNum(page);
  };

  return (
    <div   >

      <Table dataSource={dataSource} columns={columns} pagination={false} />
      <div   >
      <Pagination current={pageNum} total={total} onChange={onChange} onShowSizeChange={onShowSizeChange} />

      </div> 

    </div>
  );
}
