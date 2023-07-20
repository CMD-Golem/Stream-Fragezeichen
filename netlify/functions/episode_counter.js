var faunadb = require("faunadb");
var q = faunadb.query;

exports.handler = async (event, context) => {
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_NEW_SERVER_SECRET
	});

	var counter_db = await client.query(q.Get(q.Ref(`classes/stream-fragezeichen/347962978607301193`)));

	var data = counter_db.data;
	data.counter = data.counter + 1;
	data = JSON.parse(JSON.stringify(data));

	await client.query(q.Update(q.Ref(`classes/stream-fragezeichen/347962978607301193`), {data:data}));
}