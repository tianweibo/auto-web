# Dockerfile
FROM node:14
WORKDIR /web/
COPY ./package.json ./
# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
# 安装
RUN npm set registry https://registry.npm.taobao.org
RUN npm i
#COPY . /web
RUN npm rebuild node-sass --force
# 启动
CMD ["npm","run","dev"]
