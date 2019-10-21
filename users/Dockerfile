FROM node:10

ENV DEBUG="raddict-users:*"
ENV PORT="3333"
ENV SEQUELIZE_CONNECT="sequelize-docker-mysql.yaml"
ENV REST_LISTEN="0.0.0.0"

RUN mkdir -p /userauth
RUN cp -frv /routes /userauth
RUN cp -frv /controllers /userauth
RUN cp -frv /scripts /userauth

COPY package.json sequelize-docker-mysql.yaml *.mjs *js /userauth/
WORKDIR /userauth

RUN apt-get update -y \
  && apt-get -y install curl python build-essential git ca-certicficates \
  && npm install --unsafe-perm

EXPOSE 3333
CMD npm run docker