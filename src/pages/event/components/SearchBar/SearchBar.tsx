import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';
import ProductSelect from '../../../../components/productSelect/index.jsx';
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
  Cascader,
} from 'antd';
const { Option } = Select;
const { Search } = Input;

import moment from 'moment';

import { ArrayColumn, OptionColumn } from '../../data.d';

import styles from './style.less';

const fieldLabels = {
  event_name: '事件名称',
  event_id: '事件ID',
};

const defaultFilters = {
  event_label: '',
  event_trigger_mode: '',
  keyword: '',
};
interface SearchBarProps {
  tags: [OptionColumn];
  triggerTypes: [OptionColumn];
  handleSearch: (values: {}) => void;
  resetSearch: () => void;
  handleCreate: () => void;
  handleCreateMany: () => void;
}

const SearchBar: FC<SearchBarProps> = (props) => {
  const {
    handleSearch,
    resetSearch,
    handleCreate,
    handleCreateMany,
    triggerTypes,
    tags,
  } = props;
  const [filters, setFilters] =
    useState<{ [key: string]: any }>(defaultFilters);
  const handleFieldChange = (e: any) => {
    var str = e.length > 0 ? e[0] : '';
    setFilters(
      Object.assign({}, filters, {
        event_trigger_mode: str,
      }),
    );
    const values = {
      event_label: filters.event_label,
      event_trigger_mode: str,
      keyword: filters.keyword,
    };
    handleSearch(values);
  };
  const selectTag = (e: any) => {
    var str = e.length == 2 ? e[1] : '';
    setFilters(
      Object.assign({}, filters, {
        event_label: str,
      }),
    );
    const values = {
      event_label: str,
      event_trigger_mode: filters.event_trigger_mode,
      keyword: filters.keyword,
    };
    handleSearch(values);
  };

  const handleSubmit = (e: any) => {
    setFilters(
      Object.assign({}, filters, {
        keyword: e,
      }),
    );
    const values = {
      event_label: filters.event_label,
      event_trigger_mode: filters.event_trigger_mode,
      keyword: e,
    };
    handleSearch(values);
  };
  const handSelect = (val: any) => {
    setFilters(
      Object.assign({}, filters, {
        product_line_id: val,
      }),
    );
    const values = {
      event_label: filters.event_label,
      event_trigger_mode: filters.event_trigger_mode,
      keyword: filters.keyword,
      product_line_id: val,
    };
    handleSearch(values);
  };
  const treeProps = {
    handSelect: handSelect,
  };
  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            标签:
            <Cascader
              options={tags}
              onChange={selectTag}
              fieldNames={{
                label: 'title',
                value: 'key',
                children: 'children',
              }}
              placeholder="请选择"
            ></Cascader>
            触发类型:
            <Cascader
              options={triggerTypes}
              placeholder="请选择"
              onChange={handleFieldChange}
            ></Cascader>
            <ProductSelect {...treeProps} />
            <Search
              placeholder="事件/事件代码"
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
