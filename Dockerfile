FROM node:8

ARG NODE_ENV=staging
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/node/app
    
RUN npm i -g nodemon

CMD ["npm", "run", "start:dev"]