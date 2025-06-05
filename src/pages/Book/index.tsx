import { readBook, addBook, queryBookList, deleteBook, modifyBook, queryBookTypeList} from '@/services/demo/BookController';
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
import { Button, Divider, Drawer, message, Modal } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm'; 


/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.BookInfo) => {
  const hide = message.loading('正在添加');
  try {
    const response = await addBook({ ...fields });
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
 * 借阅
 * @param fields
 */
const handleReadBook = async (bookId,returnTime) => {
  const hide = message.loading('');
  try {
    const response = await readBook({bookId:bookId,returnTime:returnTime});
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
    const response = await modifyBook(
      { id: id || '' },
      {
        bookName: fields.bookName || '',
        bookAuthor: fields.bookAuthor || '',

        bookPrice: fields.bookPrice || '',
        bookTypeId: fields.bookTypeId || '',
        bookDesc: fields.bookDesc || '',
        isBorrowed: fields.isBorrowed || '',
        bookImg: fields.bookImg || '' ,
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
const handleRemove = async (selectedRows: API.BookInfo[], retries = 3) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    // await deleteBook({
    //   id: selectedRows.find((row) => row.id)?.id || '',
    // });
    const response = await deleteBook({
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
  const [readModalVisible, handleReadVisible] = useState<boolean>(false);
  const [drawerVisible, handleDrawerVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<API.BookInfo>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.BookInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.BookInfo[]>([]);
  
  
  const [types, setTypes] = useState([])
  const [typevalueEnum, setTypeValueEnum] = useState([])
  const getType = async () => {
    const response = await queryBookTypeList();
    setTypes(response.data); 
  }

  useEffect(() => {
    getType();
  }, []) 

  useEffect(() => {
    if (types.length > 0) {
      const valueEnum = types.reduce((acc, type) => {
        acc[type.id] = { text: type.typeName };
        return acc;
      }, {} as { [key: string]: { text: string } }); 
      setTypeValueEnum(valueEnum)
    }
    setStepFormValues({options: typevalueEnum})
  }, [types]) 

  const readColumns: ProDescriptionsItemProps<API.BookInfo>[] = [
    {
      title: '确认还书时间',
      dataIndex: 'returnTime',
      valueType: 'dateTime',
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必选项',
          },
        ],
      },
    },
  ]
  
  const columns: ProDescriptionsItemProps<API.BookInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '图书名',
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
      title: '作者',
      dataIndex: 'bookAuthor',
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
      title: '价格',
      dataIndex: 'bookPrice',
      valueType: 'money',
      hideInSearch: true,
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
      title: '图书类型',
      dataIndex: 'bookTypeId',
      valueEnum: typevalueEnum,
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
      dataIndex: 'bookDesc',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '是否被借阅',
      dataIndex: 'isBorrowed',
      valueEnum: {
        true: { text: '是'  },
        false: { text: '否'  },
       
      }, 
    },
   
    {
      title: '图书图片',
      dataIndex: 'tableBookImg',
      valueType: 'image',
      hideInSearch: true, 
      hideInForm: true,
      // hideInTable: true,
       
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


          <a onClick={() => {setRow(record),handleDrawerVisible(true)}} style={{ marginLeft: 8 }}>
            查看
          </a>

          <AccessWrapper canSeeRole="Reader">
            <a 
              style={{ marginLeft: 8 }}
              onClick={() => {handleReadVisible(true),setRow(record)}}
            >
              借阅
            </a>
          </AccessWrapper>

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
      <ProTable<API.BookInfo>
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
          const { data, success } = await queryBookList({
            // ...params,
            pageNum: params.current,
            pageSize: params.pageSize,
            id: params.id,
            bookName: params.bookName,
            bookAuthor: params.bookAuthor,
            bookTypeId: params.bookTypeId,
            isBorrowed: params.isBorrowed

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
        <ProTable<API.BookInfo, API.BookInfo>
          onSubmit={async (value) => {
            console.log(value,'value')
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

      <CreateForm
        title="借阅确认"
        onCancel={() => handleReadVisible(false)}
        modalVisible={readModalVisible}
      >
        <ProTable<API.BookInfo, API.BookInfo>
          onSubmit={async (value) => {
            console.log(value,'value11')
            console.log(row,'row11')
            const response = await handleReadBook(row.id, value.returnTime);
           console.log(response,'response')
            if (response) {
              handleReadVisible(false); 
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          
          }}
          rowKey="id"
          type="form"
          columns={readColumns}
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
        // open={!!row}
        open={drawerVisible}
        onClose={() => { 
          handleDrawerVisible(false);
          setRow(undefined); 
        }}
        closable={false}
      >
        {row?.id && (
          <ProDescriptions<API.BookInfo>
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
