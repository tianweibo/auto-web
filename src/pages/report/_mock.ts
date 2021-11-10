// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { Report } from './data.d';

function reportList(count: number): Report[] {
  const list = [];
  for (let i = 1; i < count; i += 1) {
    list.push({
      report_id: i,
      report_name: `报表名称-${i}`,
      platform_app: `应用名称-${i}`,
      application_id: i,
      application_label: '123',
      application_dep_platform: '淘宝',
      create_time: '2021/11/12',
    });
  }
  return list;
}

function fetchAll(req: Request, res: Response) {
  const params = req.query;
  // const count = params.count * 1 || 20;
  const result = reportList(20);
  return res.json({
    status: 0,
    msg: '查询成功',
    data: result,
  });
}

function findOne(req: Request, res: Response) {
  const params = req.query;

  const current = reportList(20).find((item) => {
    return item.report_id === 1;
  });

  const newCurrent = Object.assign(current, {
    activity: {
      activity_id: current?.report_id,
      title: `活动名称-${current?.report_id}`,
      tag_conf: [
        {
          tag_name: 'PV',
          tag_key: 'pv',
        },
        {
          tag_name: 'UV',
          tag_key: 'uv',
        },
        {
          tag_name: '加购',
          tag_key: 'join_cart',
        },
      ],
    },
  });

  return res.json(newCurrent);
}

export default {
  'GET /api/report/list': fetchAll,
  'GET /api/report/detail': findOne,
  'GET /api/report/filter': fetchAll,
};
