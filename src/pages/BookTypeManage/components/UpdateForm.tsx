import {
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

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

// 在 UpdateForm.tsx 文件中定义 range 函数
const range = (start: number, end: number): number[] => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => (
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
        typeName: props.values.typeName,
        typeDesc: props.values.typeDesc, 
      }}
      title="修改图书类型"
    >

      <ProFormText
        width="md"
        name="typeName"
        label="图书类型"
        rules={[{ required: true, message: '请输入' }]}
      />
      <ProFormText
        width="md"
        name="typeDesc"
        label="描述" 
      />
      
    
    </StepsForm.StepForm>

  </StepsForm>
);

export default UpdateForm;
