FROM node:12-alpine
#Create app directory
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV PATH=$PATH:/home/node/.npm-global/bin 
# optionally if you want to run npm global bin without specifying path
WORKDIR /usr/src/app
#Install app dependencies
COPY package*.json ./
COPY pm2.json ./

USER node

RUN npm install

RUN npm install pm2 -g

EXPOSE 3000

RUN ls -al -R

CMD ["pm2-runtime", "start", "pm2.json"]