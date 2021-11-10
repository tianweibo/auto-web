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
  Tooltip,
} from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const { Search } = Input;

import moment from 'moment';

import { OptionColumn } from '../../data.d';

import styles from './style.less';

const fieldLabels = {
  attribute_name: '属性标签',
  attribute_id: '数据类型',
};

const defaultFilters = {
  field: 'attribute_name',
  value: '',
};

const dataTypeList = ['String', 'Int', 'Double', 'Float', 'Boolean'];
interface SearchBarProps {
  handleSearch: (values: {}) => void;
  resetSearch: () => void;
  attributeTypes: [OptionColumn];
}

const SearchBar: FC<SearchBarProps> = (props) => {
  const { handleSearch, resetSearch } = props;

  const [filters, setFilters] = useState<{ [key: string]: any }>(
    defaultFilters,
  );

  const handleFieldChange = (e: any) => {
    setFilters(
      Object.assign({}, filters, {
        field: e.key,
      }),
    );
  };

  const projNameChange = (e: any) => {
    setFilters(
      Object.assign({}, filters, {
        value: e.target.value.trim(),
      }),
    );
  };
  const handleChange = (e: any) => {
    console.log(e);
  };
  const handleSubmit = () => {
    const values = {
      [filters.field]: filters.value,
    };
    handleSearch(values);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    resetSearch();
  };

  return (
    <>
      <Card>
        <Form layout="inline">
          <Space>
            属性标签：
            <Select style={{ width: 120 }} onChange={handleChange}></Select>
            数据类型
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              onChange={handleChange}
            >
              {dataTypeList.map((item) => (
                <Option value={item}>{item}</Option>
              ))}
            </Select>
            <Search
              placeholder="属性/属性代码"
              onSearch={handleSubmit}
              style={{ width: 200 }}
            />
          </Space>
        </Form>
      </Card>
    </>
  );
};

export default SearchBar;
