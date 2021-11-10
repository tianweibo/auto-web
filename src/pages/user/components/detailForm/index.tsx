import React, { useEffect, useState } from 'react';
import { Drawer, Form, Button, Table, Tabs, Descriptions, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import moment from 'moment';
import { detailApp, getIndicListByid, detailByEvent } from '../../service';
const { TabPane } = Tabs;
import copy from 'copy-to-clipboard';
import { history } from 'umi';
const DeatilApp = (props: any) => {
    const { handleDrawerVisible, appId } = props;
    const [indicList, setIndicList] = useState([])
    const [eventList, setEventList] = useState([])
    const [appInfo, setAppinfo] = useState({})
    const onClose = () => {
        handleDrawerVisible(false)
    };
    const getAppDetail = async (id: string) => {
        var res: any = {};
        if (res?.status == 0) {
            res = await detailApp(id);
            setAppinfo(res.data.appInfo);
            getIndicList(res.data.indicatorIds);
            getEventList(res.data.indicatorIds)
        }
    }
    const getIndicList = async (arr: any) => {
        var res: any = {};
        let obj = {
            id: arr
        }
        res = await getIndicListByid(obj);
        if (res?.status == 0) {
            setIndicList(res.data)
        }
    }
    const getEventList = async (arr: any) => {
        var res: any = {};
        let obj = {
            id: arr
        }
        res = await detailByEvent(obj);
        if (res?.status == 0) {
            setEventList(res.data)
        }
    }
    const seeData = async (val: any, url: string) => {
        localStorage.setItem(url, val);
        window.open(url)
    }
    const copyData = async (val: any) => {
        var obj = {
            event_name: val.event_name,
            event_code: val.event_code,
            event_label: val.event_label,
            event_trigger_mode: val.event_trigger_mode,
            url: ''
        }
        var obj1 = JSON.stringify(obj)
        copy(obj1);
        message.success('复制成功');
    }
    const changeTab = (e: any) => {
    }
    useEffect(() => {
        getAppDetail(appId);
    }, []);
    const columnsInfo: any = [
        {
            title: '应用名称',
            key: 'platform_app',
        },
        {
            title: '应用代码',
            key: 'platform_app_code',
        },
        {
            title: '应用版本',
            key: 'platform_app_version',
        },
        {
            title: '应用部署平台',
            key: 'application_dep_platform_label',
        },
        {
            title: '应用平台',
            key: 'platform_business_label',
        },
        {
            title: '应用类型',
            key: 'application_type_label',
        },
        {
            title: '应用标签',
            key: 'application_label_label',
        },
        {
            title: '是否互动应用',
            key: 'is_interactive',
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
        }
    ];

    const columnsIndic: any = [
        {
            title: '指标名称',
            key: 'indicator_name',
            dataIndex: 'indicator_name'
        },
        {
            title: '指标代码',
            key: 'indicator_code',
            dataIndex: 'indicator_code'
        },
        {
            title: '指标类型',
            key: 'indicator_type_label',
            dataIndex: 'indicator_type_label'
        },
        {
            title: '一级指标',
            key: 'indicator_level_label',
            dataIndex: 'indicator_level_label'
        },
        {
            title: '指标标签',
            key: 'indicator_label_label',
            dataIndex: 'indicator_label_label'
        },
        {
            title: '创建时间',
            key: 'create_time',
            dataIndex: 'create_time'
        },
        {
            title: '创建人',
            key: 'create_people',
            dataIndex: 'create_people'
        },
        {
            title: '操作',
            key: 'operation',
            width: 120,
            fixed: 'right',
            render: (row: any, record: any) => (
                <>
                    <Button size="small" type="text" style={{ color: '#1890ff' }} onClick={() => seeData(record.indicator_id, 'indicator')}>
                        查看
                    </Button>
                </>
            ),
        },
    ];
    const columnsEvent: any = [
        {
            title: '事件名称',
            key: 'event_name',
            dataIndex: 'event_name'
        },
        {
            title: '事件代码',
            key: 'event_code',
            dataIndex: 'event_code'
        },
        {
            title: '触发类型',
            key: 'event_trigger_mode_label',
            dataIndex: 'event_trigger_mode_label'
        },
        {
            title: '触发时机',
            key: 'trigger_time',
            dataIndex: 'trigger_time'
        },
        {
            title: '事件标签',
            key: 'event_label_label',
            dataIndex: 'event_label_label'
        },
        {
            title: '创建人',
            key: 'create_people',
            dataIndex: 'create_people'
        },
        {
            title: '创建时间',
            key: 'create_time',
            dataIndex: 'create_time'
        },
        {
            title: '操作',
            key: 'operation',
            width: 120,
            fixed: 'right',
            render: (row: any, record: any) => (
                <>
                    <Button size="small" type="text" style={{ color: '#1890ff' }} onClick={() => copyData(record)}>
                        <CopyOutlined />
                    </Button>
                    <Button size="small" type="text" style={{ color: '#1890ff' }} onClick={() => seeData(record.event_id, 'event')}>
                        查看
                    </Button>
                </>
            ),
        }
    ];
    return (<>
        <Drawer
            title='查看应用'
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
                    <Button onClick={onClose}>
                        取消
                    </Button>
                </div>
            }>
            <Descriptions column={1} labelStyle={{ justifyContent: 'flex-end', minWidth: 160 }}>
                {columnsInfo.map((item: obj) => {
                    if (item.key == 'is_interactive') {
                        if (appInfo[item.key] == 1) {
                            return (
                                <Descriptions.Item key={item.key} label={item.title}>
                                    是
                                </Descriptions.Item>
                            )
                        } else {
                            return (
                                <Descriptions.Item key={item.key} label={item.title}>
                                    否
                                </Descriptions.Item>
                            )
                        }
                    } else {
                        return (
                            <Descriptions.Item key={item.key} label={item.title}>
                                {appInfo[item.key] ? appInfo[item.key] : '--'}
                            </Descriptions.Item>
                        );
                    }

                })}
            </Descriptions>
            <Tabs defaultActiveKey="1" onChange={changeTab}>
                <TabPane tab="统计指标" key="1">
                    <Table dataSource={indicList} columns={columnsIndic} pagination={
                        { hideOnSinglePage: true }
                    } />
                </TabPane>
                <TabPane tab="相关事件" key="2">
                    <Table dataSource={eventList} columns={columnsEvent} pagination={
                        { hideOnSinglePage: true }} />;
                </TabPane>
            </Tabs>
        </Drawer>
    </>)

};

export default DeatilApp;
