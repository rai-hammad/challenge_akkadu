const pool = require("../../config/database");

async function getTransactions(sdata) {

	pool.query(
			`select SUM(t.balance) as total_balance, 
				AVG(t.percent_change) as agg_percent_change,
				acc.country from transactions as t inner join accounts as acc 
				ON t.account_id=acc.id 
				GROUP BY acc.country LIMIT 2`,
			[],
			(error, results, fields) => {
				if(error){
					// return callBack(error);
					return error;
				}
				var finalResult = [];
				var sentry = {};
				var i=0;
				results.forEach(element => {
					console.log(element.country);
					sentry['country'] = element.country;
					sentry['aggregate'] = {'balance': element.total_balance, 'percent_change': element.agg_percent_change};
					pool.query(
						`select t.* from transactions as t inner join accounts as acc 
							ON t.account_id=acc.id 
							WHERE acc.country=? `,
						[element.country],
						(terror, tresults, tfields) => {
							if(terror){
								// return callBack(error);
								return error;
							}
							console.log(tresults.length);
							sentry['transactions']=tresults;
							finalResult.push(sentry);
							i++;
							console.log(i+' '+results.length);
							if(i==results.length){
								return finalResult;
							}
						}
						
					);
					
					
				});
				
			}
	);	
		
}


module.exports.getTransactions = getTransactions;