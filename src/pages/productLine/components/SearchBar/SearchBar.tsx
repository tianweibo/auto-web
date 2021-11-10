import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';
import { Space, Card, Input } from 'antd';
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
  const [info, setInfo] = useState({});
  const handleSubmit = (e: any) => {
    filters.keyword = e;
    handleSearch(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    resetSearch();
  };

  useEffect(() => {}, []);
  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Search
              placeholder="产品线名称"
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
