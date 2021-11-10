import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';

import moment from 'moment';

import { Drawer, Descriptions, Badge } from 'antd';

import { AttributeItemDataType, DrawerConfType } from '../../data.d';

import styles from './style.less';

interface DetailProps {
  drawerConf: DrawerConfType;
  current: Partial<AttributeItemDataType>;
  onCancelEdit: () => void;
}

const Detail: FC<DetailProps> = (props) => {
  const { drawerConf, current, onCancelEdit } = props;

  const columns: any = [
    {
      title: '属性标签',
      key: 'attribute_label',
    },
    {
      title: '属性代码',
      key: 'attribute_code',
    },
    {
      title: '属性',
      key: 'attribute_name',
    },
    {
      title: '数据类型',
      key: 'data_type',
    },
    {
      title: '属性值含义来源',
      key: 'attribute_source',
    },
    {
      title: '字典值/个',
      key: 'attribute_zdz',
    },
    {
      title: '关联事件',
      key: 'attribute_relax',
    },
  ];

  return (
    <>
      <Drawer
        title={drawerConf.title}
        placement="right"
        onClose={onCancelEdit}
        visible={drawerConf.visible}
        bodyStyle={{ paddingBottom: 80 }}
        width={'720'}
      >
        <Descriptions
          bordered
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          className={styles.customeLabel}
        >
          {columns.map((item) => {
            return (
              <Descriptions.Item key={item.key} label={item.title}>
                {current[item.key]}
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      </Drawer>
    </>
  );
};

export default Detail;
