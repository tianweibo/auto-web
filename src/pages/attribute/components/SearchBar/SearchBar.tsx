import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';
import {
  Space,
  Card,
  Input,
  Select,
  Menu,
  Dropdown,
  message,
  Cascader,
  Tooltip
} from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import {basicData,getLabelTree} from '../../service';
const { Option } = Select;

const { Search } = Input;

const defaultFilters = {
  keyword:'',
  pageNo:1,
  pageSize:10,
  attribute_label:"",
  data_type:"",
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
  const [labelList, setLabelList] =useState<Array<{key: string,value: string}>>([])
  const [typeList, setTypeList] = useState<Array<{key: string,value: string}>>([])
 
  const typeChange = (e: any) => {
    if(e){
      filters.data_type=e;
    }else{
      filters.data_type=''
    }
    handleSearch(filters)
  };
  const labelChange = (e: any) => {
    if(e.length==2){
      filters.attribute_label=e[1]
    }else{
      filters.attribute_label=''
    }
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
  const getBasicData=async(id:string)=>{
    const res:any=await basicData(id);
    if(id=='data_type'){
      setTypeList(res.data);
    }
    const res1:any=await getLabelTree({id:3})
    let arr=res1.data.arr;
    arr = arr.map(ele =>{ele.disabled=false; return ele});
    setLabelList(arr);
  }
  useEffect(() => {
    getBasicData('data_type');
    //getBasicData('attribute_label');
  }, []);
  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
          数据类型:
            <Select
              placeholder="请选择" 
              style={{ width: 120 }}
              allowClear={true}
              onChange={typeChange}
              options={typeList}
            >
            </Select>
            属性标签:
            <Cascader
              placeholder="请选择" 
              style={{ width: 120 }}
              onChange={labelChange}
              fieldNames={{label: 'title', value: 'key', children: 'children'}} 
              options={labelList}
            />
            
            <Search
              placeholder="属性/属性代码"
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
