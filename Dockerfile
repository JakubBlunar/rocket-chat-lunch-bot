FROM mhart/alpine-node:14
WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build
RUN rm -rf /src

FROM mhart/alpine-node:14

WORKDIR /app
COPY --from=0 /app .
CMD ["yarn", "start"]
