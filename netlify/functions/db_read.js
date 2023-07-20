var faunadb = require("faunadb");
var q = faunadb.query;

exports.handler = async (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_NEW_SERVER_SECRET
	});

	var user_id = event.body;

	var response = await client.query(q.Get(q.Ref(`classes/user_data/${user_id}`)));
	
	return {
		statusCode: 200,
		body: JSON.stringify(response.data)
	}
}