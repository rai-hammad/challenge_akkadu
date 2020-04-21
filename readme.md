# Challenge Akkadu

The response should return the latest transaction for each user account that matches the filters, grouped by country, as well as an aggregate of all the transactions within each country.

Built using technologies:
node.js
express
mysql

install the nodeJs in your system. download the LTS version. for download visit
https://nodejs.org/en/download/

First make a directory for the project,
IN CMD window command line
mkdir challengeAkkadu
cd challengeAkkadu

Initialize the project.
npm init -y

npm install express

npm intall mysql

npm install dotenv

npm install bcrypt

#################

Challenge

#################

Without Filters

First we get the aggregate functions ( SUM(balance), AVG(percent_change) ) and country name using the 'accounts' and 'transactions' tables, filter the result group by country.

Then we loop through to get the transactions against each country. 

#################### 


With filtering

First we get the url and separate the parameters. 

loop through filter parameters.

make the where statement and the filters array. 

as we have only 4 parameters.

currency and account_type belong to "account" table

active_users_only and user_type belongs to "users" table.

so if user_type or active_users_only parameters appear then we also use the 'users' table to join to get the filter results. 


