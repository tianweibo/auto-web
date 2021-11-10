import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';
import {
  basicData,
  getIndicListByType,
  getIndicListByid,
  addApp,
  detailApp,
  editApp,
} from '../../service';
import {
  Table,
  Drawer,
  Divider,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  Radio,
  Cascader,
  Tag,
  PageHeader,
  message,
} from 'antd';
const { Option } = Select;
const { TextArea } = Input;
import LabelTree from '../../../../components/labelTree/index.jsx';
import './style.less';
import styles from './style.less';
import { sourceFrom } from '../../../../common/enumData.js';
const EditForm: FC<any> = (props) => {
  const [form] = Form.useForm();
  const [formType] = Form.useForm();
  const [platformList, setPlatformList] = useState<
    Array<{ key: string; value: string }>
  >([]); //应用平台
  const [appDevList, setAppDevList] = useState<
    Array<{ key: string; value: string }>
  >([]); //应用部署平台
  const [appTypeList, setAppTypeList] = useState<
    Array<{ key: string; value: string }>
  >([]); //应用类型
  const [indicTypeList, setIndicTypeList] = useState<
    Array<{ key: string; value: string }>
  >([]); //指标类
  const [levelIndicList, setLevelIndicList] = useState<
    Array<{ key: string; value: string }>
  >([]); //一级指标
  const [indicList, setIndicList] = useState<
    Array<{
      indicator_id: string;
      indicator_name: string;
      indicator_code: string;
    }>
  >([]); //指标列表
  const [indicLists, setIndicLists] = useState<
    Array<{
      indicator_id: string;
      indicator_name: string;
      indicator_code: string;
    }>
  >([]);
  const [activeType, setActiveType] = useState(1);
  const [choiceKeys, setChoiceKeys] = useState([]);
  const [choiceKeysValue, setChoiceKeysValue] = useState('');
  const {
    dispatch,
    drawerConf,
    current,
    activityList,
    onCancelEdit,
    createList,
    editList,
  } = props;

  //处理完成操作
  const handleFinished = async (values: any) => {
    var temp = JSON.parse(JSON.stringify(values));
    temp['platform_business_label'] = form.getFieldValue(
      'platform_business_label',
    );
    temp['application_dep_platform_label'] = form.getFieldValue(
      'application_dep_platform_label',
    );
    temp['application_type_label'] = form.getFieldValue(
      'application_type_label',
    );
    temp['application_label_label'] = choiceKeysValue;
    var arr = [];
    for (var i = 0; i < indicLists.length; i++) {
      arr.push(indicLists[i].indicator_id);
    }
    var obj = {
      info: temp,
      indicatorArr: arr,
    };
    var res: any = {};
    if (drawerConf.title == '编辑应用') {
      res = await editApp(obj, drawerConf.data.application_id);
      if (res?.status == 0) {
        message.success(res.msg || '编辑成功');
        onCancelEdit();
        editList();
      }
    } else {
      res = await addApp(obj);
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
  const onFormLayoutChange = (e: any) => {
    if (Object.keys(e)[0] == 'is_interactive') {
      setActiveType(e.is_interactive);
    } else if (Object.keys(e)[0] == 'platform_business') {
      form.setFieldsValue({
        platform_business_label: getLabel(e.platform_business, platformList),
      });
    } else if (Object.keys(e)[0] == 'application_dep_platform') {
      form.setFieldsValue({
        application_dep_platform_label: getLabel(
          e.application_dep_platform,
          appDevList,
        ),
      });
    } else if (Object.keys(e)[0] == 'application_type') {
      form.setFieldsValue({
        application_type_label: getLabel(e.application_type, appTypeList),
      });
    }
  };
  const changIndiaType = (e: any) => {
    formType.setFieldsValue({ indicator_level: '' });
    getBasicData(e);
    let obj = {
      indicator_type: formType.getFieldValue('indicator_type'),
      indicator_level: '',
    };
    getIndicList(obj);
  };

  const changIndiaLevel = (e: any) => {
    let obj = {
      indicator_type: formType.getFieldValue('indicator_type'),
      indicator_level: formType.getFieldValue('indicator_level'),
    };
    getIndicList(obj);
  };
  const choiceIndia = (e: any) => {
    formType.setFieldsValue({ indicIds: e });
  };
  const deleteData = (index1: number, record) => {
    if (record.open_type != 1) {
      message.warning('互动营销分析平台数据，不支持删除');
      return;
    }
    setIndicLists(indicLists.filter((data, index) => index !== index1));
  };
  const saveData = async () => {
    if (!form) return;
    form.submit();
  };
  const addIndicator = async () => {
    var temp: any = [];
    var arr: any = [];
    temp = formType.getFieldValue('indicIds');
    if (!temp) {
      return;
    }
    for (var i = 0; i < indicLists.length; i++) {
      if (!temp.includes(indicLists[i].indicator_id)) {
        arr.push(indicLists[i].indicator_id);
      }
    }
    var sj = arr.concat(temp);
    let obj = {
      id: sj,
    };
    var res: any = {};
    res = await getIndicListByid(obj);
    setIndicLists(res.data);
    formType.setFieldsValue({ indicIds: [] });
  };

  const getBasicData = async (id: string) => {
    var res: any = {};
    res = await basicData(id);
    switch (id) {
      case 'platform_business':
        setPlatformList(res.data);
        break;
      case 'indicator_type_level':
        setIndicTypeList(res.data);
        break;
      case 'application_dep_platform':
        setAppDevList(res.data);
        break;
      case 'platform_system':
        setAppTypeList(res.data);
        break;
      default:
        setLevelIndicList(res.data);
        break;
    }
  };
  const getIndicList = async (obj: object) => {
    var res: any = {};
    res = await getIndicListByType(obj);
    setIndicList(res.data);
  };
  const getAppDetail = async (id: string) => {
    var res: any = {};
    res = await detailApp(id, 0);
    setIndicLists(res.data.indicatorIds);
    if (res.data.appInfo.application_label) {
      var temp = res.data.appInfo.application_label.split(',').map(Number);
      setChoiceKeys(temp);
      setChoiceKeysValue(res.data.appInfo.application_label_label);
    }
    form.setFieldsValue(res.data.appInfo);
    let obj = {
      id: res.data.indicatorIds,
    };
    var res: any = {};
    res = await getIndicListByid(obj);
    setIndicLists(res.data);
  };
  useEffect(() => {
    getBasicData('platform_business');
    getBasicData('app_label');
    getBasicData('indicator_type_level');
    getBasicData('application_dep_platform');
    getBasicData('platform_system');

    getBasicData('frequency');
    var obj = {
      indicator_type: 'frequency',
      indicator_level: 'cyhdcs',
    };
    getIndicList(obj);
    if (drawerConf.data) {
      //edit
      getAppDetail(drawerConf.data.application_id);
    }
  }, []);
  const handSelect = (val: any, temp: any) => {
    var arr = [];
    if (val.length > 0) {
      for (var i = 0; i < temp.length; i++) {
        arr.push(temp[i].title);
      }
    }
    form.setFieldsValue({ application_label: val.join(',') });
    setChoiceKeysValue(arr.join(','));
  };
  const columns = [
    {
      title: '指标类型',
      dataIndex: 'indicator_type_label',
      key: 'indicator_type_label',
    },
    {
      title: '一级指标',
      dataIndex: 'indicator_level_label',
      key: 'indicator_level_label',
    },
    {
      title: '指标名称',
      dataIndex: 'indicator_name',
      key: 'indicator_name',
    },
    {
      title: '指标代码',
      dataIndex: 'indicator_code',
      key: 'indicator_code',
    },
    {
      title: '数据来源',
      dataIndex: 'open_type',
      key: 'open_type',
      render: (text: any, record: any, index: number) => (
        <>{sourceFrom[record.open_type]}</>
      ),
    },
    {
      title: '操作',
      dataIndex: 'address',
      key: 'address',
      render: (text: any, record: any, index: number) => (
        <>
          <a onClick={() => deleteData(index, record)}>移除</a>
        </>
      ),
    },
  ];
  const treeProps = {
    handSelect: handSelect,
    choiceKeys: choiceKeys,
    theId: 4,
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
              initialValues={{ is_interactive: activeType, open_type: 1 }}
              onValuesChange={onFormLayoutChange}
              onFinish={handleFinished}
            >
              <Form.Item
                name="platform_app"
                label="应用名称"
                rules={[
                  { required: true, message: '请输入应用名称' },
                  { pattern: /^[\S\n\s]{0,30}$/, message: '最多输入30个字符' },
                ]}
              >
                <Input
                  placeholder="一经创建,不可更改"
                  disabled={drawerConf.title == '编辑应用'}
                />
              </Form.Item>
              <Form.Item
                name="platform_app_code"
                label="应用代码"
                rules={[
                  { required: true, message: '请输入应用代码' },
                  { pattern: /^[A-Za-z_]+$/, message: '应用代码格式不正确' },
                  { pattern: /^[\S\n\s]{0,30}$/, message: '最多输入30个字符' },
                ]}
              >
                <Input
                  placeholder="由字母、下划线组成且一经创建,不可更改"
                  disabled={drawerConf.title == '编辑应用'}
                />
              </Form.Item>
              <Form.Item
                name="platform_app_version"
                label="应用版本"
                rules={[
                  { required: true, message: '请输入应用版本' },
                  { pattern: /^[\S\n\s]{0,30}$/, message: '最多输入30个字符' },
                ]}
              >
                <Input
                  placeholder="请输入应用版本"
                  disabled={form.getFieldValue('open_type') != 1}
                />
              </Form.Item>
              <Form.Item
                name="platform_business"
                label="应用平台"
                rules={[{ required: true, message: '请选择应用平台' }]}
              >
                <Select
                  placeholder="请选择应用平台"
                  options={platformList}
                  disabled={form.getFieldValue('open_type') != 1}
                ></Select>
              </Form.Item>
              <Form.Item
                name="application_dep_platform"
                label="应用部署平台"
                rules={[{ required: true, message: '请选择应用部署平台' }]}
              >
                <Select
                  placeholder="请选择应用部署平台"
                  options={appDevList}
                  disabled={form.getFieldValue('open_type') != 1}
                ></Select>
              </Form.Item>
              <Form.Item
                name="application_type"
                label="应用类型"
                rules={[{ required: true, message: '请选择应用类型' }]}
              >
                <Select
                  placeholder="请选择应用类型"
                  options={appTypeList}
                  disabled={form.getFieldValue('open_type') != 1}
                ></Select>
              </Form.Item>
              <Form.Item name="is_interactive" label="互动应用">
                <Radio.Group disabled={form.getFieldValue('open_type') != 1}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
              {form.getFieldValue('open_type') == 1 && (
                <Form.Item
                  name="application_label"
                  label="应用标签"
                  rules={[{ required: true, message: '请选择应用标签' }]}
                >
                  {choiceKeys.length > 0 && <LabelTree {...treeProps} />}
                  {choiceKeys.length == 0 && <LabelTree {...treeProps} />}
                </Form.Item>
              )}
              {form.getFieldValue('open_type') != 1 && (
                <Form.Item
                  name="application_label_label"
                  label="应用标签"
                  rules={[
                    { required: true, message: '请选择应用标签' },
                    {
                      pattern: /^[\S\n\s]{0,30}$/,
                      message: '最多输入30个字符',
                    },
                  ]}
                >
                  <Input
                    placeholder="请输入应用版本"
                    disabled={form.getFieldValue('open_type') != 1}
                  />
                </Form.Item>
              )}
              <Form.Item name="note" label="备注">
                <TextArea
                  placeholder="请输入"
                  disabled={form.getFieldValue('open_type') != 1}
                />
              </Form.Item>
            </Form>
          </div>
        </Col>
        {/* 统计指标 */}
        <Col span={24} className={'tongji'}>
          <div className="title">统计指标</div>
          <Form layout="inline" form={formType}>
            <Form.Item name="indicator_type" label="指标类型">
              <Select
                placeholder="请选择指标类型"
                defaultValue={'frequency'}
                onChange={changIndiaType}
                allowClear={true}
                options={indicTypeList}
              ></Select>
            </Form.Item>
            <Form.Item name="indicator_level" label="一级指标">
              <Select
                defaultValue={'cyhdcs'}
                placeholder="请选择一级指标"
                style={{ width: '150px' }}
                allowClear={true}
                onChange={changIndiaLevel}
                options={levelIndicList}
              ></Select>
            </Form.Item>
            <Form.Item name="indicIds" label="指标">
              <Select
                mode="multiple"
                allowClear={true}
                onChange={choiceIndia}
                style={{ width: 150, margin: '0 8px' }}
              >
                {indicList.map((item) => (
                  <Option key={item.indicator_code} value={item.indicator_id}>
                    {item.indicator_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={addIndicator}>
                添加
              </Button>
            </Form.Item>
          </Form>
          <Table className="table" columns={columns} dataSource={indicLists} />
        </Col>
      </Row>
    </Drawer>
  );
};

export default EditForm;
