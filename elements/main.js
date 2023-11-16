// user_role: "hidden" -> don't count clicks and user analytics

// load episodes
var episoden_list = document.getElementsByTagName("ol")[0];

function loadEpisodes() {
	var episode_html = [];

	for (var i = 0; i < episoden.length; i++) {
		var episode = episoden[i];
		var episode_class = "";

		// get user_data index
		if (episode.user_data_index != undefined) {
			var episode_data = user_data.list[episode.user_data_index];
		}
		else {
			var episode_data = {};
		}

		// get index of episode 001
		if (episode.number == "001") {
			var first_episode_index = i + 1;
		}

		// generate title
		var title = episode.name;
		var search_number = "";
		var search = "";
		if (episode.type == "normal") {
			title = `<b>Folge ${episode.number}</b>: ${episode.name}`;
			search_number = episode.number + " ";
		}
		else {
			search = " " + episode.search;
		}


		// remove episodes whiche are not aviable on selected streamer 
		if (episode.href[user_data.provider] == "#") {
			var href = 'href="#"';
			episode_class += " not_aviable";
			var info = "";
		}
		// add message for unreleased episodes
		else if (episode.href[0] == "#new") {
			var href = `href="#" onclick="alert('Diese Folge ist erst ab dem ${episode.href[1]} verfügbar.');"`;
			var info = `alert('Diese Folge ist erst ab dem ${episode.href[1]} verfügbar.')`;
		}
		// setup episodes links
		else {
			var href = `href="${episode.href[user_data.provider]}" target="_blank" onclick="refreshHistory('${i}')"`;
			var info = `showInfo('${i}')`;
		}

		// classes
		if (episode_data.history == undefined) {
			episode_class += " no_history";
		}
		if (episode_data.list == "true") {
			episode_class += " in_watch_list";
		}
		if (episode_data.ignored == "true") {
			episode_class += " in_ignore_list";
		}

		episode_html.push(`
		<div data-release="${episode.release}" data-history="${episode_data.history}" id="${i}" class="${episode_class}" data-filter="die drei fragezeichen ??? ${search_number}${episode.name} ${episode.book_author}${search}">
			<a ${href}>
				<img src="img/${episode.number}.jpg" alt="${title}">
				<p>${title}</p>
				<button class="control_button play" title="Abspielen"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M5.142 0v24L24 12z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
			</a>
			<button class="control_button add" title="Zur Watch List hinzufügen" onclick="toggleWatchList(${i}, this)"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 24,13.714286 H 13.714286 V 24 H 10.285714 V 13.714286 H 0 V 10.285714 H 10.285714 V 0 h 3.428572 V 10.285714 H 24 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
			<button class="control_button remove" title="Von Watch List entfernen" onclick="toggleWatchList(${i}, this)"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 0 10.285156 L 0 13.714844 L 10.285156 13.714844 L 13.714844 13.714844 L 24 13.714844 L 24 10.285156 L 13.714844 10.285156 L 10.285156 10.285156 L 0 10.285156 z " style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
			<button class="control_button info" title="Folgeninhalt anzeigen" onclick="${info}"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0Zm1.2 18h-2.4v-7.2h2.4zm0-9.6h-2.4V6h2.4z" style="fill:#fff;stroke-width:1.20001"></path></g></svg></button>
		</div>`);
	}

	if (sort_date && !show_history) {
		if (!backwards) { episode_html = episode_html.reverse(); }

		episode_html.sort((a, b) => {
			var a_date = a.slice(21, 31);
			var b_date = b.slice(21, 31);

			if (backwards) {
				if (a_date < b_date) { return 1; }
				if (a_date > b_date){ return -1; }
			}
			else {
				if (a_date < b_date) { return -1; }
				if (a_date > b_date){ return 1; }
			}
			return 0;
		});
	}
	else if (show_history) {
		episode_html.sort((a, b) => {
			var a_date = a.slice(47, 71);
			var b_date = b.slice(47, 71);

			if (backwards) {
				if (a_date < b_date) { return 1; }
				if (a_date > b_date){ return -1; }
			}
			else {
				if (a_date < b_date) { return -1; }
				if (a_date > b_date){ return 1; }
			}
			return 0;
		});
	}
	else if (!backwards) {
		episode_html = episode_html.slice(0, first_episode_index).reverse().concat(episode_html.slice(first_episode_index));
	}
	
	episoden_list.innerHTML = episode_html.join("");
}

//#################################################################################################
// change direction of episode list
function toggleOrder() {
	backwards = !backwards;
	document.getElementById("settings_sort_list").checked = !backwards;
	storeUserData(false);
	loadEpisodes();

	if (backwards) {
		document.getElementById("sort_list").style.transform = "scaleY(1)";
	}
	else {
		document.getElementById("sort_list").style.transform = "scaleY(-1)";
	}
}

// sort episode list according to release date or numbering
function toggleSort() {
	sort_date = !sort_date;
	document.getElementById("settings_episode_number").checked = sort_date;
	storeUserData(false);
	loadEpisodes();

	if (sort_date) {
		document.getElementById("episode_number").style.display = "flex";
		document.getElementById("release_date").style.display = "none";
	}
	else {
		document.getElementById("episode_number").style.display = "none";
		document.getElementById("release_date").style.display = "flex";
	}
}

