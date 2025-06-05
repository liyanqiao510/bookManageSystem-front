import {
  ProForm,
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { Modal, Form, Button } from 'antd';
import MyUploader from '@/components/MyUploader';
import React, { useState, useEffect } from 'react';
import { queryBookTypeList } from '@/services/demo/BookController';



export interface FormValueType extends Partial<API.UserInfo> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;

  typeName?: string;
  typeDesc?: string;

}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.UserInfo>;
}

const range = (start: number, end: number): number[] => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = ProForm.useForm();
  const [types, setTypes] = useState([])
  const getType = async () => {
    const response = await queryBookTypeList();
    setTypes(response.data);
  }

  useEffect(() => {
    getType();
  }, [])

  const [typevalueEnum, setTypeValueEnum] = useState([])
  useEffect(() => {
    if (types && Array.isArray(types)) {
      if (types.length > 0) {
        const options = types.map(type => ({
          label: type.typeName,
          value: type.id
        }));
        setTypeValueEnum(options);
      }
    }


  }, [types])


  useEffect(() => {
    console.log(typevalueEnum, 'typevalueEnum')
  }, [typevalueEnum])

  return (

    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{ padding: '32px 40px 48px' }}
            destroyOnClose
            title="修改"
            open={props.updateModalVisible}
            footer={submitter}
            onCancel={() => props.onCancel()}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        //初始化表单值
        initialValues={{
          bookName: props.values.bookName,
          bookAuthor: props.values.bookAuthor,

          bookPrice: props.values.bookPrice,
          bookTypeId: props.values.bookTypeId,
          bookDesc: props.values.bookDesc,
          isBorrowed: props.values.isBorrowed,
          bookImg: props.values.bookImg,
        }}
        title="修改图书信息"
      >

        <ProFormText
          width="md"
          name="bookName"
          label="图书名"
          rules={[{ required: true, message: '请输入' }]}
        />
        <ProFormText
          width="md"
          name="bookAuthor"
          label="作者"
          rules={[{ required: true, message: '请输入' }]}
        />
        <ProFormText
          width="md"
          name="bookPrice"
          label="价格"
          rules={[{ required: true, message: '请输入' }]}
        />
        <ProFormSelect
          name="bookTypeId"
          label="类型"
          rules={[{ required: true, message: '请选择!' }]}
          options={typevalueEnum}
        />
        <ProFormText
          width="md"
          name="bookDesc"
          label="描述"
        />
        <ProFormSelect
          name="isBorrowed"
          label="是否被借阅"
          rules={[{ required: true, message: '请选择!' }]}
          options={
            [
              { label: '是', value: true },
              { label: '否', value: false },

            ]
          }
        />

        <Form.Item
          label="图片"
          name='bookImg'
        >
          <MyUploader 
            initialValue={{ filePath: props.values.bookImg }}
            onChange={(fileInfo) => {
              form.setFieldValue('bookImg', fileInfo?.filePath); 
            }}
          />

        </Form.Item>


      </StepsForm.StepForm>

    </StepsForm>
  );
}


export default UpdateForm;
