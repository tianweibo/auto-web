import React, { FC, useEffect, useState } from 'react';
import {
  getAttributeList,
  getAttributeDetail,
  BasicData,
  createEvent,
  updateEvent,
  queryEvent,
} from '../../service';
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
const { Option } = Select;
import './style.less';
import styles from './style.less';
const fieldLabels = {
  event_name: '事件中文名',
  event_code: '事件英文代码',
  event_trigger_mode: '触发类型',
  trigger_time: '触发时机',
  event_label: '事件标签',
  note: '备注',
};
const dataTypeList = ['String', 'Int', 'Double', 'Float', 'Boolean'];
const EditForm: FC<any> = (props) => {
  const [form] = Form.useForm();
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
  const requireAttributeList = async (params: {}) => {
    const res: any = await getAttributeList(params);
    setAttributeList(res.data.arr);
  };
  // 渠道change事件
  const handleChannelChange = (channel_value: any, channel_options: any) => {
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
      select_channel_array[select_channel_array.length - 1].value;
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
        if (itm.value === value) {
          opt = itm.children;
          return itm;
        }
      }
      return null;
    });
  };
  const handleChangeTag = async (e: any) => {
    if (e && e.length > 0) {
      attribute_label = handleChannelChange(e, attributeTags);
    } else {
      attribute_label = '';
    }
    const obj = {
      keyword: '',
      pageNo: 1,
      pageSize: 1000,
      state: 1,
      attribute_label: attribute_label,
      data_type: data_type,
    };
    setAttributeList((await getAttributeList(obj)).data.arr);
  };
  const handleChangeType = async (e: any) => {
    if (e) {
      data_type = e;
    } else {
      data_type = '';
    }
    const obj = {
      keyword: '',
      pageNo: 1,
      pageSize: 1000,
      state: 1,
      attribute_label: attribute_label,
      data_type: data_type,
    };
    requireAttributeList(obj);
  };
  const handleChangeMul = (value: any) => {
    let event_mus: [] = [];
    if (value.length > 0) {
      value.forEach((element) => {
        event_mus.push(
          attributeList.find((item) => item.attribute_code === element).attribute_id,
        );
      });
    }
    event_options_a = event_mus;
  };
  const findTopParents:any=(menuJson:any, childId:any, result:any)=> {
    result = result || [];
    let menuStr:string = typeof menuJson === "string" ? menuJson : JSON.stringify(menuJson);
    let reg = new RegExp('value":"([^"]+)"[^\\}\\]\\[\\{]+\\[\\{[^\\}\\]\\[\\{]+value":"' + childId);
    if(reg.test(menuStr)) {
        //result.push(menuStr.match(reg)[1]);
        var temp=menuStr.match(reg);
        if(temp && temp.length>1){
          result.push(temp[1])
          return findTopParents(menuStr, temp[1], result);
        }
        
   } else {
        return result;
   }
 } 
  const getBasicData = async (id: string) => {
    var res: any = {};
    res = await BasicData(id);
    switch (id) {
      case 'data_type':
        // setDataType(res.data)
        break;
      case 'attribute_label':
        setAttributeTags(res.data);
        if(drawerConf.data){
          let str=drawerConf.data.event_label;
          var arr=findTopParents(res.data,str,[]);
          arr.push(str)
          drawerConf.data.event_label=arr;
          form.setFieldsValue(drawerConf.data);
        }
        break;
      case 'event_trigger_mode':
        setTriggerList(res.data);
        break;
      default:
        setTagList(res.data);
        break;
    }
  };
  // 点击添加属性
  const addNewAttribute = async () => {
    if (event_options_a.length === 0) {
      return;
    }
    await submitEventData({ id: event_options_a });
  };

  const submitEventData = async (value: any) => {
    const data = await (await getAttributeDetail(value)).data;
    setEventAttrList(data);
  };

  const reomveEventAttrList = async (index1: number) => {
    setEventAttrList(eventAttrList.filter((data,index)=>index !==index1))
  };

  const addZero = (value: any) => {
    return Number(value) < 10 ? '0' + value : value;
  };
  const formatTime = (date: any) => {
    return (
      date.getFullYear() +
      '-' +
      addZero(date.getMonth() + 1) +
      '-' +
      addZero(date.getDate()) +
      ' ' +
      addZero(date.getHours()) +
      ':' +
      addZero(date.getMinutes()) +
      ':' +
      addZero(date.getSeconds())
    );
  };

  //处理完成操作
  const handleFinished = async (values: any) => {
    const info: any = {};
    Object.keys(values).forEach((item) => {
      if (item === 'event_label') {
        info[`${item}`] = handleChannelChange(values[`${item}`], tagList);
        info['event_label_label'] = handleChannelChangeLabel(
          values[`${item}`],
          tagList,
        );
      } else {
        info[`${item}`] = values[`${item}`];
      }
    });
    info['create_time'] = formatTime(new Date());
    let attributeArr: [] = [];
    if (eventAttrList.length > 0) {
      eventAttrList.forEach((item) => {
        attributeArr.push(item.attribute_id);
      });
    }
    var obj = {
      info: info,
      attributeArr: attributeArr,
    };
    var res: any = {};
    if (drawerConf.data) {
      res = await updateEvent(obj, drawerConf.data.event_id);
    } else {
      res = await createEvent(obj);
    }
   
    if (res.data?.code == 0) {
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
    } else {
      message.error(res?.msg || '创建失败');
    }
  };
  const saveData = async () => {
    if (!form) return;
    form.submit();
  };
  const getLabel=(key:string,list:any)=>{
    for(var i=0;i<list.length;i++){
      if(list[i].value==key){
       return list[i].label
      }
    }
    return ''
 }
 const getLabelLabel=(array:any,list:any)=>{
   for(var i=0;i<list.length;i++){
     if(list[i].value==array[0]){
      for(var j=0;j<list[i].children.length;j++){
        if(list[i].children[j].value==array[1]){
          return list[i].children[j].label
        }
      }
     }
   }
   return ''
}
  const onFormLayoutChange = (e: any) => {
    if (Object.keys(e)[0] == 'event_trigger_mode') {
      form.setFieldsValue({event_trigger_mode_label:getLabel(e.event_trigger_mode,triggerTypes)});
    }else if (Object.keys(e)[0] == 'event_label') {
      form.setFieldsValue({event_label_label:getLabelLabel(e.event_label,tagList)});
    }
  };
  const getEventDetail = async (id: string) => {
    var res: any = {};
    res = await queryEvent(id);
    var arr: any = [];
  };

  useEffect(() => {
    getBasicData('data_type');
    getBasicData('attribute_label');
    getBasicData('event_trigger_mode');
    getBasicData('event_label');
    var obj = {
      keyword: '',
      pageNo: 1,
      pageSize: 1000,
      state: 1,
      attribute_label: '',
      data_type: '',
    };
    requireAttributeList(obj);
    if (drawerConf.data) {
      getEventDetail(drawerConf.data.event_id);
    }
  }, []);
  const tableColumns: any = [
    {
      title: '属性代码',
      dataIndex: 'attribute_code',
    },
    {
      title: '属性',
      dataIndex: 'attribute_label',
      ellipsis: true,
    },
    {
      title: '数据类型',
      dataIndex: 'data_type',
      ellipsis: true,
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
      render: (row: any, record: any,index:number) => (
        <>
          <Space size="middle">
            <a onClick={() => reomveEventAttrList(index)}>移除</a>
          </Space>
        </>
      ),
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
              >
                <Form.Item
                  name="event_name"
                  label={fieldLabels.event_name}
                  rules={[{ required: true, message: '请输入' }]}
                >
                  <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item
                  name="event_code"
                  label={fieldLabels.event_code}
                  rules={[{ required: true, message: '请输入应用代码' },{pattern: /^[A-Za-z_]+$/,
                    message: '事件代码格式不正确'}]}
                >
                  <Input placeholder="由字母、下划线组成" />
                </Form.Item>
                <Form.Item
                  name="event_trigger_mode"
                  label={fieldLabels.event_trigger_mode}
                >
                  <Select
                  placeholder="请选择触发类型" 
                  options={triggerTypes}
                 >
                </Select>
                </Form.Item>
                <Form.Item
                  name="trigger_time"
                  label={fieldLabels.trigger_time}
                >
                  <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item
                  name="event_label"
                  label={fieldLabels.event_label}
                >
                  <Cascader options={tagList}></Cascader>
                </Form.Item>
                <Form.Item
                  name="note"
                  label={fieldLabels.note}
                >
                  <Input placeholder="请输入" />
                </Form.Item>
                <Divider />
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                  | 设置自定义属性
                </div>
                <Space style={{ marginBottom: '10px' }}>
                  属性标签：
                  <Cascader
                    options={attributeTags}
                    onChange={handleChangeTag}
                  ></Cascader>
                  数据类型
                  <Select
                    onChange={handleChangeType}
                    allowClear
                    style={{ width: '100px' }}
                  >
                    {dataTypeList &&
                      dataTypeList.length > 0 &&
                      dataTypeList.map((item) => (
                        <Option value={item}>{item}</Option>
                      ))}
                  </Select>
                  属性：
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '300px' }}
                    placeholder="请选择"
                    onChange={handleChangeMul}
                  >
                    {attributeList &&
                      attributeList.length > 0 &&
                      attributeList.map((item) => (
                        <Option value={item.attribute_code}>
                          {item.attribute_code}
                        </Option>
                      ))}
                  </Select>
                  <Button onClick={addNewAttribute}>添加</Button>
                </Space>
                <Table
                  dataSource={eventAttrList}
                  pagination={false}
                  columns={tableColumns}
                ></Table>
              </Form>
            </div>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default EditForm;
