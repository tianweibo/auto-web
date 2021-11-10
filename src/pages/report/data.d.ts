import React from 'react';

// 定义报表数据
export interface Report extends Record<string, any> {
  report_id: number;
  report_name: string;
  platform_app: string;
  application_id: number;
  application_label: string;
  application_dep_platform: string;
  create_time: string;
}
// basic Data 返回数据类型
export interface BasicData extends Record<string, any> {
  fid: string;
  label: string;
  value: string;
}

// 应用信息
export interface ApplicationInfo extends Record<string, any> {
  application_id: number;
  platform_app: string; // 应用名称
  platform_business: string; // 应用平台
  platform_app_code: string; // 应用代码
  application_dep_platform: string; // 应用部署平台
  platform_app_version: string; // 版本
  application_type: string;
}
export interface ReportDetail extends Record<string, any> {
  card_ids: [];
  table_ids: [];
  trend_ids: [];
  reportInfo: object;
}
// 应用详情
export interface ApplicationDetail extends Record<string, any> {
  appInfo: ApplicationInfo;
  indicatorIds: number[];
}

// 指标信息（应用下面的指标）
export interface IndicatorInfo extends Record<string, any> {
  indicator_id: number;
  indicator_name: string;
  indicator_label: string;
  indicator_label_label: string;
  indicator_level: string;
  indicator_level_label: string;
  indicator_type: string;
  indicator_type_label: null;
}

// 卡片
export interface CardObj extends Record<string, any> {
  card_id?: number;
  indicator_id: number;
  indicator_name: string;
  indicator_show_name: string;
  indicator_desc: string;
  time_dimension: string;
  sequential: string;
  indicator_level: string;
}

// 趋势
export interface TrendObj {
  trend_id?: number;
  indicator_id: number;
  indicator_name: string;
  indicator_show_name: string;
  indicator_desc: string;
  time_scope: string;
}

// 表格
export interface TableObj {
  table_id?: number;
  indicator_id: number;
  indicator_name: string;
  indicator_show_name: string;
  indicator_desc: string;
  time_dimension: string;
  is_import: number;
}

type DataType = (CardObj | TrendObj | TableObj) & { key?: any };

export interface ColumnType {
  title: string;
  dataIndex: string;
  editable?: boolean;
  render?: (_: any, cardObj: DataType) => React.ReactElement;
}
