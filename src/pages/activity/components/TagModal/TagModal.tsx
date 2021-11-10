import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export interface TagModalConfType {
  visible: boolean,
  title?: string,
  confirmLoading?: false,
};

interface TagModalProps {
  modalConf: TagModalConfType;
  handleCancel: () => void;
  onFinish: (values: any) => void;
};

const TagModal: FC<TagModalProps> = (props) => {

  const [form] = Form.useForm();

  const { modalConf, handleCancel, onFinish } = props;

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
        <Form form={form} onFinish={onFinish} autoComplete="off">
            <Form.Item
              name="tag_name"
              rules={[{ required: true, message: '内容不能为空' }]}
            >
              <Input addonBefore="指标名称" placeholder="指标名称" />
            </Form.Item>
            <Form.Item
              name="tag_key"
              rules={[{ required: true, message: '内容不能为空' }]}
            >
              <Input addonBefore="指标字段" placeholder="指标字段" />
            </Form.Item>
            <Form.Item
              name="description"
            >
              <TextArea allowClear showCount maxLength={100} placeholder="描述信息" />
            </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TagModal;