//#################################################################################################
// load user data
var user_data = {list:[]}, last_provider_selected, backwards, sort_date, watch_list_count = 0, ignore_list_count = 0;
var user_id = null;
var input_user_id = document.getElementById("user_id");

async function loadData() {
	var json_user_data = window.localStorage.getItem("user_data");
	// user_id = window.localStorage.getItem("user_id"); user_id != null

	// setup according to user data
	if (json_user_data != null) {
		user_data = JSON.parse(json_user_data);

		// int list sorting
		backwards = !user_data.backwards;
		sort_date = !user_data.sort_date;
		toggleOrder();
		toggleSort();

		// read remote episode data and overwrite local episode data (null can be removed)
		if (user_data.user_id != undefined) {
			var response = await fetch("/.netlify/functions/db_read", {
				method: "POST",
				body: user_data.user_id,
			});

			var response_object = await response.json();

			if (response.status == 200) {
				var remote_data = JSON.stringify(response_object);
				user_data.list = remote_data.list;
				user_data.a_name = remote_data.a_name;

				input_user_id.value = user_data.user_id;
				console.log("Server Daten vom " + remote_data.latest_upload + " wurden geladen.");
			}
			else if (response.status == 502) {
				alert("Die registierte ID ist fehlerhaft oder entfernt worden!");
				disconnectId();
			}
			else {
				alert("Benutzer Daten konnten nicht heruntergeladen werden!");
				console.error(response);
				console.error(response_object);
			}
		}

		// int episode data: history, watchlist, ignore_list
		for (var i = 0; i < user_data.list.length; i++) {
			var episode = user_data.list[i];
			var found_episode = false;

			// init counters
			if (episode.list == "true") { watch_list_count++; }

			if (episode.ignored == "true") { ignore_list_count++; }

			// store user data array 
			for (var j = 0; j < episoden.length; j++) {
				if (episode.number == episoden[j].number) {
					episoden[j].user_data_index = i;
					found_episode = true;
					break;
				}
			}

			if (!found_episode) {
				console.warn("Episode in den Nutzerdaten konnte nicht gefunden werden.");
			}
		}
	}
	else {
		// setup user_data one first visit
		user_data.provider = 0;
		user_data.cover_size = "2";
		user_data.show_episode_title = true;
		user_data.backwards = true;
		user_data.sort_date = false;
		backwards = true;
		sort_date = false;

		showSettings(); //actions.js
		if (window.innerWidth <= 506) { overflowMenu(); } //actions.js
	}

	// setup selected provider (deezer = 0, youtube = 1, spotify = 2, apple = 3)
	last_provider_selected = document.getElementById("provider_" + user_data.provider);
	last_provider_selected.classList.add("provider_selected");

	// setup cover size
	document.getElementById("settings_cover_size").value = user_data.cover_size;
	changeCoverSize(user_data.cover_size); // actions.js

	// load html
	loadEpisodes();
}

loadData();

// store user data in local storage and upload local episode data if needed
async function storeUserData(remote) {
	user_data.backwards = backwards;
	user_data.sort_date = sort_date;

	var json_user_data = JSON.stringify(user_data);
	window.localStorage.setItem("user_data", json_user_data);

	if (remote && user_data.user_id != undefined) {
		var remote_data = {};
		remote_data.latest_upload = new Date();
		remote_data.list = user_data.list;
		remote_data.a_name = user_data.a_name;

		var fetch_body = {
			id: user_data.user_id,
			data: remote_data
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
			console.error(await response.json());
		}
	}
}

// create new index in user data for episode
function createUserDataIndex(episoden_index) {
	// create user data entry
	var user_data_index = user_data.list.push({number:episoden[episoden_index].number});
	user_data_index--;

	// store user_data_index in episoden array and return it
	episoden[episoden_index].user_data_index = user_data_index;
	return user_data_index;
}

//#################################################################################################
// Watchlist
var no_watch_list = document.getElementById("no_watch_list");

function toggleWatchList(episoden_index, el_button) {
	// get or create user_data entry
	var user_data_index = episoden[episoden_index].user_data_index;

	if (user_data_index == undefined) {
		user_data_index = createUserDataIndex(episoden_index);
	}

	var episode_data = user_data.list[user_data_index];

	// Remove from Watchlist
	if (episode_data.list == "true") {
		el_button.parentNode.classList.remove("in_watch_list");
		watch_list_count--;
		episode_data.list = undefined;

		if (watch_list_count == 0 && show_watch_list) {
			no_watch_list.style.display = "block";
		}
		if ((show_info || show_random_episode) && (play_box.dataset.index == episoden_index)) {
			play_box.classList.remove("in_watch_list");
			document.getElementById(episoden_index).classList.remove("in_watch_list");
		}
	}
	// Add to Watchlist
	else {
		el_button.parentNode.classList.add("in_watch_list");
		watch_list_count++;
		episode_data.list = "true";

		if (show_watch_list) {
			no_watch_list.style.display = "none";
		}
		if ((show_info || show_random_episode) && (play_box.dataset.index == episoden_index)) {
			play_box.classList.add("in_watch_list");
			document.getElementById(episoden_index).classList.add("in_watch_list");
		}
	}

	storeUserData(true);
}

