server {
    listen 80;
    listen [::]:80;

    root /usr/share/nginx/html;
    server_name app.devultimateteamsuite.com 192.168.0.123;

    location /akkariteam {
        index index.html;
        try_files $uri $uri/ /akkariteam/index.html =404;
    }

    location /devteam {
        index index.html;
        try_files $uri $uri/ /devteam/index.html;
    }
}