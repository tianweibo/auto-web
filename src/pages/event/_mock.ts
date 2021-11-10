// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { EventListItemDataType, EventItemDataType } from './data.d';

function eventList(count: number): EventListItemDataType[] {
  const list = [];
  for (let i = 1; i < count; i += 1) {
    list.push({
      event_id: i,
      title: `报表名称-${i}`,
      start_date: Date.parse(new Date().toString()) / 1000,
      end_date: Date.parse(new Date().toString()) / 1000,
      tag_conf: [
        {
          tag_name: 'PV',
          tag_key: 'pv',
        },
        {
          tag_name: 'UV',
          tag_key: 'uv',
        },
      ],
      status: `正常`,
      description: `描述信息`,
      created_at: Date.parse(new Date().toString()) / 1000,
      updated_at: Date.parse(new Date().toString()) / 1000,
    });
  }

  return list;
}

function fetchAll(req: Request, res: Response) {
  const params = req.query;
  const count = params.count * 1 || 20;
  const result = eventList(count);
  return res.json(result);
}

function findOne(req: Request, res: Response): EventItemDataType {
  const params = req.query;

  let current = eventList(20).find((item) => item.event_id == params.id);

  current = Object.assign(current, {
    tag_list: [
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
        tag_key: 'join_card',
      },
    ],
  });

  return res.json(current);
}

export default {
  'GET /api/event/list': fetchAll,
  'GET /api/event/detail': findOne,
  'GET /api/event/filter': fetchAll,
};
