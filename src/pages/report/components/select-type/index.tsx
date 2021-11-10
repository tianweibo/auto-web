import { FC, useState, useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface SelectTypeProps {
  type: 'indicator' | 'time_dimension' | 'sequential' | 'indicator_level';
}
const SelectType: FC<SelectTypeProps> = (props) => {
  const [options, setoptions] = useState([]);
  useEffect(() => {
    if (props.type === 'indicator') {
    }
  }, [props]);
  if (props.type === 'indicator_level') {
    return (
      <Select defaultValue="0" style={{ width: 120 }}>
        <Option value="0">不展示</Option>
        <Option value="1">历史累计</Option>
        <Option value="2">历史平均</Option>
        <Option value="3">历史均值</Option>
      </Select>
    );
  }
  if (props.type === 'sequential') {
    return (
      <Select defaultValue="0" style={{ width: 120 }}>
        <Option value="0">不展示</Option>
        <Option value="1">展示</Option>
      </Select>
    );
  }

  if (props.type === 'time_dimension') {
    return (
      <Select defaultValue="0" style={{ width: 120 }}>
        <Option value="0">按天</Option>
        <Option value="1">按周</Option>
        <Option value="1">按月</Option>
      </Select>
    );
  }
  return (
    <Select defaultValue="0" style={{ width: 120 }}>
      <Option value="jack">Jack</Option>
      <Option value="lucy">Lucy</Option>
    </Select>
  );
};

export default SelectType;
