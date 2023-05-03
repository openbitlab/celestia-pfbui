# Celestia-pfbui

A webapp for submitting and retrieving of Celestia PFB transactions.

## Install & Configure

Edit /etc/nginx/sites-available/default.conf and add the configuration for api proxy and static UI.

```
server {
        listen 80;
        listen [::]:80;

        server_name SERVERNAME;

        location / {
                root   /var/www/html/;
                index  index.html index.htm;
        }

        location ^~ /api/ {
	    rewrite ^/api/(.*)$ /$1 break;
            proxy_set_header Host $host;
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS' always;

            proxy_pass http://127.0.0.1:26659;
        }
}
```

Move all the files of this repository to /var/www/html:

```bash 
mv css images scripts index.html /var/www/html
```