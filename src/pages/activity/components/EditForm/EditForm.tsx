import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';
import {
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
  DatePicker,
} from 'antd';
const { RangePicker } = DatePicker;

import { PlusOutlined, FormOutlined } from '@ant-design/icons';

import { ActivityFormItemDataType, TagConfType } from '../../data.d';
import { TagListItemDataType } from '@/pages/tag/data.d';

import styles from './style.less';

interface DrawerConfType {
  visible: boolean;
  title?: string;
}
interface ProjectItem {
  project_id: number;
  title: string;
}
interface EditFormProps {
  drawerConf: DrawerConfType;
  current: ActivityFormItemDataType;
  tagListData: TagListItemDataType[];
  tagConfData: TagConfType[];
  projectList: ProjectItem[];
  handleCancelEdit: void;
  handleFinishEdit: void;
  handleUseBaseTag: void;
  handleCreateTag: void;
  handleRemoveTag: void;
}

const EditForm: FC<EditFormProps> = (props) => {
  const [form] = Form.useForm();

  const {
    drawerConf,
    current,
    tagListData,
    tagConfData,
    handleCancelEdit,
    handleFinishEdit,
    handleUseBaseTag,
    handleCreateTag,
    handleRemoveTag,
    projectList,
  } = props;
  useEffect(() => {
    if (form && !drawerConf.visible) {
      form.resetFields();
    }
  }, [drawerConf.visible]);

  useEffect(() => {
    if (current && tagConfData) {
      form.setFieldsValue({
        ...current,
        tag_conf: tagConfData,
      });
    }
  }, [props.current, props.tagConfData]);

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

  return (
    <>
      <Drawer
        title={drawerConf.title}
        placement="right"
        onClose={handleCancelEdit}
        visible={drawerConf.visible}
        bodyStyle={{ paddingBottom: 80 }}
        width={'80%'}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={handleCancelEdit} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={handleSaveDrawer} type="primary">
              保存
            </Button>
          </div>
        }
      >
        <Row>
          <Col span={6} className={styles.leftTagWrap}>
            <Divider orientation="left">
              <div className={styles.iDivider}>
                <FormOutlined /> 基础指标
              </div>
            </Divider>
            <div>
              {tagListData.length &&
                tagListData.map((item, index) => {
                  return (
                    <Tag
                      key={item.tag_key}
                      color={tagColors[index]}
                      onClick={(e) => handleUseBaseTag(item)}
                      className={styles['site-tag-plus']}
                    >
                      {item.tag_name}
                    </Tag>
                  );
                })}
            </div>
          </Col>
          <Col span={18} className={styles.rightFormWrap}>
            <div>
              <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={handleFinishEdit}
              >
                <Form.Item
                  name="title"
                  label="活动名称"
                  rules={[{ required: true, message: '请输入活动名称' }]}
                >
                  <Input placeholder="请输入活动名称" />
                </Form.Item>
                <Form.Item name="project_id" label="选择项目">
                  <Select>
                    {projectList.map((item) => {
                      return (
                        <Select.Option
                          key={item.project_id}
                          value={item.project_id}
                        >
                          {item.title}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name="date" label="活动时间">
                  <RangePicker />
                </Form.Item>
                <Form.Item name="tag_conf" label="活动指标">
                  {tagConfData.length &&
                    tagConfData.map((item, index) => {
                      return (
                        <Tag
                          key={item.tag_key}
                          closable={true}
                          onClose={(e) => handleRemoveTag(item)}
                        >
                          {item.tag_name}
                        </Tag>
                      );
                    })}

                  <Tag
                    onClick={handleCreateTag}
                    className={styles['site-tag-plus']}
                  >
                    <PlusOutlined /> 添加
                  </Tag>
                </Form.Item>

                <Form.Item name="description" label="活动描述">
                  <Input.TextArea rows={4} placeholder="请输入活动描述" />
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
