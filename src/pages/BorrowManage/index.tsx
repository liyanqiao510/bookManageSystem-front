import { addBorrow, queryBorrowList, deleteBorrow, modifyBorrow } from '@/services/demo/BorrowController';
import { useModel } from '@umijs/max';
import access from '@/access';
import AccessWrapper from '@/components/AccessWrapper';
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


/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.BorrowInfo) => {
  const hide = message.loading('正在添加');
  try {
    const response = await addBorrow({ ...fields });
    hide();

    if (response.code === 20000) { 
      return true;
    } else {
      return false;
    }

  } catch (error) {
    hide();
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
    const response = await modifyBorrow(
      { id: id || '' },
      {
        userName: fields.userName || '',
        bookName: fields.bookName || '',
        borrowTime: fields.borrowTime || '',
        returnTime: fields.returnTime || '',
      },
    );
    hide();

    if (response.code === 20000) { 
      return true;
    } else { 
      return false;
    }
  } catch (error) {
    hide();
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.BorrowInfo[], retries = 3) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    // await deleteBorrow({
    //   id: selectedRows.find((row) => row.id)?.id || '',
    // });
    const response = await deleteBorrow({
      ids: selectedRows
        .map(row => row.id)
        .filter(id => id !== undefined && id !== null) // 过滤掉无效的id
        .join(','), // 转换为逗号分隔的字符串
    });
    hide();  
    return true;

  } catch (error) {
    hide(); 
    return false;

  }
};

const TableList: React.FC<unknown> = () => {
  const { initialState } = useModel('@@initialState');
  const { canSeeAdmin } = access(initialState);

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalVisible2, handleModalVisible2] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<API.BorrowInfo>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.BorrowInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.BorrowInfo[]>([]);
  const columns: ProDescriptionsItemProps<API.BorrowInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
        ],
      },
    },
    {
      title: '书名',
      dataIndex: 'bookName',
      valueType: 'text', 
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
        ],
      },
    },
    {
      title: '借书时间',
      dataIndex: 'borrowTime',
      valueType: 'dateTime',
      hideInSearch: true,  
    },
    {
      title: '还书时间',
      dataIndex: 'returnTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '借书时间范围',
      dataIndex: 'borrowRange',
      valueType: 'dateRange',
      hideInTable: true,  
      hideInForm: true,
    },
    {
      title: '还书时间范围',
      dataIndex: 'returnRange',
      valueType: 'dateRange',
      hideInTable: true,
      hideInForm: true,
    },


    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <AccessWrapper canSeeRole="Admin">
            <a onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}>修改</a>
          </AccessWrapper>


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
      <ProTable<API.BorrowInfo>
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
          <AccessWrapper canSeeRole="Admin">
            <Button
              key="1"
              type="primary"
              onClick={() => handleModalVisible(true)}
            >
              新增
            </Button>
          </AccessWrapper>
          ,
        ]}
        request={async (params, sorter, filter) => {
          const { data, success } = await queryBorrowList({
            // ...params,
            pageNum: params.current,
            pageSize: params.pageSize,
            id: params.id,
            userName: params.userName,
            bookName: params.bookName,
            borrowRange: params.borrowRange,
            returnRange: params.returnRange,
          });
          return {
            data: data?.list || [],
            total: data?.total || 5,
            success,
          };
        }}
        columns={columns}
        rowSelection={canSeeAdmin ? {
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          // 可以添加更多权限控制属性
          getCheckboxProps: (record) => ({
            disabled: !canSeeAdmin // 禁用无权限的勾选框
          })
        } : undefined}
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
        <ProTable<API.BorrowInfo, API.BorrowInfo>
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

            const success = await handleUpdate(stepFormValues.id, value);
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
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.id && (
          <ProDescriptions<API.BorrowInfo>
            column={2}
            title={"图书类型详情"}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.id,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
