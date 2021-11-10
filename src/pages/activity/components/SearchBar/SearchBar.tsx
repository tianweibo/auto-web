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

import moment from 'moment';

import styles from './style.less';

const fieldLabels = {
  title: '活动名称',
  activity_id: '活动ID',
};

const defaultFilters = {
  field: 'title',
  value: '',
};

interface SearchBarProps {
  handleSearch: (values: {}) => void;
  resetSearch: () => void;
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
            <Dropdown
              overlay={
                <Menu onClick={handleFieldChange}>
                  <Menu.Item key="title">{fieldLabels.title}</Menu.Item>
                  <Menu.Item key="activity_id">
                    {fieldLabels.activity_id}
                  </Menu.Item>
                </Menu>
              }
            >
              <Button>
                {fieldLabels[filters.field]} <DownOutlined />
              </Button>
            </Dropdown>

            <Input value={filters.value} onChange={projNameChange} />

            <Button type="primary" onClick={handleSubmit}>
              搜索
            </Button>
            <Button type="default" onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form>
      </Card>
    </>
  );
};

export default SearchBar;
