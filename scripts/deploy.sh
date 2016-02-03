#!/bin/bash
SERVER_IP="162.243.76.9"
ssh root@$SERVER_IP <<'ENDSSH'
#commands to run on remote host
cd /var/www
test -d "/var/www/express-starter" && echo "Updating existing project" && cd express-starter && git pull && forever restart 0 && exit 1 || echo "Downloading new project" && git clone https://github.com/joshterrill/express-starter && cd express-starter/ && npm install -g forever && npm install && forever start app.js && exit 1
ENDSSH