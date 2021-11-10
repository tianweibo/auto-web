import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Space, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { TagConfType, ModalConfType } from '../../data.d';
import { arrayColumn } from '@/utils/util';

const { TextArea } = Input;

const fieldLabels = {
  tag_name: '指标名称',
  tag_key: '指标字段',
  description: '指标描述',
};

interface TagModalProps {
  modalConf: ModalConfType;
  handleCancel: () => void;
  handleFinish: (values: TagConfType) => void;
}

const TagModal: FC<TagModalProps> = (props) => {
  const [form] = Form.useForm();

  const { modalConf, handleCancel, handleFinish } = props;

  useEffect(() => {
    if (form && !modalConf.visible) {
      form.resetFields();
    }
  }, [props.modalConf.visible]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  return (
    <>
      <Modal
        title={modalConf.title}
        visible={modalConf.visible}
        onOk={handleSubmit}
        confirmLoading={modalConf.confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={handleFinish} autoComplete="off">
          <Form.Item
            name="tag_name"
            rules={[{ required: true, message: '内容不能为空' }]}
          >
            <Input addonBefore={fieldLabels.tag_name} />
          </Form.Item>
          <Form.Item
            name="tag_key"
            rules={[{ required: true, message: '内容不能为空' }]}
          >
            <Input addonBefore={fieldLabels.tag_key} />
          </Form.Item>
          <Form.Item name="description">
            <TextArea
              allowClear
              showCount
              maxLength={100}
              placeholder={fieldLabels.description}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TagModal;
