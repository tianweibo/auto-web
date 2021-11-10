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
import { ModalState as AttributeModalState } from '@/pages/attribute/model';

import {
  AttributeListItemDataType,
  AttributeItemDataType,
  DrawerConfType,
} from './data.d';

import { PlusOutlined } from '@ant-design/icons';

import { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';

import SearchBar from './components/SearchBar/SearchBar';
import EditForm from './components/EditForm/EditForm';
import Detail from './components/Detail/Detail';

import styles from './style.less';
import {
  getBasicData,
  getAttributeList,
} from './service';
interface AttributeListProps {
  attribute: ModalState;
  dispatch: Dispatch;
  loading: boolean;
}

interface AttributeListState {
  page: number;
  page_size: number;
  drawerConf: DrawerConfType;
  detailDrawerConf: DrawerConfType;
}

class AttributePage extends Component<AttributeListProps, AttributeListState> {
  //定义 state
  state: AttributeListState = {
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
  showDetail = async (row: AttributeListItemDataType) => {
    const { dispatch } = this.props;

    //获取属性详情
    await dispatch({
      type: '/api/attribute/detail',
      params: {
        id: row.attribute_id,
      },
    });
    await this.getDetailData(row);
    this.setState({
      detailDrawerConf: {
        visible: true,
        title: '属性详情',
      },
    });
  };
  /**
   * 获取属性详情
   * @param row
   */
  getDetailData = async (values: { key: [string] }) => {
   
  };

  /**
   * 属性下事件列表的获取
   * @param row 目标对象
   */
  getEventList = async (row: AttributeListItemDataType) => {
    const { dispatch } = this.props;

    //获取属性详情
    await dispatch({
      type: '/api/attribute/eventList',
      params: {
        id: row.attribute_id,
      },
    });
   
  };
  /**
   * 创建指标
   */
  handleLook = async () => {
    const { dispatch } = this.props;

    this.setState({
      drawerConf: {
        visible: true,
        title: '自定义属性',
      },
    });
  };

  /**
   * 编辑指标
   *
   * @param row 目标对象
   */
  handleERead = async (row: AttributeListItemDataType) => {
    const { dispatch } = this.props;
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
  handleFinishCreate = (values: AttributeItemDataType) => {
    const { dispatch } = this.props;
    const { drawerConf } = this.state;

    this.setState({
      drawerConf: Object.assign({}, drawerConf, {
        visible: false,
      }),
    });

    dispatch({
      type: 'attribute/create',
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
  handleFinishEdit = (values: AttributeItemDataType) => {
    const { dispatch } = this.props;
    const { drawerConf } = this.state;

    this.setState({
      drawerConf: Object.assign({}, drawerConf, {
        visible: false,
      }),
    });

    dispatch({
      type: 'attribute/update',
      payload: values,
    }).then(() => {
      message.success('编辑成功!');
      // 编辑成功，更新指标列表
      this.getList({
        keyword: '',
        pageNo: 0,
        pageSize: 10,
        state: 1,
        attribute_label: '',
        data_type: '',
      });
    });
  };

  /**
   * 指标搜索
   *
   * @param value
   */
  handleSearch = (values: { [key: string]: any } = {}) => {
    this.getList({
      keyword: values.keyword,
      pageNo: 0,
      pageSize: 10,
      state: 1,
      attribute_label: values.attribute_label,
      data_type: values.data_type,
    });
  };

  resetSearch = () => {
    this.setState({
      page: 1,
    });
    this.getList({
      keyword: '',
      pageNo: 0,
      pageSize: 10,
      state: 1,
      attribute_label: '',
      data_type: '',
    });
  };

  handlePaginationChange = (page: number) => {
    this.setState({
      page,
    });

    this.getList({
      keyword: '',
      pageNo: page,
      pageSize: 10,
      state: 1,
      attribute_label: '',
      data_type: '',
    });
  };

  //
  getList = async (values: { [key: string]: any } = {}) => {
    const { dispatch } = this.props;
    //获取属性列表
    await dispatch({
      type: '/api/attribute/list',
      params: values,
    });

    await getAttributeList({
      keyword: values.keyword,
      pageNo: values.pageNo,
      pageSize: values.pageSize,
      state: values.status,
      attribute_label: values.attribute_label,
      data_type: values.data_type,
    });
  };
  getBasicAttributeData = async (key: string) => {
    const { dispatch } = this.props;
    await dispatch({
      type: '/api/attribute/list',
      params: key,
    });
    // await getBasicData(key)
  };

  componentDidMount = async () => {
    this.getBasicAttributeData('attribute_label');
    this.getList({
      keyword: '',
      pageNo: 0,
      pageSize: 10,
      state: 1,
      attribute_label: '',
      data_type: '',
    });
  };

  render() {
    const {
      attribute: { list: attributeList, item: currentAttribute, total },
      loading,
    } = this.props;
    const attributeColors = [
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
        title: '属性',
        dataIndex: 'attribute_name',
        ellipsis: true,
        render: (text, row) => (
          <>
            <Space>
              <a onClick={() => this.handleERead(row)}>查看</a>
            </Space>
          </>
        ),
      },
      {
        title: '属性代码',
        dataIndex: 'attribute_code',
        valueType: 'indexBorder',
      },
      {
        title: '数据类型',
        dataIndex: 'data_type',
        ellipsis: true,
      },
      {
        title: '属性值含义来源',
        key: 'attribute_source',
        dataIndex: 'attribute_source',
      },
      {
        title: '字典值/个',
        key: 'attribute_zdz',
        dataIndex: 'attribute_zdz',
      },
      {
        title: '关联事件',
        key: 'attribute_zdz',
        dataIndex: 'attribute_zdz',
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: 120,
        render: (text, row) => (
          <>
            <Space>
              <a onClick={() => this.handleERead(row)}>查看</a>
            </Space>
          </>
        ),
      },
    ];

    const { drawerConf, detailDrawerConf, page, page_size } = this.state;

    const tableProps = {
      columns,
      dataSource: attributeList,
      rowKey: 'attribute_id',
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
      current: currentAttribute,
      onFinishCreate: this.handleFinishCreate,
      onFinishEdit: this.handleFinishEdit,
      onCancelEdit: this.handleCancelEdit,
    };

    const detailProps = {
      drawerConf: detailDrawerConf,
      current: currentAttribute,
      onCancelEdit: this.handleCancelDetail,
    };

    return (
      <>
        <SearchBar
          handleSearch={this.handleSearch}
          resetSearch={this.resetSearch}
        />

        <Card
          style={{ marginTop: '20px' }}
          extra={
            <Button onClick={this.handleLook} type="primary">
              查看
            </Button>
          }
        >
          <Table {...tableProps} />
          <EditForm {...formProps} />
          <Detail {...detailProps} />
        </Card>
      </>
    );
  }
}

export default connect(({ attribute }: { attribute: ModalState }) => ({
  attribute,
}))(AttributePage);
