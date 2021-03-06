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
        message.success('ε€εΆζε');
    }
    const changeTab = (e: any) => {
    }
    useEffect(() => {
        getAppDetail(appId);
    }, []);
    const columnsInfo: any = [
        {
            title: 'εΊη¨εη§°',
            key: 'platform_app',
        },
        {
            title: 'εΊη¨δ»£η ',
            key: 'platform_app_code',
        },
        {
            title: 'εΊη¨ηζ¬',
            key: 'platform_app_version',
        },
        {
            title: 'εΊη¨ι¨η½²εΉ³ε°',
            key: 'application_dep_platform_label',
        },
        {
            title: 'εΊη¨εΉ³ε°',
            key: 'platform_business_label',
        },
        {
            title: 'εΊη¨η±»ε',
            key: 'application_type_label',
        },
        {
            title: 'εΊη¨ζ η­Ύ',
            key: 'application_label_label',
        },
        {
            title: 'ζ―ε¦δΊε¨εΊη¨',
            key: 'is_interactive',
        },
        {
            title: 'εε»ΊζΆι΄',
            key: 'create_time',
        },
        {
            title: 'εε»ΊδΊΊ',
            key: 'create_people',
        },
        {
            title: 'ζεζ΄ζ°ζΆι΄',
            key: 'update_time',
        },
        {
            title: 'ζεζ΄ζ°δΊΊ',
        }
    ];

    const columnsIndic: any = [
        {
            title: 'ζζ εη§°',
            key: 'indicator_name',
            dataIndex: 'indicator_name'
        },
        {
            title: 'ζζ δ»£η ',
            key: 'indicator_code',
            dataIndex: 'indicator_code'
        },
        {
            title: 'ζζ η±»ε',
            key: 'indicator_type_label',
            dataIndex: 'indicator_type_label'
        },
        {
            title: 'δΈηΊ§ζζ ',
            key: 'indicator_level_label',
            dataIndex: 'indicator_level_label'
        },
        {
            title: 'ζζ ζ η­Ύ',
            key: 'indicator_label_label',
            dataIndex: 'indicator_label_label'
        },
        {
            title: 'εε»ΊζΆι΄',
            key: 'create_time',
            dataIndex: 'create_time'
        },
        {
            title: 'εε»ΊδΊΊ',
            key: 'create_people',
            dataIndex: 'create_people'
        },
        {
            title: 'ζδ½',
            key: 'operation',
            width: 120,
            fixed: 'right',
            render: (row: any, record: any) => (
                <>
                    <Button size="small" type="text" style={{ color: '#1890ff' }} onClick={() => seeData(record.indicator_id, 'indicator')}>
                        ζ₯η
                    </Button>
                </>
            ),
        },
    ];
    const columnsEvent: any = [
        {
            title: 'δΊδ»Άεη§°',
            key: 'event_name',
            dataIndex: 'event_name'
        },
        {
            title: 'δΊδ»Άδ»£η ',
            key: 'event_code',
            dataIndex: 'event_code'
        },
        {
            title: 'θ§¦εη±»ε',
            key: 'event_trigger_mode_label',
            dataIndex: 'event_trigger_mode_label'
        },
        {
            title: 'θ§¦εζΆζΊ',
            key: 'trigger_time',
            dataIndex: 'trigger_time'
        },
        {
            title: 'δΊδ»Άζ η­Ύ',
            key: 'event_label_label',
            dataIndex: 'event_label_label'
        },
        {
            title: 'εε»ΊδΊΊ',
            key: 'create_people',
            dataIndex: 'create_people'
        },
        {
            title: 'εε»ΊζΆι΄',
            key: 'create_time',
            dataIndex: 'create_time'
        },
        {
            title: 'ζδ½',
            key: 'operation',
            width: 120,
            fixed: 'right',
            render: (row: any, record: any) => (
                <>
                    <Button size="small" type="text" style={{ color: '#1890ff' }} onClick={() => copyData(record)}>
                        <CopyOutlined />
                    </Button>
                    <Button size="small" type="text" style={{ color: '#1890ff' }} onClick={() => seeData(record.event_id, 'event')}>
                        ζ₯η
                    </Button>
                </>
            ),
        }
    ];
    return (<>
        <Drawer
            title='ζ₯ηεΊη¨'
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
                        εζΆ
                    </Button>
                </div>
            }>
            <Descriptions column={1} labelStyle={{ justifyContent: 'flex-end', minWidth: 160 }}>
                {columnsInfo.map((item: obj) => {
                    if (item.key == 'is_interactive') {
                        if (appInfo[item.key] == 1) {
                            return (
                                <Descriptions.Item key={item.key} label={item.title}>
                                    ζ―
                                </Descriptions.Item>
                            )
                        } else {
                            return (
                                <Descriptions.Item key={item.key} label={item.title}>
                                    ε¦
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
                <TabPane tab="η»θ?‘ζζ " key="1">
                    <Table dataSource={indicList} columns={columnsIndic} pagination={
                        { hideOnSinglePage: true }
                    } />
                </TabPane>
                <TabPane tab="ηΈε³δΊδ»Ά" key="2">
                    <Table dataSource={eventList} columns={columnsEvent} pagination={
                        { hideOnSinglePage: true }} />;
                </TabPane>
            </Tabs>
        </Drawer>
    </>)

};

export default DeatilApp;
