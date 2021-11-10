import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';
import ProductSelect from '../../../../components/productSelect/index.jsx';
import {
  Space,
  Card,
  Input,
  Select,
  Menu,
  Dropdown,
  message,
  Cascader,
  Tooltip,
} from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { basicData, getLabelTree } from '../../service';
const { Option } = Select;

const { Search } = Input;

import moment from 'moment';

import styles from './style.less';

const defaultFilters = {
  keyword: '',
  pageNo: 1,
  pageSize: 10,
  indicator_label: '',
  indicator_type: '',
};

interface SearchBarProps {
  handleSearch: (values: {}) => void;
  resetSearch: () => void;
  handleCreate?: () => void;
  handleCreateMany?: () => void;
}

const SearchBar: FC<SearchBarProps> = (props) => {
  const { handleSearch, resetSearch } = props;

  const [filters, setFilters] =
    useState<{ [key: string]: any }>(defaultFilters);
  const [labelList, setLabelList] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [typeList, setTypeList] = useState<
    Array<{ key: string; value: string }>
  >([]);

  const typeChange = (e: any) => {
    if (e) {
      filters.indicator_type = e;
    } else {
      filters.indicator_type = '';
    }
    handleSearch(filters);
  };
  const labelChange = (e: any) => {
    if (e.length == 2) {
      filters.indicator_label = e[1];
    } else {
      filters.indicator_label = '';
    }
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
    if (id == 'indicator_type_level') {
      setTypeList(res.data);
    }
    const res1: any = await getLabelTree({ id: 1 });
    let arr = res1.data.arr;
    arr = arr.map((ele) => {
      ele.disabled = false;
      return ele;
    });
    setLabelList(arr);
  };
  useEffect(() => {
    getBasicData('indicator_type_level');
  }, []);
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            指标类型:
            <Select
              placeholder="请选择"
              style={{ width: 120 }}
              allowClear={true}
              onChange={typeChange}
              options={typeList}
            ></Select>
            指标标签:
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
            <ProductSelect {...treeProps} />
            <Search
              placeholder="指标名称/指标代码"
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