//#################################################################################################
// Ignore List
var no_ignore_list = document.getElementById("no_ignore_list");

function toggleIgnoreList(episoden_index, el_button) {
	// get or create user_data entry
	var user_data_index = episoden[episoden_index].user_data_index;

	if (user_data_index == undefined) {
		user_data_index = createUserDataIndex(episoden_index);
	}

	var episode_data = user_data.list[user_data_index];

	// Remove from Ignore List
	if (episode_data.ignored == "true") {
		el_button.parentNode.classList.remove("in_ignore_list");
		ignore_list_count--;
		episode_data.ignored = undefined;

		if (ignore_list_count == 0 && show_ignore_list) {
			no_ignore_list.style.display = "block";
		}
		if ((show_info || show_random_episode) && (play_box.dataset.index == episoden_index)) {
			play_box.classList.remove("in_ignore_list");
			document.getElementById(episoden_index).classList.remove("in_ignore_list");
		}
	}
	// Add to Ignore List
	else {
		el_button.parentNode.classList.add("in_ignore_list");
		ignore_list_count++;
		episode_data.ignored = "true";

		if (show_ignore_list) {
			no_ignore_list.style.display = "none";
		}
		if ((show_info || show_random_episode) && (play_box.dataset.index == episoden_index)) {
			play_box.classList.add("in_ignore_list");
			document.getElementById(episoden_index).classList.add("in_ignore_list");
		}
	}

	storeUserData(true);
}

//#################################################################################################
// History
var info_history = document.getElementById("info_history");
var edit_history = document.getElementById("edit_history");
var done_history = document.getElementById("done_history");
var date_before_edit, finished_input;

function refreshHistory(episoden_index, date) {
	// get or create user_data entry
	var user_data_index = episoden[episoden_index].user_data_index;

	if (user_data_index == undefined) {
		user_data_index = createUserDataIndex(episoden_index);
	}
	
	var episode_data = user_data.list[user_data_index];

	// store current date
	if (date == undefined) {
		episode_data.history = new Date();
	}
	// remove stored date
	else if (date == false) {
		episode_data.history = undefined;
		info_history.value = "nie";
		document.getElementById(episoden_index).classList.add("no_history");
	}
	// store predefined date
	else {
		episode_data.history = date;
	}

	storeUserData(true);

	// Click counter
	if (user_role != "hidden" && date != undefined && date != false) {
		fetch("/.netlify/functions/episode_counter/");
	}
}

function editHistory() {
	if (info_history.disabled) {
		if (info_history.value == "nie") {
			info_history.value = "tt.mm.yyyy";
		}
		info_history.disabled = false;
		date_before_edit = info_history.value;
		info_history.scrollIntoView({behavior: "smooth"});
	}
	else {
		info_history.value = date_before_edit;
	}
	info_history.select();
	info_history.focus();
}

function saveEditHistory(episoden_index) {
	info_history.disabled = true;
	edit_history.style.display = "inline-block";
	done_history.style.display = "none";

	var date_array = info_history.value.split(".");
	var date = `${date_array[2]}-${date_array[1]}-${date_array[0]}T00:00:00.000Z`;

	if (date == "1999-01-01T00:00:00.000Z") {
		date = false;
	}

	refreshHistory(episoden_index, date);
}

// Check user input (origin: https://stackoverflow.com/a/43473017/14225364)
info_history.onkeyup = function(evt) {
	var size = info_history.value.length;
	if (size <= 9 && finished_input) {
		finished_input = false;
		edit_history.style.display = "inline-block";
		done_history.style.display = "none";
	}

	if ((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 96 && evt.keyCode <= 105)) {
		if (size == 2 && info_history.value > 31) {
			info_history.value = "31";
		}
		if (size == 5 && Number(info_history.value.split('.')[1]) > 12) {
			info_history.value = info_history.value.slice(0, -2) + "12";
		}
		if (size == 10 && Number(info_history.value.split('.')[2]) < 1999) {
			info_history.value = info_history.value.slice(0, -4) + new Date().getFullYear();
		}
		if (size == 10) {
			finished_input = true;
			edit_history.style.display = "none";
			done_history.style.display = "inline-block";
		}

		if ((size == 2 && info_history.value < 32) || (size == 5 && Number(info_history.value.split('.')[1]) < 13)) {
			info_history.value += '.';        
		}
	}
	
}

info_history.onkeydown = function(evt) {
	if (evt.keyCode != 8 && // backspace
		evt.keyCode != 46 && // delete
		evt.keyCode != 37 && // move left
		evt.keyCode != 39 && // move right
		!(evt.keyCode >= 48 && evt.keyCode <= 57) &&
		!(evt.keyCode >= 96 && evt.keyCode <= 105)) {
		evt.preventDefault();
	}
}
