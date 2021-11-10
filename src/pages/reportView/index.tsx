import React, { Component } from 'react';
import * as echarts from 'echarts';
import { Space, Button, Table ,Modal,message,Tooltip,Col,Row,Layout,Card} from 'antd';
const { Header, Content, Sider } = Layout;
import { InfoCircleOutlined,DownloadOutlined,CaretUpOutlined,CaretDownOutlined,MinusOutlined } from '@ant-design/icons';
import { history, Link, connect, Dispatch } from 'umi';
import { ColumnsType } from 'antd/es/table';
import { ModalState } from './model';
import styles from './style.less';
import { ModalState as ActivityModalState } from '@/pages/activity/model';
import { conditionalExpression } from '@babel/types';
class ReportView extends Component {
  state={
    card_list:[],
    table_list:[],
    time_list:[],
    report_info:{}
  }
  requreNum=(days:number,level:number)=>{
    var days_arr=[];
    for(let i=0;i<=days;i++){
        days_arr.push(Math.ceil(Math.random()*1000)+1000*level)
    }
    return days_arr;
  }
  componentDidMount() {
    var temp= JSON.parse(localStorage.getItem('report'));
    var days=7;
    var time_list=[];
    for(let i=0;i<=days;i++){
        var nowDate = new Date();
        nowDate.setDate(nowDate.getDate() -i);
        var yy = nowDate.getFullYear();
        var mm = nowDate.getMonth() + 1;
        var dd = nowDate.getDate();
        var endD = yy + "-" + mm + "-" + dd;
        time_list.unshift(endD)
    }
    this.setState({
        time_list
    })
    this.setState({card_list:temp.card_ids});
    this.setState({table_list:temp.table_ids});
    var nameArr=[];
    var optionArr=[];
    for(var i=0;i<temp.trend_ids.length;i++){
        var obj={
            name: temp.trend_ids[i].indicator_show_name,
            type: 'line',
            data: this.requreNum(days,i)
         }
         optionArr.push(obj);
         nameArr.push(obj)
    }
     var myChart = echarts.init(document.getElementById('forms'));
     // 绘制图表
     myChart.setOption({   
         title: {
             text: '指标对比趋势图'
         },
         tooltip: {},
         legend: {
             data:nameArr
         },
         xAxis: {
             data: time_list
         },
         yAxis: {},
         series: optionArr
     });
  }
  render() {
    const {card_list ,table_list,time_list}=this.state;
    var table_lists=[];
    var columns:any=[]
    for(var i=0;i<table_list.length;i++){
      if(table_list[i].is_import==1){
        var obj={
          title: table_list[i].indicator_show_name,
          dataIndex: table_list[i].indicator_show_name,
          key: table_list[i].indicator_show_name,
        }
        columns.push(obj)
      }
    }
    columns.unshift({title:'日期',dataIndex:'date',key:'date', width: 200,});
    for(let i=0;i<time_list.length;i++){
      var obj={
        date:time_list[i],
      }
      for(let j=0;j<table_list.length;j++){
        if(table_list[j].is_import==1){
          obj[table_list[j].indicator_show_name]=Math.ceil(Math.random()*100)+1000
        }
      }
      table_lists.push(obj);
    }
    const cardList = (
        <div>
          {
            card_list.map((item:any) => {
                return<div className={styles.cardItem}>
                        <div className={styles.itemTitle}>{item.indicator_show_name}</div>
                        <div className={styles.itemNum}>{Math.ceil(Math.random()*10000)+100000}</div>
                        <Tooltip placement="top" title={item.indicator_desc}>
                            <InfoCircleOutlined style={{position:'absolute',right:'30px',top:'20px',cursor:'pointer'}}/>
                        </Tooltip>
                        {item.sequential==1 && <div className={styles.itemHuan}>较上个周期:
                          {item.indicator_level=='history_cumulative' && <CaretUpOutlined style={{color:'green'}}/>}
                          {item.indicator_level=='historical_average' && <CaretDownOutlined style={{color:'red'}}/>}
                          {item.indicator_level=='historic_peak' && <MinusOutlined style={{color:'rgb(251,183,80)'}}/>}
                          {item.indicator_level==='historic_peak' &&<span style={{fontSize:'12px'}}>无变化</span>}
                          {item.indicator_level!=='historic_peak' &&<span style={{fontSize:'12px'}}>{(Math.random()*100).toFixed(2)}%</span>}
                        </div>}
                        {item.indicator_level!='no_show'?<div className={styles.item2Box} >
                            <span>{item.indicator_level_label}：</span><span>{Math.ceil(Math.random()*10000)+1000}</span>
                        </div>:null}
                    </div>
              
            })
          }
        </div>
    )           
     const tableList=(
        <div>
          <Table dataSource={table_lists} pagination={false}  columns={columns} style={{width:'400px'}}/>
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
                        我就是报表名称：报表更新时间：xxxxxxx
                    </div>
            </Header>
            <div className={styles.thebody}>
                <Card title="数据概览" style={{ width: '100%' }}>
                    {cardList}
                </Card>
                <Card title="数据趋势" style={{ width: '100%' }}>
                    <div id="forms" style={{width:'1000px',height:'350px'}}></div>
                </Card>
                <Card title="数据明细" style={{ width: '100%' }}>
                    <div>
                        {tableList}
                    </div>
                </Card>
            </div>
       </Layout>
    );
  }
}
export default connect(
  ({
    activity,
    report,
    loading,
  }: {
    activity: ActivityModalState;
    report: ModalState;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    activity,
    report,
    loading: loading.models.report,
  }),
)(ReportView);
