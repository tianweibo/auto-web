import React, { useEffect, useState } from 'react';
import { Drawer, Row, Col, Button, Table, Tabs, Descriptions } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { sourceFrom } from '../../../../common/enumData.js';
import { queryEvent, indicatorListByEventId } from '../../service';
const { TabPane } = Tabs;
const DeatilEvent = (props: any) => {
  const { handleDrawerVisible, eventId } = props;
  const [indicList, setIndicList] = useState([]);
  const [attrList, setAttrList] = useState([]);
  const [eventInfo, setEventInfo] = useState({});
  const onClose = () => {
    handleDrawerVisible(false);
  };
  const getEventDetail = async (id: string) => {
    var res: any = {};
    res = await queryEvent(id);
    if (res.status == 0) {
      setEventInfo(res.data.eventInfo);
      //setAttrList(res.data.attrInfo);
      getIndicatorList(id);
    }
  };
  const getIndicatorList = async (id: string) => {
    var res: any = {};
    res = await indicatorListByEventId(id);
    if (res.status == 0) {
      setIndicList(res.data.data);
    }
  };
  const changeTab = (e: any) => {};
  const seeData = async (val: any, url: string) => {
    localStorage.setItem(url, val);
    window.open(url);
  };
  useEffect(() => {
    getEventDetail(eventId);
  }, []);
  const columnsInfo: any = [
    {
      title: '事件名称',
      key: 'event_name',
    },
    {
      title: '事件代码',
      key: 'event_code',
    },
    {
      title: '触发类型',
      key: 'event_trigger_mode_label',
    },
    {
      title: '触发时机',
      key: 'trigger_time',
    },
    {
      title: '事件标签',
      key: 'event_label_label',
    },
    {
      title: '数据来源',
      key: 'open_type',
    },
    {
      title: '备注',
      key: 'note',
    },
    {
      title: '创建时间',
      key: 'create_time',
    },
    {
      title: '创建人',
      key: 'create_people',
    },
    {
      title: '最后更新时间',
      key: 'update_time',
    },
    {
      title: '最后更新人',
      key: 'update_people',
    },
  ];
  const columnsAttr: any = [
    {
      title: '属性名称',
      width: 200,
      dataIndex: 'attribute_name',
      key: 'attribute_name',
      fixed: 'left',
    },
    {
      title: '属性代码',
      width: 200,
      dataIndex: 'attribute_code',
      key: 'attribute_code',
    },
    {
      title: '数据类型',
      dataIndex: 'data_type_label',
      key: 'data_type_label',
      width: 100,
    },
    {
      title: '属性标签',
      dataIndex: 'attribute_label_label',
      key: 'attribute_label_label',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 120,
    },
    {
      title: '创建人',
      dataIndex: 'create_people',
      key: 'create_people',
      width: 120,
    },
    {
      title: '操作',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (row: any, record: any) => (
        <>
          <Button
            size="small"
            type="text"
            style={{ color: '#1890ff' }}
            onClick={() => seeData(record.attribute_id, 'attribute')}
          >
            查看
          </Button>
        </>
      ),
    },
  ];
  const columnsIndic: any = [
    {
      title: '指标名称',
      width: 200,
      dataIndex: 'indicator_name',
      key: 'indicator_name',
      fixed: 'left',
    },
    {
      title: '指标代码',
      width: 200,
      dataIndex: 'indicator_code',
      key: 'indicator_code',
    },
    {
      title: '指标类型',
      dataIndex: 'indicator_type_label',
      key: 'indicator_type_label',
      width: 100,
    },
    {
      title: '一级指标',
      dataIndex: 'indicator_level_label',
      key: 'indicator_level_label',
      width: 120,
    },
    {
      title: '指标标签',
      dataIndex: 'indicator_label_label',
      key: 'indicator_label_label',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 120,
    },
    {
      title: '创建人',
      dataIndex: 'create_people',
      key: 'create_people',
      width: 120,
    },
    {
      title: '操作',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (row: any, record: any) => (
        <>
          <Button
            size="small"
            type="text"
            style={{ color: '#1890ff' }}
            onClick={() => seeData(record.indicator_id, 'indicator')}
          >
            查看
          </Button>
        </>
      ),
    },
  ];
  return (
    <>
      <Drawer
        title="查看事件"
        width={1000}
        onClose={onClose}
        visible={true}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onClose}>取消</Button>
          </div>
        }
      >
        <Descriptions
          column={1}
          labelStyle={{ justifyContent: 'flex-end', minWidth: 160 }}
        >
          {columnsInfo.map((item: obj) => {
            if (item.key == 'open_type') {
              return (
                <Descriptions.Item key={item.key} label={item.title}>
                  {sourceFrom[eventInfo[item.key]]}
                </Descriptions.Item>
              );
            } else {
              return (
                <Descriptions.Item key={item.key} label={item.title}>
                  {eventInfo[item.key] ? eventInfo[item.key] : '--'}
                </Descriptions.Item>
              );
            }
          })}
        </Descriptions>
        {/*             <Row className='row-pos'>
                <Col span={12} className='col-title'>关联自定义属性</Col>
                <Col span={12}>
                
                </Col>
            </Row>
            <Table dataSource={attrList} columns={columnsAttr} /> */}
        <Row className="row-pos">
          <Col span={12} className="col-title">
            关联指标
          </Col>
          <Col span={12}></Col>
        </Row>
        <Table dataSource={indicList} columns={columnsIndic} />
      </Drawer>
    </>
  );
};

export default DeatilEvent;
