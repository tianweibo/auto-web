import React, { Component ,useState} from 'react';
import * as echarts from 'echarts';
import { Space, Button, Table ,Modal,message,Tooltip,Col,Row,Layout,Card} from 'antd';
const { Header, Content, Sider } = Layout;
import { InfoCircleOutlined,DownloadOutlined,CaretUpOutlined,CaretDownOutlined,MinusOutlined } from '@ant-design/icons';
import { history, Link, connect, Dispatch } from 'umi';

import styles from './style.less';
import {detailReport,detailApp,queryBasicData,getNumFromBigData} from './service';
class ReportView extends Component {
  state={
    card_list:[],
    table_list:[],
    time_list:[],
    listColumns:[],
    listData:[],
    report_info:{
      card_ids:[],
      reportInfo:{},
      table_ids:[],
      trend_ids:[]
    },
    timeRangeObj:{
    }, 
    viewId: 19
  }
  getTimeRangeList=async(id:string)=>{
    var res:any=await queryBasicData(id);
    var obj={}
    for(var i=0;i<res.data.length;i++){
      obj[res.data[i].value]=res.data[i].label;
    }
    this.setState({timeRangeObj:obj})
  }
  requireDate=(time:any)=>{
    //nowDate.setDate(nowDate.getDate() -1);
    var yy = time.getFullYear();
    var mm = time.getMonth() + 1>=10?time.getMonth() + 1: `0${time.getMonth() + 1}`;
    var dd = time.getDate()>=10 ?time.getDate(): `0${time.getDate()}`;;
    var endD = yy + "-" + mm + "-" + dd;
    return endD;
  }
  dealDate=(val:string,flag:any)=>{
    var bs=flag==1?2:1;    //需要计算环比
    var nowDate = new Date();
    var time1=this.requireDate(nowDate);
    var timeRange:any=[];
    timeRange.push(time1);
    switch(val){
      case 'yesterday':
        nowDate.setDate(nowDate.getDate() -1 * bs);
        var time2=this.requireDate(nowDate);
        timeRange.unshift(time2)
      break;
      case '7days_before':
        nowDate.setDate(nowDate.getDate() -7 * bs);
        var time2=this.requireDate(nowDate);
        timeRange.unshift(time2)
      break;
      case '14days_before':
        nowDate.setDate(nowDate.getDate() -14 * bs);
        var time2=this.requireDate(nowDate);
        timeRange.unshift(time2)
      break;
      case '30days_before':
        nowDate.setDate(nowDate.getDate() -30 * bs);
        var time2=this.requireDate(nowDate);
        timeRange.unshift(time2)
      break;
      default:
        nowDate.setDate(nowDate.getDate() -1 * bs);
        var time2=this.requireDate(nowDate);
        timeRange.unshift(time2)
      break;
    }
    return timeRange
  }
  requireBigData=(app:any,timeRange:any,act_id:any,event_code:any)=>{
    //供测试数据使用
    /* var app:any={
      application_dep_platform:null,
      platform_app_code:null,
      platform_business:null
    }
    var act_id=null;
    var event_code=null;
    var timeRange:any=['2021-07-01','2021-07-30']; */
    //供测试数据使用

    var filtersArr:any=[];
    var obj1={
      name: "APPLICATION_DEP_PLATFORM",
      type: "filter",
      value: [app.application_dep_platform],
      operator: "in",
      sqlType: "VARCHAR"
    }
    if(app.application_dep_platform){
      filtersArr.push(obj1)
    }
    var obj2={
      name: "PLATFORM_APP_CODE",
      type: "filter",
      value: [app.platform_app_code],
      operator: "in",
      sqlType: "VARCHAR"
    }
    if(app.platform_app_code){
      filtersArr.push(obj2)
    }
    var obj3={
      name: "PLATFORM_BUSINESS",
      type: "filter",
      value: [app.platform_business],
      operator: "in",
      sqlType: "VARCHAR"
    }
    if(app.platform_business){
      filtersArr.push(obj3)
    }
    if(timeRange){
      var obj4={
        type: "relation",
        value: "and",
        children: [
            {
              name: "DAY_ID",
              type: "filter",
              value: timeRange[0],
              operator: ">=",
              sqlType: "VARCHAR"
            },
            {
              name: "DAY_ID",
              type: "filter",
              value: timeRange[1],
              operator: "<=",
              sqlType: "VARCHAR"
            }
        ]
      }
      filtersArr.push(obj4);
    }
    var obj5={
      name: "ACT_ID",
      type: "filter",
      value: [act_id],
      operator: "in",
      sqlType: "VARCHAR"
    }
    if(act_id){
        filtersArr.push(obj5)
    }

    var events:any=[]
    if(event_code){
      events=event_code.split(',')
    }
    var obj6={
      name: "EVENT_CODE",
      type: "filter",
      value: events,
      operator: "in",
      sqlType: "VARCHAR"
    }
    if(event_code){
      filtersArr.push(obj6)
    }
    var obj={
      viewId: this.state.viewId, //26
      groups: [
        "APPLICATION_DEP_PLATFORM",  // app.application_dep_platform
        "PLATFORM_APP_CODE",         // app.platform_app_code
        "PLATFORM_BUSINESS",  //"MERCHANT_ID","URL",     app.platform_business
        "DAY_ID",     
        "ACT_ID",             //act_id     
        "EVENT_CODE"
      ],
      aggregators: [
        {
          column: "DISTINCT_ID",
          func: "count"
        },{
          column: "DISTINCT_ID",
          func: "COUNTDISTINCT"
        }
      ],
      filters: filtersArr,
      orders: [],
      pageNo: 0,
      pageSize: 100,
      nativeQuery: false,
      limit: null,
      cache: true,
      expired: 120,
      flush: false
    }
    return obj
  }
  getNewGoodsList=(params:any,num:any)=> {
    var temp:any = {};
    for (var i in params) {
      var key = params[i].DAY_ID; //判断依据
      if (temp[key]) {
        temp[key].DAY_ID = params[i].DAY_ID;
        temp[key][num] += params[i][num];//相加值
      } else {
        temp[key] = {};
        temp[key].DAY_ID = params[i].DAY_ID;
        temp[key][num] = params[i][num];
      }
    }
    var newArry = [];
    for (var k in temp) {
      newArry.push(temp[k]);
    }
    return newArry;
  }
  makeTimeList=(val:string)=>{
    //var days=29;  //供测试数据使用
    var days=1
    switch(val){
      case 'yesterday':
        days=2;
      break;
      case '7days_before':
        days=14
      break;
      case '14days_before':
        days=28
      break;
      case '30days_before':
        days=60
      break;
      default:
        days=2
      break;
    }
    var time_list=[];
    for(let i=0;i<=days;i++){
        var nowDate = new Date();
        nowDate.setDate(nowDate.getDate() -i);
        var yy = nowDate.getFullYear();
        var mm = nowDate.getMonth() + 1>=10?nowDate.getMonth() + 1: `0${nowDate.getMonth() + 1}`;
        var dd = nowDate.getDate()>=10 ?nowDate.getDate(): `0${nowDate.getDate()}`;;
        var endD = yy + "-" + mm + "-" + dd;
        time_list.unshift(endD)
    }
    var len=days/2
    var a=time_list.splice(0,len);
    a.push(time_list[0])
    var time_lists=[a,time_list]
    return time_lists
  }
  dealCardList=async(arr:any,app_info:any,act_id:any)=>{
    var dataArr=[];
    var arr1:any=['statis_time_range','data_type'];
    for(var i=0;i<arr.length;i++){
      var calcNum=0;
      if(arr[i].indicator_level!='no_show'){  //历史累计、平均、峰值是否需要展示
        let params=this.requireBigData(app_info.appInfo,null,act_id,arr[i].events)// 组织请求大数据接口的参数
        let res:any=await getNumFromBigData(params);
        let data=res?.data?.resultList;
        var BIGDATA=0;
        var thekey=arr[i].show_type==1?'count(DISTINCT_ID)':'COUNTDISTINCT(DISTINCT_ID)';
        if(data && data.length>0){
          switch(arr[i].indicator_level){
            case 'history_cumulative': //历史累计
              for(let j=0;j<data.length;j++){
                calcNum+=data[j][thekey];
              }
            break;
            case 'historical_average':      //历史平均
              let num=0;
              let len=1;
              len=data.length;
              let tempArr=[data[0].DAY_ID]
              for(let j=0;j<len;j++){
                num+=data[j][thekey];
                if(tempArr.indexOf(data[j].DAY_ID)<0){
                  tempArr.push(data[j].DAY_ID)
                }
              }
              len=tempArr.length;
              calcNum=Math.ceil(num/len);
            break;
            case 'historic_peak':   //历史峰值
              if(data.length>0){
                calcNum=data[0][thekey];
                let hisArr=this.getNewGoodsList(data,thekey);
                for(let z=0;z<hisArr.length;z++){
                  if(calcNum<data[z][thekey]){
                    calcNum=data[z][thekey]
                  }
                }
              }
            break;
            case 'no_show':        //不展示
              calcNum=0;
            break;
            default:break;
          }
        }
      }
      let time=this.dealDate(arr[i].time_dimension,arr[i].sequential);    //var b=arr[i].events.split(',')
      let params=this.requireBigData(app_info.appInfo,time,act_id,arr[i].events)// 组织请求大数据接口的参数
      let res:any=await getNumFromBigData(params);
      let data=res?.data?.resultList||[];
      var BIGDATA=0;
      var SEQUENTIAL='无变化';
      var ISGROWTH=0;
      var thekey=arr[i].show_type==1?'count(DISTINCT_ID)':'COUNTDISTINCT(DISTINCT_ID)';
      if(arr[i].sequential==1){
        //环比  =（本期数-上期数）/ 本期数  比如本期的时间范围是 9-20--9-15   那么下一期就是 9-15-9-10
        var riqis=this.makeTimeList(arr[i].time_dimension);   //数组1 是上期数   数组2是本期数
        var qianqi=0
        for(var j=0;j<data.length;j++){
          if(riqis[0].indexOf(data[j].DAY_ID)>-1){   //前期和
            qianqi+=data[j][thekey];
          }else if(riqis[1].indexOf(data[j].DAY_ID)>-1){ //本期和
            BIGDATA+=data[j][thekey];
          }
        }
        if(BIGDATA>qianqi){
          ISGROWTH=1;
          let aw=Math.floor((BIGDATA-qianqi) / BIGDATA *100).toFixed(2);
          SEQUENTIAL=`${aw}%`;
        }else if(qianqi>BIGDATA){
          let aw=Math.floor((qianqi-BIGDATA) / qianqi *100).toFixed(2);;
          SEQUENTIAL=`${aw}%`;
          ISGROWTH=-1;
        }else if(BIGDATA==qianqi){
          ISGROWTH=0;
          SEQUENTIAL='无变化'
        }
        
      }else{
        for(var j=0;j<data.length;j++){
          BIGDATA+=data[j][thekey];
        }
      }
      
      var objTemp={
        card_id: arr[i].card_id,
        events: arr[i].events,
        indicator_desc: arr[i].indicator_desc,
        indicator_id: arr[i].indicator_id,
        indicator_level: arr[i].indicator_level,
        indicator_level_label: arr[i].indicator_level_label,
        indicator_name: arr[i].indicator_name,
        indicator_show_name:arr[i].indicator_show_name,
        sequential: arr[i].sequential,
        time_dimension: arr[i].time_dimension,
        time_dimension_label: arr[i].time_dimension_label,
        BIGDATA:BIGDATA,
        CALCNUM:calcNum,
        ISGROWTH:ISGROWTH,
        SEQUENTIAL:SEQUENTIAL
      }
      dataArr.push(objTemp)
    }
    this.setState({card_list:dataArr});
  }
  requreNum=(days:number,level:number)=>{
    var days_arr=[];
    for(let i=0;i<=days;i++){
        days_arr.push(Math.ceil(Math.random()*1000)+1000*level)
    }
    return days_arr;
  }
  getTimeRange=(day:number)=>{  //请求大数据接口的时间 范围
    let nowDate = new Date();
    let time1=this.requireDate(nowDate);
    let timeRange:any=[];
    timeRange.push(time1);
    nowDate.setDate(nowDate.getDate() -day);
    let time2=this.requireDate(nowDate);
    timeRange.unshift(time2); 
    return timeRange;
  }
  dealTrend=async(arr:any,app_info:any,act_id:any)=>{
    var timeRange=this.getTimeRange(14)
    var nameArr=[];
    var optionArr=[];
    for(let i=0;i<arr.length;i++){  // 每个指标在这个时间范围的值，
      let params=this.requireBigData(app_info.appInfo,timeRange,act_id,arr[i].events)
      let res:any=await getNumFromBigData(params);
      let data=res?.data?.resultList||[];   //如果在时间范围内没有数据的话，当前日期大数据也没返回，所以能遍历 造数据
      var dataNum:any=[];
      var thekey=arr[i].show_type==1?'count(DISTINCT_ID)':'COUNTDISTINCT(DISTINCT_ID)'
      for(let j=0;j<this.state.time_list.length;j++){
        let BIGDATA=0;
        for(let z=0;z<data.length;z++){
          if(this.state.time_list[j]==data[z].DAY_ID){
            BIGDATA+=data[z][thekey];
          }
        }
        /* if(BIGDATA==0){ //供测试数据使用
          BIGDATA=Math.ceil(Math.random()*10)+10 
        } */
        dataNum.push(BIGDATA)
      }
      var obj={
        name: arr[i].indicator_show_name,
        type: 'line',
        //data: this.requreNum(14,i) 
        data:dataNum
      }
      optionArr.push(obj);
      nameArr.push(arr[i].indicator_show_name)
    }
    this.createshape(nameArr,optionArr)
  }
  dealTable=async(arr:any,app_info:any,act_id:any)=>{
    var timeRange=this.getTimeRange(14);
    
    var listColumns:any=[];
    var listData:any=[];
    /* {
      date:'',
      zhibiao1:0,
      zhibiao2:0,
      zhibiao3:0,
      zhibiao4:0
    } */
    for(let i=0;i<arr.length;i++){  // 每个指标在这个时间范围的值，
      //arr[i].time_dimension   默认是按天，取当前时间往后14天的数据   大数据返回的数据都是按天。。。。。
      let params=this.requireBigData(app_info.appInfo,timeRange,act_id,arr[i].events)
      let res:any=await getNumFromBigData(params);
      let data=res?.data?.resultList||[];   //如果在时间范围内没有数据的话，当前日期大数据也没返回，所以能遍历 造数据
      var list:any=[];
      var thekey=arr[i].show_type==1?'count(DISTINCT_ID)':'COUNTDISTINCT(DISTINCT_ID)'
      for(let j=0;j<this.state.time_list.length;j++){
        let BIGDATAPV=0;
        let BIGDATAUV=0;
        for(let z=0;z<data.length;z++){
          if(this.state.time_list[j]==data[z].DAY_ID){
            BIGDATAPV+=data[z][thekey];
          }
        }
        var obj={
          date:this.state.time_list[j],
          indicator_name:arr[i].indicator_name,
          indicator_show_name:arr[i].indicator_show_name,
          indicator_desc:arr[i].indicator_desc,
          is_import:arr[i].is_import,
          BIGDATAPV:BIGDATAPV,
          BIGDATAUV:BIGDATAUV
        }
        var objData={
          date:this.state.time_list[j],
          //num:BIGDATAPV
        }
        objData[arr[i].indicator_show_name]=BIGDATAPV;
      }
      listData.push(objData)
      var objColumns={
        title:arr[i].indicator_show_name,
        dataIndex:arr[i].table_id,
        key:arr[i].table_id
      }
      listColumns.push(objColumns)
    }
    listColumns.unshift(
      {
      title:'日期',
      dataIndex:'date',
      key:'date'}
    );
    this.setState({
      listColumns:listColumns,
      listData:listData
    })
  }
  createshape=(nameArr:any,optionArr:any)=>{
    var myChart = echarts.init(document.getElementById('forms'));
     // 绘制图表
     myChart.setOption({   
         title: {
             text: '指标对比趋势图',
             textStyle: {
              color: '#666',
              fontSize:'14px'
             },
         },
         tooltip: {},
         legend: {
             data:nameArr
         },
         xAxis: {
             data: this.state.time_list
         },
         yAxis: {},
         series: optionArr
     });
  }
  makeTimeRecent=(days:number)=>{
    //var days=29;  //供测试数据使用
    var time_list=[];
    for(let i=0;i<=days;i++){
        var nowDate = new Date();
        //var nowDate = new Date('2021-7-30'); //供测试数据使用
        nowDate.setDate(nowDate.getDate() -i);
        var yy = nowDate.getFullYear();
        var mm = nowDate.getMonth() + 1>=10?nowDate.getMonth() + 1: `0${nowDate.getMonth() + 1}`;
        var dd = nowDate.getDate()>=10 ?nowDate.getDate(): `0${nowDate.getDate()}`;;
        var endD = yy + "-" + mm + "-" + dd;
        time_list.unshift(endD)
    }
    this.setState({
        time_list
    })
  }
  base64=(s:any) =>{ 
    return window.btoa(unescape(encodeURIComponent(s)))
  }
  exportExcel=(showList:any)=> { // 前端导出excel
    let str=`<tr><td>指标名称</td><td>${showList[0].indicator_name}</td>`
    str+=`<tr><td>指标显示名称</td><td>${showList[0].indicator_show_name}</td>`
    //str+=`<tr><td>日期</td><td>${showList[0].show_type==1?'次数':'人数'}</td>`
    str+=`<tr><td>日期</td><td>数量(pv)</td><td>数量(uv)</td>`
    for (let i = 0; i < showList.length; i++) {
        str += '<tr>'
        str += `<td>${showList[i].date + '\t'}</td><td>${showList[i].BIGDATAPV + '\t'}</td>`
        str += `<td>${showList[i].BIGDATAUV + '\t'}</td>`
        str += '</tr>'
    }
    let worksheet = 'Sheet1'  
    let uri = 'data:application/vnd.ms-excel;base64,'  // 下载的表格模板数据  
    let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"   
    xmlns:x="urn:schemas-microsoft-com:office:excel"  
    xmlns="http://www.w3.org/TR/REC-html40">  
    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>    
    <x:Name>${worksheet}</x:Name>    
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>    
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->    
    </head><body><table>${str}</table></body></html>`  // 下载模板 
    window.location.href = uri + this.base64(template)
  }
  getDetailOfReport=async(report_id:any,app_id:any,act_id:any)=>{
    const res:any=await detailReport(report_id);
    const res1:any=await detailApp(app_id);
    this.setState({
      report_info:res.data
    })
    this.dealCardList(this.state.report_info.card_ids,res1.data,act_id); //卡片的数据获取及展示
    this.makeTimeRecent(14) // 制造最近14天的日期数据
    this.dealTrend(this.state.report_info.trend_ids,res1.data,act_id); //趋势图的数据获取及展示
    this.dealTable(this.state.report_info.table_ids,res1.data,act_id); //表格的数据获取及展示
  }
  getUrlKeyValue=(key:string)=> {
    var url = window.location.search;
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
    var r = url.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
  }
  componentDidMount() {
    var viewId=19;
    if(window.location.href.indexOf('buriedpoint') > -1){
      viewId=26
    }else{
      viewId = (window.location.href.indexOf('test') > -1 || window.location.href.indexOf('localhost') > -1) ? 26 : 19
    }
    this.setState({
      viewId:viewId
    })
    var tempData={
      report_id:this.getUrlKeyValue('report_id'),
      app_id:this.getUrlKeyValue('app_id'),
      act_id:this.getUrlKeyValue('act_id'),
    }
    this.getDetailOfReport(tempData.report_id,tempData.app_id,tempData.act_id);
  }
  render() {
    const {card_list ,table_list,time_list,listColumns,listData}=this.state;
    const cardList = (
        <div>
          {
            card_list.map((item:any) => {
                return<div className={styles.cardItem}>
                        <div className={styles.itemTitle} title={item.indicator_show_name}>{item.indicator_show_name}</div>
                        <div className={styles.itemNum}>{item.BIGDATA}</div>
                        <Tooltip placement="top" title={`(${item.time_dimension_label})${item.indicator_desc}`}>
                            <InfoCircleOutlined style={{position:'absolute',right:'30px',top:'20px',cursor:'pointer'}}/>
                        </Tooltip>
                        {item.sequential==1 && <div className={styles.itemHuan}>较上个周期:
                          {item.ISGROWTH==1 && <CaretUpOutlined style={{color:'green'}}/>}
                          {item.ISGROWTH==-1 && <CaretDownOutlined style={{color:'red'}}/>}
                          {item.ISGROWTH==0 && <MinusOutlined style={{color:'rgb(251,183,80)'}}/>}
                          <span style={{fontSize:'12px'}}>{item.SEQUENTIAL}</span>
                        </div>}
                        {item.indicator_level!='no_show'?<div className={styles.item2Box} >
                            <span>{item.indicator_level_label}：</span><span>{item.CALCNUM}</span>
                        </div>:null}
                    </div>
            })
          }
        </div>
    )
      const columns = [
        {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
        },
        /* {
          title: '指标名称',
          dataIndex: 'indicator_name',
          key: 'indicator_name',
        },
        {
          title: '指标展示名称',
          dataIndex: 'indicator_show_name',
          key: 'indicator_show_name',
        },
        {
            title: '指标描述',
          dataIndex: 'indicator_desc',
          key: 'indicator_desc',
        }, */
         {
          title: '数量(pv)',
          dataIndex: 'BIGDATAPV',
          key: 'BIGDATAPV',
        }, 
        {
          title: '数量(uv)',
          dataIndex: 'BIGDATAUV',
          key: 'BIGDATAUV',
        }
      ];
                        
     const tableList=(
        <div>
          {
            <Table dataSource={listData} pagination={false}  columns={listColumns} style={{width:'400px'}}/>
          }
        </div>
    ) 
    return (
       <Layout className={styles.layout}>
            <Header style={{padding: '0 30px',
                    backgroundColor: '#fff',
                    display: 'flex',
                    borderBottom: '1px solid #efefef',
                    boxShadow: '0 8px 24px -2px rgb(0 0 0 / 5%)',
                    height: '64px',}}>
                    <div>
                        <span style={{fontSize:'26px',fontWeight:700,marginRight:'30px'}}>{this.state.report_info?.reportInfo?.report_name}</span>
                        <span>报表更新时间：{this.state.report_info?.reportInfo?.update_time}</span>
                    </div>
            </Header>
            <div className={styles.thebody}>
                <Card title="数据概览" style={{ width: '100%' }}>
                    {card_list.length==0?'加载中。。。':cardList}
                </Card>
                <Card title="数据趋势" style={{ width: '100%' }}>
                    <div id="forms" style={{width:'1200px',height:'350px'}}></div>
                </Card>
                <Card title="数据明细" style={{ width: '100%' }}>
                    <div>
                        {listData.length==0?'加载中。。。':tableList}
                    </div>
                </Card>
            </div>
       </Layout>
    );
  }
}
export default ReportView
