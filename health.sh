#!/bin/bash
while :
do
  date
  curl -s https://secure-ridge-95152.herokuapp.com/health
  sleep 600
done
