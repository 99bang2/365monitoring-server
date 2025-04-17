FROM node:14.18.1

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN mkdir -p /app
WORKDIR /app
ADD ./ /app

RUN npm i -g npm@9.8.1
RUN npm i -g pm2
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:retain 7
RUN npm install
RUN chmod -R 777 /root/.pm2/

ENV HOST 0.0.0.0
EXPOSE 3000

#CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
CMD [ "/usr/local/bin/entrypoint.sh" ]
