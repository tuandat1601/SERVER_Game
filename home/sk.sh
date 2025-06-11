#!/bin/bash

HOSTNAME="localhost"
PORT="3306"
USERNAME="root"
PASSWORD="123456"

mysql -h${HOSTNAME} -P${PORT} -u${USERNAME} -p${PASSWORD} -e "CREATE DATABASE lyz_webcross DEFAULT CHARACTER SET utf8;"
mysql -h${HOSTNAME} -P${PORT} -u${USERNAME} -p${PASSWORD} -e "CREATE DATABASE lyz_webgame DEFAULT CHARACTER SET utf8;"
mysql -h${HOSTNAME} -P${PORT} -u${USERNAME} -p${PASSWORD} -e "CREATE DATABASE lyz_wgbackend DEFAULT CHARACTER SET utf8;"
mysql -h${HOSTNAME} -P${PORT} -u${USERNAME} -p${PASSWORD} -e "CREATE DATABASE lyz_wglog DEFAULT CHARACTER SET utf8;"

# 还原数据库
mysql -uroot -p123456 lyz_webcross < /home/sql/lyz_webcross.sql
mysql -uroot -p123456 lyz_webgame < /home/sql/lyz_webgame.sql
mysql -uroot -p123456 lyz_wgbackend < /home/sql/lyz_wgbackend.sql
mysql -uroot -p123456 lyz_wglog < /home/sql/lyz_wglog.sql
