import services from '@/services/demo';

import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { format } from 'date-fns';

const { addUser, queryUserList, deleteUser, modifyUser } =
  services.UserController;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserInfo) => {
  const hide = message.loading('正在添加');
  try {
    const response = await addUser({ ...fields });
    hide();

    if (response.code === 20000) {
      message.success(response.message);
      return true;
    } else {
      message.error(response.message);
      return false;
    }

  } catch (error) {
    hide();
    message.error('服务器错误');
    return false;
  }
};


/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (id: string, fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    const response = await modifyUser(
      { id: id || '' },
      {
        userName: fields.userName || '',
        name: fields.name || '',
        role: fields.role || '',
        isLocked: fields.isLocked || false,
        phone: fields.phone || '',
        email: fields.email || '',

        birthday: (fields as any).birthday ? format(new Date((fields as any).birthday), 'yyyy-MM-dd') : '',
      },
    );
    hide();

    if (response.code === 20000) {
      message.success(response.message);
      return true;
    } else {
      message.error(response.message);
      return false;
    }
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[], retries = 3) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    // await deleteUser({
    //   id: selectedRows.find((row) => row.id)?.id || '',
    // });
    const response = await deleteUser({
      ids: selectedRows
        .map(row => row.id)
        .filter(id => id !== undefined && id !== null) // 过滤掉无效的id
        .join(','), // 转换为逗号分隔的字符串
    });
    hide();
    if (response.code === 20000) {
      message.success(response.message);
    }
    else {
      message.error(response.message);
    }


    return true;
  } catch (error) {
    hide();
    if (error instanceof Error) {
      message.error(error.message);
    } else {
      message.error('发生未知错误，请重试！');
    }
    return false;

  }
};

const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalVisible2, handleModalVisible2] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<API.UserInfo>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.UserInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      tip: '用户名是唯一的 key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '用户名为必填项',
          },
        ],
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '角色',
      dataIndex: 'role',
      // hideInForm: true,
      valueEnum: {
        '0': { text: '管理员' },
        '1': { text: '普通用户' },
      },
    },
    {
      title: '是否禁用',
      dataIndex: 'isLocked',
      hideInForm: true,
      valueEnum: {
        false: { text: '可用', status: 'Success' },
        true: { text: '禁用', status: 'Error' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>

          <a onClick={() => {
            handleUpdateModalVisible(true);
            setStepFormValues(record);
          }}>修改</a>

          <a onClick={() => setRow(record)} style={{ marginLeft: 8 }}>
            查看
          </a>

        </>
      ),
    },
  ];



  return (
    <PageContainer
      header={{
        title: '用户管理',
      }}
    >
      <ProTable<API.UserInfo> 
        pagination={{ // 分页配置
          //position: ['bottomCenter'], // 分页位置
          pageSize: 10,
          showQuickJumper: true,               // 支持快速跳转
          // showTotal: total => `共 ${total} 条`  // 自定义总数显示
        }}
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新增
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data, success } = await queryUserList({
            // ...params,
            pageNum: params.current,
            pageSize: params.pageSize,
            id: params.id,
            userName: params.userName,
            name: params.name,
            role: params.role,
            isLocked: params.isLocked,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            // sorter,
            // filter,
          });
          return {
            data: data?.list || [],
            total: data?.total || 5,
            success,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
           
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            type="primary"
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.UserInfo, API.UserInfo>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {

            const success = await handleUpdate(stepFormValues?.id || '', value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable={true}  // 允许显示关闭图标
      >
        {row?.id && (  // 改用id作为判断条件
          <ProDescriptions<API.UserInfo>
            column={2}
            title="用户详情"
            request={async () => ({ data: row })}
            params={{ id: row.id }}  // 正确传递id参数
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
