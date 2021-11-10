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
  Cascader,
  Menu,
  Dropdown,
  message,
  Tooltip,
} from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

import moment from 'moment';

import { Report, BasicData } from '../../data.d';

import styles from './style.less';

const Search = Input.Search;

const fieldLabels = {
  title: '报表名称',
  report_id: '报表ID',
};
// export interface Report extends Record<string, any> {
//   report_id: number;
//   report_name: string;
//   platform_app: string;
//   application_id: number;
//   application_label: string;
//   application_dep_platform: string;
//   create_time: string;
// }
const defaultFilters = {
  application_label: '',
  application_dep_platform: '',
  application_keyword: '',
  report_keyword: '',
  pageNo: 1,
  pageSize: 10,
};

interface SearchBarProps {
  onCreateReport: () => void;
  handleSearch: (values: {}) => void;
  resetSearch: () => void;
  appLabelList: Array<BasicData>;
  applicationDepPlatformList: Array<BasicData>;
}

const SearchBar: FC<SearchBarProps> = (props) => {
  const {
    handleSearch,
    resetSearch,
    onCreateReport,
    appLabelList,
    applicationDepPlatformList,
  } = props;

  const [filters, setFilters] = useState<Partial<Report>>(defaultFilters);

  const handleFieldChange = (e: any) => {
    setFilters(
      Object.assign({}, filters, {
        field: e.key,
      }),
    );
  };

  const fieldValueChange = (e: any) => {
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
  const labelChange = (e: any) => {
    if (e.length == 2) {
      filters.application_label = e[1];
    } else {
      filters.application_label = '';
    }
    handleSearch(filters);
  };
  const devPlatChange = (e: any) => {
    if (e) {
      filters.application_dep_platform = e;
    } else {
      filters.application_dep_platform = '';
    }
    handleSearch(filters);
  };
  const applicationKeyword = (e: any) => {
    filters.application_keyword = e;
    handleSearch(filters);
  };
  const reportKeyword = (e: any) => {
    filters.report_keyword = e;
    handleSearch(filters);
  };
  const handSelect = (val: any) => {
    if (val) {
      filters.product_line_id = val;
    } else {
      filters.product_line_id = '';
    }
    handleSearch(filters);
  };
  const treeProps = {
    handSelect: handSelect,
  };
  return (
    <>
      <Card>
        <Form layout="inline">
          <Space>
            应用标签:
            <Cascader
              placeholder="请选择"
              style={{ width: 120 }}
              onChange={labelChange}
              fieldNames={{
                label: 'title',
                value: 'key',
                children: 'children',
              }}
              options={appLabelList}
            />
            应用部署平台:
            <Select
              placeholder="请选择"
              style={{ width: 120 }}
              allowClear={true}
              onChange={devPlatChange}
            >
              {applicationDepPlatformList.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
            <ProductSelect {...treeProps} />
            <Search
              placeholder="应用名称/ID"
              onSearch={applicationKeyword}
              style={{ width: 200 }}
            />
            <Search
              placeholder="报表名称/ID"
              onSearch={reportKeyword}
              style={{ width: 200 }}
            />
          </Space>
        </Form>
      </Card>
    </>
  );
};

export default SearchBar;
