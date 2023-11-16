#!/bin/bash

echo "########### Loading data to Mongo DB ###########"
mongoimport --jsonArray --db mock-databe --collection users --file users.json