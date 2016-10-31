

FROM node:6.3.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/

#
RUN uname -a

# CentOS 
# RUN echo "Asia/shanghai" > /etc/timezone; 

RUN npm i -g supervisor
RUN npm i

COPY . /usr/src/app

ENV PORT 80
EXPOSE 80

# ENTRYPOINT ["node", "app.js"]
# CMD forever start --minUptime 1000 --spinSleepTime 1000 app.js
CMD supervisor node ./bin/www