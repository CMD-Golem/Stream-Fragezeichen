// user_role: "hidden" -> don't count clicks and user analytics

// Functions to generate the list according to settings
var provider_link, last_provider_selected, backwards, sort_date, user_data = {list:[]}, watch_list_count = 0, ignore_list_count = 0;
var user_id = null;

// get data from storage/db
function setupUserData(json_user_data) {
	user_data = JSON.parse(json_user_data);

	// int selected provider
	// deezer = 0, youtube = 1, spotify = 2, apple = 3
	provider_link = user_data.provider;
	if (provider_link == undefined) { provider_link = 0; }

	// int list sorting
	backwards = user_data.backwards;
	set_sort_list.checked = !backwards;
	if (backwards == false) {
		el_sort_list.style.transform = "scaleY(-1)";
	}
	else {
		backwards = true;
		el_sort_list.style.transform = "scaleY(1)";
	}

	// int list sort type
	sort_date = user_data.sort_date;
	set_episode_number.checked = sort_date;
	if (sort_date == true) {
		episode_number.style.display = "flex";
		release_date.style.display = "none";
	}
	else {
		sort_date = false;
		episode_number.style.display = "none";
		release_date.style.display = "flex";
	}

	// int user list
	for (var i = 0; i < user_data.list.length; i++) {
		var episode = user_data.list[i];
		var found_episode = false;

		// init counters
		if (episode.list != "") { watch_list_count++; }

		if (episode.ignored != "") { ignore_list_count++; }

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

	// select provider
	last_provider_selected = document.getElementById("provider_" + provider_link);
	last_provider_selected.classList.add("provider_selected");
}


//#################################################################################################
// load episodes
var episoden_list = document.getElementsByTagName("ol")[0];
var episode_html = [];

function loadEpisodes() {
	episode_html = [];

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

		// generate title
		var title = episode.name;
		var search_number = "";
		if (episode.type == "normal") {
			title = `<b>Folge ${episode.number}</b>: ${episode.name}`;
			search_number = episode.number + " ";
		}

		// remove episodes whiche are not aviable on selected streamer 
		if (episode.href[provider_link] == "#") {
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
			var href = `href="${episode.href[provider_link]}" target="_blank" onclick="refreshHistory('${i}', new Date())"`;
			var info = `showInfo('${i}')`;
		}

		// classes
		if (episode_data.history == undefined || episode_data.history == "1899-01-01T00:00:00.000Z" || episode_data.history == "") {
			episode_class += " no_history";
		}
		if (episode_data.list == "true") {
			episode_class += " in_watch_list";
		}
		if (episode_data.ignored == "true") {
			episode_class += " in_ignore_list";
		}
																						//number or index?							// remove?
		episode_html.push(`
		<div data-release="${episode.release}" data-history="${episode_data.history}" id="${episode.number}" class="${episode_class}" data-array="${i}" data-filter="die drei fragezeichen ??? ${search_number}${episode.name} ${episode.book_author}">
			<a ${href} class="img_play_box">
				<img src="img/${episode.number}.jpg" alt="${title}">
				<p>${title}</p>
				<button class="control_button play" title="Abspielen"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 2.5714996,-1e-7 V 24 L 21.428642,12 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
			</a>
			<button class="control_button add" title="Zur Watch List hinzufügen" onclick="toggleWatchList(${i}, this)"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 24,13.714286 H 13.714286 V 24 H 10.285714 V 13.714286 H 0 V 10.285714 H 10.285714 V 0 h 3.428572 V 10.285714 H 24 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
			<button class="control_button remove" title="Von Watch List entfernen" onclick="toggleWatchList(${i}, this)"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 0 10.285156 L 0 13.714844 L 10.285156 13.714844 L 13.714844 13.714844 L 24 13.714844 L 24 10.285156 L 13.714844 10.285156 L 10.285156 10.285156 L 0 10.285156 z " style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
			<button class="control_button info" title="Folgeninhalt anzeigen" onclick="${info}"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0Zm1.2 18h-2.4v-7.2h2.4zm0-9.6h-2.4V6h2.4z" style="fill:#fff;stroke-width:1.20001"></path></g></svg></button>
		</div>`);
	}

	// do html sorting according to settings
	if (!backwards && !show_history) {
		episode_html.reverse();
	}
	else if (show_history) {
		episode_html.reverse();
	}

	if (sort_date && !show_history) {
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

	if (show_history) {
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
	
	episoden_list.innerHTML = episode_html.join("");
}

//#################################################################################################
// change direction of episode list
var el_sort_list = document.getElementById("sort_list");
var set_sort_list = document.getElementById("settings_sort_list");

function toggleOrder() {
	backwards = !backwards;
	set_sort_list.checked = !backwards;
	storeUserData();
	loadEpisodes();

	if (backwards) {
		el_sort_list.style.transform = "scaleY(1)";
	}
	else {
		el_sort_list.style.transform = "scaleY(-1)";
	}
}

// sort episode list according to release date or numbering
var episode_number = document.getElementById("episode_number");
var set_episode_number = document.getElementById("settings_episode_number");
var release_date = document.getElementById("release_date");

function toggleSort() {
	sort_date = !sort_date;
	set_episode_number.checked = sort_date;
	storeUserData();
	loadEpisodes();

	if (sort_date) {
		episode_number.style.display = "flex";
		release_date.style.display = "none";
	}
	else {
		episode_number.style.display = "none";
		release_date.style.display = "flex";
	}
}

//#################################################################################################
// load user data
var input_user_id = document.getElementById("user_id");

async function loadData() {
	var json_user_data = window.localStorage.getItem("user_data");
	user_id = window.localStorage.getItem("user_id");

	// read data from db
	if (user_id != null) {
		var response = await fetch("/.netlify/functions/db_read", {
			method: "POST",
			body: user_id,
		});

		var response_object = await response.json();

		if (response.status == 200) {
			json_user_data = JSON.stringify(response_object);

			input_user_id.value = user_id;
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

	// setup according to user data
	if (json_user_data != null) {
		setupUserData(json_user_data);
	}
	else {
		provider_link = 0;
		backwards = true;
		sort_date = false;

		showSettings(); //actions.js
		if (window_width <= 506) { overflowMenu(); } //actions.js

		last_provider_selected = document.getElementById("provider_0");
		last_provider_selected.classList.add("provider_selected");
	}

	// load html
	loadEpisodes();
}

loadData();

// store user data on storage/db
// document.addEventListener("visibilitychange", function() { if (document.hidden) { storeUserData() } });
// document.addEventListener("beforeunload", storeUserData);

async function storeUserData() {
	console.log("Saved User data");

	user_data.provider = provider_link;
	user_data.backwards = backwards;
	user_data.sort_date = sort_date;

	var json_user_data = JSON.stringify(user_data);
	window.localStorage.setItem("user_data", json_user_data);
	
	// store on db
	if (user_id != null) {
		var fetch_body = {
			id: user_id,
			data: user_data
		}
	
		var json_fetch_body = JSON.stringify(fetch_body);
	
		var response = await fetch("/.netlify/functions/db_update", {
			method: "POST",
			body: json_fetch_body,
		});

		if (response.status != 200) {
			alert("Benutzer Daten konnte nicht hochgeladen werden!");
			console.error(response);
			console.error(await response.json());
		}
	}
}

//#################################################################################################
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
	}
	// Add to Watchlist
	else {
		el_button.parentNode.classList.add("in_watch_list");
		watch_list_count++;
		episode_data.list = "true";
	}

	storeUserData();
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
	}
	// Add to Ignore List
	else {
		el_button.parentNode.classList.add("in_ignore_list");
		ignore_list_count++;
		episode_data.ignored = "true";
	}

	storeUserData();
}

//#################################################################################################
// History
var info_history = document.getElementById("info_history");
var edit_history = document.getElementById("edit_history");
var done_history = document.getElementById("done_history");
var this_year = new Date().getFullYear();
var date_before_edit, finished_input;

function refreshHistory(episoden_index, date, click_counter) {
	// get or create user_data entry
	var user_data_index = episoden[episoden_index].user_data_index;

	if (user_data_index == undefined) {
		user_data_index = createUserDataIndex(episoden_index);
	}

	var episode_data = user_data.list[user_data_index];

	// store date
	episode_data.history = date;
	storeUserData();

	// Click counter
	if (user_role != "hidden" && click_counter != false) {
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

function saveEditHistory() {
	info_history.disabled = true;
	edit_history.style.display = "inline-block";
	done_history.style.display = "none";

	var date_array = info_history.value.split(".");
	var date = `${date_array[2]}-${date_array[1]}-${date_array[0]}T00:00:00.000Z`;

	refreshHistory(info_history.dataset.array, date, false);
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
		if (size == 10 && Number(info_history.value.split('.')[2]) < 1900) {
			info_history.value = info_history.value.slice(0, -4) + this_year;
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

//#################################################################################################
// Show Watch list, History
var show_watch_list = false;
var show_ignore_list = false;
var show_history = false;

function showWatchList() {
	show_watch_list = !show_watch_list;
	show_history = false;
	refreshList();
}

function showHistory() {
	show_history = !show_history;
	show_watch_list = false;
	refreshList();
}

function refreshList() {
	no_watch_list.style.display = "none";
	no_history.style.display = "none";

	episoden_list.classList.remove("show_history");
	episoden_list.classList.remove("show_watch_list");

	if (show_watch_list) {
		// loadEpisodes();
		episoden_list.classList.add("show_watch_list");
		if (watch_list_count == 0) { no_watch_list.style.display = "block"; }
	}
	else if (show_history) {
		loadEpisodes();
		episoden_list.classList.add("show_history");
		if (episoden_list.querySelectorAll("div:not(.no_history)").length == 0) { no_history.style.display = "block"; }
	}
	else {
		loadEpisodes();
	}
	refreshNavButtons(); // actions.js
}