import React, { FC, useEffect, useState } from 'react';
import { Drawer, Button, Input, Select, Radio, message } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
const IndicatorCalc: FC<any> = (props) => {
  const [choiceEvents, setChoiceEvents] = useState([
    { name: '1访问人数访问人数访问人数访问人数访问人数', type: 1 },
  ]);
  const [isAdd, setIsAdd] = useState(true);
  const [indicName, setIndicName] = useState('');
  const [indicDesc, setIndicDesc] = useState('');
  const [dataFormat, setDataFormat] = React.useState(1);
  useEffect(() => {}, []);
  const { visible, onCancel, eventList, typeList } = props;
  const indicDescChange = (e: any) => {
    setIndicDesc(e.target.value);
  };
  const formateChange = (e: any) => {
    setDataFormat(e.target.value);
  };
  const indicNameChange = (e: any) => {
    setIndicName(e.target.value);
  };
  const saveData = () => {
    console.log(indicName, indicDesc, dataFormat, isAdd, choiceEvents);
  };
  const toDelEvent = (index: number) => {
    choiceEvents.splice(index, 1);
    setChoiceEvents([...choiceEvents]);
  };
  const toAddEvent = (obj: any) => {
    if (isAdd) {
      //相加的重复也需要判断
      if (choiceEvents.length != 0 && obj.type != choiceEvents[0].type) {
        message.warn('相加指标仅可选相同类型的事件');
        return;
      }
    } else {
      if (choiceEvents.length == 2) {
        message.warn('相除指标仅可选择两个事件,默认第一项除以第二项');
        return;
      }
    }
    setChoiceEvents([...choiceEvents, obj]);
  };
  const addEvent = () => {
    setIsAdd(true);
    setChoiceEvents([]);
  };
  const divEvent = () => {
    setIsAdd(false);
    setChoiceEvents([]);
  };
  return (
    <>
      <Drawer
        placement="right"
        onClose={onCancel}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        width={'620px'}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" onClick={saveData}>
              保存
            </Button>
          </div>
        }
      >
        <div className={styles.title}>指标显示名</div>
        <Input onChange={indicNameChange} />
        <div className={styles.title}>
          运算逻辑
          <span
            style={{
              fontSize: '12px',
              fontWeight: 200,
              color: 'red',
              marginLeft: '10px',
            }}
          >
            注：相加指标选择相同类型，相除指标仅可选择两个，默认第一项除以第二项。
          </span>
        </div>
        <div className={styles.clearFloat} style={{ height: '40px' }}>
          <div
            className={`${styles.defaultBtn} ${isAdd ? styles.choiceBtn : ''}`}
            onClick={addEvent}
          >
            相加
          </div>
          <div
            className={`${styles.defaultBtn} ${!isAdd ? styles.choiceBtn : ''}`}
            onClick={divEvent}
          >
            相除
          </div>
          {!isAdd && (
            <Radio.Group
              style={{ marginTop: '10px' }}
              value={dataFormat}
              onChange={formateChange}
            >
              <Radio value={1}>百分比展示</Radio>
              <Radio value={2}>小数展示</Radio>
            </Radio.Group>
          )}
        </div>

        <div className={styles.title}>可选事件列表</div>
        <ul className={styles.clearFloat}>
          <li className={styles.eventBox}>
            {eventList.map((item: any, index: number) => {
              return (
                <div
                  className={styles.clearFloat}
                  style={{
                    height: '40px;',
                    lineHeight: '40px',
                    borderBottom: '1px solid #999',
                  }}
                >
                  <div className={styles.itemName}>{item.name}</div>
                  <Select
                    options={typeList}
                    defaultValue={item.type}
                    style={{ width: '70px', float: 'left', marginTop: '8px' }}
                  ></Select>
                  <PlusCircleOutlined
                    className={styles.iconCss}
                    onClick={() => toAddEvent(item)}
                  />
                </div>
              );
            })}
          </li>
          <li className={styles.arrow}>==</li>
          <li className={styles.eventBox}>
            {choiceEvents.map((item: any, index: number) => {
              return (
                <div
                  className={styles.clearFloat}
                  style={{
                    height: '40px;',
                    lineHeight: '40px',
                    borderBottom: '1px solid #999',
                  }}
                >
                  <div className={styles.itemName}>{item.name}</div>
                  <Select
                    options={typeList}
                    defaultValue={item.type}
                    disabled
                    style={{ width: '70px', float: 'left', marginTop: '8px' }}
                  ></Select>
                  <MinusCircleOutlined
                    className={styles.iconCss}
                    onClick={() => toDelEvent(index)}
                  />
                </div>
              );
            })}
          </li>
        </ul>
        <div className={styles.title} onChange={indicDescChange}>
          数据说明
        </div>
        <TextArea showCount maxLength={100} />
      </Drawer>
    </>
  );
};
export default IndicatorCalc;
