const pool = require("../../config/database");


// function getTransactionsModel() {
//   return new Promise(async function(resolve, reject) {
//     try {
//       console.log('Connected to database');
//       let result = await pool.query(
//         `select SUM(t.balance) as total_balance, 
// 				AVG(t.percent_change) as agg_percent_change,
// 				acc.country from transactions as t inner join accounts as acc 
// 				ON t.account_id=acc.id 
// 				GROUP BY acc.country LIMIT 2`,
//         []
//       );
//       console.log('Query executed');
//       resolve(result);
//     } catch (err) {
//       console.log('Error occurred', err);
//       reject(err);
//     }
//   });
// }

let transactions = async (sdata) => {
  let result = await pool.query(
        `select SUM(t.balance) as total_balance, 
				AVG(t.percent_change) as agg_percent_change,
				acc.country from transactions as t inner join accounts as acc 
				ON t.account_id=acc.id 
				GROUP BY acc.country LIMIT 2`,
		(error, results, fields) => {
			if(error) throw error;
			console.log(results);
			return results;
		}
      );

  return result;
}

async function getTransactionsByCountry(sdata) {
	const tresult = await pool.query(
			`select t.* from transactions as t inner join accounts as acc 
			ON t.account_id=acc.id 
			WHERE acc.country=? 
			LIMIT 10`,
			[element.country]
		);
	return tresult;
}


async function getAllTransactions() {
	const result = await pool.query(
        `select SUM(t.balance) as total_balance, 
				AVG(t.percent_change) as agg_percent_change,
				acc.country from transactions as t inner join accounts as acc 
				ON t.account_id=acc.id 
				GROUP BY acc.country LIMIT 2`
      );
	var finalResult = [];
	var sentry = {};
	result.forEach(element => {
		console.log(element.country);
		sentry['country'] = element.country;
		sentry['aggregate'] = {'balance': element.total_balance, 'percent_change': element.agg_percent_change};
		// const tresult = pool.query(
		// 	`select t.* from transactions as t inner join accounts as acc 
		// 	ON t.account_id=acc.id 
		// 	WHERE acc.country=? `,
		// 	[element.country]
		// );
		sentry['transactions']= getTransactionsByCountry(element.country);

		finalResult.push(sentry);
					
	});
	console.log(finalResult);
	return finalResult;
  // var value = await transactions(sdata);
  // console.log('function value');
  // console.log(value)

}


let ftransactions = new Promise( (resolve, reject) => {
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
				return results;
			}
		);
	});
let tranbycountry = () => {
	ftransactions.then(function (results) {
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
	})
}


tranbycountry();

module.exports.ftransactions=tranbycountry;
module.exports.getAllTransactions = getAllTransactions;