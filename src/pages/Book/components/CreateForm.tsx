import { Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
  const { modalVisible, onCancel, title } = props;
  const titleText = title || "新增";
  return (
    <Modal
      destroyOnClose
      title={titleText}
      width={420}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
