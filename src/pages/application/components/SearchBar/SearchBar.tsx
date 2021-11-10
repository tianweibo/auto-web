import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';
import {
  Space,
  Card,
  Form,
  Input,
  Button,
  Select,
  Menu,
  Dropdown,
  message,
  Cascader,
  Tooltip,
} from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { basicData, getLabelTree } from '../../service';
import ProductSelect from '../../../../components/productSelect/index.jsx';
const { Option } = Select;

const { Search } = Input;

import moment from 'moment';

import styles from './style.less';

const defaultFilters = {
  keyword: '',
  pageNo: 1,
  pageSize: 10,
  application_label: '',
  platform_business: '',
  is_interactive: '1',
};

interface SearchBarProps {
  handleSearch: (values: {}) => void;
  resetSearch: () => void;
  handleCreate?: () => void;
  handleCreateMany?: () => void;
}

const SearchBar: FC<SearchBarProps> = (props) => {
  const { handleSearch, resetSearch, handleCreate, handleCreateMany } = props;

  const [filters, setFilters] =
    useState<{ [key: string]: any }>(defaultFilters);
  const [labelList, setLabelList] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [platformList, setPlatformList] = useState<
    Array<{ key: string; value: string }>
  >([]);

  const plateChange = (e: any) => {
    if (e) {
      filters.platform_business = e;
    } else {
      filters.platform_business = '';
    }
    handleSearch(filters);
  };
  const labelChange = (e: any) => {
    if (e.length == 2) {
      filters.application_label = e[1];
    } else {
      filters.application_label = '';
    }
    handleSearch(filters);
  };
  const isChange = (e: any) => {
    filters.is_interactive = e;
    handleSearch(filters);
  };
  const handleSubmit = (e: any) => {
    filters.keyword = e;
    handleSearch(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    resetSearch();
  };
  const getBasicData = async (id: string) => {
    const res: any = await basicData(id);
    if (id == 'platform_business') {
      setPlatformList(res.data);
    }
    const res1: any = await getLabelTree({ id: 4 });
    let arr = res1.data.arr;
    arr = arr.map((ele) => {
      ele.disabled = false;
      return ele;
    });
    setLabelList(arr);
  };
  const handSelect = (val: any) => {
    if (val) {
      filters.product_line_id = val;
    } else {
      filters.product_line_id = null;
    }
    handleSearch(filters);
  };
  const treeProps = {
    handSelect: handSelect,
  };
  useEffect(() => {
    getBasicData('platform_business');
  }, []);
  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            标签:
            <Cascader
              placeholder="请选择"
              style={{ width: 120 }}
              onChange={labelChange}
              fieldNames={{
                label: 'title',
                value: 'key',
                children: 'children',
              }}
              options={labelList}
            />
            是否互动:
            <Select defaultValue="1" style={{ width: 120 }} onChange={isChange}>
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
            应用平台
            <Select
              placeholder="请选择"
              style={{ width: 120 }}
              allowClear={true}
              onChange={plateChange}
              options={platformList}
            ></Select>
            <ProductSelect {...treeProps} />
            <Search
              placeholder="应用名称"
              onSearch={handleSubmit}
              style={{ width: 200 }}
            />
          </Space>
        </div>
      </Card>
    </>
  );
};

export default SearchBar;
