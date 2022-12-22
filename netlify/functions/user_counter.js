var faunadb = require("faunadb");
var q = faunadb.query;

exports.handler = async (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	});

	// get contry of user
	var current_country = event.path.match(/([^\/]*)\/*$/)[0];

	// get counter ids
	var db_ids = [];
	var response = await client.query(q.Paginate(q.Match(q.Ref("indexes/all_stream-fragezeichen"))));

	for (var i = 0; i < response.data.length; i++) {
		db_ids.push(response.data[i].value.id);
	}

	// get data of existing stream-fragezeichen or create new doc for country
	for (var i = 0; i < db_ids.length; i++) {
		var db_id = db_ids[i];
		var counter_db = await client.query(q.Get(q.Ref(`classes/stream-fragezeichen/${db_id}`)));

		if (counter_db.data.country == current_country) {
			var data = counter_db.data;
			var new_id = db_id;
			break;
		}
		else if (db_ids.length == i + 1) {
			var data = {country:current_country, counter:0};
			var new_doc = await client.query(q.Create(q.Collection("stream-fragezeichen"), {data:data}));
			var new_id = new_doc.ref.value.id;
		}
	}

	// update db
	data.counter = data.counter + 1;

	data = JSON.parse(JSON.stringify(data));

	await client.query(q.Update(q.Ref(`classes/stream-fragezeichen/${new_id}`), {data:data}));

	return { statusCode: 200 };
}