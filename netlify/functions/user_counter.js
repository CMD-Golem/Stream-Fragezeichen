var fetch = require("node-fetch");
var faunadb = require("faunadb");
var q = faunadb.query;

exports.handler = async (event, context) => {
	// get FaunaDB secret key
	var client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_SECRET
	});

	// get contry of user
	var country_response = await fetch("https://stream-fragezeichen.netlify.app/get-country");
	var geo_data = await country_response.json();
	var current_country = geo_data.geo.geo.country.name;

	// get counter from db
	var response = await client.query(q.Paginate(q.Match(q.Ref("indexes/get_stream-fragezeichen"))));
	console.log(response.data)
	var getAllTodoDataQuery = response.data.map((ref) => {
		return q.Get(ref);
	})

	console.log(getAllTodoDataQuery)
	var counter_db = client.query(getAllTodoDataQuery);

	// get ts of existing country or create new doc for country
	for (var i = 0; i < counter_db.length; i++) {
		if (counter_db[i].data.country == current_country) {
			var ts = counter_db[i].ts;
			var data = counter_db[i].data;
		}
		else if (counter_db.length == i - 1) {
			var new_doc = await client.query(q.Create(q.Collection("stream-fragezeichen"),{data:{country:current_country, counter:0}}));
			var ts = new_doc.ts;
			var data = {country:current_country, counter:0};
		}
	}

	// update db
	return data;
	// data.counter = data.counter + 1;

	// data = JSON.parse(JSON.stringify(data));

	// await client.query(q.Update(q.Ref(`classes/stream-fragezeichen/${ts}`), {data}));
}