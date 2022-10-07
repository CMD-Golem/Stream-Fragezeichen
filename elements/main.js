// Functions to generate the list according to settings
// setup(); storeUserData(); changeUserData(); loadEpisodes();
// toggleOrder(); toggleSort();
// toggleWatchList(); showWatchList();
// refreshHistory(); editHistory(); saveEditHistory(); showHistory();

var provider, provider_link, backwards, sort_date, active_type, user_data = {list:[]}, watch_list_count = 0;

// get data from storage/db
function setup() {
	var json_user_data = window.localStorage.getItem("user_data");
	if (json_user_data != null) {
		user_data = JSON.parse(json_user_data);

		// int selected provider
		provider = user_data.provider;
		if (user_data.provider == undefined) { provider = "youtube"; }

		if (provider == "deezer") { provider_link = 0; } 
		else if (provider == "spotify") { provider_link = 2; }
		else if (provider == "apple") { provider_link = 3; }
		else { provider_link = 1; } // Youtube

		// int list sorting
		backwards = user_data.backwards;
		if (backwards == false) {
			el_sort_list.style.transform = "scaleY(-1)";
		}
		else {
			backwards = true;
			el_sort_list.style.transform = "scaleY(1)";
		}

		// int list sort type
		sort_date = user_data.sort_date;
		if (sort_date == true) {
			episode_number.style.display = "flex";
			release_date.style.display = "none";
		}
		else {
			sort_date = false;
			episode_number.style.display = "none";
			release_date.style.display = "flex";
		}

		active_type = "all";

		// int user list
		for (var i = 0; i < user_data.list.length; i++) {
			var episode = user_data.list[i];
			var add_class = "";

			// int history
			var history = "";

			if (episode.history != "") {
				history = episode.history;
			}

			// int watch list
			if (episode.list != "") {
				add_class += "in_watch_list ";
				watch_list_count++;
			}

			// load in episode array
			var episode_id = episode.array_id.split("_");
			if (episode_id[0] == "normal") {
				episoden[episode_id[1]].class = add_class;
				episoden[episode_id[1]].history = history;
			}
			else {
				special[episode_id[1]].class = add_class;
				special[episode_id[1]].history = history;
			}
		}
	}
}

//#################################################################################################
// store user data on storage/db
document.addEventListener("visibilitychange", function() { if (document.hidden) { storeUserData() } });
document.addEventListener("beforeunload", storeUserData);

function storeUserData() {
	console.log("Saved User data");

	user_data.provider = provider;
	user_data.backwards = backwards;
	user_data.sort_date = sort_date;
	user_data.active_type = active_type;

	json_user_data = JSON.stringify(user_data);
	window.localStorage.setItem("user_data", json_user_data);
}

//#################################################################################################
// make changes to user data list
function changeUserData(array_id, history, list) {
	var in_array = false;
	var add_class = "";

	// if (user_list[0] == undefined) { return; }

	for (var i = 0; i < user_data.list.length; i++) {
		if (user_data.list[i].array_id == array_id) {
			in_array = i;
		}
	}

	// add episode to user list if not existing
	if (in_array === false) {
		var in_array = user_data.list.push({array_id:array_id, history:"", list:""});
		in_array--;
	}

	// change history
	if (history != "" || user_data.list[in_array].history != "") {
		user_data.list[in_array].history = history;
	}

	// change watch list
	if (list == "true") {
		user_data.list[in_array].list = "true";
		add_class += "in_watch_list ";
	}
	else if (list == "false") { user_data.list[in_array].list = ""; }

	// load in episode array
	var episode_id = array_id.split("_");
	if (episode_id[0] == "normal") {
		episoden[episode_id[1]].class = add_class;
		episoden[episode_id[1]].history = history;
	}
	else {
		special[episode_id[1]].class = add_class;
		special[episode_id[1]].history = history;
	}
}

//#################################################################################################
// load episodes
var episoden_list = document.getElementsByTagName("ol")[0];

