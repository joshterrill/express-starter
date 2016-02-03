#!/bin/bash
ssh root@$DEPLOY_IP <<'ENDSSH'
#commands to run on remote host
cd /var/www
test -d "/var/www/express-starter" && echo "Updating existing project" && git pull && forever restart || echo "Downloading new project" && git clone https://github.com/joshterrill/express-starter && cd express-starter/ && npm install -g forever && npm install && forever start app.js
ENDSSH