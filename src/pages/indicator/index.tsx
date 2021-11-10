import React, { useState, useEffect, Component } from 'react';
import {
  Card,
  Space,
  Modal,
  message,
  Upload,
  Button,
  Table,
  Col,
  Menu,
  Tooltip,
  Dropdown,
} from 'antd';
import {
  DownOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { wrapAuth } from '../../components/wrapAuth/index.jsx';
import EditForm from './components/EditForm/EditForm';
import DetailForm from './components/detailForm';
import SearchBar from './components/SearchBar/SearchBar';
import OmegaLogger from 'buried-points-sdk-all';
import { sourceFrom } from '../../common/enumData.js';
import {
  basicData,
  deleteIndicator,
  getIndicatorList,
  usefulIndicator,
} from './service';
const AuthButton = wrapAuth(Button);
const AuthMenuItem = wrapAuth(Menu.Item);
class IndicatorList extends Component {
  //定义 state
  state = {
    indicatorId: '',
    indicatorList: [],
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
      indicator_label: '',
      indicator_type: '',
      product_line_id: null,
    },
  };

  createReport() {}

  resetSearch() {}
  getBasicData = async (id: string) => {
    const res = await basicData(id);
  };
  requireIndicatorList = async (params: {}) => {
    const res: any = await getIndicatorList(params);
    if (res.status == 0) {
      this.setState({
        indicatorList: res.data.arr,
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
    this.requireIndicatorList(val);
  };
  handleCreate = async () => {
    this.setState({
      drawerConf: {
        visible: true,
        title: '创建指标',
      },
    });
    OmegaLogger.fed({
      event_name: '指标创建-埋点',
      event_code: 'zhibiaocreate_maidian',
      event_label: 1,
      event_trigger_mode: 'open',
      url: '/indicator',
    });
  };
  handleEdit = async (data: any) => {
    this.setState({
      drawerConf: {
        visible: true,
        data: data,
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
  deleteData(id: string) {
    Modal.confirm({
      title: `确认删除吗？删除之后不可恢复`,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDelete(id),
    });
  }
  archiveIndicator = async (id: string) => {
    var res: any = {};
    res = await usefulIndicator(id);
    if (res?.status === 0) {
      this.setState({
        page: 1,
        page_size: 10,
      });
      var obj = {
        keyword: '',
        pageNo: 1,
        pageSize: 10,
        indicator_label: '',
        indicator_type: '',
        product_line_id: null,
      };
      this.requireIndicatorList(obj);
      message.success(res.msg || '停用成功');
    } else {
      message.error(res?.msg || '停用失败');
    }
  };
  handleDelete = async (id: string) => {
    var res: any = {};
    res = await deleteIndicator(id);
    if (res?.status === 0) {
      this.setState({
        page: 1,
        page_size: 10,
      });
      var obj = {
        keyword: '',
        pageNo: 1,
        pageSize: 10,
        indicator_label: '',
        indicator_type: '',
        product_line_id: null,
      };
      this.requireIndicatorList(obj);
      message.success(res.msg || '删除成功');
    } else {
      message.error(res?.msg || '删除失败');
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
      indicator_label: this.state.searchObject.indicator_label,
      indicator_type: this.state.searchObject.indicator_type,
      product_line_id: this.state.searchObject.product_line_id,
    };
    this.requireIndicatorList(obj);
  };
  clickMenu = (e: any, data: any) => {
    switch (e.key) {
      case 'gd':
        this.archiveIndicator(data.indicator_id);
        break;
      case 'sc':
        this.deleteData(data.indicator_id);
        break;
      default:
        break;
    }
  };
  seeData = (data: any) => {
    this.setState({ isDrawer: true, indicatorId: data });
  };
  handleDrawerVisible = () => {
    this.setState({ isDrawer: false, indicatorId: '' });
  };
  downLoadEx = () => {
    location.href =
      'https://enbrands-2.oss-cn-shanghai.aliyuncs.com/jindong/指标模板.xlsx';
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
      indicator_label: '',
      indicator_type: '',
      product_line_id: null,
    };
    this.requireIndicatorList(obj);
  };
  editList = () => {
    var obj = {
      keyword: this.state.searchObject.keyword,
      pageNo: this.state.page,
      pageSize: this.state.page_size,
      indicator_label: this.state.searchObject.indicator_label,
      indicator_type: this.state.searchObject.indicator_type,
      product_line_id: this.state.searchObject.product_line_id,
    };
    this.requireIndicatorList(obj);
  };
  componentDidMount() {
    var obj = {
      keyword: '',
      pageNo: 1,
      pageSize: 10,
      indicator_label: '',
      indicator_type: '',
      product_line_id: null,
    };
    this.requireIndicatorList(obj);
    if (localStorage.getItem('indicator')) {
      this.seeData(localStorage.getItem('indicator'));
      localStorage.removeItem('indicator');
    }
    OmegaLogger.fed({
      event_name: '指标页面-埋点',
      event_code: 'zhibiao_maidian',
      event_label: 'all_general',
      event_trigger_mode: 'open',
      url: '/app',
    });
  }
  menuItem = (record: any) => {
    return (
      <Menu onClick={(params) => this.clickMenu(params, record)}>
        {/* <Menu.Item key='gd'>归档</Menu.Item> */}
        <AuthMenuItem productLine={record.product_line_id} key="sc">
          删除
        </AuthMenuItem>
      </Menu>
    );
  };
  render() {
    const { drawerConf, isDrawer, indicatorId } = this.state;
    const columns: any = [
      {
        title: '指标名称',
        width: 200,
        dataIndex: 'indicator_name',
        fixed: 'left',
        render: (text: any, record: any, index: number) => {
          return (
            <a onClick={() => this.seeData(record.indicator_id)}>{text}</a>
          );
        },
      },
      {
        title: '指标代码',
        width: 120,
        dataIndex: 'indicator_code',
        key: 'indicator_code',
        ellipsis: {
          showTitle: false,
        },
        render: (indicator_code) => (
          <Tooltip placement="topLeft" title={indicator_code}>
            {indicator_code}
          </Tooltip>
        ),
      },
      {
        title: '指标标签',
        dataIndex: 'indicator_label_label',
        key: 'indicator_label_label',
        width: 160,
        ellipsis: {
          showTitle: false,
        },
        render: (indicator_label_label) => (
          <Tooltip placement="topLeft" title={indicator_label_label}>
            {indicator_label_label}
          </Tooltip>
        ),
      },
      {
        title: '指标类型',
        dataIndex: 'indicator_type_label',
        key: 'indicator_type_label',
        width: 120,
      },
      {
        title: '一级指标',
        dataIndex: 'indicator_level_label',
        key: 'indicator_level_label',
        width: 120,
      },
      {
        title: '创建日期',
        dataIndex: 'create_time',
        key: 'description',
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
        width: 100,
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
                onClick={() => this.deleteData(record.indicator_id)}
              >
                删除
              </AuthButton>
              {/* <Dropdown overlay={() => this.menuItem(record)} 
              >
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  更多<DownOutlined />
               </a>
              </Dropdown> */}
            </Space>
          </>
        ),
      },
    ];

    const tableProps = {
      rowKey: 'indicator_id',
      columns: columns,
      dataSource: this.state.indicatorList,
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
      onCancelEdit: this.handleCancelEdit,
      createList: this.createList,
      editList: this.editList,
    };

    const searchProps = {
      handleSearch: this.handleSearch,
      resetSearch: this.resetSearch,
    };
    const propsUpload = {
      name: 'file',
      action: '/api/indicator/importIndicator',
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      onChange: (info) => {
        if (info.file.status === 'done') {
          if (info.file.response.status == 0) {
            message.success(`${info.file.name} 导入成功`);
            this.setState({
              page: 1,
              page_size: 10,
            });
            var obj = {
              keyword: '',
              pageNo: 1,
              pageSize: 10,
              indicator_label: '',
              indicator_type: '',
              product_line_id: null,
            };
            this.requireIndicatorList(obj);
          } else {
            message.error(`${info.file.response.msg}`);
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 导入失败`);
        }
      },
    };
    return (
      <>
        <SearchBar {...searchProps} />
        <Card
          title="指标列表"
          extra={
            <Space>
              <Button type="primary" onClick={this.handleCreate}>
                新建
              </Button>
              {/* <Button type="primary" icon={<DownloadOutlined />} onClick={this.downLoadEx}>
               模板下载
             </Button>
             <Upload {...propsUpload}>
              <AuthButton icon={<UploadOutlined />}>数据导入</AuthButton>
             </Upload> */}
            </Space>
          }
          style={{ marginTop: '20px' }}
        >
          <Table {...tableProps} />
          {this.state.drawerConf.visible && <EditForm {...formProps} />}
          {this.state.isDrawer && (
            <DetailForm
              indicatorId={indicatorId}
              handleDrawerVisible={this.handleDrawerVisible}
            />
          )}
        </Card>
      </>
    );
  }
}

export default IndicatorList;
