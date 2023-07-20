var faunadb = require("faunadb");
var q = faunadb.query;

exports.handler = async (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_NEW_SERVER_SECRET
	});

	var user_id = event.body.id;
	var data = JSON.parse(event.body.data);

	var response = await client.query(q.Update(q.Ref(`classes/user_data/${user_id}`), {data:data}));

	return response;
}