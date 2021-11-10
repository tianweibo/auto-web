import React, { FC, useState ,shouldComponentUpdate} from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Button,
} from 'antd';
// import { ColumnType } from 'antd/es/table';
import { CardObj, ColumnType, DataType, IndicatorInfo } from '../../data';
import SelectType from '../select-type/index';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  nodeInfo:
    | 'indicator'
    | 'time_dimension'
    | 'sequential'
    | 'indicator_level'
    | 'input';
  record: DataType;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  nodeInfo,
  record,
  index,
  children,
  ...restProps
}) => {
  const node =
    nodeInfo === 'input' ? (
      <Input onChange={() => inputChange()}/>
    ) : nodeInfo === 'indicator' ? (
      <SelectType type="indicator" />
    ) : nodeInfo === 'time_dimension' ? (
      <SelectType type="time_dimension" />
    ) : nodeInfo === 'sequential' ? (
      <SelectType type="sequential" />
    ) : nodeInfo === 'indicator_level' ? (
      <SelectType type="indicator_level" />
    ) : null;
    const inputChange=()=> {
      console.log('inputChange')
    }
  return (
    <>
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {node}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    </>
  );
};
interface EditableTableProps {
  columns: ColumnType[];
  isDetail:boolean;
  changeData:(index:number,type:string) => void;
  name:string;
  data: Array<DataType>;
  indicatorList: Array<IndicatorInfo>;
}
const EditableTable: FC<EditableTableProps> = (props) => {
  //var props:any=useRef(props);
  const { changeData} = props;
  const [form] = Form.useForm();
  const [data, setData] = useState<Array<DataType>>(props.data);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: DataType) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };
  const deleteData=(record:DataType,index:number)=>{
    changeData(index,props.name)
  }
  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns: ColumnType[] = [
    ...props.columns,
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: DataType,index:number) => {
        const editable = isEditing(record);
        if(props.isDetail==true){
          return(<span>-</span>)
        }
        return editable ? (
          <span
            style={{
              display: 'inline-block',
              width: '150px',
              color: '#1890ff',
            }}
          >
            <Button type="text" onClick={() => save(record.key)}>
              保存
            </Button>
            <Button type="text" onClick={() => cancel()}>
              取消
            </Button>
          </span>
        ) : (
          <span
            style={{
              display: 'inline-block',
              width: '150px',
              color: '#1890ff',
            }}
          >
            <Button type="text" onClick={() => edit(record)}>
              编辑
            </Button>
            <Button type="text" onClick={() => deleteData(record,index)}>
              删除
            </Button>
          </span>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        // nodeInfo: col.dataIndex === 'indicator_name' ? 'indicator' : 'input',
        nodeInfo:
          col.dataIndex === 'indicator_name'
            ? 'indicator'
            : col.dataIndex === 'time_dimension'
            ? 'time_dimension'
            : col.dataIndex === 'sequential'
            ? 'sequential'
            : col.dataIndex === 'indicator_level'
            ? 'indicator_level'
            : 'input',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        rowKey="indicator_id"
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          hideOnSinglePage:true
        }}
      />
    </Form>
  );
};

export default EditableTable;
