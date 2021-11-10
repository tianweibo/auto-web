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
  Table,
  PageHeader,
  message,
  Modal,
  Upload,
} from 'antd';

import { PlusOutlined, FormOutlined, UploadOutlined } from '@ant-design/icons';

import { EventItemDataType, DrawerConfType } from '../../data';

const { Option } = Select;

const { Column, ColumnGroup } = Table;

import { arrayColumn } from '@/utils/util';

import styles from './style.less';

const fieldLabels = {
  title: '指标名称',
  event_cn_name: '事件中文名',
  event_en_name: '事件英文代码 event_name',
  event_trigger_cate: '触发类型',
  event_trigger_time: '触发时机',
  event_tag: '事件标签',
  event_remark: '备注',
  event_key: '指标字段',
  event_name: '指标名称',
  description: '指标描述',
};

interface uploadFormProps {
  dispatch: Dispatch;
  drawerConf: DrawerConfType;
  current: Partial<EventItemDataType>;
  onCancelUpload: () => void;
  onSubmitUpload: () => void;
  onUploadFile: () => void;
  onClickLink: () => void;
}

const UploadForm: FC<uploadFormProps> = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    drawerConf,
    current,
    onCancelUpload,
    onSubmitUpload,
    onUploadFile,
    onClickLink,
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

  const handleChange = (e: any) => {
    console.log(e);
  };
  return (
    <>
      <Modal
        title={drawerConf.title}
        onCancel={onCancelUpload}
        onOk={onSubmitUpload}
        visible={drawerConf.visible}
        bodyStyle={{ paddingBottom: 80 }}
        width={'80%'}
      >
        事件创建
        <Upload onChange={onUploadFile}>
          <Button icon={<UploadOutlined />}>上传文件</Button>
        </Upload>
      </Modal>
    </>
  );
};

export default UploadForm;
