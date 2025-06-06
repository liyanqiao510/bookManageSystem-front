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
          title="规则配置22"
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
      title="基本信息"
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
      // rules={[{ required: true, message: '请输入手机号！' }]}
      />
      <ProFormText
        width="md"
        name="email"
        label="邮箱"
      // rules={[{ required: true, message: '请输入邮箱！' }]}
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
