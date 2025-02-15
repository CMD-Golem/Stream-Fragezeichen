var html_list = document.querySelector("ol");
var user_data, user_id;

async function loadId(id, manuall) {
	// dont fetch if id is obviously broken
	if (id == null || id == "" || id.length != 18) {
		if (manuall) html_list.innerHTML = "Die ID ist fehlerhaft oder entfernt worden!";
		return;
	}
	user_id = id;

	// autofill id when delivered via url
	if (!manuall) document.getElementById('user_id').value = user_id;

	// fetch data
	var response = await fetch("/.netlify/functions/db_chronicle", {
		method: "POST",
		body: user_id
	});

	if (response.status == 200) {
		user_data = await response.json();

		// generate html
		var html = "";

		for (var i = 0; i < user_data.length; i++) {
			var obj = user_data[i].data;
			if (obj.list == undefined) continue;
			var table = "";

			for (var j = 0; j < obj.list.length; j++) {
				var episode = obj.list[j];

				// generate episode name
				name:
				for (var k = 0; k < episoden.length; k++) {
					if (episode.number == episoden[k].number) {
						if (episoden[k].type == "normal") var title = `Folge ${episode.number}: ${episoden[k].name}`;
						else var title = episoden[k].name;
						break name;
					}
				}

				// generate date
				if (episode.history == undefined) var date = "nie gehört";
				else var date = new Date(episode.history).toLocaleString("de-CH");

				// generate table row
				table += `
					<tr>
						<td>${title}</td>
						<td>${date}</td>
						<td>${visBool(episode.list)}</td>
						<td>${visBool(episode.ignored)}</td>
					</tr>
				`;
			}

			// generate details
			html += `
				<details onclick="spoiler(event, true)" open>
					<summary>${new Date(obj.a_latest_upload).toLocaleString("de-CH")}</summary>
					<button onclick="uploadData(${i})"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M14 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-2-9c-4.97 0-9 4.03-9 9H0l4 4 4-4H5c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.51 0-2.91-.49-4.06-1.3l-1.42 1.44C8.04 20.3 9.94 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/></g></svg></button>
					<table>
						<tr>
							<th>Folge</th>
							<th>Verlauf</th>
							<th>Watch List</th>
							<th>Ignoriert</th>
						</tr>
						${table}
					</table>
				</details>`;
		}

		html_list.innerHTML = html;
	}
	else html_list.innerHTML = "Die ID ist fehlerhaft oder entfernt worden!";
}

function visBool(bool) {
	if (bool) return "&check;";
	else return "&cross;";
}

async function uploadData(index) {
	if (!confirm("Sämtliche Daten die auf deiner ID gespeichert sind werden gelöscht und durch die alten Daten ersetzt!")) return;

	var fetch_body = {
		id: user_id,
		data: user_data[index].data
	}

	var json_fetch_body = JSON.stringify(fetch_body);

	var response = await fetch("/.netlify/functions/db_update", {
		method: "POST",
		body: json_fetch_body,
	});

	if (response.status == 200) {
		console.log("Uploaded Episode data");
	}
	else {
		alert("Benutzer Daten konnte nicht hochgeladen werden!");
		console.error(response);
	}
}

var url_parameter = new URLSearchParams(window.location.search);
loadId(url_parameter.get("id"), false);