function loadEpisodes(load_type) {
	var html = [];

	// load_type: normal, special, all, history (all but with special sort)
	// load normal episods if load type isnt special
	if (load_type != "special") {
		for (var i = 0; i < episoden.length; i++) {
			var episode = episoden[i];
			var number = parseInt(episode.number);
			var episode_class = episode.class
	
			if (episode.href[provider_link] != "#" && episode.href[0] != "#new") {
				var href = `href="${episode.href[provider_link]}" target="_blank" onclick="refreshHistory('normal_${i}')"`;
				var info = `showInfo('normal_${i}')`
			}
			else if (episode.href[0] == "#new") {
				var href = `href="#" onclick="alert('Diese Folge ist erst ab dem ${episode.href[1]} verfügbar.');"`;
				var info = `alert('Diese Folge ist erst ab dem ${episode.href[1]} verfügbar.')`
			}
			else {
				var href = 'href="#"';
				episode_class += "not_aviable ";
				var info = "";
			}
	
			html.push(`
			<div data-release="${episode.release}" data-history="${episode.history}" id="${number}" class="${episode_class}" data-array="normal_${i}" data-filter="die drei fragezeichen ??? ${number} ${episode.name}">
				<a ${href} class="img_play_box">
					<img src="img/episode_${number}.jpg" alt="Folge ${episode.number}: ${episode.name}">
					<p><b>Folge ${episode.number}</b>: ${episode.name}</p>
					<button class="control_button play" title="Abspielen"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 2.5714996,-1e-7 V 24 L 21.428642,12 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				</a>
				<button class="control_button add" title="Zur Watch List hinzufügen" onclick="toggleWatchList(this, 'normal')"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 24,13.714286 H 13.714286 V 24 H 10.285714 V 13.714286 H 0 V 10.285714 H 10.285714 V 0 h 3.428572 V 10.285714 H 24 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				<button class="control_button remove" title="Von Watch List entfernen" onclick="toggleWatchList(this, 'normal')"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 0 10.285156 L 0 13.714844 L 10.285156 13.714844 L 13.714844 13.714844 L 24 13.714844 L 24 10.285156 L 13.714844 10.285156 L 10.285156 10.285156 L 0 10.285156 z " style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				<button class="control_button info" title="Folgeninhalt anzeigen" onclick="${info}"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0Zm1.2 18h-2.4v-7.2h2.4zm0-9.6h-2.4V6h2.4z" style="fill:#fff;stroke-width:1.20001"></path></g></svg></button>
			</div>`);
		}
		if (backwards && !show_history) {
			html.reverse();
		}
		else if (show_history) {
			html.reverse();
		}
	}
	// load special episods if load type isnt normal
	if (load_type != "normal") {
		for (var i = 0; i < special.length; i++) {
			var episode = special[i];
			var episode_class = episode.class
	
			if (episode.href[provider_link] != "#" || episode.href[0] != "#new") {
				var href = `href="${episode.href[provider_link]}" target="_blank" onclick="refreshHistory('special_${i}')"`;
				var info = `showInfo('special_${i}')`
			}
			else if (episode.href[0] == "#new") {
				var href = `href="#" onclick="alert('Diese Folge ist erst ab dem ${episode.href[1]} verfügbar.')"`;
				var info = `alert('Diese Folge ist erst ab dem ${episode.href[1]} verfügbar.')`
			}
			else {
				var href = 'href="#"';
				episode_class += "not_aviable ";
				var info = "";
			}

			html.push(`
			<div data-release="${episode.release}" data-history="${episode.history}" id="${episode.number}" class="${episode_class}" data-array="special_${i}" data-filter="die drei fragezeichen ??? ${episode.search} ${episode.name}">
				<a ${href} class="img_play_box">
					<img src="img_special/special_${episode.number.toLowerCase()}.jpg" alt="${episode.name}">
					<p>${episode.name}</p>
					<button class="control_button play" title="Abspielen"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 2.5714996,-1e-7 V 24 L 21.428642,12 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				</a>
				<button class="control_button add" title="Zur Watch List hinzufügen" onclick="toggleWatchList(this, 'special')"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 24,13.714286 H 13.714286 V 24 H 10.285714 V 13.714286 H 0 V 10.285714 H 10.285714 V 0 h 3.428572 V 10.285714 H 24 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				<button class="control_button remove" title="Von Watch List entfernen" onclick="toggleWatchList(this, 'special')"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 0 10.285156 L 0 13.714844 L 10.285156 13.714844 L 13.714844 13.714844 L 24 13.714844 L 24 10.285156 L 13.714844 10.285156 L 10.285156 10.285156 L 0 10.285156 z " style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				<button class="control_button info" title="Folgeninhalt anzeigen" onclick="${info}"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0Zm1.2 18h-2.4v-7.2h2.4zm0-9.6h-2.4V6h2.4z" style="fill:#fff;stroke-width:1.20001"></path></g></svg></button>
			</div>`);
		}
	}

	if (show_history) {
		html.sort((a, b) => {
			var a_date = a.slice(45, 69);
			var b_date = b.slice(45, 69);

			if (new Date(a_date) == "Invalid Date") {
				a_date = "2000-01-01T00:00:00.000Z"
			}
			if (new Date(b_date) == "Invalid Date") {
				b_date = "2000-01-01T00:00:00.000Z"
			}

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

	if (sort_date) {
		html.sort((a, b) => {
			var a_date = a.slice(19, 29);
			var b_date = b.slice(19, 29);

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
	
	episoden_list.innerHTML = html.join("");
}

//#################################################################################################
// change direction of episode list
var el_sort_list = document.getElementById("sort_list");

function toggleOrder() {
	backwards = !backwards;
	if (backwards) {
		el_sort_list.style.transform = "scaleY(1)";
	}
	else {
		el_sort_list.style.transform = "scaleY(-1)";
	}

	console.log(backwards)
	
	if (show_history) {
		loadEpisodes("history");
	}
	else {
		loadEpisodes(active_type);
	}
}

//#################################################################################################
// sort episode list for date or numbering
var episode_number = document.getElementById("episode_number");
var release_date = document.getElementById("release_date");

function toggleSort() {
	sort_date = !sort_date;
	if (sort_date) {
		episode_number.style.display = "flex";
		release_date.style.display = "none";
	}
	else {
		episode_number.style.display = "none";
		release_date.style.display = "flex";
	}
	
	if (show_history) {
		loadEpisodes("history");
	}
	else {
		loadEpisodes(active_type);
	}
}

//#################################################################################################
// init
setup();
loadEpisodes("all");


//#################################################################################################
// Watchlist
var no_watch_list = document.getElementById("no_watch_list");

function toggleWatchList(el_button) {
	var element = el_button.parentNode;
	var array_id = element.dataset.array;

	if (!element.classList.contains("in_watch_list")) {
		// Add to Watchlist
		element.classList.add("in_watch_list");
		watch_list_count++;
		changeUserData(array_id, "", "true");
	}
	else {
		// Remove from Watchlist
		element.classList.remove("in_watch_list");
		watch_list_count--;
		changeUserData(array_id, "", "false");

		if (watch_list_count == 0 && show_watch_list) {
			no_watch_list.style.display = "block";
		}
	}
}

var show_watch_list = false;

function showWatchList(el) {
	removeActiveNav("watch_list"); // actions.js
	if (show_watch_list) {
		document.querySelector(":root").style.setProperty("--watch_list", "block");
		show_watch_list = false;
		no_watch_list.style.display = "none";
		// loadEpisodes(active_type);
	}
	else {
		document.querySelector(":root").style.setProperty("--watch_list", "none");
		show_watch_list = true;
		el.classList.add("nav_active");
		// loadEpisodes("all");
		if (watch_list_count == 0) {
			no_watch_list.style.display = "block";
		}
	}
}


//#################################################################################################
// History
var date_input = document.getElementById("info_history");
var edit_history = document.getElementById("edit_history");
var done_history = document.getElementById("done_history");
var this_year = new Date().getFullYear();
var date_before_edit, finished_input;

function refreshHistory(array_id) {
	var episode_id = array_id.split("_");

	if (episode_id[0] == "normal") {
		var episode = episoden[episode_id[1]];
		info_img.src = `img/episode_${parseInt(episode.number)}.jpg`;
	}
	else {
		var episode = special[episode_id[1]];
		info_img.src = `img_special/special_${episode.number}.jpg`;
	}

	changeUserData(array_id, new Date(), "");
}

function editHistory() {
	if (date_input.disabled) {
		if (date_input.value == "nie") {
			date_input.value = "tt.mm.yyyy";
		}
		date_input.disabled = false;
		date_before_edit = date_input.value;
	}
	else {
		date_input.value = date_before_edit;
	}
	date_input.select();
	date_input.focus();
}

function saveEditHistory() {
	date_input.disabled = true;
	edit_history.style.display = "inline-block";
	done_history.style.display = "none";

	var date_array = date_input.value.split(".");
	var date = `${date_array[2]}-${date_array[1]}-${date_array[0]}T00:00:00.000Z`;

	changeUserData(info_history.dataset.array, date, "");
}

// https://stackoverflow.com/a/43473017/14225364
date_input.onkeydown = function(evt) {
	var size = date_input.value.length;
	if ((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 96 && evt.keyCode <= 105)) {
		if (size == 2 && date_input.value > 31) {
			date_input.value = "31";
		}
		if (size == 5 && Number(date_input.value.split('.')[1]) > 12) {
			date_input.value = date_input.value.slice(0, -2) + "12";
		}
		if (size == 10 && Number(date_input.value.split('.')[2]) < 2000) {
			date_input.value = date_input.value.slice(0, -4) + this_year;
		}
		if (size == 9) {
			finished_input = true;
			edit_history.style.display = "none";
			done_history.style.display = "inline-block";
		}

		if ((size == 2 && date_input.value < 32) || (size == 5 && Number(date_input.value.split('.')[1]) < 13)) {
			date_input.value += '.';        
		}
	}
	else if (evt.keyCode != 8 && evt.keyCode != 46 && evt.keyCode != 37 && evt.keyCode != 39) {
		evt.preventDefault();
	}
}

date_input.onkeyup = function() {
	var size = date_input.value.length;
	if (size <= 9 && finished_input) {
		finished_input = false;
		edit_history.style.display = "inline-block";
		done_history.style.display = "none";
	}
}

var show_history = false;

function showHistory(el) {
	removeActiveNav("history"); // actions.js
	if (show_history) {
		show_history = false;
		loadEpisodes(active_type);
	}
	else {
		show_history = true;
		el.classList.add("nav_active");
		loadEpisodes("history");
	}
}