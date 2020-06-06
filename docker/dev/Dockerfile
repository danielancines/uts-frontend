FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html
#COPY /dist-v1.6.1 /usr/share/nginx/html
COPY /dist-v1.7.0 /usr/share/nginx/html

RUN mkdir /etc/nginx/sites-enabled/

COPY app.devultimateteamsuite.com /etc/nginx/sites-enabled
COPY nginx.conf /etc/nginx/

EXPOSE 80
