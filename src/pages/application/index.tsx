import React, { useState, useEffect, Component } from 'react';
import { sourceFrom } from '../../common/enumData.js';
import {
  Card,
  Space,
  Modal,
  message,
  Divider,
  Button,
  Table,
  Menu,
  Col,
  Dropdown,
  Tooltip,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import EditForm from './components/EditForm/EditForm';
import { wrapAuth } from '../../components/wrapAuth/index.jsx';
import DetailForm from './components/detailForm';
import SearchBar from './components/SearchBar/SearchBar';
import OmegaLogger from 'buried-points-sdk-all';
import {
  basicData,
  deleteApp,
  getAppList,
  usefulApp,
  indicatorNumOfApp,
  downloadData,
} from './service';
import { history } from 'umi';
import copy from 'copy-to-clipboard';
import { conversionMomentValue } from '_@ant-design_pro-utils@1.24.7@@ant-design/pro-utils';
const AuthButton = wrapAuth(Button);
const AuthMenuItem = wrapAuth(Menu.Item);
class AppList extends Component {
  //定义 state
  state = {
    appId: '',
    appList: [],
    isDrawer: false,
    drawerConf: {
      visible: false,
    },
    total: 0,
    page: 1,
    page_size: 10,
    searchObject: {
      keyword: '',
      pageNo: 1,
      pageSize: 10,
      application_label: '',
      platform_business: '',
      product_line_id: null,
      is_interactive: '1',
    },
  };

  createReport() {}

  resetSearch() {}
  getBasicData = async (id: string) => {
    const res = await basicData(id);
  };
  requireAppList = async (params: {}) => {
    const res: any = await getAppList(params);
    if (res?.status == 0) {
      this.setState({
        appList: res.data.arr,
        total: res.data.count,
      });
    }
  };
  handleSearch = (val: any) => {
    this.setState({
      page: 1,
      page_size: 10,
      searchObject: val,
    });
    this.requireAppList(val);
  };
  handleCreate = async () => {
    this.setState({
      drawerConf: {
        visible: true,
        title: '创建应用',
      },
    });
  };
  copyApp = (data: any) => {
    this.setState({
      drawerConf: {
        visible: true,
        data: data,
        title: '复制应用',
      },
    });
  };
  handleEdit = async (data: any) => {
    this.setState({
      drawerConf: {
        visible: true,
        data: data,
        title: '编辑应用',
      },
    });
  };
  exportData = async (data: any) => {
    var res: any = await downloadData(data.application_id, true);
    location.href = res.data;
  };
  linkData = async (data: any) => {
    var theUrl = `/seeCode?app_id=${data.application_id}`;
    window.open(theUrl);
  };
  handleCancelEdit = async () => {
    this.setState({
      drawerConf: {
        visible: false,
      },
    });
  };
  deleteData(id: string) {
    Modal.confirm({
      title: `确认删除吗？删除之后不可恢复`,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDelete(id),
    });
  }
  stopApp = async (id: string) => {
    var res: any = {};
    res = await usefulApp(id);
    if (res?.status === 0) {
      this.setState({
        page: 1,
        page_size: 10,
      });
      var obj = {
        keyword: '',
        pageNo: 1,
        pageSize: 10,
        application_label: '',
        platform_business: '',
        product_line_id: null,
        is_interactive: '1',
      };
      this.requireAppList(obj);
      message.success(res.msg || '停用成功');
    }
  };
  handleDelete = async (id: string) => {
    var res: any = {};
    res = await deleteApp(id);
    if (res?.status === 0) {
      this.setState({
        page: 1,
        page_size: 10,
      });
      var obj = {
        keyword: '',
        pageNo: 1,
        pageSize: 10,
        application_label: '',
        platform_business: '',
        product_line_id: null,
        is_interactive: '1',
      };
      this.requireAppList(obj);
      message.success(res.msg || '删除成功');
    }
  };
  handlePaginationChange = (page: number, pageSize: number) => {
    this.setState({
      page,
      page_size: pageSize,
    });
    var obj = {
      keyword: this.state.searchObject.keyword,
      pageNo: page,
      pageSize: pageSize,
      application_label: this.state.searchObject.application_label,
      platform_business: this.state.searchObject.platform_business,
      product_line_id: this.state.searchObject.product_line_id,
      is_interactive: this.state.searchObject.is_interactive,
    };
    this.requireAppList(obj);
  };
  createList = () => {
    this.setState({
      page: 1,
      page_size: 10,
    });
    var obj = {
      keyword: '',
      pageNo: 1,
      pageSize: 10,
      application_label: '',
      platform_business: '',
      product_line_id: null,
      is_interactive: '1',
    };
    this.requireAppList(obj);
  };
  editList = () => {
    var obj = {
      keyword: this.state.searchObject.keyword,
      pageNo: this.state.page,
      pageSize: this.state.page_size,
      application_label: this.state.searchObject.application_label,
      platform_business: this.state.searchObject.platform_business,
      product_line_id: this.state.searchObject.product_line_id,
      is_interactive: this.state.searchObject.is_interactive,
    };
    this.requireAppList(obj);
  };
  gotoCreate = async (id: any) => {
    var res = await indicatorNumOfApp(id);
    if (res.data > 0) {
      history.push({
        pathname: '/report/create',
        query: {
          application_id: id,
          type: 'create',
        },
      });
    } else {
      message.warning('该应用下没有指标，不支持报表的创建');
    }
  };
  clickMenu = (e: any, data: any) => {
    switch (e.key) {
      case 'fzyy':
        this.copyApp(data);
        break;
      case 'tyyy':
        this.stopApp(data.application_id);
        break;
      case 'scyy':
        this.deleteData(data.application_id);
        break;
      case 'cjbb':
        //应用下是否有指标
        this.gotoCreate(data.application_id);
        break;
      case 'sjfz':
        //应用下是否有指标
        this.copyData(data);
      default:
        break;
    }
  };
  copyData = async (val: any) => {
    let flag = val.is_interactive == 1 ? true : false;
    var obj = `{
        is_prod: false,      // 数据埋入测试环境还是正式环境
        runtime_env:'',      //  参见埋点api
        merchant_id:'未知',   //  店铺ID 也就是店铺号 无法获取就写未知
        distinct_id:'未知',   //  用户ID
        act_id:'未知',        //  活动ID 也就是活动号
        member_id:'未知',     //  会员ID
        platform_app: "${val.platform_app}", 
        platform_app_code: "${val.platform_app_code}",
        platform_app_version:"${val.platform_app_version}",
        application_dep_platform:"${val.application_dep_platform}",
        platform_business:"${val.platform_business}",
        application_label:"${val.application_label}",
        is_interactive:${flag}
        nick:'未知',
        mix_nick:'未知',
        act_name:'未知',
        open_id:'未知',
        phone:'未知',
        ouid:'未知',
        provider:'未知',
        open_type:1,          //  1正常数据也就是对接新埋点平台，2互动营销类的，3其他
      }`;
    copy(obj);
    message.success('复制成功');
  };
  seeData = (data: any) => {
    this.setState({ isDrawer: true, appId: data });
  };
  handleDrawerVisible = () => {
    this.setState({ isDrawer: false, appId: '' });
  };
  componentDidMount() {
    OmegaLogger.fed({
      event_name: '应用页面-埋点',
      event_code: 'yingyong_maidian',
      event_label: 'all_general',
      event_trigger_mode: 'open',
      url: '/app',
    });
    var obj = {
      keyword: '',
      pageNo: 1,
      pageSize: 10,
      application_label: '',
      platform_business: '',
      product_line_id: null,
      is_interactive: '1',
    };
    this.requireAppList(obj);
    if (localStorage.getItem('app')) {
      this.seeData(localStorage.getItem('app'));
      localStorage.removeItem('app');
    }
  }
  menuItem = (record: any) => {
    return (
      <Menu onClick={(params) => this.clickMenu(params, record)}>
        <Menu.Item key="fzyy">复制应用</Menu.Item>
        <AuthMenuItem productLine={record.product_line_id} key="scyy">
          删除应用
        </AuthMenuItem>
        <Menu.Item key="cjbb">创建报表</Menu.Item>
        <Menu.Item key="sjfz">数据复制</Menu.Item>
      </Menu>
    );
  };
  render() {
    const { drawerConf, isDrawer, appId } = this.state;
    const columns: any = [
      {
        title: '应用名称',
        width: 200,
        dataIndex: 'platform_app',
        fixed: 'left',
        ellipsis: {
          showTitle: false,
        },
        render: (text: any, record: any, index: number) => {
          return (
            <Tooltip placement="topLeft" title={record.platform_app}>
              <a onClick={() => this.seeData(record.application_id)}>{text}</a>
            </Tooltip>
          );
        },
      },
      {
        title: '应用代码',
        width: 200,
        dataIndex: 'platform_app_code',
        key: 'platform_app_code',
        ellipsis: {
          showTitle: false,
        },
        render: (platform_app_code) => (
          <Tooltip placement="topLeft" title={platform_app_code}>
            {platform_app_code}
          </Tooltip>
        ),
      },
      {
        title: '互动应用',
        width: 100,
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
        width: 160,
        ellipsis: {
          showTitle: false,
        },
        render: (application_label_label) => (
          <Tooltip placement="topLeft" title={application_label_label}>
            {application_label_label}
          </Tooltip>
        ),
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
        width: 180,
      },
      {
        title: '创建日期',
        dataIndex: 'create_time',
        key: 'create_time',
        width: 200,
      },
      {
        title: '创建人',
        dataIndex: 'create_people',
        key: 'create_people',
        width: 100,
      },
      {
        title: '数据来源',
        dataIndex: 'open_type',
        key: 'open_type',
        width: 160,
        render: (text: any, record: any, index: number) => (
          <>{sourceFrom[record.open_type]}</>
        ),
      },
      {
        title: '所属产品线',
        key: 'product_line_name',
        dataIndex: 'product_line_name',
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        render: (product_line_name) => (
          <Tooltip placement="topLeft" title={product_line_name}>
            {product_line_name}
          </Tooltip>
        ),
      },
      {
        title: '操作',
        key: 'operation',
        width: 300,
        fixed: 'right',
        render: (row: any, record: any) => (
          <>
            <Space>
              <AuthButton
                productLine={record.product_line_id}
                size="small"
                type="text"
                style={{ color: '#1890ff' }}
                onClick={() => this.handleEdit(record)}
              >
                编辑
              </AuthButton>
              <AuthButton
                productLine={record.product_line_id}
                size="small"
                type="text"
                style={{ color: '#1890ff' }}
                onClick={() => this.exportData(record)}
              >
                代码-Doc
              </AuthButton>
              <AuthButton
                productLine={record.product_line_id}
                size="small"
                type="text"
                style={{ color: '#1890ff' }}
                onClick={() => this.linkData(record)}
              >
                代码-Link
              </AuthButton>
              <Dropdown overlay={() => this.menuItem(record)}>
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  更多
                  <DownOutlined />
                </a>
              </Dropdown>
            </Space>
          </>
        ),
      },
    ];

    const tableProps = {
      rowKey: 'app_id',
      columns: columns,
      dataSource: this.state.appList,
      scroll: { x: 1500, y: 600 },
      pagination: {
        current: this.state.page,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: this.state.page_size,
        total: this.state.total,
        onChange: (page: number, pageSize: number) =>
          this.handlePaginationChange(page, pageSize),
      },
    };

    const formProps = {
      drawerConf: drawerConf,
      createList: this.createList,
      editList: this.editList,
      onCancelEdit: this.handleCancelEdit,
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
          extra={
            <Button type="primary" onClick={this.handleCreate}>
              新建
            </Button>
          }
          style={{ marginTop: '20px' }}
        >
          <Table {...tableProps} />
          {this.state.drawerConf.visible && <EditForm {...formProps} />}
          {this.state.isDrawer && (
            <DetailForm
              appId={appId}
              handleDrawerVisible={this.handleDrawerVisible}
            />
          )}
        </Card>
      </>
    );
  }
}

export default AppList;
