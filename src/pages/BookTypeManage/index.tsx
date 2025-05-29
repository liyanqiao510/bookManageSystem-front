import { addBookType, queryBookTypeList, deleteBookType, modifyBookType } from '@/services/demo/BookTypeController';
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
const handleAdd = async (fields: API.BookTypeInfo) => {
  const hide = message.loading('正在添加');
  try {
    const response = await addBookType({ ...fields });
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
    const response = await modifyBookType(
      { id: id || '' },
      {
        typeName: fields.typeName || '',
        typeDesc: fields.typeDesc || '',
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
const handleRemove = async (selectedRows: API.BookTypeInfo[], retries = 3) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    // await deleteBookType({
    //   id: selectedRows.find((row) => row.id)?.id || '',
    // });
    const response = await deleteBookType({
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
      message.error('发生未知错误，请重试');
    }
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
  const [stepFormValues, setStepFormValues] = useState<API.BookTypeInfo>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.BookTypeInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.BookTypeInfo[]>([]);
  const columns: ProDescriptionsItemProps<API.BookTypeInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '图书类型名',
      dataIndex: 'typeName',
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
      title: '描述',
      dataIndex: 'typeDesc',
      valueType: 'text',
      hideInSearch: true,
    },


    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <AccessWrapper>
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
      <ProTable<API.BookTypeInfo>
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
          <AccessWrapper>
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
          const { data, success } = await queryBookTypeList({
            // ...params,
            pageNum: params.current,
            pageSize: params.pageSize,
            id: params.id,
            typeName: params.typeName

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
        <ProTable<API.BookTypeInfo, API.BookTypeInfo>
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
          <ProDescriptions<API.BookTypeInfo>
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
