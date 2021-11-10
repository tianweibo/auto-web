import React, { Component } from 'react';

import {
  Card,
  Drawer,
  Space,
  Modal,
  Divider,
  Button,
  Table,
  Row,
  Col,
  Tag,
  message,
} from 'antd';

import { history, Link, connect, Dispatch } from 'umi';
import moment from 'moment';

import {
  SearchOutlined,
  EyeOutlined,
  LineChartOutlined,
} from '@ant-design/icons';

import { ModalState, ModalItemData } from './model';
import { ModalState as TagModalState } from '@/pages/tag/model';

import {
  ProjectListItemDataType,
  ProjectItemDataType,
  DrawerConfType,
  TagConfType,
} from './data.d';

import { PlusOutlined } from '@ant-design/icons';

import { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';

import SearchBar from './components/SearchBar/SearchBar';
import EditForm from './components/EditForm/EditForm';
import Detail from './components/Detail/Detail';

import styles from './style.less';

interface ProjectListProps {
  tag: TagModalState;
  project: ModalState;
  dispatch: Dispatch;
  loading: boolean;
}

interface ProjectListState {
  page: number;
  page_size: number;
  drawerConf: DrawerConfType;
  detailDrawerConf: DrawerConfType;
}

class ProjectPage extends Component<ProjectListProps, ProjectListState> {
  //定义 state
  state: ProjectListState = {
    page: 1,
    page_size: 10,
    drawerConf: {
      visible: false,
    },
    detailDrawerConf: {
      visible: false,
    },
  };

  /**
   * 编辑项目
   *
   * @param row 目标对象
   */
  showDetail = async (row: ProjectListItemDataType) => {
    const { dispatch } = this.props;

    //获取项目详情
    await dispatch({
      type: 'project/find',
      params: {
        project_id: row.project_id,
      },
    });

    this.setState({
      detailDrawerConf: {
        visible: true,
        title: '项目详情',
      },
    });
  };

  /**
   * 创建项目
   */
  handleCreate = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tag/tagList',
    });
    dispatch({
      type: 'project/reset',
      payload: {
        item: ModalItemData,
      },
    });
    this.setState({
      drawerConf: {
        visible: true,
        title: '创建项目',
      },
    });
  };

  /**
   * 编辑项目
   *
   * @param row 目标对象
   */
  handleEdit = async (row: ProjectListItemDataType) => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'tag/tagList',
    });

    //获取项目详情
    await dispatch({
      type: 'project/find',
      params: {
        project_id: row.project_id,
      },
    });

    this.setState({
      drawerConf: {
        visible: true,
        title: '编辑项目',
      },
    });
  };

  /**
   * 取消编辑
   */
  handleCancelEdit = () => {
    const { drawerConf } = this.state;

    this.setState({
      drawerConf: Object.assign({}, drawerConf, {
        visible: false,
      }),
    });
  };

  handleCancelDetail = () => {
    const { detailDrawerConf } = this.state;

    this.setState({
      detailDrawerConf: Object.assign({}, detailDrawerConf, {
        visible: false,
      }),
    });
  };

  /**
   * 完成项目创建
   *
   * @param values 插入对象
   */
  handleFinishCreate = (values: ProjectItemDataType) => {
    const { dispatch } = this.props;
    const { drawerConf } = this.state;

    this.setState({
      drawerConf: Object.assign({}, drawerConf, {
        visible: false,
      }),
    });

    dispatch({
      type: 'project/create',
      payload: values,
    }).then(() => {
      message.success('创建成功');
      this.getList();
    });
  };

  /**
   * 完成项目编辑
   *
   * @param values 编辑对象
   */
  handleFinishEdit = (values: ProjectItemDataType) => {
    const { dispatch } = this.props;
    const { drawerConf } = this.state;

    this.setState({
      drawerConf: Object.assign({}, drawerConf, {
        visible: false,
      }),
    });

    dispatch({
      type: 'project/update',
      payload: values,
    }).then(() => {
      message.success('编辑成功!');
      // 获取列表
      this.getList();
    });
  };

  /**
   * 项目搜索
   *
   * @param value
   */
  handleSearch = (values: { [key: string]: any } = {}) => {
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

  handlePaginationChange = (page: number) => {
    this.setState({
      page,
    });

    this.getList({
      page,
    });
  };

  //
  getList = async (values: { [key: string]: any } = {}) => {
    const { dispatch } = this.props;
    //获取项目列表
    await dispatch({
      type: 'project/fetch',
      params: values,
    });
  };

  componentDidMount = async () => {
    this.getList();
  };

  render() {
    const {
      tag: { tagList },
      project: { list: projectList, item: currentProject, total },
      loading,
    } = this.props;

    const tagColors = [
      'magenta',
      'red',
      'volcano',
      'orange',
      'gold',
      'lime',
      'green',
      'cyan',
      'blue',
      'geekblue',
      'purple',
    ];

    const columns: any = [
      {
        title: 'ID',
        dataIndex: 'project_id',
        fixed: 'left',
        valueType: 'indexBorder',
        width: 60,
      },
      {
        title: '项目名称',
        dataIndex: 'title',
        ellipsis: true,
      },
      {
        title: '项目指标数量',
        width: 200,
        dataIndex: 'tag_conf',
        render: (tag_conf: any, row: any) => <Space>{tag_conf.length}个</Space>,
      },
      {
        title: '项目描述',
        key: 'description',
        dataIndex: 'description',
      },
      {
        title: '开始时间 ~ 结束时间',
        dataIndex: 'date_range',
        width: 260,
        render: (text, row) => {
          const start_date = moment(row.start_date).format('YYYY/MM/DD');
          const end_date = moment(row.end_date).format('YYYY/MM/DD');
          return `${start_date} ~ ${end_date}`;
        },
      },
      {
        title: '创建时间',
        key: 'created_at',
        dataIndex: 'created_at',
        width: 180,
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        dataIndex: 'id',
        fixed: 'right',
        width: 120,
        render: (text, row) => (
          <>
            <Space>
              <a onClick={() => this.showDetail(row)}>详情</a>
              <a onClick={() => this.handleEdit(row)}>编辑</a>
            </Space>
          </>
        ),
      },
    ];

    const { drawerConf, detailDrawerConf, page, page_size } = this.state;

    const tableProps = {
      columns,
      dataSource: projectList,
      rowKey: 'project_id',
      // bordered
      scroll: { x: 1500, y: 300 },
      pagination: {
        // page,
        // page_size,
        // total,
        current: page,
        pageSize: page_size,
        total,
        onChange: (page: number) => this.handlePaginationChange(page),
      },
    };

    const formProps = {
      drawerConf: drawerConf,
      current: currentProject,
      tagList,
      onFinishCreate: this.handleFinishCreate,
      onFinishEdit: this.handleFinishEdit,
      onCancelEdit: this.handleCancelEdit,
    };

    const detailProps = {
      drawerConf: detailDrawerConf,
      current: currentProject,
      onCancelEdit: this.handleCancelDetail,
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
            <Button onClick={this.handleCreate} type="primary">
              新建
            </Button>
          }
          style={{ marginTop: '20px' }}
        >
          <Table {...tableProps} />
          <EditForm {...formProps} />
          <Detail {...detailProps} />
        </Card>
      </>
    );
  }
}

export default connect(
  ({ tag, project }: { tag: TagModalState; project: ModalState }) => ({
    tag,
    project,
  }),
)(ProjectPage);
