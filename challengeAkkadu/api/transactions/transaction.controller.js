const pool = require("../../config/database");

module.exports = {
	getTransactions: (req, res) => {
		console.log(req.query);
		sdata = req.query;
		var finalResult = []; // this for the final data result to return. 
		var userIn = 0; // this flag use to check weather the users table include in the query or not
		var whereStatement = ''; // where statement for the filters 
		var queryString = ""; // use to make a query statement
		var filter = []; // adding filters for the query

		// Now the block for making the where statement starts.
		if (req.query !== {}){ // first we check if url has parameters.
			for ( const key in sdata) { // loop to this url params array
				if(key.toLowerCase()=='currency'){ // use the toLowerCase() function to lower the param key to match with the currency. make the search case in-sensitive
					if(whereStatement == '') whereStatement += " WHERE upper(acc.currency)=? "; // if wherestatement is empty then use WHERE clause 
					else whereStatement += " AND upper(acc.currency)=?} "; // else use the AND 
					filter.push(sdata[key].toUpperCase()); // add the filter value to filter array. this will also in sequence w.r.t query
				}
				else if(key.toLowerCase() == 'active_users_only'){
					var activeUsers = ['true', 'false', '0', '1']; // use because this is Boolean Type, so we have true or false or 0 or 1 
					if( activeUsers.includes(sdata[key].toLowerCase()) ) {
						// change the value according to the database value. because in table the active users has value 0 or 1
						if(sdata[key].toLowerCase() == 'true' || sdata[key].toLowerCase() == '1') sdata[key] = 1;
						else sdata[key] = 0;

						if(whereStatement == '') whereStatement += " WHERE user.is_active=? ";
						else whereStatement += " AND user.is_active=? ";
						userIn=1;
						filter.push(sdata[key]);
						
					}
				}
				else if(key.toLowerCase() == 'user_type'){
					var usertype = [ 'corporate', 'individual' ]; // as user has only 2 type corporate or individual, if not then it means all type same like 'all' type
					if(usertype.includes(sdata[key].toLowerCase()) ){
						if(whereStatement == '') whereStatement += " WHERE lower(user.type)=? ";
						else whereStatement += " AND lower(user.type)=? ";
						userIn = 1;
						filter.push(sdata[key].toLowerCase());
					}
				}
				else if(key.toLowerCase() == 'account_type'){
					var accountType = [ 'primary', 'secondary' ]; // as account has only 2 types primary or secondary, if not then it means all type same like 'all' 
					if( accountType.includes(sdata[key].toLowerCase()) ){
						if(whereStatement == '') whereStatement += " WHERE lower(acc.type)=? ";
						else whereStatement += " AND lower(acc.type)=? ";
						filter.push(sdata[key].toLowerCase());
					}
				}
			}
		}

		console.log(whereStatement, filter); // this is for testing
		var queryTables = ""; // this is used to check the tables to be included for the query join
		// console.log('user table in or not: ' + userIn);
		if(userIn==1){
			queryTables = `
				 	FROM transactions as t 
					INNER JOIN accounts as acc ON t.account_id=acc.id 
					INNER JOIN users as user ON user.id=acc.user_id  
			`;
		} else {
			queryTables = `
					FROM transactions as t 
					INNER JOIN accounts as acc ON t.account_id=acc.id 
			`;
		}
		queryString = `
					SELECT SUM(t.balance) as total_balance, 
					AVG(t.percent_change) as agg_percent_change,
					acc.country 
					${queryTables} 
					${whereStatement}
					GROUP BY acc.country 
		`;
		// console.log(queryString);
		pool.query( queryString, filter,
				(error, results, fields) => {
					if(error){
						return res.status(400).json({success: 0, message: "Bad Error. aggregate first query.", error: error});
					}
					if(results.length==0){
						return res.status(400).json({success: 0, message: "No Record Found."});
					}
					
					var i=0; // to count the loop values to compare with results length
					results.forEach(element => {
						var queryselect = ` SELECT t.* `; 
						// if there is no parameter then use the WHERE clause to add the condition else AND clause
						if(whereStatement=="") var queryTransWhere = ` WHERE acc.country `;
						else var queryTransWhere = `${whereStatement} AND acc.country=?`;

						var transfilter = [element.country];
						// to check filters values
						if(filter.length>0) var queryTransFilter = filter.concat(transfilter);
						else var queryTransFilter = transfilter;

						// console.log(queryselect, queryTables, queryTransWhere, queryTransFilter);
						
						pool.query(
							`
							${queryselect}  
							${queryTables} 
							${queryTransWhere} 
							LIMIT 2 
							`,
							queryTransFilter,
							(terror, tresults, tfields) => {
								if(terror){
									return res.status(400).json({success: 0, message: "Bad Error. Getting Transactions.", error: terror});
								}
								
								var entry = {'country': element.country, 'aggregate': {'balance': element.total_balance, 'percent_change': element.agg_percent_change},
									'transactions': tresults };

								finalResult.push(entry);
								i++;
								if(i==results.length){
									return res.status(200).json({ success: 1, data: finalResult });
								}
							}			
						);						
					});			
				}
		);
	}
};