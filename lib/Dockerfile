FROM quay.io/vorterx/vorterx:latest
RUN git clone https://github.com/Vorterx/NovaBot /root/vorterx
WORKDIR /root/vorterx/
RUN npm install
EXPOSE 9000
CMD ["node", "core.js"]
