import React, { Component, useState } from 'react';
import { Input } from 'antd';
const { TextArea } = Input;
import styles from './style.less';
import { downloadData } from '../application/service';
class SeeCode extends Component {
  state = {
    theData: '',
  };
  componentWillUnmount() {}
  getUrlKeyValue = (key: string) => {
    var url = window.location.search;
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
    var r = url.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
  };
  requireData = async () => {
    var id = this.getUrlKeyValue('app_id');
    var res: any = await downloadData(id, false);
    this.setState({
      theData: res.data,
    });
  };
  componentDidMount() {
    this.requireData();
  }
  render() {
    return (
      <>
        <TextArea value={this.state.theData} style={{ height: '100%' }} />
      </>
    );
  }
}
export default SeeCode;
