import { defineConfig } from 'umi';

import proxy from './src/config/proxy';
import routes from './src/config/routes';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  proxy: proxy[REACT_APP_ENV || 'dev'],
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  fastRefresh: {},
  hash: true,
});
