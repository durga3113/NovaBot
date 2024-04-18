FROM quay.io/vorterx/vorterx:latest
RUN git clone https://github.com/Diegoson/NovaBot /root/vorterx
WORKDIR /root/vorterx/
RUN yarn install --network-concurrency 1
EXPOSE 9000
CMD ["npm", "start"]
