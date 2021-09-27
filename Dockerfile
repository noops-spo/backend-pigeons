FROM node:16.10.0-alpine3.12

ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL info
WORKDIR /noopspool/
EXPOSE 80

COPY src/ /noopspool/
