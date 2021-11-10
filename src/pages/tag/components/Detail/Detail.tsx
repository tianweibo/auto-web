import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';

import moment from 'moment';

import { Drawer, Descriptions, Badge } from 'antd';

import { TagItemDataType, DrawerConfType } from '../../data.d';

import styles from './style.less';

interface DetailProps {
  drawerConf: DrawerConfType;
  current: Partial<TagItemDataType>;
  onCancelEdit: () => void;
}

const Detail: FC<DetailProps> = (props) => {
  const { drawerConf, current, onCancelEdit } = props;

  const columns: any = [
    {
      title: 'ID',
      key: 'tag_id',
    },
    {
      title: '指标字段',
      key: 'tag_key',
    },
    {
      title: '指标名称',
      key: 'tag_name',
    },
    {
      title: '指标描述',
      key: 'description',
    },
    {
      title: '创建时间',
      key: 'created_at',
    },
    {
      title: '更新时间',
      key: 'updated_at',
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
