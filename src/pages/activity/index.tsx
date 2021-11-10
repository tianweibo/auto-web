import React, { Component } from 'react';
import {
  Modal,
  Divider,
  Button,
  Table,
  Row,
  Col,
  Tag,
  message,
  Card,
} from 'antd';
import { Link, connect, Dispatch } from 'umi';

import { ModalState } from './model';
import { ModalState as TagModalState } from '../tag/model';
import { TagListItemDataType } from '../tag/data.d';
import {
  TagConfType,
  ActivityListItemDataType,
  ActivityFormItemDataType,
} from './data.d';
import styles from './style.less';

import EditForm from './components/EditForm/EditForm';
import SearchBar from './components/SearchBar/SearchBar';
import TagModal, { TagModalConfType } from './components/TagModal/TagModal';

import { arrayColumn } from '@/utils/util';
import moment from 'moment';

export interface DrawerConfType {
  visible: boolean;
  title?: string;
}
interface ActivityListProps {
  activity: ModalState;
  tag: TagModalState;
  dispatch: Dispatch<any>;
  loading: boolean;
}

interface ActivityListState {
  drawerConf: DrawerConfType;
  modalConf: TagModalConfType;
  currentTagList: TagListItemDataType[];
  currentTagConf: TagConfType[];
  current: number;
  pageSize: number;
  total: number;
  projectList: [];
}

class ActivityList extends Component<ActivityListProps, ActivityListState> {
  state: ActivityListState = {
    drawerConf: {
      visible: false,
    },
    modalConf: {
      visible: false,
    },
    currentTagList: [],
    currentTagConf: [],
    current: 1,
    pageSize: 10,
    total: 0,
    projectList: [],
  };

