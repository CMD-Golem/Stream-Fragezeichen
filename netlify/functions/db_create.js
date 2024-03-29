var faunadb = require("faunadb");
var q = faunadb.query;

exports.handler = async (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	});

	var user_data = JSON.parse(event.body);

	var new_doc = await client.query(q.Create(q.Collection("user_data"), {data:user_data}));
	var new_id = new_doc.ref.value.id;

	var response = {user_id: new_id}

	return {
		statusCode: 200,
		body: JSON.stringify(response)
	}
}