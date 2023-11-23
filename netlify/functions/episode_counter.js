var faunadb = require("faunadb");
var q = faunadb.query;

exports.handler = async (event, context) => {
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	});

	var counter_db = await client.query(q.Get(q.Ref(`classes/user_counter/370879542209806541`)));

	var data = counter_db.data;
	data.counter = data.counter + 1;
	data = JSON.parse(JSON.stringify(data));

	await client.query(q.Update(q.Ref(`classes/user_counter/370879542209806541`), {data:data}));

	return { statusCode: 200 };
}