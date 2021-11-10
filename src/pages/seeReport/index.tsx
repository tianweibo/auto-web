import React, { Component, useState } from 'react';
import * as echarts from 'echarts';
import {
  ConfigProvider,
  Tooltip,
  Col,
  Row,
  Layout,
  Card,
  DatePicker,
  AutoComplete,
  message,
  Spin,
} from 'antd';
const { Header, Content, Sider } = Layout;
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {
  InfoCircleOutlined,
  DownloadOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { history, Link, connect, Dispatch } from 'umi';
const { RangePicker } = DatePicker;
var theLen = -1;
import styles from './style.less';
import {
  detailReport,
  detailApp,
  queryBasicData,
  getNumFromBigData,
} from './service';

class ReportView extends Component {
  state = {
    dates: [],
    loadingText: '上拉加载',
    tableObj: {
      table_trend_ids: [],
      table_dataArr: [],
      table_act_id: null,
      table_merchant_id: null,
      table_DateArr: [],
    },
    itemsWidth: '200px',
    requestFlag: true,
    update_time: null,
    hackValue: [],
    valueDate: [],
    card_list: [],
    table_list: [],
    table_list_export: [],
    listColumns_export: [],
    time_list: [],
    listColumns: [],
    report_info: {
      card_ids: [],
      reportInfo: {},
      table_ids: [],
      trend_ids: [],
    },
    timeRangeObj: {},
    viewId: 20,
  };
  requireDate = (time: any) => {
    //nowDate.setDate(nowDate.getDate() -1);
    var yy = time.getFullYear();
    var mm =
      time.getMonth() + 1 >= 10
        ? time.getMonth() + 1
        : `0${time.getMonth() + 1}`;
    var dd = time.getDate() >= 10 ? time.getDate() : `0${time.getDate()}`;
    var endD = yy + '-' + mm + '-' + dd;
    return endD;
  };
  disabledDate = (current) => {
    if (!this.state.dates || this.state.dates.length === 0) {
      return false;
    }
    const tooLate =
      this.state.dates[0] && current.diff(this.state.dates[0], 'days') > 60;
    const tooEarly =
      this.state.dates[1] && this.state.dates[1].diff(current, 'days') > 60;
    return tooEarly || tooLate;
  };
  setDates = (val) => {
    this.setState({
      dates: val,
    });
  };
  setValueDate = (val, val1) => {
    this.setState({
      valueDate: val,
    });
    this.setState({
      card_list: [],
      table_list: [],
      table_list_export: [],
      listColumns_export: [],
      time_list: [],
      listColumns: [],
      report_info: {
        card_ids: [],
        reportInfo: {},
        table_ids: [],
        trend_ids: [],
      },
      timeRangeObj: {},
    });
    this.setState({
      requestFlag: true,
      loadingText: '上拉加载',
    });
    if (val1 && val1.length == 2 && val1[0] && val1[1]) {
      this.initData(val1);
    } else {
      this.initData(null);
    }
  };
  onOpenChange = (open) => {
    if (open) {
      this.setState({
        dates: [],
        hackValue: [],
      });
    } else {
      this.setState({
        hackValue: undefined,
      });
    }
  };
  dealDate = (val: string, flag: any) => {
    var nowDate = new Date();
    var time1 = this.requireDate(nowDate);
    var timeRange: any = [];
    timeRange.push(time1);
    switch (val) {
      case 'yesterday':
        nowDate.setDate(nowDate.getDate() - 1);
        var time2 = this.requireDate(nowDate);
        timeRange.unshift(time2);
        break;
      case '7days_before':
        nowDate.setDate(nowDate.getDate() - 7);
        var time2 = this.requireDate(nowDate);
        timeRange.unshift(time2);
        break;
      case '14days_before':
        nowDate.setDate(nowDate.getDate() - 14);
        var time2 = this.requireDate(nowDate);
        timeRange.unshift(time2);
        break;
      case '30days_before':
        nowDate.setDate(nowDate.getDate() - 30);
        var time2 = this.requireDate(nowDate);
        timeRange.unshift(time2);
        break;
      default:
        nowDate.setDate(nowDate.getDate() - 1);
        var time2 = this.requireDate(nowDate);
        timeRange.unshift(time2);
        break;
    }
    return timeRange;
  };
  requireBigDataParams = (
    app: any,
    timeRange: any,
    act_id: any,
    merchant_id: any,
    event_code: any,
    type: any,
  ) => {
    var merchant_id = merchant_id;
    var act_id = act_id;
    var filtersArr: any = [
      {
        name: 'PLATFORM_APP_CODE',
        type: 'filter',
        value: [app.platform_app_code],
        operator: 'in',
        sqlType: 'VARCHAR',
      },
    ];
    var groups: any = ['PLATFORM_APP_CODE'];
    if (merchant_id) {
      filtersArr.push({
        name: 'MERCHANT_ID',
        type: 'filter',
        value: [merchant_id],
        operator: 'in',
        sqlType: 'VARCHAR',
      });
    }
    if (act_id) {
      filtersArr.push({
        name: 'ACT_ID',
        type: 'filter',
        value: [act_id],
        operator: 'in',
        sqlType: 'VARCHAR',
      });
    }
    var events: any = [];
    if (event_code) {
      events = event_code.split(',');
    }
    if (timeRange) {
      var objTime: any = {
        type: 'relation',
        value: 'and',
        children: [
          {
            name: 'day_id_day',
            type: 'filter',
            value: timeRange[0],
            operator: '>=',
            sqlType: 'CHAR',
          },
          {
            name: 'day_id_day',
            type: 'filter',
            value: timeRange[1],
            operator: '<=',
            sqlType: 'CHAR',
          },
        ],
      };
    }
    if (type == 'history_cumulative') {
      //groups.push('EVENT_CODE');
      filtersArr.push({
        name: 'EVENT_CODE',
        type: 'filter',
        value: events,
        operator: 'in',
        sqlType: 'VARCHAR',
      });
    }

    if (type == 'common') {
      //groups.push('EVENT_CODE');
      filtersArr.push({
        name: 'EVENT_CODE',
        type: 'filter',
        value: events,
        operator: 'in',
        sqlType: 'VARCHAR',
      });
      filtersArr.push(objTime);
    }
    if (type == 'tableTrend') {
      groups.push('day_id_day', 'EVENT_CODE');
      filtersArr.push(
        {
          name: 'EVENT_CODE',
          type: 'filter',
          value: events,
          operator: 'in',
          sqlType: 'VARCHAR',
        },
        objTime,
      );
    }
    var obj = {
      viewId: this.state.viewId,
      groups: groups,
      aggregators: [
        {
          column: 'DISTINCT_ID',
          func: 'count',
        },
        {
          column: 'DISTINCT_ID',
          func: 'COUNTDISTINCT',
        },
      ],
      filters: filtersArr,
      orders: [],
      pageNo: 0,
      pageSize: 0,
      nativeQuery: false,
      limit: null,
      cache: false,
      expired: 0,
      flush: false,
    };
    return obj;
    //卡片
    //历史累计   应用 事件  活动 商铺     groups 和 filtersArr都不传日期
    //['PLATFORM_APP_CODE','EVENT_CODE','ACT_ID','MERCHANT_ID']
    //['PLATFORM_APP_CODE','EVENT_CODE','ACT_ID','MERCHANT_ID']

    //天数
    //通过历史累计获取总数，天数= 应用  活动 商铺  day_id_day
    //['PLATFORM_APP_CODE','ACT_ID','MERCHANT_ID','day_id_day']
    //['PLATFORM_APP_CODE','EVENT_CODE','ACT_ID','MERCHANT_ID']
    //.length

    //历史峰值   比较大小既可
    //['PLATFORM_APP_CODE','ACT_ID','MERCHANT_ID','day_id_day']
    //['PLATFORM_APP_CODE','EVENT_CODE','ACT_ID','MERCHANT_ID']

    //通用     应用 事件  活动 商铺   groups 和 filtersArr需要传时间段
    //['PLATFORM_APP_CODE','ACT_ID','MERCHANT_ID','EVENT_CODE']
    //['PLATFORM_APP_CODE','EVENT_CODE','MERCHANT_ID','ACT_ID','day_id_day']

    //趋势图、表格
    //['PLATFORM_APP_CODE','ACT_ID','MERCHANT_ID','EVENT_CODE',"day_id_day"]
    //['PLATFORM_APP_CODE','EVENT_CODE','ACT_ID','MERCHANT_ID','day_id_day']
  };

  getNewGoodsList = (params: any, num: any) => {
    var temp: any = {};
    for (var i in params) {
      var key = params[i].day_id_day; //判断依据
      if (temp[key]) {
        temp[key].day_id_day = params[i].day_id_day;
        temp[key][num] += params[i][num]; //相加值
      } else {
        temp[key] = {};
        temp[key].day_id_day = params[i].day_id_day;
        temp[key][num] = params[i][num];
      }
    }
    var newArry = [];
    for (var k in temp) {
      newArry.push(temp[k]);
    }
    return newArry;
  };
  makeTimeListTS = (date: string, days: number) => {
    var time_list = [];
    for (let i = 0; i <= days; i++) {
      var nowDate = new Date(date);
      nowDate.setDate(nowDate.getDate() - i);
      var yy = nowDate.getFullYear();
      var mm =
        nowDate.getMonth() + 1 >= 10
          ? nowDate.getMonth() + 1
          : `0${nowDate.getMonth() + 1}`;
      var dd =
        nowDate.getDate() >= 10 ? nowDate.getDate() : `0${nowDate.getDate()}`;
      var endD = yy + '-' + mm + '-' + dd;
      time_list.unshift(endD);
    }
    var len = days / 2;
    var a = time_list.splice(0, len);
    a.push(time_list[0]);
    var time_lists = [a, time_list];
    return time_lists;
  };
  makeTimeList = (val: string) => {
    var days = 1;
    switch (val) {
      case 'yesterday':
        days = 2;
        break;
      case '7days_before':
        days = 14;
        break;
      case '14days_before':
        days = 28;
        break;
      case '30days_before':
        days = 60;
        break;
      default:
        days = 2;
        break;
    }
    var time_list = [];
    for (let i = 0; i <= days; i++) {
      var nowDate = new Date();
      nowDate.setDate(nowDate.getDate() - i);
      var yy = nowDate.getFullYear();
      var mm =
        nowDate.getMonth() + 1 >= 10
          ? nowDate.getMonth() + 1
          : `0${nowDate.getMonth() + 1}`;
      var dd =
        nowDate.getDate() >= 10 ? nowDate.getDate() : `0${nowDate.getDate()}`;
      var endD = yy + '-' + mm + '-' + dd;
      time_list.unshift(endD);
    }
    var len = days / 2;
    var a = time_list.splice(0, len);
    a.push(time_list[0]);
    var time_lists = [a, time_list];
    return time_lists;
  };
  getTimeRange = (day: number) => {
    //请求大数据接口的时间 范围
    let nowDate = new Date();
    let time1 = this.requireDate(nowDate);
    let timeRange: any = [];
    timeRange.push(time1);
    nowDate.setDate(nowDate.getDate() - day);
    let time2 = this.requireDate(nowDate);
    timeRange.unshift(time2);
    return timeRange;
  };
  getDaysBetween(dateString1: any, dateString2: any) {
    //两个日期之间的间隔
    var startDate = Date.parse(dateString1);
    var endDate = Date.parse(dateString2);
    var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
    return days;
  }
  getNextDate(date: any, day: any) {
    //day 传-1表始前一天，传1表始后一天
    var dd = new Date(date);
    dd.setDate(dd.getDate() + day);
    var y = dd.getFullYear();
    var m =
      dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;
    var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
    return y + '-' + m + '-' + d;
  }
  dealCardList = async (
    arr: any,
    app_info: any,
    act_id: any,
    merchant_id: any,
    DateArr: Array,
  ) => {
    var dataArr = [];
    for (var i = 0; i < arr.length; i++) {
      var calcNum = 0;
      if (arr[i].indicator_level != 'no_show') {
        //历史累计
        let params = this.requireBigDataParams(
          app_info.appInfo,
          null,
          act_id,
          merchant_id,
          arr[i].events,
          'history_cumulative',
        ); // 组织请求大数据接口的参数
        let res: any = await getNumFromBigData(params);
        let data = res?.data?.resultList;
        var BIGDATA = 0;
        var thekey =
          arr[i].show_type == 1
            ? 'count(DISTINCT_ID)'
            : 'COUNTDISTINCT(DISTINCT_ID)';
        if (data && data.length > 0) {
          calcNum = data[0][thekey];
        }
      }
      var timeNow = [];
      var timePast = [];
      if (DateArr) {
        // 2020-01-11 2020-01-22
        timePast = [];
        timeNow = JSON.parse(JSON.stringify(DateArr));
        var numSpace = this.getDaysBetween(DateArr[0], DateArr[1]);
        let start = this.getNextDate(DateArr[0], -numSpace);
        timePast.push(start, DateArr[0]);
      } else {
        timeNow = this.dealDate(arr[i].time_dimension, arr[i].sequential);
        var numSpace = this.getDaysBetween(timeNow[0], timeNow[1]);
        let start = this.getNextDate(timeNow[0], -numSpace);
        timePast.push(start, timeNow[0]);
      }
      var paramsNow = this.requireBigDataParams(
        app_info.appInfo,
        timeNow,
        act_id,
        merchant_id,
        arr[i].events,
        'common',
      );
      let resNow: any = await getNumFromBigData(paramsNow);
      let dataNow = resNow?.data?.resultList || [];
      if (dataNow.length == 0) {
        BIGDATA = 0;
      } else {
        var thekey =
          arr[i].show_type == 1
            ? 'count(DISTINCT_ID)'
            : 'COUNTDISTINCT(DISTINCT_ID)';
        BIGDATA = dataNow[0][thekey];
      }

      var objTemp = {
        card_id: arr[i].card_id,
        events: arr[i].events,
        indicator_desc: arr[i].indicator_desc,
        indicator_id: arr[i].indicator_id,
        indicator_level: arr[i].indicator_level,
        //indicator_level_label: arr[i].indicator_level_label,
        indicator_name: arr[i].indicator_name,
        indicator_show_name: arr[i].indicator_show_name,
        sequential: arr[i].sequential,
        time_dimension: arr[i].time_dimension,
        time_dimension_label: arr[i].time_dimension_label,
        BIGDATA: BIGDATA,
        CALCNUM: calcNum,
        //ISGROWTH: ISGROWTH,
        //SEQUENTIAL: SEQUENTIAL,
      };
      dataArr.push(objTemp);
    }
    this.setState({ card_list: dataArr });
  };

  dealTrend = async (
    arr: any,
    app_info: any,
    act_id: any,
    merchant_id: any,
    DateArr: Array,
  ) => {
    if (DateArr) {
      var timeRange = DateArr;
    } else {
      var timeRange = this.getTimeRange(14);
    }
    var nameArr = [];
    var optionArr = [];
    for (let i = 0; i < arr.length; i++) {
      // 每个指标在这个时间范围的值，
      let params = this.requireBigDataParams(
        app_info.appInfo,
        timeRange,
        act_id,
        merchant_id,
        arr[i].events,
        'tableTrend',
      );
      let res: any = await getNumFromBigData(params);
      let data = res?.data?.resultList || []; //如果在时间范围内没有数据的话，当前日期大数据也没返回，所以能遍历 造数据
      var dataNum: any = [];
      var thekey =
        arr[i].show_type == 1
          ? 'count(DISTINCT_ID)'
          : 'COUNTDISTINCT(DISTINCT_ID)';
      for (let j = 0; j < this.state.time_list.length; j++) {
        let BIGDATA = 0;
        for (let z = 0; z < data.length; z++) {
          if (this.state.time_list[j] == data[z].day_id_day) {
            BIGDATA += data[z][thekey];
          }
        }
        /* if(BIGDATA==0){ //供测试数据使用
          BIGDATA=Math.ceil(Math.random()*10)+10 
        } */
        dataNum.push(BIGDATA);
      }
      var obj = {
        name: arr[i].indicator_show_name,
        type: 'line',
        data: dataNum,
      };
      optionArr.push(obj);
      nameArr.push(arr[i].indicator_show_name);
    }
    this.createshape(nameArr, optionArr);
  };
  dealTable = async (
    arr: any,
    app_info: any,
    act_id: any,
    merchant_id: any,
    DateArr: Array,
  ) => {
    this.setState({
      loadingText: `loading`,
    });
    if (DateArr) {
      var timeRange = DateArr;
    } else {
      var timeRange = this.getTimeRange(14);
    }
    var lists = [];
    var listColumns: any = [];
    var listColumns_export: any = [];
    var list_export: any = [];
    for (let i = 0; i < arr.length; i++) {
      // 每个指标在这个时间范围的值，
      //arr[i].time_dimension   默认是按天，取当前时间往后14天的数据   大数据返回的数据都是按天。。。。。
      let params = this.requireBigDataParams(
        app_info.appInfo,
        timeRange,
        act_id,
        merchant_id,
        arr[i].events,
        'tableTrend',
      );
      let res: any = await getNumFromBigData(params);
      let data = res?.data?.resultList || []; //如果在时间范围内没有数据的话，当前日期大数据也没返回，所以能遍历 造数据
      var list: any = [];

      if (arr[i].is_import == 1) {
        listColumns_export.push(arr[i].indicator_show_name);
      }
      listColumns.push(arr[i].indicator_show_name);
      var thekey =
        arr[i].show_type == 1
          ? 'count(DISTINCT_ID)'
          : 'COUNTDISTINCT(DISTINCT_ID)';
      var dateArr = this.state.time_list.concat().reverse();
      for (let j = 0; j < dateArr.length; j++) {
        let BIGDATATABLE = 0;
        for (let z = 0; z < data.length; z++) {
          if (dateArr[j] == data[z].day_id_day) {
            BIGDATATABLE += data[z][thekey];
          }
        }
        var obj = {
          date: dateArr[j],
          indicator_name: arr[i].indicator_name,
          indicator_show_name: arr[i].indicator_show_name,
          indicator_desc: arr[i].indicator_desc,
          is_import: arr[i].is_import,
          BIGDATATABLE: BIGDATATABLE,
        };
        list.push(obj);
      }
      if (arr[i].is_import == 1) {
        list_export.push(list);
      }
      lists.push(list);
    }
    listColumns.unshift('日期');
    //计算宽度
    listColumns_export.unshift('日期');
    let itemsWidth = 220 * listColumns.length;
    this.setState({
      itemsWidth: `${itemsWidth}px`,
      table_list: lists,
      listColumns: listColumns,
      listColumns_export: listColumns_export,
      table_list_export: list_export,
    });
  };
  createshape = (nameArr: any, optionArr: any) => {
    var myChart = echarts.init(document.getElementById('forms'));
    // 绘制图表
    myChart.setOption({
      title: {
        text: '指标对比趋势图',
        textStyle: {
          color: '#666',
          fontSize: '14px',
        },
      },
      tooltip: {},
      legend: {
        data: nameArr,
      },
      xAxis: {
        data: this.state.time_list,
      },
      yAxis: {},
      series: optionArr,
    });
  };

  base64 = (s: any) => {
    return window.btoa(unescape(encodeURIComponent(s)));
  };
  exportExcel = () => {
    // 前端导出excel
    const { table_list_export, time_list, listColumns_export } = this.state;
    const timeArr = time_list.concat().reverse();
    var str = '<tr>';
    for (let i = 0; i < listColumns_export.length; i++) {
      str += `<td>${listColumns_export[i]}</td>`;
    }
    str += '\t</tr>';
    for (let j = 0; j < timeArr.length; j++) {
      str += `<tr><td>${timeArr[j]}</td>`;
      for (let z = 0; z < table_list_export.length; z++) {
        for (let w = 0; w < table_list_export[z].length; w++) {
          if (timeArr[j] == table_list_export[z][w].date) {
            str += `<td>${table_list_export[z][w].BIGDATATABLE + '\t'}</td>`;
          }
        }
      }
      str += '</tr>';
    }
    let worksheet = 'Sheet1';
    let uri = 'data:application/vnd.ms-excel;base64,'; // 下载的表格模板数据
    let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"   
    xmlns:x="urn:schemas-microsoft-com:office:excel"  
    xmlns="http://www.w3.org/TR/REC-html40">  
    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>    
    <x:Name>${worksheet}</x:Name>    
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>    
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->    
    </head><body><table>${str}</table></body></html>`; // 下载模板
    window.location.href = uri + this.base64(template);
  };
  getDetailOfReport = async (
    report_id: any,
    app_id: any,
    act_id: any,
    merchant_id: any,
    DateArr: Array,
  ) => {
    const res: any = await detailReport(report_id);
    if (res.status == 1) {
      message.warning(`${res.msg}`);
      return;
    }
    const res1: any = await detailApp(app_id, 1);
    if (res1.status == 1) {
      message.warning(`${res1.msg}`);
      return;
    }
    this.setState({
      report_info: res.data,
    });
    this.dealCardList(
      this.state.report_info.card_ids,
      res1.data,
      act_id,
      merchant_id,
      DateArr,
    ); //卡片的数据获取及展示
    if (DateArr) {
      this.getDateInfo(DateArr[0], DateArr[1]);
    } else {
      this.makeTimeRecent(14); // 制造最近14天的日期数据
    }
    this.dealTrend(
      this.state.report_info.trend_ids,
      res1.data,
      act_id,
      merchant_id,
      DateArr,
    ); //趋势图的数据获取及展示
    var tableObj = {
      table_trend_ids: this.state.report_info.trend_ids,
      table_dataArr: res1.data,
      table_act_id: act_id,
      table_merchant_id: merchant_id,
      table_DateArr: DateArr,
    };
    this.setState({
      tableObj: tableObj,
    });
    /* this.dealTable(
      this.state.report_info.table_ids,
      res1.data,
      act_id,
      merchant_id,
      DateArr,
    ); //表格的数据获取及展示 */
  };
  getDateInfo(starDay: any, endDay: any) {
    var arr = [];
    var time_list = [];

    // 设置两个日期UTC时间
    var db = new Date(starDay);
    var de = new Date(endDay);

    // 获取两个日期GTM时间
    var s = db.getTime() - 24 * 60 * 60 * 1000;
    var d = de.getTime() - 24 * 60 * 60 * 1000;

    // 获取到两个日期之间的每一天的毫秒数
    for (var i = s; i <= d; ) {
      i = i + 24 * 60 * 60 * 1000;
      arr.push(parseInt(i));
    }

    // 获取每一天的时间  YY-MM-DD
    for (var j in arr) {
      var time = new Date(arr[j]);
      var year = time.getFullYear(time);
      var mouth =
        time.getMonth() + 1 >= 10
          ? time.getMonth() + 1
          : '0' + (time.getMonth() + 1);
      var day = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate();
      var YYMMDD = year + '-' + mouth + '-' + day;
      time_list.push(YYMMDD);
    }
    this.setState({
      time_list,
    });
  }
  makeTimeRecent = (days: number) => {
    var time_list = [];
    for (let i = 0; i <= days; i++) {
      var nowDate = new Date();
      nowDate.setDate(nowDate.getDate() - i);
      var yy = nowDate.getFullYear();
      var mm =
        nowDate.getMonth() + 1 >= 10
          ? nowDate.getMonth() + 1
          : `0${nowDate.getMonth() + 1}`;
      var dd =
        nowDate.getDate() >= 10 ? nowDate.getDate() : `0${nowDate.getDate()}`;
      var endD = yy + '-' + mm + '-' + dd;
      time_list.unshift(endD);
    }
    this.setState({
      time_list,
    });
  };
  getUrlKeyValue = (key: string) => {
    var url = window.location.search;
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
    var r = url.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
  };
  initData(DateArr: Array) {
    var viewId = 20;
    if (window.location.href.indexOf('buriedpoint') > -1) {
      viewId = 27;
    } else {
      viewId =
        window.location.href.indexOf('test') > -1 ||
        window.location.href.indexOf('localhost') > -1
          ? 27
          : 20;
    }
    this.setState({
      viewId: viewId,
    });
    var tempData = {
      report_id: this.getUrlKeyValue('report_id'),
      app_id: this.getUrlKeyValue('app_id'),
      act_id: this.getUrlKeyValue('act_id'),
      merchant_id: this.getUrlKeyValue('merchant_id'),
    };
    this.getDetailOfReport(
      tempData.report_id,
      tempData.app_id,
      tempData.act_id,
      tempData.merchant_id,
      DateArr,
    );
  }
  randmColor() {
    theLen++;
    if (theLen > 3) {
      theLen = 0;
    }
    var colorArr = [
      'linear-gradient(180deg, #3FBFFF 0%, #418DFF 100%)',
      'linear-gradient(180deg, #07CCE9 0%, #0490AE 100%)',
      'linear-gradient(180deg, #6699FB 0%, #6664FE 100%)',
      'linear-gradient(180deg, #00A0FA 0%, #027AF5 100%)',
    ];
    return colorArr[theLen];
  }
  handleSize() {
    var scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    //alert(scrollTop)
    if (scrollTop >= 5 && this.state.requestFlag) {
      console.log('请求中');
      this.setState({
        requestFlag: false,
      });
      this.dealTable(
        this.state.tableObj.table_trend_ids,
        this.state.tableObj.table_dataArr,
        this.state.tableObj.table_act_id,
        this.state.tableObj.table_merchant_id,
        this.state.tableObj.table_DateArr,
      ); //表格的数据获取及展示
    }
  }
  componentWillUnmount() {
    // 移除监听事件
    window.removeEventListener('scroll', this.handleSize);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleSize.bind(this));
    let date = new Date();
    let year = date.getFullYear();
    var mm =
      date.getMonth() + 1 >= 10
        ? date.getMonth() + 1
        : `0${date.getMonth() + 1}`;
    var dd = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let minute =
      date.getMinutes() - 2 < 10
        ? '0' + (date.getMinutes() - 2)
        : date.getMinutes() - 2;
    let time2 = `${year}-${mm}-${dd} ${hour}:${minute}`;
    this.setState({
      update_time: time2,
    });
    this.initData(null);
  }
  render() {
    const {
      card_list,
      table_list,
      time_list,
      listColumns,
      itemsWidth,
      loadingText,
    } = this.state;
    const dateReverse = time_list.concat().reverse();
    const len = card_list.length;
    const laodingSpan = (
      <div className={styles.load}>
        {loadingText}
        <Spin style={{ marginLeft: '10px' }} />
      </div>
    );
    const laodingz = (
      <div className={styles.load}>
        loading
        <Spin style={{ marginLeft: '10px' }} />
      </div>
    );
    const cardList = (
      <div>
        {card_list.map((item: any) => {
          let itemBac = this.randmColor();
          return (
            <div
              className={styles.cardItem}
              style={{ background: `${itemBac}` }}
            >
              <div
                className={styles.itemTitle}
                title={item.indicator_show_name}
              >
                {item.indicator_show_name}
              </div>
              <div className={styles.itemNum}>{item.BIGDATA}</div>
              <Tooltip
                placement="top"
                title={`(${item.time_dimension_label})${item.indicator_desc}`}
              >
                <InfoCircleOutlined
                  style={{
                    position: 'absolute',
                    right: '30px',
                    top: '20px',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                />
              </Tooltip>
              {item.indicator_level != 'no_show' ? (
                <div className={styles.item2Box}>
                  <span>历史累计：</span>
                  <span>{item.CALCNUM}</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );

    const tableList = (
      <div className={styles.contentTab}>
        {
          <div style={{ height: '40px', width: itemsWidth }}>
            {listColumns.map((item1, key) => {
              return (
                <div className={styles.tableTitle} title={item1}>
                  {item1}
                </div>
              );
            })}
          </div>
        }
        <div style={{ clear: 'both', width: itemsWidth }}>
          {
            <div style={{ float: 'left', marginBottom: '20px' }}>
              {dateReverse.map((item1, key) => {
                return <div className={styles.tableItem}>{item1}</div>;
              })}
            </div>
          }
          {table_list.map((item, index) => {
            return (
              <div style={{ float: 'left', marginBottom: '20px' }}>
                <div>
                  {item.map((item1: any) => {
                    return (
                      <div className={styles.tableItem}>
                        {item1.BIGDATATABLE}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
    return (
      <ConfigProvider locale={zh_CN}>
        <Layout className={styles.layout}>
          <Header
            style={{
              background: '#f0f2f5',
              display: 'flex',
              height: '70px',
              lineHeight: '70px',
            }}
          >
            <div style={{ width: '100%' }}>
              <span
                style={{
                  fontSize: '26px',
                  fontWeight: 700,
                  marginRight: '30px',
                }}
              >
                {this.state.report_info?.reportInfo?.report_name}
              </span>
              {/* <span style={{ marginRight: '50px' }}>
                报表创建时间：{this.state.report_info?.reportInfo?.create_time}
              </span> */}
              <span>
                时间筛选：
                <RangePicker
                  value={this.state.hackValue || this.state.valueDate}
                  disabledDate={this.disabledDate}
                  onCalendarChange={(val) => this.setDates(val)}
                  onChange={(val, val1) => this.setValueDate(val, val1)}
                  onOpenChange={this.onOpenChange}
                />
              </span>
              <span style={{ marginRight: '50px', float: 'right' }}>
                数据更新时间:{this.state.update_time}
              </span>
            </div>
          </Header>
          <div className={styles.thebody}>
            <Card
              title="数据概览"
              style={{
                width: '100%',
                marginBottom: '20px',
                borderRadius: '8px',
              }}
            >
              {card_list.length == 0 ? laodingz : cardList}
            </Card>
            <Card
              title="数据趋势"
              style={{
                width: '100%',
                marginBottom: '20px',
                borderRadius: '8px',
              }}
            >
              <div id="forms" style={{ height: '350px' }}></div>
            </Card>
            <Card
              title="数据明细"
              style={{
                width: '100%',
                marginBottom: '20px',
                borderRadius: '8px',
              }}
              extra={
                <span
                  style={{ cursor: 'pointer', color: '#1890FF' }}
                  onClick={() => this.exportExcel()}
                >
                  数据导出
                  <DownloadOutlined />
                </span>
              }
            >
              {table_list.length == 0 ? laodingSpan : tableList}
            </Card>
          </div>
        </Layout>
      </ConfigProvider>
    );
  }
}
export default ReportView;