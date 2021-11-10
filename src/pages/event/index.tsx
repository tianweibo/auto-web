import React, { Component } from 'react';
import { sourceFrom } from '../../common/enumData.js';
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
  Upload,
  Menu,
  Tooltip,
  Dropdown,
} from 'antd';

import { history, Link, connect, Dispatch } from 'umi';
import moment from 'moment';
import OmegaLogger from 'buried-points-sdk-all';
import { wrapAuth } from '../../components/wrapAuth/index.jsx';
import {
  SearchOutlined,
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
} from '@ant-design/icons';
const AuthButton = wrapAuth(Button);
const AuthMenuItem = wrapAuth(Menu.Item);
import { ModalState, ModalItemData } from './model';
import { ModalState as EventModalState } from '@/pages/event/model';

import {
  EventListItemDataType,
  EventItemDataType,
  DrawerConfType,
  ArrayColumn,
  OptionColumn,
} from './data.d';

import { PlusOutlined } from '@ant-design/icons';

import { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';

import SearchBar from './components/SearchBar/SearchBar';
import EditForm from './components/EditForm/EditForm';
import DetailForm from './components/detailForm';
import styles from './style.less';
import {
  importEvent,
  updateEvent,
  deleteEvent,
  usefulEvent,
  BasicData,
} from './service';
interface EventListProps {
  event: ModalState;
  dispatch: Dispatch;
  loading: boolean;
}

interface EventListState {
  page: number;
  page_size: number;
  event_trigger_mode: string;
  product_line_id: any;
  event_label: string;
  eventId: string;
  keyword: string;
  dataSource: ArrayColumn;
  drawerConf: DrawerConfType;
  isDrawerDetail: DrawerConfType;
  drawerUploadConf: DrawerConfType;
  uploadModalConf: DrawerConfType;
  isLoading: boolean;
}

class EventPage extends Component<EventListProps, EventListState> {
  //定义 state
  state: EventListState = {
    isDrawerDetail: {
      visible: false,
    },
    eventId: '',
    page: 1,
    page_size: 10,
    event_trigger_mode: '',
    product_line_id: null,
    event_label: '',
    keyword: '',
    dataSource: [],
    drawerConf: {
      visible: false,
    },

    drawerUploadConf: {
      visible: false,
    },
    uploadModalConf: {
      visible: false,
    },
    isLoading: true,
  };
  /**
   * 获取触发类型标签
   */
  getTriggerMode = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'event/tagBasicData',
      params: {
        id: 'event_label',
      },
    });
    await dispatch({
      type: 'event/triggerBasicData',
      params: {
        id: 'event_trigger_mode',
      },
    });
  };

  /**
   * 编辑事件
   *
   * @param row 目标对象
   */
  showDetail = async (row: EventListItemDataType) => {
    const { dispatch } = this.props;

    //获取事件详情
    await dispatch({
      type: '/api/event/detail',
      params: {
        id: row.event_id,
      },
    });
  };
  /**
   * 创建事件
   */
  handleCreate = async () => {
    const { dispatch } = this.props;
    this.setState({
      drawerConf: {
        visible: true,
        title: '创建事件',
      },
    });
  };
  /**
   * 批量创建事件
   */
  handleCreateMany = async () => {
    const { dispatch } = this.props;
    this.setState({
      uploadModalConf: {
        visible: true,
        title: '批量创建事件',
      },
    });
  };

  /**
   * 事件批量导入
   */
  handleSubmitUpload = async (values: EventItemDataType) => {
    const { dispatch } = this.props;
    const { drawerUploadConf } = this.state;

    this.setState({
      drawerUploadConf: Object.assign({}, drawerUploadConf, {
        visible: false,
      }),
    });
    importEvent(values).then(() => {
      this.getList({
        keyword: '',
        pageNo: 1,
        pageSize: 10,
        state: 1,
        event_label: '',
        event_trigger_mode: '',
        product_line_id: '',
      });
    });
    dispatch({
      type: '/api/event/importEvent',
      payload: values,
    }).then(() => {
      message.success('创建成功!');
      // 编辑成功，更新事件列表
    });
  };

  /**
   * 批量创建点击取消上传
   */
  handleCancelUpload = async () => {
    const { uploadModalConf } = this.state;

    this.setState({
      uploadModalConf: Object.assign({}, uploadModalConf, {
        visible: false,
      }),
    });
  };

  /**
   * 批量创建点击上传文件
   */
  handleUploadFile = async (e: any) => {};
  /**
   * 批量创建点击模板文件
   */
  handleClickLink = async () => {};
  /**
   * 编辑事件
   *
   * @param row 目标对象
   */
  handleEdit = async (data: any) => {
    this.setState({
      drawerConf: {
        visible: true,
        data: data,
        title: '编辑事件',
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

  /**
   * 完成事件创建
   *
   * @param values 插入对象
   */
  handleFinishCreate = (values: EventItemDataType) => {
    const { dispatch } = this.props;
    const { drawerConf } = this.state;

    this.setState({
      drawerConf: Object.assign({}, drawerConf, {
        visible: false,
      }),
    });

    dispatch({
      type: 'event/create',
      payload: values,
    }).then(() => {
      message.success('创建成功');
    });
  };

  /**
   * 完成事件编辑
   *
   * @param values 编辑对象
   */
  handleFinishEdit = (values: EventItemDataType) => {
    const { dispatch } = this.props;
    const { drawerConf } = this.state;

    this.setState({
      drawerConf: Object.assign({}, drawerConf, {
        visible: false,
      }),
    });

    dispatch({
      type: '/api/event/update',
      payload: values,
    }).then(() => {
      message.success('编辑成功!');
      this.setState({
        event_label: '',
        event_trigger_mode: '',
        keyword: '',
      });
      // 编辑成功，更新事件列表
      const { event_label, event_trigger_mode, product_line_id, keyword } =
        this.state;
      this.getList({
        pageNo: 1,
        pageSize: 10,
        state: 1,
        keyword: keyword,
        event_label: event_label,
        event_trigger_mode: event_trigger_mode,
        product_line_id: product_line_id,
      });
    });
  };

  /**
   * 事件搜索
   *
   * @param value
   */
  handleSearch = (values: { [key: string]: any } = {}) => {
    this.setState({
      event_label: values.event_label,
      event_trigger_mode: values.event_trigger_mode,
      keyword: values.keyword,
      product_line_id: values.product_line_id,
      page: 1,
      page_size: this.state.page_size,
    });
    this.getList({
      keyword: values.keyword,
      pageNo: 1,
      pageSize: 10,
      state: 1,
      event_label: values.event_label,
      event_trigger_mode: values.event_trigger_mode,
      product_line_id: values.product_line_id,
    });
  };

  handlePaginationChange = (page: number, pageSize: number) => {
    this.setState({
      page,
      page_size: pageSize,
    });
    const { event_label, event_trigger_mode, product_line_id, keyword } =
      this.state;
    this.getList({
      pageNo: page,
      pageSize: pageSize,
      state: 1,
      keyword: keyword,
      event_label: event_label,
      event_trigger_mode: event_trigger_mode,
      product_line_id: product_line_id,
    });
  };
  // 查看事件
  handleLookEvent = (data: any) => {
    this.setState({
      isDrawerDetail: {
        visible: true,
      },
      eventId: data,
    });
  };
  handleDrawerVisible = () => {
    this.setState({
      isDrawerDetail: {
        visible: false,
      },
      eventId: '',
    });
  };
  // 归档事件
  handleArchiveEvent = (row: any) => {
    usefulEvent(row.id).then(() => {
      this.getList();
    });
  };

  // 获取事件列表
  getList = async (values: { [key: string]: any } = {}) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'event/fetch',
      params: values,
    });
  };
  componentWillMount = async () => {
    await this.requireEventList();
    await this.getTriggerMode();
    if (localStorage.getItem('event')) {
      this.handleLookEvent(localStorage.getItem('event'));
      localStorage.removeItem('event');
    }
    OmegaLogger.fed({
      event_name: '事件页面-埋点',
      event_code: 'sjymMaidian',
      event_label: 'all_general',
      event_trigger_mode: 'open',
      url: '/app',
    });

    OmegaLogger.setActMess({
      appletCode: 'E2375921D669984E',
      actId: '123',
      actName: '123',
      runtime_env: 'pc',
    });
  };
  componentDidMount = async () => {};
  //
  requireEventList = async () => {
    const { event_label, event_trigger_mode, product_line_id, keyword } =
      this.state;
    this.setState({
      page: 1,
      page_size: 10,
    });
    this.getList({
      pageNo: 1,
      pageSize: 10,
      state: 1,
      keyword: keyword,
      event_label: event_label,
      event_trigger_mode: event_trigger_mode,
      product_line_id: product_line_id,
    });
  };
  /**
   * 向列表返回数据
   * @returns
   */
  commitData = async (values: { [key: string]: any } = {}) => {};
  deleteData(id: string) {
    Modal.confirm({
      title: `确认删除吗？删除之后不可恢复`,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDelete(id),
    });
  }
  archiveEvent = async (id: string) => {
    var res: any = {};
    res = await usefulEvent(id);
    if (res?.status === 0) {
      var obj = {
        keyword: '',
        pageNo: this.state.page,
        pageSize: this.state.page_size,
        event_label: '',
        event_trigger_mode: '',
        product_line_id: null,
      };
      this.getList(obj);
      message.success(res.msg || '停用成功');
    } else {
      message.error(res?.msg || '停用失败');
    }
  };
  handleDelete = async (id: string) => {
    var res: any = {};
    res = await deleteEvent(id);
    if (res?.status === 0) {
      var obj = {
        keyword: '',
        pageNo: this.state.page,
        pageSize: this.state.page_size,
        event_label: '',
        event_trigger_mode: '',
        product_line_id: null,
      };
      this.getList(obj);
      message.success(res.msg || '删除成功');
    } else {
      message.error(res?.msg || '删除失败');
    }
  };
  downLoadEx = () => {
    location.href =
      'https://enbrands-2.oss-cn-shanghai.aliyuncs.com/jindong/事件模板.xlsm';
  };

  clickMenu = (e: any, data: any) => {
    switch (e.key) {
      case 'gd':
        this.archiveEvent(data.event_id);
        break;
      case 'sc':
        this.deleteData(data.event_id);
        break;
      default:
        break;
    }
  };
  menuItem = (record: any) => {
    return (
      <Menu onClick={(params) => this.clickMenu(params, record)}>
        {/* <Menu.Item key="gd">归档</Menu.Item> */}
        <AuthMenuItem productLine={record.product_line_id} key="sc">
          删除
        </AuthMenuItem>
      </Menu>
    );
  };
  render() {
    const {
      event: {
        list: eventList,
        item: currentEvent,
        total,
        triggerTypes,
        tags,
        attributeTags,
        dataTypes,
      },
      loading,
    } = this.props;
    if (loading) {
      return <p>isLoading...</p>;
    }
    const columns: any = [
      {
        title: '事件英文代码',
        dataIndex: 'event_code',
        valueType: 'indexBorder',
        render: (text: any, record: any, index: number) => {
          return (
            <a onClick={() => this.handleLookEvent(record.event_id)}>{text}</a>
          );
        },
      },
      {
        title: '事件中文名',
        dataIndex: 'event_name',
        ellipsis: true,
      },
      {
        title: '事件标签',
        dataIndex: 'event_label_label',
        width: 160,
        ellipsis: {
          showTitle: false,
        },
        render: (event_label_label) => (
          <Tooltip placement="topLeft" title={event_label_label}>
            {event_label_label}
          </Tooltip>
        ),
      },
      {
        title: '事件触发类型',
        key: 'event_trigger_mode_label',
        dataIndex: 'event_trigger_mode_label',
        width: 120,
      },
      {
        title: '触发时机',
        key: 'trigger_time',
        dataIndex: 'trigger_time',
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
        width: 130,
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
        width: 140,
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
                onClick={() => this.deleteData(record.event_id)}
              >
                删除
              </AuthButton>
            </Space>
          </>
        ),
      },
    ];

    const {
      uploadModalConf,
      drawerConf,
      page,
      page_size,
      dataSource,
      isDrawerDetail,
      eventId,
    } = this.state;

    const tableProps = {
      columns,
      dataSource: eventList,
      rowKey: 'event_id',
      // bordered
      scroll: { x: 1500, y: 600 },
      pagination: {
        current: page,
        pageSize: page_size,
        showSizeChanger: true,
        showQuickJumper: true,
        total,
        onChange: (page: number, pageSize: number) =>
          this.handlePaginationChange(page, pageSize),
      },
    };

    const formProps = {
      drawerConf: drawerConf,
      current: currentEvent,
      tags: tags,
      triggerTypes: triggerTypes,
      attributeTags: attributeTags,
      dataTypes: dataTypes,
      dataSource: dataSource,
      onFinishCreate: this.handleFinishCreate,
      onFinishEdit: this.handleFinishEdit,
      onCancelEdit: this.handleCancelEdit,
      commitData: this.commitData,
      requireEventList: this.requireEventList,
    };

    const uploadformProps = {
      drawerConf: uploadModalConf,
      current: currentEvent,
      onCancelUpload: this.handleCancelUpload,
      onUploadFile: this.handleUploadFile,
      onSubmitUpload: this.handleSubmitUpload,
      onClickLink: this.handleClickLink,
    };
    const propsUpload = {
      name: 'file',
      action: '/api/event/importEvent',
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      onChange: (info) => {
        if (info.file.status === 'done') {
          if (info.file.response.status == 0) {
            message.success(`${info.file.name} 导入成功`);
            var obj = {
              keyword: '',
              pageNo: 1,
              pageSize: 10,
              event_label: '',
              event_trigger_mode: '',
              product_line_id: null,
            };
            this.getList(obj);
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
        <SearchBar
          tags={tags}
          triggerTypes={triggerTypes}
          handleSearch={this.handleSearch}
          resetSearch={this.resetSearch}
          handleCreate={this.handleCreate}
          handleCreateMany={this.handleCreateMany}
        />

        <Card
          title="事件列表"
          extra={
            <Space>
              <Button type="primary" onClick={this.handleCreate}>
                新建
              </Button>
              {/* <Button type="primary" icon={<DownloadOutlined />} onClick={this.downLoadEx}>
               模板下载
             </Button>
             <Upload {...propsUpload}>
              <AuthButton  icon={<UploadOutlined />}> 
              数据导入
              </AuthButton>
             </Upload> */}
            </Space>
          }
          style={{ marginTop: '20px' }}
        >
          <Table {...tableProps} />
          {drawerConf.visible && <EditForm {...formProps} />}
          {isDrawerDetail.visible && (
            <DetailForm
              eventId={eventId}
              handleDrawerVisible={this.handleDrawerVisible}
            ></DetailForm>
          )}
        </Card>
      </>
    );
  }
}

export default connect(({ event }: { event: ModalState }) => ({
  event,
}))(EventPage);
