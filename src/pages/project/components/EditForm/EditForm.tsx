import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';

import moment from 'moment';

import {
  DatePicker,
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

import TagModal from '@/pages/project/components/TagModal/TagModal';

import {
  ProjectItemDataType,
  DrawerConfType,
  TagConfType,
  ModalConfType,
  DatePickerType,
} from '@/pages/project/data.d';

const { RangePicker } = DatePicker;

const { Option } = Select;

import { arrayColumn } from '@/utils/util';

import styles from './style.less';

const fieldLabels = {
  title: '项目名称',
  tag_conf: '项目指标',
  date_range: '项目周期',
  description: '项目描述',
};

interface EditFormProps {
  dispatch: Dispatch;
  drawerConf: DrawerConfType;
  current: Partial<ProjectItemDataType>;
  tagList: TagConfType[];
  onFinishCreate: (values: Partial<ProjectItemDataType>) => void;
  onFinishEdit: (values: Partial<ProjectItemDataType>) => void;
  onCancelEdit: () => void;
}

const EditForm: FC<EditFormProps> = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    drawerConf,
    current,
    tagList,
    onCancelEdit,
    onFinishCreate,
    onFinishEdit,
  } = props;
  const [modalConf, setModalConf] = useState<ModalConfType>({
    visible: false,
  });

  const [dateRange, setDateRange] = useState<Partial<DatePickerType>>({});

  const [currentTagList, setCurrentTagList] = useState<TagConfType[]>([]);
  const [projectTagConf, setProjectTagConf] = useState<TagConfType[]>([]);

  useEffect(() => {
    if (form && !drawerConf.visible) {
      form.resetFields();
    }
  }, [drawerConf.visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
        rangeDate: current.start_date
          ? [moment(current.start_date), moment(current.end_date)]
          : [],
      });
      setProjectTagConf(current.tag_conf);

      //找出两个标签库差集
      if (current.tag_conf && tagList) {
        const tagListDiff = tagList.filter((v) =>
          current.tag_conf.every((e) => e.tag_key != v.tag_key),
        );
        setCurrentTagList(tagListDiff);
      }
    }
  }, [props.current]);

  useEffect(() => {
    //解构是为了拷贝,目的解除引用关系,防止源数据污染
    setCurrentTagList(tagList);
  }, [tagList]);

  useEffect(() => {
    form.setFieldsValue({
      tag_conf: projectTagConf,
    });
  }, [projectTagConf]);

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

  //删除指标
  const handleRemoveTag = (values: TagConfType) => {
    const { tag_key } = values;
    //返回符合条件的数据
    const index = projectTagConf.findIndex((x) => x.tag_key === tag_key);
    if (index !== -1) {
      projectTagConf.splice(index, 1);
    }
    //重置项目中的指标
    setProjectTagConf(projectTagConf);
    //检查是否来源于tagList
    if (!arrayColumn(tagList, 'tag_key').includes(tag_key)) {
      return;
    }
    //返还指标到 currentTagList
    setCurrentTagList(currentTagList.concat(values));
  };

  //使用基础指标
  const handleUseBaseTag = (values: TagConfType) => {
    const { tag_key } = values;

    //往右边指标库里增加
    handleSubmitTag(values, () => {
      // 查找当前指标索引
      const index = currentTagList.findIndex((x) => x.tag_key === tag_key);
      //从 currentTagList 中删除指标
      if (index !== -1) {
        currentTagList.splice(index, 1);
      }
      // 重置当前 state
      setCurrentTagList(currentTagList);
    });
  };

  //保存编辑
  const handleSaveDrawer = () => {
    if (!form) return;
    form.submit();
  };

  const handleDatePickerChange = (values: any) => {
    const [start_date, end_date] = values.map((value: any) => {
      return value.valueOf();
    });

    setDateRange({
      start_date,
      end_date,
    });
  };

  //处理完成操作
  const handleFinished = (values: ProjectItemDataType) => {
    const { project_id } = current;

    const data: Partial<ProjectItemDataType> = {
      ...values,
      ...dateRange,
      tag_conf: projectTagConf,
    };
    !project_id
      ? onFinishCreate(data)
      : onFinishEdit({
          ...data,
          project_id,
        });
  };

  /**
   * 创建指标
   */
  const handleCreateTag = () => {
    setModalConf({
      visible: true,
      title: '创建指标',
    });
  };

  /**
   * 取消创建标签
   */
  const handleCancelTag = () => {
    setModalConf({
      visible: false,
    });
  };

  /**
   * 取消 Modal
   */
  const handleCancelModal = () => {
    setModalConf({
      visible: false,
    });
  };

  //保存添加的指标
  const handleSubmitTag = (values: TagConfType, callback?: () => void) => {
    //检查该指标是否已存在
    if (arrayColumn(projectTagConf, 'tag_key').includes(values.tag_key)) {
      message.error('指标字段已存在，请使用其它字段!');
      return;
    }

    //重置指标列表
    setProjectTagConf(projectTagConf.concat(values));

    //更新modal状态
    setModalConf({
      visible: false,
    });

    callback && callback();
  };

  const tagProps = {
    modalConf: modalConf,
    handleCancel: handleCancelModal,
    handleFinish: (values: TagConfType) => handleSubmitTag(values),
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
          <Col span={6} className={styles.leftTagWrap}>
            <div className="base-wrap">
              <Divider orientation="left">
                <div className={styles.iDivider}>
                  <FormOutlined /> 基础指标
                </div>
              </Divider>
              <div>
                {currentTagList &&
                  currentTagList.map((item, index) => {
                    return (
                      <Tag
                        key={item.tag_key}
                        color={tagColors[index]}
                        onClick={() => handleUseBaseTag(item)}
                        className={styles['site-tag-plus']}
                      >
                        {item.tag_name}
                      </Tag>
                    );
                  })}
              </div>
            </div>
          </Col>

          <Col span={18} className={styles.rightFormWrap}>
            <div>
              <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={handleFinished}
              >
                <Form.Item
                  name="title"
                  label={fieldLabels.title}
                  rules={[{ required: true, message: '请输入项目名称' }]}
                >
                  <Input placeholder="请输入项目名称" />
                </Form.Item>

                <Form.Item label={fieldLabels.tag_conf}>
                  {projectTagConf &&
                    projectTagConf.map((item, index) => {
                      return (
                        <Tag
                          key={item.tag_key + index}
                          closable={true}
                          onClose={() => handleRemoveTag(item)}
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

                <Form.Item
                  name="rangeDate"
                  label={fieldLabels.date_range}
                  rules={[{ required: true, message: '请选择项目项目周期' }]}
                >
                  <RangePicker onChange={handleDatePickerChange} />
                </Form.Item>

                <Form.Item name="description" label={fieldLabels.description}>
                  <Input.TextArea rows={4} placeholder="请输入项目描述" />
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
        <TagModal {...tagProps} />
      </Drawer>
    </>
  );
};

export default EditForm;
