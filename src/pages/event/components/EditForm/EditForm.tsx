import React, { FC, useEffect, useState } from 'react';
import {
  getAttributeDetail,
  BasicData,
  createEvent,
  updateEvent,
  queryEvent,
  getLabelTree,
} from '../../service';
import { sourceFromList } from '../../.././../common/enumData.js';
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  Radio,
  Cascader,
  message,
  Table,
  Divider,
  Space,
} from 'antd';
const { Column, ColumnGroup } = Table;
const { TextArea } = Input;
const { Option } = Select;
import './style.less';
import styles from './style.less';
import LabelTree from '../../../../components/labelTree/index.jsx';
import { getValues } from '@/utils/util';
const fieldLabels = {
  event_name: '事件中文名',
  event_code: '事件英文代码',
  event_trigger_mode: '触发类型',
  trigger_time: '触发时机',
  event_label: '事件标签',
  note: '备注',
};
const EditForm: FC<any> = (props) => {
  const [form] = Form.useForm();
  const [formType] = Form.useForm();
  const [choiceKeys, setChoiceKeys] = useState([]);
  const [choiceKeysValue, setChoiceKeysValue] = useState('');
  const [dataTypeList, setDataTypeList] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [attributeList, setAttributeList] = useState<
    Array<{
      attribute_id: string;
      attribute_name: string;
      attribute_code: string;
    }>
  >([]);
  const [tagList, setTagList] = useState<Array<{ key: string; value: string }>>(
    [],
  );
  const [attributeTags, setAttributeTags] = useState<
    Array<{ key: string; value: string }>
  >([]);
  // const [dataTypeList, setDataType] = useState<Array<{ key: string, value: string }>>([])
  const [triggerTypes, setTriggerList] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [eventAttrList, setEventAttrList] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const { drawerConf, onCancelEdit, requireEventList } = props;
  let attribute_label: string = '';
  let attribute_label_top: string = '';
  let data_type: string = '';
  let event_options_a: [] = [];
  //
  // 渠道change事件
  const handleChannelChange = (channel_value: any, channel_options: any) => {
    let select_channel_array = getCascaderObj(channel_value, channel_options);
    let select_channel = '';
    let select_channel_id = '';
    select_channel_array.forEach((element: any, index: number) => {
      select_channel += element.title;
      if (index < select_channel_array.length - 1) {
        select_channel = select_channel + '/';
      }
    });
    select_channel_id =
      select_channel_array[select_channel_array.length - 1].key;
    return select_channel_id;
  };
  // 渠道change事件
  const handleChannelChangeLabel = (
    channel_value: any,
    channel_options: any,
  ) => {
    let select_channel_array = getCascaderObj(channel_value, channel_options);
    let select_channel = '';
    let select_channel_id = '';
    select_channel_array.forEach((element: any, index: number) => {
      select_channel += element.label;
      if (index < select_channel_array.length - 1) {
        select_channel = select_channel + '/';
      }
    });
    select_channel_id =
      select_channel_array[select_channel_array.length - 1].label;
    return select_channel_id;
  };
  // 级联数据匹配label
  const getCascaderObj = (val: any, opt: any) => {
    return val.map((value: any) => {
      for (let itm of opt) {
        if (itm.key === value) {
          opt = itm.children;
          return itm;
        }
      }
      return null;
    });
  };

  const getBasicData = async (id: string) => {
    var res: any = {};
    res = await BasicData(id);
    switch (id) {
      case 'data_type':
        setDataTypeList(res.data);
        break;
      case 'event_trigger_mode':
        setTriggerList(res.data);
        break;
      default:
        break;
    }
    const res1: any = await getLabelTree({ id: 3 });
    let arr = res1.data.arr;
    arr = arr.map((ele) => {
      ele.disabled = false;
      return ele;
    });

    setAttributeTags(arr);
  };
  // 点击添加属性
  const addNewAttribute = async () => {
    var temp: any = [];
    var arr: any = [];
    temp = formType.getFieldValue('attribute');
    for (var i = 0; i < eventAttrList.length; i++) {
      if (!temp.includes(eventAttrList[i].attribute_id)) {
        arr.push(eventAttrList[i].attribute_id);
      }
    }
    var sj = arr.concat(temp);
    let obj = {
      id: sj,
    };
    await submitEventData(obj);
    formType.setFieldsValue({ attribute: [] });
  };

  const submitEventData = async (value: any) => {
    const data = await (await getAttributeDetail(value)).data;
    setEventAttrList(data);
  };

  const reomveEventAttrList = async (index1: number) => {
    setEventAttrList(eventAttrList.filter((data, index) => index !== index1));
  };

  const addZero = (value: any) => {
    return Number(value) < 10 ? '0' + value : value;
  };

  //处理完成操作
  const handleFinished = async (values: any) => {
    var temp = JSON.parse(JSON.stringify(values));
    temp['event_label_label'] = choiceKeysValue;
    temp['event_trigger_mode_label'] = form.getFieldValue(
      'event_trigger_mode_label',
    );
    let attributeArr: [] = [];
    /* if (eventAttrList.length > 0) {
      eventAttrList.forEach((item) => {
        attributeArr.push(item.attribute_id);
      });
    } */
    var obj = {
      info: temp,
      attributeArr: attributeArr,
    };
    var res: any = {};
    if (drawerConf.data) {
      res = await updateEvent(obj, drawerConf.data.event_id);
    } else {
      res = await createEvent(obj);
    }

    if (res.status == 0) {
      message.success(res.msg || '创建成功');
      var obj1 = {
        keyword: '',
        pageNo: 1,
        pageSize: 10,
        indicator_label: '',
        indicator_type: '',
      };
      onCancelEdit();
      requireEventList(obj1);
    }
  };
  const saveData = async () => {
    if (!form) return;
    form.submit();
  };
  const getLabel = (key: string, list: any) => {
    for (var i = 0; i < list.length; i++) {
      if (list[i].value == key) {
        return list[i].label;
      }
    }
    return '';
  };

  const onFormLayoutChange = (e: any) => {
    if (Object.keys(e)[0] == 'event_trigger_mode') {
      form.setFieldsValue({
        event_trigger_mode_label: getLabel(e.event_trigger_mode, triggerTypes),
      });
    }
  };
  const getEventDetail = async (id: string) => {
    var res: any = {};
    res = await queryEvent(id);
    if (res?.status == 0) {
      //setEventAttrList(res.data.attrInfo)
      if (res.data.eventInfo.event_label) {
        var temp = res.data.eventInfo.event_label.split(',').map(Number);
        setChoiceKeys(temp);
        setChoiceKeysValue(res.data.eventInfo.event_label_label);
      }
      form.setFieldsValue(res.data.eventInfo);
    }
  };

  useEffect(() => {
    getBasicData('data_type');
    getBasicData('event_trigger_mode');
    if (drawerConf.data) {
      getEventDetail(drawerConf.data.event_id);
    }
  }, []);
  const tableColumns: any = [
    {
      title: '属性代码',
      dataIndex: 'attribute_code',
      key: 'attribute_code',
    },
    {
      title: '属性',
      dataIndex: 'attribute_name',
      key: 'attribute_name',
    },
    {
      title: '数据类型',
      dataIndex: 'data_type',
      key: 'data_type',
    },
    {
      title: '属性值含义来源',
      key: 'attribute_source',
      dataIndex: 'attribute_source',
    },
    {
      title: '操作',
      key: 'operation',
      width: 200,
      fixed: 'right',
      render: (row: any, record: any, index: number) => (
        <>
          <Space size="middle">
            <a onClick={() => reomveEventAttrList(index)}>移除</a>
          </Space>
        </>
      ),
    },
  ];
  const handSelect = (val: any, temp: any) => {
    var arr = [];
    if (val.length > 0) {
      for (var i = 0; i < temp.length; i++) {
        arr.push(temp[i].title);
      }
    }
    form.setFieldsValue({ event_label: val.join(',') });
    setChoiceKeysValue(arr.join(','));
  };
  const treeProps = {
    handSelect: handSelect,
    choiceKeys: choiceKeys,
    theId: 2,
    isEdit: drawerConf.data ? true : false,
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
            <Button onClick={saveData} type="primary">
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
                onValuesChange={onFormLayoutChange}
                onFinish={handleFinished}
                initialValues={{ open_type: 1 }}
              >
                <Form.Item
                  name="event_name"
                  label={fieldLabels.event_name}
                  rules={[
                    { required: true, message: '请输入' },
                    {
                      pattern: /^[\S\n\s]{0,30}$/,
                      message: '最多输入30个字符',
                    },
                  ]}
                >
                  <Input
                    placeholder="一经创建,不可更改"
                    disabled={drawerConf.data != undefined}
                  />
                </Form.Item>
                <Form.Item
                  name="event_code"
                  label={fieldLabels.event_code}
                  rules={[
                    { required: true, message: '请输入应用代码' },
                    { pattern: /^[A-Za-z_]+$/, message: '事件代码格式不正确' },
                    {
                      pattern: /^[\S\n\s]{0,30}$/,
                      message: '最多输入30个字符',
                    },
                  ]}
                >
                  <Input
                    placeholder="由字母、下划线组成且一经创建,不可更改"
                    disabled={drawerConf.data != undefined}
                  />
                </Form.Item>
                <Form.Item
                  name="event_trigger_mode"
                  rules={[{ required: true, message: '请选择触发类型' }]}
                  label={fieldLabels.event_trigger_mode}
                >
                  <Select
                    placeholder="请选择触发类型"
                    options={triggerTypes}
                  ></Select>
                </Form.Item>
                <Form.Item
                  name="trigger_time"
                  rules={[
                    { required: true, message: '请输入触发时机' },
                    {
                      pattern: /^[\S\n\s]{0,30}$/,
                      message: '最多输入30个字符',
                    },
                  ]}
                  label={fieldLabels.trigger_time}
                >
                  <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item
                  name="event_label"
                  label={fieldLabels.event_label}
                  rules={[{ required: true, message: '请选择事件标签' }]}
                >
                  {choiceKeys.length > 0 && <LabelTree {...treeProps} />}
                  {choiceKeys.length == 0 && <LabelTree {...treeProps} />}
                </Form.Item>
                <Form.Item
                  name="open_type"
                  label="数据来源"
                  rules={[{ required: true, message: '请选择数据来源' }]}
                >
                  <Select
                    placeholder="请选择数据来源"
                    allowClear={true}
                    options={sourceFromList}
                  ></Select>
                </Form.Item>
                <Form.Item name="note" label={fieldLabels.note}>
                  <TextArea placeholder="请输入" />
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
