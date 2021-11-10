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
import {wrapAuth} from '../../components/wrapAuth/index.jsx';
import {
  SearchOutlined,
  EyeOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
const AuthButton = wrapAuth(Button)
const AuthSpan = wrapAuth(Col)
import { ModalState, ModalItemData } from './model';
import { ModalState as TagModalState } from '@/pages/tag/model';

import { TagListItemDataType, TagItemDataType, DrawerConfType } from './data.d';

import { PlusOutlined } from '@ant-design/icons';

import { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';

import SearchBar from './components/SearchBar/SearchBar';
import EditForm from './components/EditForm/EditForm';
import Detail from './components/Detail/Detail';

import styles from './style.less';

interface TagListProps {
  tag: ModalState;
  dispatch: Dispatch;
  loading: boolean;
}

interface TagListState {
  page: number;
  page_size: number;
  drawerConf: DrawerConfType;
  detailDrawerConf: DrawerConfType;
}

class TagPage extends Component<TagListProps, TagListState> {
  //定义 state
  state: TagListState = {
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
   * 编辑指标
   *
   * @param row 目标对象
   */
  showDetail = async (row: TagListItemDataType) => {
    const { dispatch } = this.props;

    //获取指标详情
    await dispatch({
      type: 'tag/find',
      params: {
        tag_id: row.tag_id,
      },
    });

    this.setState({
      detailDrawerConf: {
        visible: true,
        title: '指标详情',
      },
    });
  };

  /**
   * 创建指标
   */
  handleCreate = async () => {
    const { dispatch } = this.props;
    this.setState({
      drawerConf: {
        visible: true,
        title: '创建指标',
      },
    });
  };

  /**
   * 编辑指标
   *
   * @param row 目标对象
   */
  handleEdit = async (row: TagListItemDataType) => {
    const { dispatch } = this.props;

    //获取指标详情
    await dispatch({
      type: 'tag/find',
      params: {
        tag_id: row.tag_id,
      },
    });

    this.setState({
      drawerConf: {
        visible: true,
        title: '编辑指标',
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
   * 完成指标创建
   *
   * @param values 插入对象
   */
  handleFinishCreate = (values: TagItemDataType) => {
    const { dispatch } = this.props;
    const { drawerConf } = this.state;

    this.setState({
      drawerConf: Object.assign({}, drawerConf, {
        visible: false,
      }),
    });

    dispatch({
      type: 'tag/create',
      payload: values,
    }).then(() => {
      message.success('创建成功');
    });
  };

  /**
   * 完成指标编辑
   *
   * @param values 编辑对象
   */
  handleFinishEdit = (values: TagItemDataType) => {
    const { dispatch } = this.props;
    const { drawerConf } = this.state;

    this.setState({
      drawerConf: Object.assign({}, drawerConf, {
        visible: false,
      }),
    });

    dispatch({
      type: 'tag/update',
      payload: values,
    }).then(() => {
      message.success('编辑成功!');
      // 编辑成功，更新指标列表
      this.getList();
    });
  };

  /**
   * 指标搜索
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
    //获取指标列表
    await dispatch({
      type: 'tag/fetch',
      params: values,
    });
  };

  componentDidMount = async () => {
    this.getList();
  };

  render() {
    const {
      tag: { list: tagList, item: currentTag, total },
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
        dataIndex: 'tag_id',
        fixed: 'left',
        valueType: 'indexBorder',
        width: 60,
      },
      {
        title: '指标名称',
        dataIndex: 'tag_name',
        ellipsis: true,
      },
      {
        title: '指标字段',
        dataIndex: 'tag_key',
        ellipsis: true,
      },
      {
        title: '指标描述',
        key: 'description',
        dataIndex: 'description',
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
              <a onClick={() => this.handleEdit(row)}>编辑</a>
            </Space>
          </>
        ),
      },
    ];

    const { drawerConf, detailDrawerConf, page, page_size } = this.state;

    const tableProps = {
      columns,
      dataSource: tagList,
      rowKey: 'tag_id',
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
      current: currentTag,
      onFinishCreate: this.handleFinishCreate,
      onFinishEdit: this.handleFinishEdit,
      onCancelEdit: this.handleCancelEdit,
    };

    const detailProps = {
      drawerConf: detailDrawerConf,
      current: currentTag,
      onCancelEdit: this.handleCancelDetail,
    };

    return (
      <>
        <SearchBar
          handleSearch={this.handleSearch}
          resetSearch={this.resetSearch}
        />

        <Card
          title="指标列表"
          extra={
            <AuthButton onClick={this.handleCreate} type="primary">
              新建
            </AuthButton>
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

export default connect(({ tag }: { tag: ModalState }) => ({
  tag,
}))(TagPage);
