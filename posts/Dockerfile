FROM node:10

ENV DEBUG="raddict:*"
ENV SEQUELIZE_CONNECT="models/sequelize-docker-mysql.yaml"
ENV RADDICT_MODEL="sequelize"
ENV USER_SERVICE_URL="http://userauth:3333"
ENV SECRET="whiteblue wolfdogz"
ENV POSTS_SESSIONS_DIR="/sessions"
ENV PORT="3030"

ENV TWITTER_CONSUMER_KEY="YOUR/[a-zA-Z0-9]/KEYS-HERE"
ENV TWITTER_CONSUMER_SECRET="YOUR/[a-zA-Z0-9]/SECRET-HERE"
# ENV TWITTER_CALLBACK_HOST="REFLECTS-IP-ADDRESS/DOMAIN-NAME-OF-YOUR-VPS"

ENV FACEBOOK_APP_ID="YOUR/[a-zA-Z0-9]/APP-ID-HERE"
ENV FACEBOOK_APP_SECRET="YOUR/[a-zA-Z0-9]/APP-SECRET-HERE"
# ENV FACEBOOK_CALLBACK_HOST="REFLECTS-IP-ADDRESS/DOMAIN-NAME-OF-YOUR-VPS"

ENV GOOGLE_CLIENT_ID="YOUR/[a-zA-Z0-9]/CLIENT-ID-HERE"
ENV GOOGLE_CLIENT_SECRET="YOUR/[a-zA-Z0-9]/CLIENT-SECRET-HERE"
# ENV GOOGLE_CALLBACK_HOST="REFLECTS-IP-ADDRESS/DOMAIN-NAME-OF-YOUR-VPS"

RUN mkdir -p /posts /posts/views /posts/static /posts/socket.io /posts/routes /posts/passport \
  /posts/models /posts/middlewares /posts/controllers

COPY package.json *.mjs *.js /posts/
COPY views/ /posts/views/
COPY static/ /posts/static/
COPY socket.io/ /posts/socket.io/
COPY routes/ /posts/routes/
COPY passport/ /posts/passport/
COPY models/ /posts/models/
COPY middlewares/ /posts/middlewares/
COPY controllers/ /posts/controllers/

WORKDIR /posts

RUN apt-get update -y \
  && apt-get -y install curl python build-essential git ca-certificates \
  && npm install --unsafe-perm

VOLUME /sessions

EXPOSE 3030
CMD npm run docker