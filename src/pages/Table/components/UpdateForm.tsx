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

  name?: string; 
  userName?: string;
  password?: string;
  role?: string;
  isLocked?: boolean;
  phone?: string;
  email?: string;
  birthday?: string;
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
        name: props.values.name,
        role: String(props.values.role),

        isLocked: props.values.isLocked,
        phone: props.values.phone,
        email: props.values.email,
        birthday: props.values.birthday,
      }}
      title="修改用户信息"
    >

      <ProFormText
        width="md"
        name="userName"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名！' }]}
      />
      <ProFormText
        width="md"
        name="name"
        label="姓名"
        rules={[{ required: true, message: '请输入姓名！' }]}
      />
      <ProFormSelect
        name="role"
        label="角色"
        rules={[{ required: true, message: '请选择角色!' }]}
        options={[
          { label: '管理员', value: '0' },
          { label: '普通用户', value: '1' },
        ]}
      />
      <ProFormSelect
        name="isLocked"
        label="是否禁用"
        rules={[{ required: true, message: '请选择!' }]}
        options={[
          { label: '可用', value: false },
          { label: '禁用', value: true },
        ]}
      />

      <ProFormText
        width="md"
        name="phone"
        label="手机号"
        rules={[
          {
            pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
            message: '请输入正确的手机号格式'
          }
        ]}
      />
      <ProFormText
        width="md"
        name="email"
        label="邮箱"
        rules={[
          {
            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
            message: '邮箱格式不正确'
          }
        ]}
      />
      <ProFormDateTimePicker
        name="birthday"  
        label="生日" 
        fieldProps={{
          format: "YYYY-MM-DD", // 控制显示格式  
          showTime: false,
          // disabledSeconds: () => range(0, 60), // 禁用所有秒（0-59）
        }}
        // rules={[{ required: true, message: '请选择时间！' }]}  
      >

      </ProFormDateTimePicker>


    </StepsForm.StepForm>

  </StepsForm>
);

export default UpdateForm;
