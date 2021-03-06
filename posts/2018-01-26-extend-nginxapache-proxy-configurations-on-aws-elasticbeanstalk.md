---
title: Extend nginx or Apache proxy configurations on AWS ElasticBeanstalk
published: true
description: >-
  Use .ebextensions feature of AWS ElasticBeanstalk to define custom
  configurations for your proxy server
cover_image: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--m9Atdxe4--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/8ndsgtt91bqudopf8m7o.png
tags: 'aws, elasticbeanstalk, proxy'
canonical_url: >-
  https://dev.to/david_ojeda/extend-nginxapache-proxy-configurations-on-aws-elasticbeanstalk-3mjg
type_of: article
id: 17968
published_at: 2018-01-26
slug: extend-nginxapache-proxy-configurations-on-aws-elasticbeanstalk-3mjg
path: >-
  /david_ojeda/extend-nginxapache-proxy-configurations-on-aws-elasticbeanstalk-3mjg
url: >-
  https://dev.to/david_ojeda/extend-nginxapache-proxy-configurations-on-aws-elasticbeanstalk-3mjg
comments_count: 7
public_reactions_count: 11
page_views_count: 492
published_timestamp: '2018-01-26T20:31:21Z'
positive_reactions_count: 11
tag_list:
  - aws
  - elasticbeanstalk
  - proxy
---

<details open>
  <summary>
    Index
  </summary>

  [[toc]]

</details>

AWS ElasticBeanstalk applications use either an nginx or Apache proxy to relay requests. Using the .ebextensions feature of ElasticBeanstalk we can extend the configuration of these proxies. If you don't know how .ebextensions work you can read more <a href="https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/ebextensions.html">here.</a>

I'm going to extend the default nginx proxy configurations using .ebextensions. The same procedure can be used to extend an Apache proxy.

## Create a .conf file

First we need to create a .conf file with the desired directives. A list of nginx directives can be found <a href="http://nginx.org/en/docs/dirindex.html"> here.</a> My conf file- named proxy.conf -increases some timeouts of the proxy:

```bash
# Elastic Beanstalk Nginx Configuration File

user                    nginx;
error_log               /var/log/nginx/error.log warn;
pid                     /var/run/nginx.pid;
worker_processes        auto;
worker_rlimit_nofile    200000;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    include       conf.d/*.conf;

    map $http_upgrade $connection_upgrade {
        default     "upgrade";
    }

    server {
        listen        80 default_server;
        access_log    /var/log/nginx/access.log main;

        client_header_timeout 60;
        client_body_timeout   60;
        keepalive_timeout     60;
        gzip                  on;
        gzip_comp_level       4;
        gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;

        # Include the Elastic Beanstalk generated locations
        include conf.d/elasticbeanstalk/*.conf;
    }
}
```

## Create nginx conf.d directory

Now we need the directory where our configuration file will be. Under .ebextensions, create a directory named 'nginx', and inside it another named 'conf.d'. Then add the file you just created. Your dir structure should look like this:

- .ebextensions
    - nginx
        - conf.d
            - proxy.conf

Now, when you deploy a new version of your application, ElasticBeanstalk will automatically copy your files on the `.ebextensions/nginx/conf.d/` directory to the `/etc/nginx/conf.d/` directory of your instances.

This all works because the default nginx.conf file- on line 21 -specifies to include all .conf files under the conf.d directory:

```bash
# Elastic Beanstalk Nginx Configuration File

user                    nginx;
error_log               /var/log/nginx/error.log warn;
pid                     /var/run/nginx.pid;
worker_processes        auto;
worker_rlimit_nofile    200000;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    include       conf.d/*.conf;

    map $http_upgrade $connection_upgrade {
        default     "upgrade";
    }

    server {
        listen        80 default_server;
        access_log    /var/log/nginx/access.log main;

        client_header_timeout 60;
        client_body_timeout   60;
        keepalive_timeout     60;
        gzip                  on;
        gzip_comp_level       4;
        gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;

        # Include the Elastic Beanstalk generated locations
        include conf.d/elasticbeanstalk/*.conf;
    }
}
```

The directives from the .conf file will be added to the <em>http</em> block of the default configuration.

If you need to add directives to the <em>server</em> block you will need to add .conf files to the elasticbeanstalk folder (see line 39 of previous Gist). That dir structure would look:

- .ebextensions
    - nginx
        - conf.d
            - proxy.conf
        - elasticbeanstalk
            - my_other_conf.conf

Same can be done for an Apache proxy. The difference is on the directory structure. For Apache your structure should be this:

- .ebextensions
    - httpd
        - conf
            - proxy.conf

## Wrap-up

Using .ebextensions is by far the simplest method to add custom configurations to your nginx or Apache proxy. Create as many configuration files as you need and add them to the corresponding directory under .ebextensions and you are done.
