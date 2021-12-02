export default {
  dev: {
    '/api/': {
      target: 'http://172.18.0.1:8088',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/erlang/': {
      target: 'https://test-open-gateway.enbrands.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/api/': {
      target: 'http://127.0.0.1:8088',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
    '/erlang/': {
      target: 'https://test-open-gateway.enbrands.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
