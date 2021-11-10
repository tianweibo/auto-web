export default {
  dev: {
    '/api/': {
      target: 'http://localhost:7001',
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
      target: 'https://bp.enbrands.com',
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
