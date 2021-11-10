import React, { useState, useEffect, Component } from 'react';
import { Select } from 'antd';
import { requireProList } from '../../pages/user/service';
const { Option } = Select;
export default class ProductLine extends Component {
  state = {
    productList: [],
    infoRole: 1,
  };
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(nextProps) {}
  getProdList = async () => {
    var res = await requireProList();
    if (res?.status == 0) {
      this.setState({ productList: res.data });
    }
  };
  onSelect = (selectedKeys) => {
    this.props.handSelect(selectedKeys);
  };
  componentDidMount() {
    var sj = JSON.parse(localStorage.getItem('info'));
    this.setState({ infoRole: sj.role });
    if (sj.role == 10) {
      this.getProdList();
    }
  }
  render() {
    const { productList, infoRole } = this.state;
    if (infoRole == 1) {
      return null;
    }
    return (
      <>
        所属产品线：
        <Select
          allowClear={true}
          placeholder="请选择所属产品线"
          options={productList}
          onChange={this.onSelect}
        ></Select>
      </>
    );
  }
}
