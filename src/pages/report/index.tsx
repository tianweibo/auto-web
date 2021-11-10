import React, { Component } from 'react';
import {
  Space,
  Button,
  Table,
  Modal,
  message,
  Input,
  Col,
  Row,
  Tooltip,
} from 'antd';
import { history, Link, connect, Dispatch } from 'umi';
import { ColumnsType } from 'antd/es/table';

import { ModalState } from './model';
import { ModalState as ActivityModalState } from '@/pages/activity/model';

import { Report } from './data.d';

import SearchBar from './components/SearchBar/SearchBar';

export interface DrawerConfType {
  visible: boolean;
  title?: string;
}
interface ReportListProps {
  activity: ActivityModalState;
  report: ModalState;
  dispatch: Dispatch;
  loading: boolean;
}

class ReportPage extends Component<ReportListProps> {
  state = {
    total: 0,
    page: 1,
    page_size: 10,
    isModalVisible: false,
    app_id: null,
    inputValueAct: null,
    inputValueShop: null,
    report_id: null,
  };
  createReport = () => {};
  /**
   * 项目搜索
   * @param value
   */
  handleSearch = (values: Record<string, any> = {}) => {
    this.getList({
      filters: values,
    });
  };

  resetSearch = () => {
    this.setState({
      page: 1,
    });
    this.getList();
  };

  /**
   * 获取报表列表
   * @param values
   */
  getList(values: Record<string, any> = {}) {
    const { dispatch } = this.props; //获取项目列表
    dispatch({
      type: 'report/fetch',
      params: values.filters,
    });
  }
  handleDelete(id: number) {
    const { dispatch } = this.props; //获取项目列表
    dispatch({
      type: 'report/delete',
      id,
    }).then((res: any) => {
      if (res.status === 0) {
        var params = {
          application_keyword: '',
          application_label: '',
          application_dep_platform: '',
          product_line_id: null,
          report_keyword: '',
          pageNo: 1,
          pageSize: 10,
        };
        message.success('删除成功');
        dispatch({
          type: 'report/fetch',
          params: params,
        });
      } else {
        message.success('删除失败');
      }
    });
  }
  // 应用标签
  getLabelList() {
    this.props.dispatch({
      type: 'report/labelTree',
      params: {
        id: 4,
      },
    });
  }
  // 应用部署平台
  getApplicationDep() {
    this.props.dispatch({
      type: 'report/queryBasicData',
      params: {
        id: 'application_dep_platform',
      },
    });
  }
  componentDidMount() {
    var obj = {
      filters: {
        application_keyword: '',
        application_label: '',
        application_dep_platform: '',
        product_line_id: null,
        report_keyword: '',
        pageNo: 1,
        pageSize: 10,
      },
    };
    this.getList(obj);
    this.getLabelList();
    this.getApplicationDep();
  }
  deleteData(id: number) {
    Modal.confirm({
      title: `确认删除吗？删除之后不可恢复`,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDelete(id),
    });
  }
  seeReport(val: any) {
    this.setState({
      isModalVisible: true,
      app_id: val.application_id,
      report_id: val.report_id,
    });
  }
  handleOk = () => {
    this.setState({ isModalVisible: false });
    var theUrl = `/seeReport?app_id=${this.state.app_id}&report_id=${this.state.report_id}`;
    if (this.state.inputValueAct) {
      theUrl += `&act_id=${this.state.inputValueAct}`;
    }
    if (this.state.inputValueShop) {
      theUrl += `&merchant_id=${this.state.inputValueShop}`;
    }
    window.open(theUrl);
  };
  inputChangeAct = (e: any) => {
    this.setState({ inputValueAct: e.target.value });
  };
  inputChangeShop = (e: any) => {
    this.setState({ inputValueShop: e.target.value });
  };
  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };
  seeData(report_id: number, application_id: number, type: string) {
    history.push({
      pathname: '/report/create',
      query: {
        report_id: report_id.toString(),
        application_id: application_id.toString(),
        type: type,
      },
    });
  }
  handlePaginationChange = (page: number, pageSize: number) => {
    this.setState({
      page,
      page_size: pageSize,
    });
    var obj = {
      filters: {
        application_keyword: '',
        application_label: '',
        application_dep_platform: '',
        product_line_id: null,
        report_keyword: '',
        pageNo: page,
        pageSize: pageSize,
      },
    };
    this.getList(obj);
  };
  onClick(row: Report, type: number) {
    switch (type) {
      case 1:
        this.seeReport(row);
        break;
      case 2:
        this.seeData(row.report_id, row.application_id, 'detail');
        break;
      case 3:
        this.seeData(row.report_id, row.application_id, 'update');
        break;
      case 4:
        this.deleteData(row.report_id);
        break;
      default:
        break;
    }
  }

  render() {
    const columns: ColumnsType<Report> = [
      {
        title: '报表ID',
        dataIndex: 'report_id',
        width: 100,
      },
      {
        title: '报表名称',
        dataIndex: 'report_name',
        ellipsis: {
          showTitle: false,
        },
        render: (text: any, record: any, index: number) => {
          return (
            <Tooltip placement="topLeft" title={record.report_name}>
              <span>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '应用ID',
        dataIndex: 'application_id',
        width: 100,
      },
      {
        title: '应用名称',
        dataIndex: 'platform_app',
        ellipsis: {
          showTitle: false,
        },
        render: (text: any, record: any, index: number) => {
          return (
            <Tooltip placement="topLeft" title={record.platform_app}>
              <span>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '应用标签',
        dataIndex: 'application_label_label',
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
        title: '应用部署平台',
        dataIndex: 'application_dep_platform_label',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
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
        fixed: 'right',
        render: (row) => (
          <>
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => this.onClick(row, 1)}
              >
                查看报表
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => this.onClick(row, 2)}
              >
                查看配置
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => this.onClick(row, 3)}
              >
                编辑配置
              </Button>
              <Button size="small" onClick={() => this.onClick(row, 4)} danger>
                删除配置
              </Button>
            </Space>
          </>
        ),
      },
    ];
    const tableProps = {
      rowKey: 'report_id',
      columns: columns,
      dataSource: this.props.report.reportList,
      scroll: { x: 1500, y: 600 },
      pagination: {
        current: this.state.page,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: this.state.page_size,
        total: this.props.report.total,
        onChange: (page: number, pageSize: number) =>
          this.handlePaginationChange(page, pageSize),
      },
    };
    const searchProps = {
      onCreateReport: this.createReport,
      handleSearch: this.handleSearch,
      resetSearch: this.resetSearch,
      appLabelList: this.props.report.appLabelList,
      applicationDepPlatformList: this.props.report.applicationDepPlatformList,
    };

    return (
      <>
        <SearchBar {...searchProps} />
        <Table {...tableProps} />
        <Modal
          title="查看报表"
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Row style={{ marginBottom: '20px' }}>
            <Col span={3}>活动ID:</Col>
            <Col span={21}>
              <Input
                placeholder="请输入正确的活动号码"
                onChange={this.inputChangeAct}
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col span={3}>商户ID:</Col>
            <Col span={21}>
              <Input
                placeholder="请输入正确的商家号码"
                onChange={this.inputChangeShop}
              ></Input>
            </Col>
          </Row>
        </Modal>
      </>
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
)(ReportPage);
