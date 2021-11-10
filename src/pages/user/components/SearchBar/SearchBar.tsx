import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';
import ProductSelect from '../../../../components/productSelect/index.jsx';
import { Space, Card, Input, Select, Cascader } from 'antd';
import { basicData } from '../../service';
const { Option } = Select;
const { Search } = Input;
const defaultFilters = {
  keyword: '',
  pageNo: 1,
  pageSize: 10,
  role: 1,
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
    filters.role = e;
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
    } else if (id == 'app_label') {
      setLabelList(res.data);
    }
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
  useEffect(() => {
    getBasicData('platform_business');
    getBasicData('app_label');
  }, []);
  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            角色:
            <Select defaultValue="1" style={{ width: 120 }} onChange={isChange}>
              <Option value="10">管理员</Option>
              <Option value="1">普通用户</Option>
            </Select>
            <ProductSelect {...treeProps} />
            <Search
              placeholder="用户名称"
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
