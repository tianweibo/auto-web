import React, { useState, useEffect, Component } from 'react';
import {
  Card,
  Space,
  Modal,
  message,
  Button,
  Table,
  Menu,
  Dropdown,
  Input,
  Col,
  Tree,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import EditForm from './components/EditForm/EditForm';
import DetailForm from './components/detailForm';
import SearchBar from './components/SearchBar/SearchBar';
import {
  basicData,
  deleteUser,
  getUserList,
  usefulUser,
  resetPassword,
  giveData,
} from './service';

class UserList extends Component {
  //定义 state

  state = {
    userId: '',
    newUsername: '',
    oldUsername: '',
    oldProduct: '',
    userList: [],
    isDrawer: false,
    drawerConf: {
      visible: false,
    },
    isModalVisible: false,
    total: 0,
    page: 1,
    page_size: 10,
    searchObject: {
      keyword: '',
      pageNo: 1,
      pageSize: 10,
      role: 1,
      product_line_id: null,
    },
  };

  createReport() {}

  resetSearch() {}
  getBasicData = async (id: string) => {
    const res = await basicData(id);
  };
  requireUserList = async (params: {}) => {
    const res: any = await getUserList(params);
    if (res.status == 0) {
      this.setState({
        userList: res.data.arr,
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
    this.requireUserList(val);
  };
  handleCreate = async () => {
    this.setState({
      drawerConf: {
        visible: true,
        title: '创建用户',
      },
    });
  };
  handleEdit = async (data: any) => {
    this.setState({
      drawerConf: {
        visible: true,
        data: data,
        title: '编辑用户',
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
  stopUser = async (id: string) => {
    var res: any = {};
    res = await usefulUser(id);
    if (res?.status === 0) {
      this.setState({
        page: 1,
        page_size: 10,
      });
      var obj = {
        keyword: '',
        pageNo: 1,
        pageSize: 10,
        role: this.state.searchObject.role,
        product_line_id: this.state.searchObject.product_line_id,
      };
      this.requireUserList(obj);
      message.success(res.msg || '停用成功');
    }
  };
  setPassword = async (id: string) => {
    var res: any = {};
    res = await resetPassword(id);
    if (res?.status === 0) {
      this.setState({
        page: 1,
        page_size: 10,
      });
      var obj = {
        keyword: '',
        pageNo: 1,
        pageSize: 10,
        role: this.state.searchObject.role,
        product_line_id: this.state.searchObject.product_line_id,
      };
      this.requireUserList(obj);
      message.success(res.msg || '还原成功');
    }
  };
  handleDelete = async (id: string) => {
    var res: any = {};
    res = await deleteUser(id);
    if (res?.status === 0) {
      this.setState({
        page: 1,
        page_size: 10,
      });
      var obj = {
        keyword: '',
        pageNo: 1,
        pageSize: 10,
        role: 1,
        product_line_id: null,
      };
      this.requireUserList(obj);
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
      role: this.state.searchObject.role,
      product_line_id: this.state.searchObject.product_line_id,
    };
    this.requireUserList(obj);
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
      role: 1,
      product_line_id: null,
    };
    this.requireUserList(obj);
  };
  editList = () => {
    var obj = {
      keyword: this.state.searchObject.keyword,
      pageNo: this.state.page,
      pageSize: this.state.page_size,
      role: this.state.searchObject.role,
      product_line_id: this.state.searchObject.product_line_id,
    };
    this.requireUserList(obj);
  };
  clickMenu = (e: any, data: any) => {
    switch (e.key) {
      case 'tyyh':
        this.stopUser(data.id);
        break;
      case 'scyh':
        this.deleteData(data.id);
        break;
      case 'mmhy':
        this.setPassword(data.id);
        break;
      case 'sjzy':
        this.setState({
          isModalVisible: true,
          oldUsername: data.username,
          oldProduct: data.product_line_id,
        });
        break;
      default:
        break;
    }
  };
  seeData = (data: any) => {
    this.setState({ isDrawer: true, userId: data });
  };
  handleDrawerVisible = () => {
    this.setState({ isDrawer: false, userId: '' });
  };
  handleOk = async () => {
    var obj = {
      newUsername: this.state.newUsername,
      oldUsername: this.state.oldUsername,
      oldProduct: this.state.oldProduct,
    };
    var res: any = await giveData(obj);
    if (res?.status == 0) {
      message.success(res.msg);
      this.setState({ newUsername: '' });
    }
    this.setState({ isModalVisible: false });
  };
  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };
  setUsername(e: any) {
    this.setState({ newUsername: e.target.value });
  }
  componentDidMount() {
    //this.getBasicData('platform_system');
    var obj = {
      keyword: '',
      pageNo: 1,
      pageSize: 10,
      role: 1,
      product_line_id: null,
    };
    this.requireUserList(obj);
    if (localStorage.getItem('app')) {
      this.seeData(localStorage.getItem('app'));
      localStorage.removeItem('app');
    }
  }
  menuItem = (record: any) => {
    return (
      <Menu onClick={(params) => this.clickMenu(params, record)}>
        <Menu.Item key="tyyh">
          {record.user_use == 1 ? '停用用户' : '启用用户'}
        </Menu.Item>
        <Menu.Item key="scyh">删除用户</Menu.Item>
        <Menu.Item key="sjzy">数据赠予</Menu.Item>
        <Menu.Item key="mmhy">密码还原</Menu.Item>
      </Menu>
    );
  };
  render() {
    const { drawerConf, isDrawer, userId } = this.state;
    const columns: any = [
      {
        title: '用户名',
        width: 150,
        dataIndex: 'username',
        fixed: 'left',
      },
      {
        title: '真实名',
        width: 100,
        dataIndex: 'realname',
        key: 'realname',
      },
      {
        title: '所属产品线',
        width: 120,
        key: 'product_line_name',
        dataIndex: 'product_line_name',
      },
      {
        title: '角色',
        width: 60,
        key: 'role',
        dataIndex: 'role',
        render: (text: string) => {
          if (text == '1') {
            return '普通用户';
          } else {
            return '管理员';
          }
        },
      },
      {
        title: '状态',
        dataIndex: 'user_use',
        key: 'user_use',
        width: 60,
        render: (text: string) => {
          if (text == '1') {
            return '启用';
          } else {
            return '停用';
          }
        },
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        width: 120,
      },
      {
        title: '创建日期',
        dataIndex: 'create_time',
        key: 'create_time',
        width: 100,
      },
      {
        title: '创建人',
        dataIndex: 'create_people',
        key: 'create_people',
        width: 120,
      },
      {
        title: '操作',
        key: 'operation',
        width: 80,
        fixed: 'right',
        render: (row: any, record: any) => (
          <>
            <Space>
              <Button
                size="small"
                type="text"
                style={{ color: '#1890ff' }}
                onClick={() => this.handleEdit(record)}
              >
                编辑
              </Button>
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
      rowKey: 'user_id',
      columns: columns,
      dataSource: this.state.userList,
      scroll: { x: 1500, y: 500 },
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
        <Modal
          title="数据赠予"
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input
            placeholder="请输入用户名"
            onChange={(e) => this.setUsername(e)}
          />
        </Modal>
        <SearchBar {...searchProps} />
        <Card
          title="用户列表"
          extra={
            <Button type="primary" onClick={this.handleCreate}>
              新建
            </Button>
          }
          style={{ marginTop: '20px' }}
        >
          <Table {...tableProps} />
          {this.state.drawerConf.visible && <EditForm {...formProps} />}
          {/* {this.state.isDrawer && <DetailForm userId={userId} handleDrawerVisible={this.handleDrawerVisible}/>} */}
        </Card>
      </>
    );
  }
}

export default UserList;
