import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';
import {
  Space,
  Card,
  Input,
  Select,
  Cascader
} from 'antd';
const { Option } = Select;
const { Search } = Input;
const defaultFilters = {
  keyword:'',
  pageNo:1,
  pageSize:10,
  fid:''
};
interface SearchBarProps {
  handleSearch: (values: {}) => void;
  resetSearch: () => void;
  handleCreate?: () => void;
  handleCreateMany?: () => void;
}
const SearchBar: FC<SearchBarProps> = (props) => {
  const { handleSearch, resetSearch,fidList} = props;

  const [filters, setFilters] = useState<{ [key: string]: any }>(
    defaultFilters,
  );
  const isChange = (e: any) => {
    filters.fid=e?e:'';
    handleSearch(filters)
  };
  const handleSubmit = (e: any) => {
    filters.keyword=e;
    handleSearch(filters)
  };
 
  const handleReset = () => {
    setFilters(defaultFilters);
    resetSearch();
  };
  useEffect(() => {
  }, []);
  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            父标签:
           {/*  <Select
              style={{ width: 120 }}
              onChange={isChange}
              placeholder="请选择父标签"
              allowClear={true}
              filterOption={(input, option:any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {fidList.map(item => (
                      <Option key={item.id} value={item.id}>{item.label}</Option>
              ))}
            </Select> */}
            <Cascader options={fidList} fieldNames={{
              label: 'title', value: 'key', children: 'children'}} onChange={isChange} placeholder='请选择'></Cascader>
            <Search
              placeholder="请输入标签名"
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
