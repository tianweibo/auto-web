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
  Tooltip,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import EditForm from './components/EditForm/EditForm';
import SearchBar from './components/SearchBar/SearchBar';
import {
  getProductLineList,
  usefulproductLine,
  deleteproductLine,
} from './service';

class ProductList extends Component {
  //定义 state
  state = {
    productId: '',
    productList: [],
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
    },
  };
  requireProductList = async (params: {}) => {
    const res: any = await getProductLineList(params);
    if (res.status == 0) {
      this.setState({
        productList: res.data.arr,
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
    this.requireProductList(val);
  };
  handleCreate = async () => {
    this.setState({
      drawerConf: {
        visible: true,
        title: '创建产品线',
      },
    });
  };
  handleEdit = async (data: any) => {
    this.setState({
      drawerConf: {
        visible: true,
        data: data,
        title: '编辑产品线',
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
  stopProduct = async (id: string) => {
    var res: any = {};
    res = await usefulproductLine(id);
    if (res?.status === 0) {
      this.setState({
        page: 1,
        page_size: 10,
      });
      var obj = {
        keyword: '',
        pageNo: 1,
        pageSize: 10,
      };
      this.requireProductList(obj);
      message.success(res.msg || '停用成功');
    }
  };
  handleDelete = async (id: string) => {
    var res: any = {};
    res = await deleteproductLine(id);
    if (res?.status === 0) {
      this.setState({
        page: 1,
        page_size: 10,
      });
      var obj = {
        keyword: '',
        pageNo: 1,
        pageSize: 10,
      };
      this.requireProductList(obj);
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
    };
    this.requireProductList(obj);
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
    };
    this.requireProductList(obj);
  };
  editList = () => {
    var obj = {
      keyword: this.state.searchObject.keyword,
      pageNo: this.state.page,
      pageSize: this.state.page_size,
    };
    this.requireProductList(obj);
  };
  clickMenu = (e: any, data: any) => {
    switch (e.key) {
      case 'tyyh':
        this.stopProduct(data.id);
        break;
      case 'scyh':
        this.deleteData(data.id);
        break;
      default:
        break;
    }
  };

  componentDidMount() {
    var obj = {
      keyword: '',
      pageNo: 1,
      pageSize: 10,
    };
    this.requireProductList(obj);
  }
  menuItem = (record: any) => {
    return (
      <Menu onClick={(params) => this.clickMenu(params, record)}>
        <Menu.Item key="tyyh">
          {record.product_use == 1 ? '停用产品线' : '启用产品线'}
        </Menu.Item>
        <Menu.Item key="scyh">删除产品线</Menu.Item>
      </Menu>
    );
  };
  render() {
    const { drawerConf, productId } = this.state;
    const columns: any = [
      {
        title: '产品线名称',
        width: 150,
        dataIndex: 'productname',
        fixed: 'left',
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
        width: 80,
      },
      {
        title: '状态',
        dataIndex: 'product_use',
        key: 'product_use',
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
        title: '备注说明',
        dataIndex: 'remark',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (remark) => (
          <Tooltip placement="topLeft" title={remark}>
            {remark}
          </Tooltip>
        ),
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
      rowKey: 'id',
      columns: columns,
      dataSource: this.state.productList,
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
        <SearchBar {...searchProps} />
        <Card
          title="产品线列表"
          extra={
            <Button type="primary" onClick={this.handleCreate}>
              新建
            </Button>
          }
          style={{ marginTop: '20px' }}
        >
          <Table {...tableProps} />
          {this.state.drawerConf.visible && <EditForm {...formProps} />}
        </Card>
      </>
    );
  }
}

export default ProductList;
