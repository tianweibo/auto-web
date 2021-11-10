import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';

import moment from 'moment';

import {
  Space,
  Drawer,
  Divider,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  Tag,
  PageHeader,
  message,
} from 'antd';

import { PlusOutlined, FormOutlined } from '@ant-design/icons';

import { TagItemDataType, DrawerConfType } from '../../data.d';

const { Option } = Select;

import { arrayColumn } from '@/utils/util';

import styles from './style.less';

const fieldLabels = {
  title: '指标名称',
  tag_key: '指标字段',
  tag_name: '指标名称',
  description: '指标描述',
};

interface EditFormProps {
  dispatch: Dispatch;
  drawerConf: DrawerConfType;
  current: Partial<TagItemDataType>;
  onFinishCreate: (values: Partial<TagItemDataType>) => void;
  onFinishEdit: (values: Partial<TagItemDataType>) => void;
  onCancelEdit: () => void;
}

const EditForm: FC<EditFormProps> = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    drawerConf,
    current,
    onCancelEdit,
    onFinishCreate,
    onFinishEdit,
  } = props;
  useEffect(() => {
    if (form && !drawerConf.visible) {
      form.resetFields();
    }
  }, [drawerConf.visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
      });
    }
  }, [props.current]);

  const tagColors = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ];

  //保存编辑
  const handleSaveDrawer = () => {
    if (!form) return;
    form.submit();
  };

  //处理完成操作
  const handleFinished = (values: TagItemDataType) => {
    const { tag_id } = current;

    const data: Partial<TagItemDataType> = {
      ...values,
    };
    !tag_id
      ? onFinishCreate(data)
      : onFinishEdit({
          ...data,
          tag_id,
        });
  };

  return (
    <>
      <Drawer
        title={drawerConf.title}
        placement="right"
        onClose={onCancelEdit}
        visible={drawerConf.visible}
        bodyStyle={{ paddingBottom: 80 }}
        width={'80%'}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onCancelEdit} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={handleSaveDrawer} type="primary">
              保存
            </Button>
          </div>
        }
      >
        <Row>
          <Col className={styles.rightFormWrap}>
            <div>
              <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={handleFinished}
              >
                <Form.Item
                  name="tag_key"
                  label={fieldLabels.tag_key}
                  rules={[{ required: true, message: '请输入指标字段' }]}
                >
                  <Input placeholder="请输入指标字段(字符串，类似'name')" />
                </Form.Item>

                <Form.Item
                  name="tag_name"
                  label={fieldLabels.tag_name}
                  rules={[{ required: true, message: '请输入指标名称' }]}
                >
                  <Input placeholder="请输入指标名称(汉字，类似'name')" />
                </Form.Item>

                <Form.Item name="description" label={fieldLabels.description}>
                  <Input.TextArea rows={4} placeholder="请输入指标描述" />
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default EditForm;
