# 镜像版本
FROM node:12.16.2-alpine

# 设置时区
RUN apk --update add tzdata \
&& cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
&& echo "Asia/Shanghai" > /etc/timezone \
&& apk del tzdata

# 创建 app 目录
RUN mkdir -p /root/backend/pluto-admin

# 设置工作目录
WORKDIR /root/backend/pluto-admin

# 拷贝 package.json 文件到工作目录
# !!重要：package.json 需要单独添加。
# Docker 在构建镜像的时候，是一层一层构建的，仅当这一层有变化时，重新构建对应的层。
# 如果 package.json 和源代码一起添加到镜像，则每次修改源码都需要重新安装 npm 模块，这样木有必要。
# 所以，正确的顺序是：添加 package.json；安装 npm 模块；添加源代码。
COPY package.json /root/backend/pluto-admin/package.json

# 安装 npm 依赖（使用淘宝的镜像源）
# 如果使用的境外服务器，无需使用淘宝的镜像源，即改为 `RUN npm i`。
RUN npm install --registry=https://registry.npm.taobao.org

# 拷贝所有源代码到工作目录
COPY . /root/backend/pluto-admin

# 暴露容器端口
EXPOSE 7001

# 启动 Node 应用
CMD npm start