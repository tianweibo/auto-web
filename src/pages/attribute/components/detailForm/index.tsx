import React, { useEffect, useState } from 'react';
import { Drawer, Form, Button,Table, Tabs, Descriptions, Col, Row,Input} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { detailAttribute,eventListOfAttr } from '../../service';
const { Search } = Input;
import './style.less';
const DeatilAttribute = (props: any) => {
    const { handleDrawerVisible, attributeId } = props;
    const [attributeInfo, setAttributeInfo] = useState({})  
    const [eventList, setEventList] = useState([])  
    const [page, setPage] = useState(1)
    const [enumList, setEnumList] = useState([])  
    const [total, setTotal] = useState(0)   
    const [keyword, setKeyword] = useState('') 
    const onClose = () => {
        handleDrawerVisible(false)
    };
    const getAttributeDetail = async (id: string) => {
        var res: any = {};
        var obj={
            id:[id]
        }
        res = await detailAttribute(obj);
        if(res.status==0){
            if(res.data[0].enum_data){
                setEnumList(JSON.parse(res.data[0].enum_data))
            }
            setAttributeInfo(res.data[0]);
        }
    }
    const seeData = async (val: any,url:string) => {
        localStorage.setItem(url,val);
        window.open(url)
      }
    const handleSubmit = (e: any) => {
        setKeyword(e)
        var obj={
            keyword:e,
            pageNo:1,
            pageSize:1000,
            id:attributeId
        }
        requireEventList(obj);
    };
    useEffect(() => {
        getAttributeDetail(attributeId);
        var obj={
            keyword:'',
            pageNo:page,
            pageSize:1000,
            id:attributeId
          }
          requireEventList(obj);
    }, []);
    const columnsInfo: any = [
        {
            title: '属性名称',
            key: 'attribute_name',
        },
        {
            title: '属性代码',
            key: 'attribute_code',
        },
        {
            title: '数据类型',
            key: 'data_type_label',
        },
        {
            title: '属性值含义来源',
            key: 'attribute_source',
        },
        {
            title: '属性标签',
            key: 'attribute_label_label',
        },
        {
            title: '单位/格式说明',
            key: 'desc',
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
        }
        /* {
            title: '最后更新时间',
            key: 'update_time',
        },
        {
            title: '最后更新人',
            key: 'update_people',
        } */
    ];
    const columnsEnum:any=[
        {
            title: '值',
            key: 'value',
            dataIndex: 'value'
        },
        {
            title: '含义',
            key: 'label',
            dataIndex: 'label'
        },
    ]
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
            width: 100,
            dataIndex: 'event_trigger_mode_label'
        },
        {
            title: '触发时机',
            key: 'trigger_time',
            width: 200,
            dataIndex: 'trigger_time'
        },
        {
            title: '事件标签',
            key: 'event_label_label',
            width: 200,
            dataIndex: 'attribute_name'
        },
        {
            title: '创建时间',
            key: 'create_time',
            dataIndex: 'create_time',
        },
        {
            title: '创建人',
            key: 'create_people',
            width: 80,
            dataIndex: 'create_people'
        },
        {
            title: '操作',
            key: 'operation',
            width: 120,
            fixed: 'right',
            render: (row: any,record:any) => (
              <>
                <Button size="small" type="text" style={{color:'#1890ff'}} onClick={()=>seeData(record.event_id,'event')}>
                    查看
                </Button>
              </>
            ),
          }
        
    ];
    const requireEventList=async(params: {})=>{
        const res:any=await eventListOfAttr(params);
        if(res.status==0){
            setEventList(res.data.arr)
            setTotal(res.data.count)
        } 
    }
    const handlePaginationChange = (page: number) => {
        setPage(page);
        var obj={
          keyword:setKeyword,
          pageNo:page,
          pageSize:5,
          id:attributeId
        }
        requireEventList(obj);
    };
   
    const tableProps = {
        rowKey: 'event_id',
        columns: columnsEvent,
        dataSource: eventList,
        scroll: { x: 1500, y: 200 },
        pagination: {
            hideOnSinglePage:true
          /* current: page,
          pageSize: 1000,
          total:total,
          onChange: (page: number) => handlePaginationChange(page) */,
        },
      };
      const tableEnum = {
        rowKey: 'enum_id',
        columns: columnsEnum,
        dataSource: enumList,
        scroll: { x: 1500, y: 200 },
        pagination:{
            hideOnSinglePage:true
        }
      };
    return (<>
        <Drawer
            title='查看属性'
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
                    if(item.key=='is_interactive'){
                        if(attributeInfo[item.key]==1){
                           return(
                            <Descriptions.Item key={item.key} label={item.title}>
                            是
                            </Descriptions.Item>
                           ) 
                        }else{
                            return(
                                <Descriptions.Item key={item.key} label={item.title}>
                                    否
                                </Descriptions.Item>
                            )
                        }
                    }else{
                        return (
                            <Descriptions.Item key={item.key} label={item.title}>
                              {attributeInfo[item.key] ? attributeInfo[item.key]:'--'} 
                            </Descriptions.Item>
                        );
                    }
                    
                })}
            </Descriptions>
            {
                attributeInfo.attribute_source!='上报值本身' && <Row className='row-pos'>
                <Col span={12} className='col-title'>字典详情</Col>
                <Col span={12}>
                
                </Col>
            </Row>
            }
            {
                attributeInfo.attribute_source!='上报值本身' && <Table {...tableEnum} />
            }
            <Row className='row-pos'>
                <Col span={12} className='col-title'>关联事件详情</Col>
                <Col span={12}>
                    <Search enterButton
                     placeholder="事件/事件代码" onSearch={handleSubmit}/>
                </Col>
            </Row>
            <Table {...tableProps} />
        </Drawer>
    </>)

};

export default DeatilAttribute;
