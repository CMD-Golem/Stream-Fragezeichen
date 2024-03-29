var faunadb = require("faunadb");
var q = faunadb.query;

exports.handler = async (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	});

	var body = JSON.parse(event.body);

	var user_id = body.id;
	var user_data = body.data;

	var response = await client.query(q.Update(q.Ref(`classes/user_data/${user_id}`), {data:user_data}));

	return {
		statusCode: 200,
		body: JSON.stringify(response)
	}
}