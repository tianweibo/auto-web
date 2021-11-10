import React, { FC, useState, useEffect } from 'react';
import {
  Space,
  Card,
  Form,
  Input,
  Table,
  Button,
  Checkbox,
  Select,
  message,
} from 'antd';
const { Option } = Select;
import { checknameUse, getEventCodesByindic } from '../../service';
import IndicatorCalc from '../../components/indicator-calc/';
import {
  CardObj,
  TableObj,
  TrendObj,
  ApplicationInfo,
  ReportDetail,
  ColumnType,
  IndicatorInfo,
  BasicData,
  DataType,
} from '../../data';
import {
  PlusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { ModalState } from '../../model';
import { history, connect, Dispatch } from 'umi';
import styles from './style.less';
interface Iprops {
  applicationInfo: ApplicationInfo;
  secondIndicatorList: Array<BasicData>;
  timeRangeList: Array<BasicData>;
  reportInfo: ReportDetail;
  indicatorList: Array<IndicatorInfo>;
  dispatch: Dispatch;
}
const CreateReport: FC<Iprops> = (props) => {
  const [initialValues, setinitialValues] = useState<ApplicationInfo>(
    props.applicationInfo,
  );
  const [visible, setVisible] = useState(false);
  const [formType] = Form.useForm();
  const [title, setTitle] = useState('报表创建');
  const [isCheck, setIsCheck] = useState(false);
  const [isCheckbox, setIsCheckbox] = useState(false);
  /*   const [cardList, setCardList] = useState<Array<DataType>>(props.reportInfo.card_ids);
  const [trendList, setTrendList] = useState<Array<DataType>>(props.reportInfo.trend_ids);
  const [tableList, setTableList] = useState<Array<DataType>>(props.reportInfo.table_ids); */
  const changeData = (text: any, id: string, index1: number, type: string) => {
    setIsCheck(false);
    props.dispatch({
      type: 'report/deleteTemp',
      params: {
        type: type,
        id: id,
      },
    });
    props.dispatch({
      type: 'report/deleteData',
      params: {
        index1: index1,
        type: type,
      },
    });
  };
  const moveData = (text: any, index: number, index1: number, type: string) => {
    props.dispatch({
      type: 'report/moveData',
      params: {
        index1: index1,
        index: index,
        type: type,
      },
    });
  };
  const checkdata = () => {
    var temp = {
      status: 0,
      message: '验证通过可以提交了',
    };
    var card_ids = props.reportInfo.card_ids;
    var trend_ids = props.reportInfo.trend_ids;
    var table_ids = props.reportInfo.table_ids;
    var cards = [];
    var trends = [];
    var tables = [];
    if (card_ids && card_ids.length == 0) {
      temp = {
        status: 1,
        message: '请点击增加【卡片】数据',
      };
      return temp;
    } else {
      for (let z = 0; z < card_ids.length; z++) {
        cards.push(card_ids[z].indicator_show_name);
      }
    }
    if (trend_ids && trend_ids.length == 0) {
      temp = {
        status: 1,
        message: '请点击增加【趋势图】数据',
      };
      return temp;
    } else {
      for (let z = 0; z < trend_ids.length; z++) {
        trends.push(trend_ids[z].indicator_show_name);
      }
    }
    if (table_ids && table_ids.length == 0) {
      temp = {
        status: 1,
        message: '请点击增加【表格】数据',
      };
      return temp;
    } else {
      for (let z = 0; z < table_ids.length; z++) {
        tables.push(table_ids[z].indicator_show_name);
      }
    }
    for (var i = 0; i < card_ids.length; i++) {
      if (!card_ids[i].indicator_id) {
        temp = {
          status: 1,
          message: `卡片${i + 1}中的指标名称不能为空`,
        };
        return temp;
      }
      if (!card_ids[i].events) {
        temp = {
          status: 1,
          message: `卡片${i + 1}中的指标没有关联事件，请检查`,
        };
        return temp;
      }
      if (!card_ids[i].indicator_show_name) {
        temp = {
          status: 1,
          message: `卡片${i + 1}中的指标显示名称不能为空`,
        };
        return temp;
      }
      var flag = arrLength(card_ids[i].indicator_show_name, cards);
      if (!flag) {
        temp = {
          status: 1,
          message: `卡片${i + 1}中的指标显示名称已存在，请重新设置`,
        };
        return temp;
      }
      if (!card_ids[i].time_dimension) {
        temp = {
          status: 1,
          message: `卡片${i + 1}中的统计时间范围不能为空`,
        };
        return temp;
      }
      /* if(!card_ids[i].indicator_level){
        temp={
          status:1,
          message:`卡片${i+1}中的二级指标不能为空`
        }
        return temp;
      } */
    }
    for (var i = 0; i < trend_ids.length; i++) {
      if (!trend_ids[i].indicator_id) {
        temp = {
          status: 1,
          message: `趋势图${i + 1}中的指标名称不能为空`,
        };
        return temp;
      }
      if (!trend_ids[i].events) {
        temp = {
          status: 1,
          message: `趋势图${i + 1}中的指标没有关联事件，请检查`,
        };
        return temp;
      }
      if (!trend_ids[i].indicator_show_name) {
        temp = {
          status: 1,
          message: `趋势图${i + 1}中的指标显示名称不能为空`,
        };
        return temp;
      }
      var flag = arrLength(trend_ids[i].indicator_show_name, trends);
      if (!flag) {
        temp = {
          status: 1,
          message: `趋势图${i + 1}中的指标显示名称已存在，请重新设置`,
        };
        return temp;
      }
    }
    for (var i = 0; i < table_ids.length; i++) {
      if (!table_ids[i].indicator_id) {
        temp = {
          status: 1,
          message: `表格${i + 1}中的指标名称不能为空`,
        };
        return temp;
      }
      if (!table_ids[i].events) {
        temp = {
          status: 1,
          message: `表格${i + 1}中的指标没有关联事件，请检查`,
        };
        return temp;
      }
      if (!table_ids[i].indicator_show_name) {
        temp = {
          status: 1,
          message: `表格${i + 1}中的指标显示名称不能为空`,
        };
        return temp;
      }

      var flag = arrLength(table_ids[i].indicator_show_name, tables);
      if (!flag) {
        temp = {
          status: 1,
          message: `表格${i + 1}中的指标显示名称已存在，请重新设置`,
        };
        return temp;
      }
    }
    return temp;
  };
  const goView = () => {
    window.open('/reportView');
    localStorage.setItem('report', JSON.stringify(props.reportInfo));
  };
  const goCheck = async () => {
    if (title == '报表创建') {
      if (!formType.getFieldValue('report_name')) {
        message.warning('报表名称不能为空');
        return;
      }
      var res = await checknameUse(formType.getFieldValue('report_name'));
      if (res.data.code !== 0) {
        message.warning('该报表名已存在，请重新输入');
        return;
      }
    }
    var temp = checkdata();
    if (temp.status !== 0) {
      message.warning(`${temp.message}`);
      return;
    }
    setIsCheck(true);
  };
  const arrLength = (str, arr) => {
    var num = 0;
    for (let i = 0; i < arr.length; i++) {
      if (str == arr[i]) {
        num++;
      }
    }
    if (num > 1) {
      return false;
    }
    return true;
  };
  const cancalCreate = () => {
    history.push({
      pathname: '/report',
    });
  };
  const createData = async () => {
    if (!isCheckbox) {
      message.warning('确认已完成预览，配置无误？请勾选');
      return;
    }
    if (!isCheck) {
      message.warning('请先点击【检查配置】按钮，确认数据是否正确');
      return;
    }
    if (title == '报表创建') {
      debugger;
      var id = history?.location.query?.application_id;
      var data = {
        id: id,
        updates: {
          card_ids: props.reportInfo.card_ids,
          table_ids: props.reportInfo.table_ids,
          trend_ids: props.reportInfo.trend_ids,
          reportInfo: {
            report_name: formType.getFieldValue('report_name'),
          },
        },
      };
      props.dispatch({
        type: 'report/create',
        params: data,
      });
    } else if (title == '报表编辑') {
      var id = history?.location.query?.report_id;
      var data = {
        id: id,
        updates: {
          card_ids: props.reportInfo.card_ids,
          table_ids: props.reportInfo.table_ids,
          trend_ids: props.reportInfo.trend_ids,
          reportInfo: {
            report_name: formType.getFieldValue('report_name'),
          },
        },
      };
      props.dispatch({
        type: 'report/update',
        params: data,
      });
    }
  };
  const checkChange = (e: any) => {
    setIsCheckbox(e.target.checked);
  };
  const addData1 = (row: number) => {
    setIsCheck(false);
    props.dispatch({
      type: 'report/addData',
      row: row,
    });
  };
  const openCalIndic = () => {
    setVisible(true);
  };
  const inputChange = (e: any, index: number, key: any, type: string) => {
    setIsCheck(false);
    props.dispatch({
      type: 'report/changeInput',
      params: {
        value: e.target.value,
        index: index,
        key: key,
        type: type,
      },
    });
  };
  const onCancal = () => {
    setVisible(false);
  };
  const eventList = [
    {
      name: '访问活动',
      type: 1,
    },
    {
      name: '访问活动访问活动访问活动',
      type: 1,
    },
    {
      name: '访问活动访问活动',
      type: 0,
    },
  ];
  const typeList = [
    {
      value: 1,
      label: '次数',
    },
    {
      value: 0,
      label: '人数',
    },
  ];
  const formProps = {
    visible: visible,
    onCancel: onCancal,
    eventList: eventList,
    typeList: typeList,
  };
  const selectChange = async (
    value: any,
    index: number,
    key: any,
    type: string,
  ) => {
    setIsCheck(false); //后续考虑枚举对应的label值的更新
    var events = '';
    if (key === 'indicator_id') {
      var response: any = await getEventCodesByindic(value);
      if (response && response.status == 0) {
        events = response.data.join(',');
      }
    }
    props.dispatch({
      type: 'report/changeSelect',
      params: {
        value: value,
        index: index,
        key: key,
        type: type,
        events: events,
      },
    });
  };
  const timeRangeList = [{ label: '最近14天', value: 'recent_14day' }];
  const sticTimeDimensionList = [
    { label: '按天', value: 'accord_day' },
    { label: '按周', value: 'accord_week' },
    { label: '按月', value: 'accord_month' },
    { label: '按季', value: 'accord_quarter' },
    { label: '按年', value: 'accord_year' },
  ];
  const sequentialList = [
    {
      value: 1,
      label: '展示',
    },
    {
      value: 0,
      label: '不展示',
    },
  ];
  const importList = [
    {
      value: 1,
      label: '支持',
    },
    {
      value: 0,
      label: '不支持',
    },
  ];

  useEffect(() => {
    const type = history?.location.query?.type;
    const report_id = history?.location.query?.report_id;
    const application_id = history?.location.query?.application_id;
    props.dispatch({
      type: 'report/queryBasicData',
      params: {
        id: 'statis_time_range',
      },
    });
    props.dispatch({
      type: 'report/queryBasicData',
      params: {
        id: 'second_indicator',
      },
    });
    props.dispatch({
      type: 'report/queryIndicatorList',
      params: {
        id: application_id,
        open_type: 1,
      },
    });
    if (type && type == 'create' && application_id) {
      setTitle('报表创建');
      props.dispatch({
        type: 'report/clearData',
      });
      formType.setFieldsValue({ report_name: '' });
    } else if (type && type == 'detail' && application_id && report_id) {
      setTitle('报表详情');
      props.dispatch({
        type: 'report/getReportDetail',
        params: {
          id: report_id,
        },
      });
    } else if (type && type == 'update' && application_id && report_id) {
      setTitle('报表编辑');
      props.dispatch({
        type: 'report/getReportDetail',
        params: {
          id: report_id,
        },
      });
    } else {
      console.log('error router');
    }
  }, []);
  if (props?.reportInfo?.reportInfo?.report_name) {
    formType.setFieldsValue({
      report_name: props?.reportInfo?.reportInfo?.report_name,
    });
  }
  formType.setFieldsValue(props.applicationInfo);
  //setTableList(props.reportInfo.card_ids)
  const cardColumns = [
    {
      title: '指标名称',
      dataIndex: 'indicator_id', //
      key: 'indicator_id',
      render: (text: any, record: any, index: number) => (
        <Select
          defaultValue={text}
          disabled={title == '报表详情' ? true : false}
          onChange={(value) =>
            selectChange(value, index, 'indicator_id', 'card')
          }
          style={{ width: '240px' }}
        >
          {props.indicatorList &&
            props.indicatorList.length > 0 &&
            props.indicatorList.map((item) => (
              <Option value={item.indicator_id} key={item.indicator_id}>
                {item.indicator_name}
              </Option>
            ))}
        </Select>
      ),
    },
    {
      title: '指标显示名称',
      key: 'indicator_show_name',
      dataIndex: 'indicator_show_name',
      render: (text: any, record: any, index: number) => (
        <Input
          disabled={title == '报表详情' ? true : false}
          maxLength={15}
          defaultValue={text}
          onChange={(e) => inputChange(e, index, 'indicator_show_name', 'card')}
        />
      ),
    },
    {
      title: '指标说明',
      dataIndex: 'indicator_desc',
      key: 'indicator_desc',
      render: (text: any, record: any, index: number) => (
        <Input
          disabled={title == '报表详情' ? true : false}
          maxLength={40}
          defaultValue={text}
          onChange={(e) => inputChange(e, index, 'indicator_desc', 'card')}
        />
      ),
    },
    {
      title: '统计时间范围',
      dataIndex: 'time_dimension',
      key: 'time_dimension',
      render: (text: any, record: any, index: number) => (
        <Select
          defaultValue={text}
          disabled={title == '报表详情' ? true : false}
          onChange={(value) =>
            selectChange(value, index, 'time_dimension', 'card')
          }
          style={{ width: '100px' }}
        >
          {props.timeRangeList &&
            props.timeRangeList.length > 0 &&
            props.timeRangeList.map((item) => (
              <Option value={item.value}>{item.label}</Option>
            ))}
        </Select>
      ),
    },
    /* {
      title: '环比',
      dataIndex: 'sequential',
      key:'sequential',
      render :(text:any,record:any,index:number)=> (
        <Select options={sequentialList} 
          defaultValue={text} 
          style={{ width: '80px' }}
          disabled={title=='报表详情'?true:false}
          onChange={(value)=>
            selectChange(value,index,'sequential','card')}>
        </Select>)
    }, */
    {
      title: '展示类型',
      dataIndex: 'show_type',
      key: 'show_type',
      render: (text: any, record: any, index: number) => (
        <Select
          options={typeList}
          defaultValue={text}
          style={{ width: '80px' }}
          disabled={title == '报表详情' ? true : false}
          onChange={(value) => selectChange(value, index, 'show_type', 'card')}
        ></Select>
      ),
    },
    /* {
      title: '二级指标',
      dataIndex: 'indicator_level',
      key:'indicator_level',
      render :(text:any,record:any,index:number)=> (
        <Select
        defaultValue={text} 
        disabled={title=='报表详情'?true:false}
        onChange={(value)=>
          selectChange(value,index,'indicator_level','card')}
        style={{ width: '100px' }}
      >
        {props.secondIndicatorList &&
          props.secondIndicatorList.length > 0 &&
          props.secondIndicatorList.map((item) => (
            <Option value={item.value}>{item.label}</Option>
          ))}
      </Select>
      )
    }, */
    {
      title: '操作',
      dataIndex: 'option',
      render: (text: any, record: any, index: number) => {
        if (title == '报表详情') {
          return <span>-</span>;
        }
        return (
          <Space size="middle">
            <a onClick={() => changeData(text, record.card_id, index, 'card')}>
              删除
            </a>
            {index != 0 && (
              <a onClick={() => moveData(text, index, index - 1, 'card')}>
                上移
              </a>
            )}
            {index != props.reportInfo.card_ids.length - 1 && (
              <a onClick={() => moveData(text, index, index + 1, 'card')}>
                下移
              </a>
            )}
          </Space>
        );
      },
    },
  ];
  const trendColumns = [
    {
      title: '指标名称',
      dataIndex: 'indicator_id', //
      render: (text: any, record: any, index: number) => (
        <Select
          defaultValue={text}
          disabled={title == '报表详情' ? true : false}
          onChange={(value) =>
            selectChange(value, index, 'indicator_id', 'trend')
          }
          style={{ width: '160px' }}
        >
          {props.indicatorList &&
            props.indicatorList.length > 0 &&
            props.indicatorList.map((item) => (
              <Option value={item.indicator_id}>{item.indicator_name}</Option>
            ))}
        </Select>
      ),
    },
    {
      title: '指标显示名称',
      dataIndex: 'indicator_show_name',
      render: (text: any, record: any, index: number) => (
        <Input
          disabled={title == '报表详情' ? true : false}
          maxLength={15}
          defaultValue={text}
          onChange={(e) =>
            inputChange(e, index, 'indicator_show_name', 'trend')
          }
        />
      ),
    },
    {
      title: '指标说明',
      dataIndex: 'indicator_desc',
      render: (text: any, record: any, index: number) => (
        <Input
          disabled={title == '报表详情' ? true : false}
          maxLength={40}
          defaultValue={text}
          onChange={(e) => inputChange(e, index, 'indicator_desc', 'trend')}
        />
      ),
    },
    {
      title: '默认展示时间范围',
      dataIndex: 'time_scope',
      render: (text: any, record: any, index: number) => (
        <Select
          options={timeRangeList}
          style={{ width: '160px' }}
          defaultValue={text}
          disabled
          onChange={(value) =>
            selectChange(value, index, 'time_scope', 'trend')
          }
        ></Select>
      ),
    },
    {
      title: '展示类型',
      dataIndex: 'show_type',
      key: 'show_type',
      render: (text: any, record: any, index: number) => (
        <Select
          options={typeList}
          defaultValue={text}
          style={{ width: '80px' }}
          disabled={title == '报表详情' ? true : false}
          onChange={(value) => selectChange(value, index, 'show_type', 'trend')}
        ></Select>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text: any, record: any, index: number) => {
        if (title == '报表详情') {
          return <span>-</span>;
        }
        return (
          <Space size="middle">
            <a
              onClick={() => changeData(text, record.trend_id, index, 'trend')}
            >
              删除
            </a>
            {index != 0 && (
              <a onClick={() => moveData(text, index, index - 1, 'card')}>
                上移
              </a>
            )}
            {index != props.reportInfo.trend_ids.length - 1 && (
              <a onClick={() => moveData(text, index, index + 1, 'trend')}>
                下移
              </a>
            )}
          </Space>
        );
      },
    },
  ];
  const tableColumns = [
    {
      title: '指标名称',
      dataIndex: 'indicator_id', //
      render: (text: any, record: any, index: number) => (
        <Select
          defaultValue={text}
          disabled={title == '报表详情' ? true : false}
          onChange={(value) =>
            selectChange(value, index, 'indicator_id', 'table')
          }
          style={{ width: '150px' }}
        >
          {props.indicatorList &&
            props.indicatorList.length > 0 &&
            props.indicatorList.map((item) => (
              <Option value={item.indicator_id}>{item.indicator_name}</Option>
            ))}
        </Select>
      ),
    },
    {
      title: '指标显示名称',
      dataIndex: 'indicator_show_name',
      render: (text: any, record: any, index: number) => (
        <Input
          disabled={title == '报表详情' ? true : false}
          maxLength={15}
          defaultValue={text}
          onChange={(e) =>
            inputChange(e, index, 'indicator_show_name', 'table')
          }
        />
      ),
    },
    {
      title: '指标说明',
      dataIndex: 'indicator_desc',
      render: (text: any, record: any, index: number) => (
        <Input
          disabled={title == '报表详情' ? true : false}
          maxLength={40}
          defaultValue={text}
          onChange={(e) => inputChange(e, index, 'indicator_desc', 'table')}
        />
      ),
    },
    {
      title: '统计时间维度',
      dataIndex: 'time_dimension',
      render: (text: any, record: any, index: number) => (
        <Select
          options={sticTimeDimensionList}
          defaultValue={text}
          disabled
          style={{ width: '150px' }}
          onChange={(value) =>
            selectChange(value, index, 'time_dimension', 'table')
          }
        ></Select>
      ),
    },
    {
      title: '展示类型',
      dataIndex: 'show_type',
      key: 'show_type',
      render: (text: any, record: any, index: number) => (
        <Select
          options={typeList}
          defaultValue={text}
          style={{ width: '80px' }}
          disabled={title == '报表详情' ? true : false}
          onChange={(value) => selectChange(value, index, 'show_type', 'table')}
        ></Select>
      ),
    },
    {
      title: '是否支持导出',
      dataIndex: 'is_import',
      render: (text: any, record: any, index: number) => (
        <Select
          options={importList}
          defaultValue={text}
          style={{ width: '100px' }}
          disabled={title == '报表详情' ? true : false}
          onChange={(value) => selectChange(value, index, 'is_import', 'table')}
        ></Select>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text: any, record: any, index: number) => {
        if (title == '报表详情') {
          return <span>-</span>;
        }
        return (
          <Space size="middle">
            <a
              onClick={() => changeData(text, record.table_id, index, 'table')}
            >
              删除
            </a>
            {index != 0 && (
              <a onClick={() => moveData(text, index, index - 1, 'card')}>
                上移
              </a>
            )}
            {index != props.reportInfo.table_ids.length - 1 && (
              <a onClick={() => moveData(text, index, index + 1, 'table')}>
                下移
              </a>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card title={title} style={{ width: '100%' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form
            layout="inline"
            name="basic"
            labelAlign="right"
            form={formType}
            initialValues={initialValues}
          >
            <Form.Item
              name="platform_app"
              style={{ width: '40%', marginBottom: '20px' }}
              label="应用名称"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="platform_business"
              style={{ width: '40%', marginBottom: '20px' }}
              label="应用平台"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="platform_app_code"
              style={{ width: '40%', marginBottom: '20px' }}
              label="应用代码"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="application_dep_platform"
              style={{ width: '40%', marginBottom: '20px' }}
              label="应用部署平台"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="platform_app_version"
              style={{ width: '40%', marginBottom: '20px' }}
              label="应用版本"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="application_type"
              style={{ width: '40%', marginBottom: '20px' }}
              label="应用类型"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="report_name"
              style={{ width: '40%', marginBottom: '20px' }}
              label="报表名称"
            >
              <Input
                disabled={title === '报表创建' ? false : true}
                maxLength={30}
              />
            </Form.Item>
          </Form>
        </Space>
        {/* 卡片 */}
        <Card
          type="inner"
          title="卡片"
          extra={
            <div>
              <span>
                展示指定统计时间维度的 T-1 的统计值，一行最多将放置四个卡片
              </span>
              {title !== '报表详情' ? (
                <span onClick={() => addData1(1)}>
                  <PlusCircleOutlined
                    style={{
                      color: '#1890ff',
                      marginLeft: '10px',
                      cursor: 'pointer',
                    }}
                  />
                </span>
              ) : null}
              {/* {title!=='报表详情'?<span onClick={() => openCalIndic(1)}>运算指标<PlusCircleOutlined style={{color:'#1890ff',marginLeft:'10px',cursor:'pointer'}}/></span>:null} */}
            </div>
          }
        >
          <Table
            pagination={false}
            columns={cardColumns}
            dataSource={props.reportInfo.card_ids}
            rowKey={(record) => record.card_id}
          />
        </Card>

        {/* 趋势图 */}
        <Card
          type="inner"
          title="趋势图"
          extra={
            <div>
              <span>
                默认展示所选指标近 14 天的指标趋势图，多个指标在 tab 中切换
              </span>
              {title !== '报表详情' ? (
                <span onClick={() => addData1(2)}>
                  <PlusCircleOutlined
                    style={{
                      color: '#1890ff',
                      marginLeft: '10px',
                      cursor: 'pointer',
                    }}
                  />
                </span>
              ) : null}
            </div>
          }
        >
          <Table
            pagination={false}
            columns={trendColumns}
            dataSource={props.reportInfo.trend_ids}
            rowKey={(record) => record.trend_id}
          />
        </Card>

        {/* 表格 */}
        <Card
          type="inner"
          title="表格"
          extra={
            <div>
              <span>
                展示按天的指标明细值，仅能配置有按天维度的指标，如需配置其他展示维度，则所选维度需为所有指标的共有自定义属性
              </span>
              {title !== '报表详情' ? (
                <span onClick={() => addData1(3)}>
                  <PlusCircleOutlined
                    style={{
                      color: '#1890ff',
                      marginLeft: '10px',
                      cursor: 'pointer',
                    }}
                  />
                </span>
              ) : null}
            </div>
          }
        >
          <Table
            pagination={false}
            columns={tableColumns}
            dataSource={props.reportInfo.table_ids}
            rowKey={(record) => record.table_id}
          />
        </Card>
      </Card>
      {title !== '报表详情' && (
        <Card type="inner" title="预览确认">
          <Button type="primary" onClick={() => goCheck()}>
            检查配置
          </Button>
          {isCheck && (
            <div style={{ marginTop: '10px' }}>
              <CheckCircleOutlined style={{ color: 'green' }} /> 配置通过{' '}
              <span
                style={{ cursor: 'pointer', color: '#1809ff' }}
                onClick={goView}
              >
                去预览
              </span>
            </div>
          )}
          {isCheck == false && (
            <div style={{ marginTop: '10px' }}>
              <CloseCircleOutlined style={{ color: 'red' }} /> 配置有误，请检查
            </div>
          )}
          <div style={{ marginTop: '10px' }}>
            <Checkbox onChange={checkChange}>
              我已完成预览，确认配置无误
            </Checkbox>
          </div>
          <div style={{ marginTop: '10px', float: 'right' }}>
            <Button
              type="primary"
              style={{ marginRight: '10px' }}
              onClick={() => cancalCreate()}
            >
              取消
            </Button>
            <Button type="primary" onClick={() => createData()}>
              {title == '报表创建' ? '创建' : '编辑'}
            </Button>
          </div>
        </Card>
      )}
      {visible && <IndicatorCalc {...formProps} />}
    </>
  );
};
export default connect((state: { report: ModalState }) => {
  return state.report;
})(CreateReport);
