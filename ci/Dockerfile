FROM node:16.20.1
COPY --chown=node:node . /

USER node
ENV NODE_ENV=production

RUN cd /src && npm ci 

WORKDIR /src
CMD ["node", "./index.js"]

EXPOSE 8080