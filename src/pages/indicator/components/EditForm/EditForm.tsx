import React, { FC, useEffect, useState } from 'react';
import {
  basicData,
  getEventById,
  addIndicator,
  detailIndicator,
  editIndicator,
  getEventList,
} from '../../service';
import {
  Drawer,
  Table,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  Radio,
  Cascader,
  message,
} from 'antd';
const { Option } = Select;
const { TextArea } = Input;
import './style.less';
import styles from './style.less';
import { sourceFromList } from '../../.././../common/enumData.js';
import LabelTree from '../../../../components/labelTree/index.jsx';
import { getValues } from '@/utils/util';
const EditForm: FC<any> = (props) => {
  const [form] = Form.useForm();
  const [formType] = Form.useForm();
  const [labelList, setLabelList] = useState<
    Array<{ key: string; value: string }>
  >([]); //指标标签
  const [indicTypeList, setIndicTypeList] = useState<
    Array<{ key: string; value: string }>
  >([]); //指标类型
  const [levelIndicList, setLevelIndicList] = useState<
    Array<{ key: string; value: string }>
  >([]); //一级指标
  const [eventList, setEventList] = useState([]);
  const [eventLists, setEventLists] = useState([]);
  const [activeRelation, setActiveRelation] = useState(1);
  const [choiceKeys, setChoiceKeys] = useState([]);
  const [triggerTypes, setTriggerTypes] = useState([]);
  const [choiceKeysValue, setChoiceKeysValue] = useState('');
  const { drawerConf, onCancelEdit, createList, editList } = props;
  //处理完成操作
  const handleFinished = async (values: any) => {
    var temp = JSON.parse(JSON.stringify(values));
    temp['indicator_label_label'] = choiceKeysValue;
    temp['indicator_type_label'] = form.getFieldValue('indicator_type_label');
    temp['indicator_level_label'] = form.getFieldValue('indicator_level_label');
    var arr = [];
    if (eventLists.length == 0) {
      message.warning('每个指标下必须至少关联一个事件');
      return;
    }
    for (var i = 0; i < eventLists.length; i++) {
      arr.push(eventLists[i].event_id);
    }
    var obj = {
      info: temp,
      eventArr: arr,
    };
    var res: any = {};
    if (drawerConf.data) {
      res = await editIndicator(obj, drawerConf.data.indicator_id);
      if (res?.status == 0) {
        message.success(res.msg || '编辑成功');
        onCancelEdit();
        editList();
      }
    } else {
      res = await addIndicator(obj);
      if (res?.status == 0) {
        message.success(res.msg || '创建成功');
        onCancelEdit();
        createList();
      }
    }
  };
  const getLabel = (key: string, list: any) => {
    for (var i = 0; i < list.length; i++) {
      if (list[i].value == key) {
        return list[i].label;
      }
    }
    return '';
  };
  const handleFieldChange = (e: any) => {
    var obj = {
      keyword: '',
      pageNo: 1,
      pageSize: 1000,
      event_label: '',
      event_trigger_mode: e,
      state: 1,
    };
    requireEventList(obj);
  };
  const requireEventList = async (params: {}) => {
    const res: any = await getEventList(params);
    if (res.status == 0) {
      setEventList(res.data.arr);
    }
  };
  const getLabelLabel = (array: any, list: any) => {
    for (var i = 0; i < list.length; i++) {
      if (list[i].value == array[0]) {
        for (var j = 0; j < list[i].children.length; j++) {
          if (list[i].children[j].value == array[1]) {
            return list[i].children[j].label;
          }
        }
      }
    }
    return '';
  };
  const onFormLayoutChange = (e: any) => {
    if (Object.keys(e)[0] == 'indicator_type') {
      form.setFieldsValue({
        indicator_type_label: getLabel(e.indicator_type, indicTypeList),
      });
    } else if (Object.keys(e)[0] == 'indicator_level') {
      form.setFieldsValue({
        indicator_level_label: getLabel(e.indicator_level, levelIndicList),
      });
    } else if (Object.keys(e)[0] == 'relationship_event') {
      setActiveRelation(e.relationship_event);
    }
  };

  const changIndiaType = (e: any) => {
    form.setFieldsValue({ indicator_level: '' });
    getBasicData(e);
    let obj = {
      indicator_type: form.getFieldValue('indicator_type'),
      indicator_level: '',
    };
  };
  const changIndiaLevel = (e: any) => {
    let obj = {
      indicator_type: form.getFieldValue('indicator_type'),
      indicator_level: form.getFieldValue('indicator_level'),
    };
  };

  const saveData = async () => {
    if (!form) return;
    form.submit();
  };

  const getBasicData = async (id: string) => {
    var res: any = {};
    res = await basicData(id);
    if (res?.status == 0) {
      switch (id) {
        case 'indicator_type_level':
          setIndicTypeList(res.data);
          break;
        case 'event_trigger_mode':
          setTriggerTypes(res.data);
          break;
        default:
          setLevelIndicList(res.data);
          break;
      }
    }
  };

  const getIndicatorDetail = async (id: string) => {
    var res: any = {};
    res = await detailIndicator(id);
    if (res?.status == 0) {
      var arr: any = [];
      for (var i = 0; i < res.data.eventInfo.length; i++) {
        arr.push(res.data.eventInfo[i].event_id);
      }
      if (res.data.indicatorInfo.indicator_label) {
        var temp = res.data.indicatorInfo.indicator_label
          .split(',')
          .map(Number);
        setChoiceKeys(temp);
        setChoiceKeysValue(res.data.indicatorInfo.indicator_label_label);
      }
      form.setFieldsValue(res.data.indicatorInfo);
      getBasicData(res.data.indicatorInfo.indicator_type);
      let obj = {
        id: arr,
      };
      var res: any = {};
      res = await getEventById(obj);
      setEventLists(res.data);
    }
  };
  useEffect(() => {
    getBasicData('indicator_type_level');
    getBasicData('event_trigger_mode');
    var obj = {
      keyword: '',
      pageNo: 1,
      pageSize: 1000,
      event_label: '',
      event_trigger_mode: 'open',
      state: 1,
    };
    requireEventList(obj);
    if (drawerConf.data) {
      //edit
      getIndicatorDetail(drawerConf.data.indicator_id);
    }
  }, []);
  const handSelect = (val: any, temp: any) => {
    var arr = [];
    if (val.length > 0) {
      for (var i = 0; i < temp.length; i++) {
        arr.push(temp[i].title);
      }
    }
    form.setFieldsValue({ indicator_label: val.join(',') });
    setChoiceKeysValue(arr.join(','));
  };
  const deleteData = (index1: number) => {
    setEventLists(eventLists.filter((data, index) => index !== index1));
  };
  const addEvent = async () => {
    var temp: any = [];
    var arr: any = [];
    temp = formType.getFieldValue('eventIds');
    if (!temp) {
      return;
    }
    for (var i = 0; i < eventLists.length; i++) {
      if (!temp.includes(eventLists[i].event_id)) {
        arr.push(eventLists[i].event_id);
      }
    }
    var sj = arr.concat(temp);
    let obj = {
      id: sj,
    };
    var res: any = {};
    res = await getEventById(obj);
    setEventLists(res.data);
    formType.setFieldsValue({ eventIds: [] });
  };
  const columns = [
    {
      title: '事件名称',
      dataIndex: 'event_name',
      key: 'event_name',
    },
    {
      title: '事件code',
      dataIndex: 'event_code',
      key: 'event_code',
    },
    {
      title: '事件触发类型',
      dataIndex: 'event_trigger_mode_label',
      key: 'event_trigger_mode_label',
    },
    {
      title: '操作',
      dataIndex: 'address',
      key: 'address',
      render: (text: any, record: any, index: number) => (
        <>
          <a onClick={() => deleteData(index)}>移除</a>
        </>
      ),
    },
  ];
  const treeProps = {
    handSelect: handSelect,
    choiceKeys: choiceKeys,
    theId: 1,
    isEdit: drawerConf.data ? true : false,
  };
  return (
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
          <Button type="primary" onClick={saveData}>
            保存
          </Button>
        </div>
      }
    >
      <Row>
        <Col span={24} className={styles.rightFormWrap}>
          <div>
            <Form
              form={form}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              initialValues={{
                relationship_event: activeRelation,
                open_type: 1,
              }}
              onValuesChange={onFormLayoutChange}
              onFinish={handleFinished}
            >
              <Form.Item
                name="indicator_type"
                label="指标类型"
                rules={[{ required: true, message: '请选择指标类型' }]}
              >
                <Select
                  placeholder="请选择指标类型"
                  onChange={changIndiaType}
                  allowClear={true}
                  options={indicTypeList}
                ></Select>
              </Form.Item>
              <Form.Item
                name="indicator_level"
                label="一级指标"
                rules={[{ required: true, message: '请选择一级指标' }]}
              >
                <Select
                  placeholder="请选择一级指标"
                  allowClear={true}
                  onChange={changIndiaLevel}
                  options={levelIndicList}
                ></Select>
              </Form.Item>
              <Form.Item
                name="indicator_name"
                label="指标名称"
                rules={[
                  { required: true, message: '请输入指标名称' },
                  { pattern: /^[\S\n\s]{0,30}$/, message: '最多输入30个字符' },
                ]}
              >
                <Input
                  placeholder="一经创建,不可更改"
                  disabled={drawerConf.data != undefined}
                />
              </Form.Item>
              <Form.Item
                name="indicator_code"
                label="指标代码"
                rules={[
                  { required: true, message: '请输入指标代码' },
                  {
                    pattern: /^[A-Za-z_]+$/,
                    message: '指标代码格式不正确',
                  },
                  { pattern: /^[\S\n\s]{0,30}$/, message: '最多输入30个字符' },
                ]}
              >
                <Input
                  placeholder="由字母、下划线组成且一经创建,不可更改"
                  disabled={drawerConf.data != undefined}
                />
              </Form.Item>
              <Form.Item
                name="indicator_label"
                label="指标标签"
                rules={[{ required: true, message: '请选择指标标签' }]}
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
              <Form.Item name="note" label="备注">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Form>
            <Col span={18} className={'tongji'}>
              {/* <div className="title">计算公式</div> */}
              <Form layout="inline" form={formType}>
                <Form.Item label="事件触发类型">
                  <Cascader
                    options={triggerTypes}
                    defaultValue={['open']}
                    placeholder="请选择事件触发类型"
                    onChange={handleFieldChange}
                    style={{ width: '100px' }}
                  ></Cascader>
                </Form.Item>
                <Form.Item
                  name="eventIds"
                  label="统计事件"
                  rules={[{ required: true, message: '请关联事件' }]}
                >
                  <Select
                    placeholder="请选择事件"
                    allowClear={true}
                    filterOption={(input, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    style={{ width: '280px', float: 'left' }}
                  >
                    {eventList.map((item) => (
                      <Option key={item.event_id} value={item.event_id}>
                        {item.event_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={addEvent}>
                    添加
                  </Button>
                </Form.Item>
              </Form>
              <Table
                className="table"
                columns={columns}
                dataSource={eventLists}
              />
              {/* <Form.Item name="relationship_event" label="事件关系">
                  <Radio.Group >
                    <Radio value={1}>且</Radio>
                    <Radio value={0}>或</Radio>
                  </Radio.Group>
                </Form.Item> */}
            </Col>
          </div>
        </Col>
      </Row>
    </Drawer>
  );
};

export default EditForm;
