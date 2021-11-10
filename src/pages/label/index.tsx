import React, { useState, useEffect, Component } from 'react';
import {
  Card,
  Space,
  Modal,
  Col,
  message,
  Button,
  Form,
  Input,
  Select,
  Cascader,
  Table,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
const { Option } = Select;
import { history } from 'umi';
import SearchBar from './components/SearchBar/SearchBar';
import {
  deleteLabel,
  getLabelList,
  addLabel,
  editLabel,
  getFLabels,
  getFuid,
} from './service';
class LabelList extends Component {
  //定义 state
  state = {
    labelId: '',
    labelList: [],
    selectList: [],
    fidList: [],
    isDrawer: false,
    drawerConf: {
      visible: false,
      title: '创建标签',
    },
    total: 0,
    page: 1,
    page_size: 10,
    fname: '',
    fuid: null,
    isfu: null,
    searchObject: {
      keyword: '',
      pageNo: 1,
      pageSize: 10,
      fid: '',
    },
  };
  formRef = React.createRef<FormInstance>();
  requireLabelList = async (params: {}) => {
    const res: any = await getLabelList(params);
    if (res.status == 0) {
      this.setState({
        labelList: res.data.arr,
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
    this.requireLabelList(val);
  };
  handleCreate = async () => {
    if (this.formRef && this.formRef.current) {
      this.formRef.current!.setFieldsValue({ label: [] });
      this.formRef.current!.setFieldsValue({ fuid: '' });
      this.formRef.current!.setFieldsValue({ fname: '' });
      this.formRef.current!.setFieldsValue({ isfu: null });
      this.formRef.current!.setFieldsValue({ labelList: '' });
    }
    this.setState({
      drawerConf: {
        visible: true,
        title: '创建标签',
      },
    });
  };
  handleEdit = async (data: any) => {
    Modal.confirm({
      title: `请注意:编辑后，所有使用了此标签的地方将同时改变`,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.toEdit(data),
    });
  };
  toEdit = async (data: any) => {
    this.setState(
      {
        drawerConf: {
          visible: true,
          title: '编辑标签',
        },
      },
      async () => {
        //let arr=this.treeConvertToArr(this.state.labelList,data.fid);
        //let arr=  返回结果为null或者0均只取一个数组
        var arr = [data.fid];
        let res = await getFuid(data.fid);
        if (res && res.data && res.data.fid) {
          arr.unshift(res.data.fid);
        }
        console.log(arr);
        this.formRef.current!.setFieldsValue({ label: arr });
        this.formRef.current!.setFieldsValue({ id: data.id });
        this.formRef.current!.setFieldsValue({ labelList: data.label });
      },
    );
  };
  treeConvertToArr = (tree: any, value: any) => {
    if (value == 0) {
      return [0];
    }
    let arrs: any = [];
    let result = [];
    arrs = arrs.concat(tree);
    while (arrs.length) {
      let first = arrs.shift(); // 弹出第一个元素
      if (first.children) {
        arrs = arrs.concat(first.children);
        delete first['children'];
      }
      result.push(first);
    }
    let arr = result.filter((ele) => ele.id === value);
    if (arr[0].fid == 0) {
      var temp = [arr[0].id];
    } else {
      var temp = [arr[0].fid, arr[0].id];
    }
    return temp;
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
  handleDelete = async (id: string) => {
    var res: any = {};
    res = await deleteLabel(id);
    if (res?.status === 0) {
      this.setState({
        page: 1,
        page_size: 10,
      });
      var obj = {
        keyword: '',
        pageNo: 1,
        pageSize: 10,
        fid: '',
      };
      this.requireLabelList(obj);
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
      fid: this.state.searchObject.fid,
    };
    this.requireLabelList(obj);
  };
  handleDrawerVisible = () => {
    this.setState({ isDrawer: false, labelId: '' });
  };
  getFidList = async () => {
    const res: any = await getFLabels();
    if (res.status == 0) {
      let arr = res.data;
      arr = arr.filter((ele) => ele.children.length != 0); //无子级的不展示
      this.setState({ fidList: arr });
      let arr1 = JSON.parse(JSON.stringify(res.data));

      arr1.unshift({ fid: 0, key: 0, title: '创建父标签', children: [] });
      this.setState({ selectList: arr1 });
    }
  };
  componentDidMount() {
    var obj = {
      keyword: '',
      pageNo: 1,
      pageSize: 10,
      fid: '',
    };
    this.requireLabelList(obj);
    this.getFidList();
  }
  handleOk = () => {
    this.formRef.current!.submit();
  };
  changLabelType = (e: any, v: any) => {
    if (v.length == 1) {
      if (v[0].title == '创建父标签') {
        this.setState({
          fname: '标签',
          fuid: 0,
          isfu: 1,
        });
      } else {
        this.setState({
          fname: v[0].title,
          fuid: v[0].key,
          isfu: 1,
        });
      }
    } else if (v.length == 2) {
      this.setState({
        fname: v[1].title,
        fuid: v[1].key,
        isfu: 0,
      });
    }
  };
  createLabel = async (values) => {
    values['fname'] = this.state.fname;
    values['fuid'] = this.state.fuid;
    values['isfu'] = this.state.isfu;
    var res = await addLabel(values);
    if (res?.status === 0) {
      message.success(res.msg || '创建成功');
      if (this.state.isfu == 1) {
        this.getFidList();
      }
      this.setState({
        drawerConf: {
          visible: false,
          page: 1,
          page_size: 10,
        },
      });
      var obj = {
        keyword: '',
        pageNo: 1,
        pageSize: 10,
        fid: '',
      };
      this.requireLabelList(obj);
    }
  };
  editLabel1 = async (values: any) => {
    var temp = {
      id: this.formRef.current!.getFieldValue('id'),
      label: values.labelList,
    };
    var res = await editLabel(temp);
    if (res?.status === 0) {
      message.success(res.msg || '编辑成功');
      this.getFidList();
      this.setState({
        drawerConf: {
          visible: false,
        },
      });
      var obj = {
        keyword: this.state.searchObject.keyword,
        pageNo: this.state.page,
        pageSize: this.state.page_size,
        fid: this.state.searchObject.fid,
      };
      this.requireLabelList(obj);
    }
  };
  onFinish = async (values: any) => {
    if (this.state.drawerConf.title == '创建标签') {
      this.createLabel(values);
    } else {
      this.editLabel1(values);
    }
  };
  handleCancel = () => {
    this.setState({
      drawerConf: {
        visible: false,
      },
    });
  };
  render() {
    const { drawerConf, isDrawer, labelId } = this.state;
    const columns: any = [
      {
        title: '标签',
        width: 150,
        dataIndex: 'label',
        key: 'label',
        fixed: 'left',
      },
      {
        title: '父标签',
        width: 150,
        dataIndex: 'fname',
        key: 'fname',
      },

      {
        title: '标签使用数',
        dataIndex: 'number',
        key: 'number',
        width: 120,
        render: (row: any, record: any) => {
          if (record.is_lower == 0) {
            return '父级标签';
          } else {
            return record.number;
          }
        },
      },

      {
        title: '创建人',
        dataIndex: 'create_people',
        key: 'create_people',
        width: 120,
      },
      {
        title: '更新人',
        dataIndex: 'update_people',
        key: 'update_people',
        width: 120,
        render: (row: any, record: any) => {
          if (!record.update_people) {
            return '-';
          } else {
            return record.update_people;
          }
        },
      },

      {
        title: '最后更新日期',
        dataIndex: 'update_time',
        key: 'update_time',
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
              <Button
                size="small"
                type="text"
                style={{ color: '#1890ff' }}
                onClick={() => this.deleteData(record.id)}
              >
                删除
              </Button>
            </Space>
          </>
        ),
      },
    ];
    const tableProps = {
      rowKey: 'user_id',
      columns: columns,
      dataSource: this.state.labelList,
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

    const searchProps = {
      handleSearch: this.handleSearch,
      resetSearch: this.resetSearch,
      fidList: this.state.fidList,
    };

    return (
      <>
        <Modal
          title={drawerConf.title}
          visible={drawerConf.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form
            name="basic"
            ref={this.formRef}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            //onFinishFailed={onFinishFailed}
          >
            <Form.Item name="label" label="父标签">
              {/* <Select
                  placeholder="请选择标签类别"
                  onChange={this.changLabelType}
                  disabled={drawerConf.title=='编辑标签'}
                  allowClear={true}>
                    {this.state.selectList.map(item => (
                    <Option key={item.id} value={item.id}>{item.label}</Option>
                  ))}
                  </Select> */}
              <Cascader
                options={this.state.selectList}
                fieldNames={{
                  label: 'title',
                  value: 'key',
                  children: 'children',
                }}
                onChange={this.changLabelType}
                placeholder="请选择"
                disabled={drawerConf.title == '编辑标签'}
                changeOnSelect
              ></Cascader>
            </Form.Item>
            <Form.Item
              label="标签"
              name="labelList"
              rules={[{ required: true, message: '标签不能为空' }]}
            >
              <Input placeholder="如创建多个标签请以逗号分隔" />
            </Form.Item>
          </Form>
        </Modal>
        <SearchBar {...searchProps} />
        <Card
          title="标签列表"
          extra={
            <Button type="primary" onClick={this.handleCreate}>
              新建
            </Button>
          }
          style={{ marginTop: '20px' }}
        >
          <Table {...tableProps} />
        </Card>
      </>
    );
  }
}

export default LabelList;