  constructor(props: ActivityListProps) {
    super(props);
  }
  getProjectList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/getProjectList',
    }).then((res: any) => {
      this.setState({
        projectList: res.data.list,
      });
    });
  }

  editForm(id: number) {
    const { dispatch } = this.props;

    //获取活动详情
    dispatch({
      type: 'activity/find',
      payload: {
        activity_id: id,
      },
    }).then((res: any) => {
      this.setState({
        currentTagConf: res.data.tag_conf,
      });
    });

    //获取基础指标库列表
    dispatch({
      type: 'tag/tagList',
    }).then((res: any) => {
      this.setState({
        currentTagList: [...res.data.list],
      });
    });

    this.setState({
      drawerConf: {
        visible: true,
        title: '编辑活动',
      },
    });
  }

  //取消编辑
  handleCancelEdit() {
    const { drawerConf } = this.state;

    this.setState({
      drawerConf: Object.assign({}, drawerConf, {
        visible: false,
      }),
    });
  }

  //保存编辑
  handleFinishEdit(values: any) {
    const { drawerConf } = this.state;
    const { dispatch } = this.props;

    this.setState({
      drawerConf: Object.assign({}, drawerConf, {
        visible: false,
      }),
    });
    if (this.props.activity.item.activity_id) {
      dispatch({
        type: 'activity/update',
        payload: {
          activity_id: this.props.activity.item.activity_id,
          ...values,
          start_date: moment(values.date[0]).valueOf(),
          end_date: moment(values.date[1]).valueOf(),
        },
      }).then((res: any) => {
        console.log(res);
      });
    } else {
      dispatch({
        type: 'activity/create',
        payload: {
          ...values,
          start_date: moment(values.date[0]).valueOf(),
          end_date: moment(values.date[1]).valueOf(),
        },
      }).then((res: any) => {
        console.log(res);
      });
    }
  }

  handleCreate() {
    const { drawerConf } = this.state;
    // dispatch ------- 获取标签
    this.props
      .dispatch({
        type: 'tag/tagList',
      })
      .then((res: any) => {
        this.setState({
          currentTagList: [...res.data.list],
        });
      });
    // 创建
    this.setState({
      drawerConf: {
        visible: true,
        title: '创建活动',
      },
    });
  }
  //使用基础指标
  handleUseBaseTag(values: any) {
    const { currentTagList } = this.state;
    const { tag_key, tag_name } = values;

    //往右边标签库里增加
    this.handleSubmitTag({ tag_key, tag_name }, () => {
      //查找当前标签索引
      const index = currentTagList.findIndex((x) => x.tag_key === tag_key);

      //从 currentTagList 中删除标签
      if (index !== -1) {
        currentTagList.splice(index, 1);
      }
      //重置当前 state
      this.setState({
        currentTagList,
      });
    });
  }

  //创建指标
  handleCreateTag() {
    this.setState({
      modalConf: {
        visible: true,
        title: '创建指标',
      },
    });
  }

  //保存添加的标签
  handleSubmitTag(values: any, callback?: () => void) {
    const { modalConf, currentTagConf } = this.state;

    //更新modal状态
    this.setState({
      modalConf: Object.assign({}, modalConf, {
        visible: false,
      }),
    });

    //检查该标签是否已存在
    if (arrayColumn(currentTagConf, 'tag_key').includes(values.tag_key)) {
      message.error('指标字段已存在，请使用其它字段!');
      return;
    }

    //重置标签列表
    this.setState(
      {
        currentTagConf: currentTagConf.concat(values),
      },
      () => {
        callback && callback();
      },
    );
  }

  //删除标签
  handleRemoveTag(values: any) {
    const {
      tag: { list: tagList },
    } = this.props;
    const { currentTagList, currentTagConf } = this.state;
    const { tag_key } = values;

    //返回符合条件的数据
    const index = currentTagConf.findIndex((x) => x.tag_key === tag_key);
    if (index !== -1) {
      currentTagConf.splice(index, 1);
    }

    //重置活动中的标签
    this.setState({
      currentTagConf,
    });

    //检查是否来源于currentTagList
    if (!arrayColumn(tagList, 'tag_key').includes(tag_key)) {
      return;
    }

    //返还标签到 currentTagList
    this.setState({
      currentTagList: currentTagList.concat(values),
    });
  }

  //取消添加标签
  handleCancelTag() {
    const { modalConf } = this.state;

    this.setState({
      modalConf: Object.assign({}, modalConf, {
        visible: false,
      }),
    });
  }

  //取消modal
  handleCancelModal() {
    const { modalConf } = this.state;

    this.setState({
      modalConf: Object.assign({}, modalConf, {
        visible: false,
      }),
    });
  }

  componentDidMount() {
    const {
      dispatch,
      tag: { list: tagList },
    } = this.props;

    this.getList();
    this.getProjectList();
  }
  getList = async (values: any = {}) => {
    const { dispatch } = this.props;
    //获取活动列表
    await dispatch({
      type: 'activity/fetchList',
      payload: values,
    }).then((res) => {
      this.setState({
        total: res.data.total,
      });
    });
  };
  handleSearch = (values: any) => {
    this.getList({
      filters: values,
    });
  };

  resetSearch = () => {
    this.getList();
  };

  componentWillReceiveProps(nextProps: any, nextContext: any) {
    // console.log('this.props-->',  (this.props));
    // console.log('nextProps-->', (nextProps));
    // console.log('nextContext-->', (nextContext));
  }

  handlePaginationChange = (page: number) => {
    this.setState({
      current: page,
    });
    this.getList({
      page,
    });
  };

  render() {
    const {
      activity: { list: activityList, item: currentActivity },
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

    const columns = [
      {
        title: 'ID',
        width: 60,
        dataIndex: 'activity_id',
        key: 'activity_id',
        fixed: 'left',
      },
      {
        title: '活动名称',
        width: 100,
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '活动指标',
        width: 100,
        dataIndex: 'tag_conf',
        key: 'tag_conf',
        render: (tag_conf: TagConfType[]) => (
          <>
            {tag_conf &&
              tag_conf.map((item, index) => {
                return (
                  <Tag color={tagColors[index]} key={index}>
                    {item.tag_name}
                  </Tag>
                );
              })}
          </>
        ),
      },
      // {
      //   title: '创建时间',
      //   dataIndex: 'created_at',
      //   key: 'created_at',
      //   width: 100,
      // },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        fixed: 'right',
        render: (row: ActivityListItemDataType) => (
          <>
            <a onClick={() => this.editForm(row.activity_id)}>编辑</a>
          </>
        ),
      },
    ];

    const {
      drawerConf,
      modalConf,
      currentTagList,
      currentTagConf,
      current,
      pageSize,
      total,
    } = this.state;

    const pagination = {
      current: current,
      pageSize: pageSize,
      total: total,
      onChange: this.handlePaginationChange,
    };
    return (
      <>
        <SearchBar
          handleSearch={this.handleSearch}
          resetSearch={this.resetSearch}
        />
        <Card
          title="活动列表"
          extra={
            <Button onClick={(e) => this.handleCreate(e)} type="primary">
              新建
            </Button>
          }
          style={{ marginTop: '20px' }}
        >
          <Table
            rowKey="activity_id"
            loading={loading}
            columns={columns}
            dataSource={activityList}
            pagination={pagination}
          />
          <EditForm
            drawerConf={drawerConf}
            tagListData={currentTagList}
            tagConfData={currentTagConf}
            current={currentActivity}
            projectList={this.state.projectList}
            handleFinishEdit={(e) => this.handleFinishEdit(e)}
            handleCancelEdit={() => this.handleCancelEdit()}
            handleUseBaseTag={(e) => this.handleUseBaseTag(e)}
            handleCreateTag={() => this.handleCreateTag()}
            handleRemoveTag={(e) => this.handleRemoveTag(e)}
            onFinishEdit={(e) => this.onFinishEdit(e)}
          />
          <TagModal
            modalConf={modalConf}
            handleCancel={() => this.handleCancelModal()}
            onFinish={(e) => this.handleSubmitTag(e)}
          ></TagModal>
        </Card>
      </>
    );
  }
}

export default connect(
  ({
    activity,
    tag,
    loading,
  }: {
    activity: ModalState;
    tag: TagModalState;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    activity,
    tag,
    loading: loading.models.activity,
  }),
)(ActivityList);
