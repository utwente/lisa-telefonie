#!/bin/bash
NODE_ENV=production \
DOMAIN="http://localhost" \
SESSION_SECRET="S5n4h5QxmPDlQ22I506Z4G7aqN83SB1R" \
MAIL_FROM="servicedesk-ict@utwente.nl" \
MAIL_HOST="localhost" \
MAIL_PORT=25 \
MAIL_MAX_CONNECTIONS=5 \
MAIL_MAX_MESSAGES=10 \
MAIL_RATE_LIMIT=10 \
IP="127.0.0.1" \
PORT=8000 \
MONGODB_URI="mongodb://localhost/ictsapp-dev" \
nohup nodejs /home/floriaan/Documents/Werk/UT_Operator/lisa-telefonie/dist/server/app.js > telefonie.out 2>&1&
#nodejs /opt/application/lisa-telefonie/server/app.js
