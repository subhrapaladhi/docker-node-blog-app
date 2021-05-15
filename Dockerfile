FROM node:14.15.4
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm --unsafe-perm install; \
        else npm --unsafe-perm install --only=production; \
        fi
COPY . .
ENV PORT 3000
EXPOSE $PORT
CMD ["npm","start"]