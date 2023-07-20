var faunadb = require("faunadb");
var q = faunadb.query;

exports.handler = async (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_NEW_SERVER_SECRET
	});

	var data = JSON.parse(event.body);

	var new_doc = await client.query(q.Create(q.Collection("user_data"), {data:data}));
	var new_id = new_doc.ref.value.id;

	return new_id;
}