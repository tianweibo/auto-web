import React, { useState, useEffect, Component } from 'react';
import {
  Card,
  Space,
  Modal,
  message,
  Divider,
  Button,
  Table,
  Menu,
  Dropdown
} from 'antd';
import {
  DownOutlined
} from '@ant-design/icons';
import DetailForm from './components/detailForm';
import SearchBar from './components/SearchBar/SearchBar';
import {basicData,getAttributeList} from './service';

class IndicatorList extends Component {
  //定义 state
  state = {
    attributeId: '',
    attributeList:[],
    isDrawer:false,
    drawerConf: {
      visible: false,
    },
    total:0,
    page:1,
    page_size: 10,
    searchObject:{
      keyword:'',
      pageNo:1,
      pageSize:10,
      attribute_label:'',
      data_type:'',
    }
  };
  
  createReport() {}
  
  resetSearch() {}
  requireAttributeList=async(params: {})=>{
    const res:any=await getAttributeList(params);
    if(res?.status==0){
      this.setState({
        attributeList:res.data.arr,
        total:res.data.count
      })
    }
  }
  handleSearch= (val: any) => {
    this.setState({
      page:1,
      page_size:10,
      searchObject:val
    });
    this.requireAttributeList(val)
  }
  
  handleEdit= async (data:any) => {
    this.setState({
      drawerConf: {
        visible: true,
        data:data,
        title: '编辑指标',
      },
    });
  };
  handleCancelEdit = async () => {
    this.setState({
      drawerConf: {
        visible: false,
      },
    });
  };
  

 
  handlePaginationChange = (page: number,pageSize:number) => {
    this.setState({
      page,
      page_size:pageSize
    });
    var obj={
      keyword:this.state.searchObject.keyword,
      pageNo:page,
      pageSize:pageSize,
      attribute_label:this.state.searchObject.attribute_label,
      data_type:this.state.searchObject.data_type,
    }
    this.requireAttributeList(obj);
  };
  
  seeData=(data:any)=>{
    this.setState({isDrawer:true,attributeId:data})
  }
  handleDrawerVisible=()=>{
    this.setState({isDrawer:false,attributeId:''})
  }
  componentDidMount() {
    var obj={
      keyword:'',
      pageNo:1,
      pageSize:10,
      attribute_label:"",
      data_type:""
    }
    this.requireAttributeList(obj);
    if(localStorage.getItem('attribute')){
      this.seeData(localStorage.getItem('attribute'))
      localStorage.removeItem('attribute')
    }
  }
  render() {
    const { drawerConf ,isDrawer,attributeId} = this.state;
    const columns: any = [
      {
        title: '属性',
        width: 200,
        dataIndex: 'attribute_name',
        fixed: 'left',
        render: (text:any,record:any,index:number) => {
          return (
           <a onClick={() => this.seeData(record.attribute_id)}>{text}</a>
         )}
      },
      {
        title: '属性代码',
        width: 200,
        dataIndex: 'attribute_code',
        key: 'attribute_code',
      },
      {
        title: '属性标签',
        dataIndex: 'attribute_label_label',
        key: 'attribute_label_label',
        width: 100,
      },
      {
        title: '数据类型',
        dataIndex: 'data_type_label',
        key: 'data_type_label',
        width: 120,
      },
      {
        title: '属性值含义来源',
        dataIndex: 'attribute_source',
        key: 'attribute_source',
        width: 120,
      }
    ];

    const tableProps = {
      rowKey: 'attribute_id',
      columns: columns,
      dataSource: this.state.attributeList,
      scroll: { x: 1500, y: 500 },
      pagination: {
        current: this.state.page,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: this.state.page_size,
        total:this.state.total,
        onChange: (page: number,pageSize:number) => this.handlePaginationChange(page,pageSize),
      },
    };

    const searchProps = {
      handleSearch: this.handleSearch,
      resetSearch: this.resetSearch,
    };
   
    return (
      <>
        <SearchBar {...searchProps} />
        <Card
          title="项目列表"
          style={{ marginTop: '20px' }}
        >
          <Table {...tableProps} />
          {this.state.isDrawer && <DetailForm attributeId={attributeId} handleDrawerVisible={this.handleDrawerVisible}/>} 
        </Card>
      </>
    );
  }
}

export default IndicatorList;
