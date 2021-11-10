import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Button,
  Table,
  Tabs,
  Descriptions,
  Row,
  Col,
} from 'antd';
import { sourceFrom } from '../../../../common/enumData.js';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { detailIndicator } from '../../service';
import './style.less';
const { TabPane } = Tabs;
const DeatilApp = (props: any) => {
  const { handleDrawerVisible, indicatorId } = props;
  const [indicList, setIndicList] = useState([]);
  const [appList, setAppList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [indicatorInfo, setIndicatorInfo] = useState({});
  const onClose = () => {
    handleDrawerVisible(false);
  };
  const getIndicatorDetail = async (id: string) => {
    var res: any = {};
    res = await detailIndicator(id);
    if (res?.status == 0) {
      setIndicatorInfo(res.data.indicatorInfo);
      setEventList(res.data.eventInfo);
      setAppList(res.data.appInfo);
    }
  };
  const changeTab = (e: any) => {};
  const seeData = async (val: any, url: string) => {
    localStorage.setItem(url, val);
    window.open(url);
  };
  useEffect(() => {
    getIndicatorDetail(indicatorId);
  }, []);
  const columnsInfo: any = [
    {
      title: '指标名称',
      key: 'indicator_name',
    },
    {
      title: '指标代码',
      key: 'indicator_code',
    },
    {
      title: '指标类型',
      key: 'indicator_type_label',
    },
    {
      title: '一级指标',
      key: 'indicator_level_label',
    },
    {
      title: '指标标签',
      key: 'indicator_label_label',
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
      title: '数据来源',
      key: 'open_type',
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
  const columnsApp: any = [
    {
      title: '应用名称',
      width: 200,
      dataIndex: 'platform_app',
      key: 'platform_app',
      fixed: 'left',
    },
    {
      title: '应用代码',
      width: 200,
      dataIndex: 'platform_app_code',
      key: 'platform_app_code',
    },
    {
      title: '互动应用',
      width: 200,
      key: 'is_interactive',
      dataIndex: 'is_interactive',
      render: (text: string) => {
        if (text == '1') {
          return '是';
        } else {
          return '否';
        }
      },
    },
    {
      title: '应用标签',
      dataIndex: 'application_label_label',
      key: 'application_label_label',
      width: 100,
    },
    {
      title: '应用版本',
      dataIndex: 'platform_app_version',
      key: 'platform_app_version',
      width: 120,
    },
    {
      title: '应用类型',
      dataIndex: 'application_type_label',
      key: 'application_type_label',
      width: 120,
    },
    {
      title: '应用平台',
      dataIndex: 'platform_business_label',
      key: 'platform_business_label',
      width: 120,
    },
    {
      title: '应用部署平台',
      dataIndex: 'application_dep_platform_label',
      key: 'application_dep_platform_label',
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
            onClick={() => seeData(record.application_id, 'app')}
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
        title="查看指标"
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
                  {sourceFrom[indicatorInfo[item.key]]}
                </Descriptions.Item>
              );
            } else {
              return (
                <Descriptions.Item key={item.key} label={item.title}>
                  {indicatorInfo[item.key] ? indicatorInfo[item.key] : '--'}
                </Descriptions.Item>
              );
            }
          })}
        </Descriptions>
        {/*             <Row className='row-pos'>
                <Col span={12} className='col-title'>计算公式</Col>
            </Row> */}
        <Row className="row-pos">
          <Col span={3}>事件名称:</Col>
          <Col span={21}>
            {eventList.map((item: obj) => {
              return <span>{item.event_name},</span>;
            })}
          </Col>
        </Row>
        {/*  <Row className='row-pos'>
                <Col span={3}>事件关系:</Col>
                <Col span={2} >{indicatorInfo.relationship_event==1?'且':'或'}</Col>
            </Row> */}

        <Row className="row-pos">
          <Col span={12} className="col-title">
            关联应用
          </Col>
        </Row>
        <Table dataSource={appList} columns={columnsApp} />
      </Drawer>
    </>
  );
};

export default DeatilApp;
