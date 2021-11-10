import React, { FC, useEffect, useState } from 'react';
import { Link, connect, Dispatch } from 'umi';

import moment from 'moment';

import { Drawer, Descriptions, Badge } from 'antd';

import { ProjectItemDataType, DrawerConfType } from '@/pages/project/data.d';

import styles from './style.less';

interface DetailProps {
  drawerConf: DrawerConfType;
  current: Partial<ProjectItemDataType>;
  onCancelEdit: () => void;
}

const Detail: FC<DetailProps> = (props) => {
  const { drawerConf, current, onCancelEdit } = props;

  const columns: any = [
    {
      title: 'ID',
      key: 'project_id',
    },
    {
      title: '项目名称',
      key: 'title',
    },
    {
      title: '项目指标',
      key: 'tag_conf',
    },
    {
      title: '项目描述',
      key: 'description',
    },
    {
      title: '开始时间',
      key: 'start_date',
    },
    {
      title: '结束时间',
      key: 'end_date',
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
            if (item.key === 'tag_conf') {
              return (
                <Descriptions.Item key={item.key} label={item.title}>
                  {current[item.key].map((item) => item.tag_name).join('、')}
                </Descriptions.Item>
              );
            }
            if (item.key === 'start_date' || item.key === 'end_date') {
              return (
                <Descriptions.Item key={item.key} label={item.title}>
                  {moment(current[item.key]).format('YYYY/MM/DD hh:mm:ss')}
                </Descriptions.Item>
              );
            }
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
