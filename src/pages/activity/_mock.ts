// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { ActivityListItemDataType, ActivityFormItemDataType } from './data.d';

function activityList(count: number): ActivityListItemDataType[] {
  const list = [];
  for (let i = 1; i < count; i += 1) {
    list.push({
      activity_id: i,
      title: `活动名称-${i}`,
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
      description: `内容描述-${i}`,
      created_at: Date.parse(new Date().toString()) / 1000,
      updated_at: Date.parse(new Date().toString()) / 1000,
    });
  }

  return list;
}

function fetchAll(req: Request, res: Response) {
  const params = req.query;
  const count = params.count * 1 || 20;
  const result = activityList(count);
  return res.json(result);
}

function findOne(req: Request, res: Response) {
  const params = req.query;
  const current = activityList(20).find((item) => {
    return item.activity_id == params.id;
  });
  return res.json(current);
}

export default {
  // 'POST /api/activity/list': fetchAll,
  // 'GET /api/activity/detail': findOne,
  // 'GET /api/activity/filter': fetchAll,
};
