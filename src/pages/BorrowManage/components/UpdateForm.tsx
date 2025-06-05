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
import moment from 'moment';


export interface FormValueType extends Partial<API.UserInfo> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;

  userName?: string; 
  bookName?: string;
  borrowTime?: string;
  returnTime?: string;
   
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
        userName: props.values.userName,
        bookName: props.values.bookName, 
        borrowTime: props.values.borrowTime, 
        returnTime: props.values.returnTime, 
      }}
      title="修改借阅信息"
    >

      <ProFormText
        width="md"
        name="userName"
        label="用户名"
        rules={[{ required: true, message: '请输入' }]}
      />

<ProFormText
        width="md"
        name="bookName"
        label="书名"
        rules={[{ required: true, message: '请输入' }]}
      />  

<ProFormDateTimePicker
        name="borrowTime"  
        label="借书时间" 
        transform={(value) => ({
          borrowTime: value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null
        })}
        // fieldProps={{
        //   format: "YYYY-MM-DD HH:mm:ss", // 控制显示格式  
        //   showTime: false, 
        // }}
        // rules={[{ required: true, message: '请选择时间！' }]}  
      >

      </ProFormDateTimePicker>

      <ProFormDateTimePicker
        name="returnTime"  
        label="还书时间" 
        transform={(value) => ({
          returnTime: value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null
        })}
        // fieldProps={{
        //   format: "YYYY-MM-DD HH:mm:ss", // 控制显示格式  
        //   showTime: false, 
        // }}
        // rules={[{ required: true, message: '请选择时间！' }]}  
      >

      </ProFormDateTimePicker>
      
  
    
    </StepsForm.StepForm>

  </StepsForm>
);

export default UpdateForm;
