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
} from 'antd';

import { PlusOutlined, FormOutlined } from '@ant-design/icons';

import { AttributeItemDataType, DrawerConfType } from '../../data.d';

const { Option } = Select;

const { Search } = Input;

const { Column, ColumnGroup } = Table;

import { arrayColumn } from '@/utils/util';

import styles from './style.less';

const fieldLabels = {
  attribute_name: '属性：',
  attribute_type: '属性代码：',
  data_type: '数据类型：',
  desc: '单位/格式说明：',
  attribute_tag: '属性值含义说明：',
  attribute_remark: '字典：',
  attribute_key: '属性标签：',
  note: '备注：',
  description: '创建人：',
  create_time: '创建时间：',
  end_user: '最后更新人：',
  end_time: '最后更新时间：',
};

interface EditFormProps {
  dispatch: Dispatch;
  drawerConf: DrawerConfType;
  current: Partial<AttributeItemDataType>;
  onFinishCreate: (values: Partial<AttributeItemDataType>) => void;
  onFinishEdit: (values: Partial<AttributeItemDataType>) => void;
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
  const searchMean = (e: any) => {
    console.log(e);
  };
  //处理完成操作
  const handleFinished = (values: AttributeItemDataType) => {
    const { attribute_id } = current;

    const data: Partial<AttributeItemDataType> = {
      ...values,
    };
    !attribute_id
      ? onFinishCreate(data)
      : onFinishEdit({
          ...data,
          attribute_id,
        });
  };
  const handleChange = (e: any) => {
    console.log(e);
  };
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];

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
          </div>
        }
      >
        <Row>
          <Col className={styles.rightFormWrap}>
            <div>
              <div className={styles.cellList}>
                <div className={styles.cellItem}>
                  <div className={styles.cellItemLeft}>
                    {fieldLabels.attribute_name}
                  </div>
                  <div className={styles.cellItemRight}>触发元素</div>
                </div>
                <div className={styles.cellItem}>
                  <div className={styles.cellItemLeft}>
                    {fieldLabels.attribute_type}
                  </div>
                  <div className={styles.cellItemRight}>event_elements</div>
                </div>
                <div className={styles.cellItem}>
                  <div className={styles.cellItemLeft}>
                    {fieldLabels.data_type}
                  </div>
                  <div className={styles.cellItemRight}>STRING</div>
                </div>
                <div className={styles.cellItem}>
                  <div className={styles.cellItemLeft}>{fieldLabels.desc}</div>
                  <div className={styles.cellItemRight}>['value']</div>
                </div>
                <div className={styles.cellItem}>
                  <div className={styles.cellItemLeft}>
                    {fieldLabels.attribute_tag}
                  </div>
                  <div className={styles.cellItemRight}>数据字典</div>
                </div>
                <div className={styles.cellItem}>
                  <div className={styles.cellItemLeft}>
                    {fieldLabels.attribute_remark}
                  </div>
                  <div className={styles.cellItemRight}>300</div>
                </div>
                <div className={styles.cellItem}>
                  <div className={styles.cellItemLeft}>
                    {fieldLabels.attribute_key}
                  </div>
                  <div className={styles.cellItemRight}>触发元素</div>
                </div>
                <div className={styles.cellItem}>
                  <div className={styles.cellItemLeft}>{fieldLabels.note}</div>
                  <div className={styles.cellItemRight}>这里是备注</div>
                </div>
                <div className={styles.cellItem}>
                  <div className={styles.cellItemLeft}>
                    {fieldLabels.description}
                  </div>
                  <div className={styles.cellItemRight}>Admin</div>
                </div>
                <div className={styles.cellItem}>
                  <div className={styles.cellItemLeft}>
                    {fieldLabels.create_time}
                  </div>
                  <div className={styles.cellItemRight}>
                    2011-05-21 22:04:00
                  </div>
                </div>
                <div className={styles.cellItem}>
                  <div className={styles.cellItemLeft}>
                    {fieldLabels.end_user}
                  </div>
                  <div className={styles.cellItemRight}>Admin</div>
                </div>
                <div className={styles.cellItem}>
                  <div className={styles.cellItemLeft}>
                    {fieldLabels.end_time}
                  </div>
                  <div className={styles.cellItemRight}>
                    2011-05-25 22:04:00
                  </div>
                </div>
              </div>
              <Divider />
              <div
                style={{
                  marginTop: '10px',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>| 字典详情</div>
                <Search
                  placeholder="值，含义"
                  onSearch={searchMean}
                  style={{ width: 200 }}
                />
              </div>
              <Table dataSource={dataSource}>
                <ColumnGroup title="值" key="name"></ColumnGroup>
                <Column title="含义" dataIndex="age" key="age" />
              </Table>
              <Divider />
              <div
                style={{
                  marginTop: '10px',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>| 关联事件详情</div>
                <Search
                  placeholder="事件，事件代码"
                  onSearch={searchMean}
                  style={{ width: 200 }}
                />
              </div>
              <Table dataSource={dataSource}>
                <ColumnGroup title="事件代码" key="name"></ColumnGroup>
                <Column title="事件" dataIndex="age" key="age" />
              </Table>
            </div>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default EditForm;
