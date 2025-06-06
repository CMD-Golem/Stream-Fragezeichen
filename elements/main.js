// user_role: "hidden" -> don't count clicks and user analytics
const standard_settings = {
	user_id: undefined,
	provider: 0,
	cover_size: "50",
	hide_episode_title: false,
	theme: false,
	backwards: true,
	sort_date: false,
	observer: true,
	list:[],
	random_amount: 20,
	random_settings: {
		normal: true,
		special: true, 
		advent_calender: false,
		headphones: false,
		short_story: false,
		film: false,
		live: false,
		audiobook: false,
		documentation: false
	}
}

// load images on scroll
const observer = new IntersectionObserver((entries, observer) => {
	for (var i = 0; i < entries.length; i++) {
		if (entries[i].isIntersecting) {
			var episode = entries[i].target;
			episode.querySelector("img").src = `img/${episoden[episode.id].number}.jpg`;
			observer.unobserve(episode);
		}
	}
});

// load episodes
function loadEpisodes() {
	var episode_html = [];

	for (var i = 0; i < episoden.length; i++) {
		var episode = episoden[i];
		var episode_class = "";
		episode.index = i;

		// get user_data index
		if (episode.user_data_index != undefined) {
			var episode_data = user_data.list[episode.user_data_index];
		}
		else var episode_data = {};

		// get index of episode 001
		if (episode.number == "001") var first_episode_index = i + 1;

		// generate title		
		if (episode.type == "normal") {
			var title = `<b>Folge ${episode.number}</b>: ${episode.name}`;
			var alt = `Folge ${episode.number}: ${episode.name}`;
			var search = episode.number + " ";
		}
		else {
			var title = episode.name;
			var alt = episode.name;
			var search = episode.search + " ";
		}


		// remove episodes whiche are not aviable on selected streamer 
		if (episode.href[user_data.provider] == "#") {
			var href = 'href="#"';
			episode_class += " not_aviable";
			var info = "";
		}
		// add message for unreleased episodes
		else if (episode.href[0] == "#new") {
			var href = `href="#" onclick="openDialog(false, '<p>Diese Folge ist erst ab dem ${episode.href[1]} verfügbar.</p>');"`;
			var info = `openDialog(false, '<p>Diese Folge ist erst ab dem ${episode.href[1]} verfügbar.</p>')`;
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

		// images
		if (user_data.observer) var img = "";
		else var img = `img/${episode.number}.jpg`;

		episode_html.push(`
		<div data-release="${episode.release}" data-history="${episode_data.history}" id="${i}" class="${episode_class}" data-filter="die drei fragezeichen ??? ${search}${episode.name} ${episode.book_author}">
			<a ${href}>
				<img src="${img}" alt="${alt}">
				<p>${title}</p>
				<button class="control_button play" title="Abspielen"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M5.142 0v24L24 12z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
			</a>
			<button class="control_button add" title="Zur Watch List hinzufügen" onclick="toggleWatchList(${i}, this)"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 24,13.714286 H 13.714286 V 24 H 10.285714 V 13.714286 H 0 V 10.285714 H 10.285714 V 0 h 3.428572 V 10.285714 H 24 Z" style="fill:#ffffff;stroke-width:1.71429"/></g></svg></button>
			<button class="control_button remove" title="Von Watch List entfernen" onclick="toggleWatchList(${i}, this)"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 0 10.285156 L 0 13.714844 L 10.285156 13.714844 L 13.714844 13.714844 L 24 13.714844 L 24 10.285156 L 13.714844 10.285156 L 10.285156 10.285156 L 0 10.285156 z " style="fill:#ffffff;stroke-width:1.71429"/></g></svg></button>
			<button class="control_button info" title="Folgeninhalt anzeigen" onclick="${info}"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0Zm1.2 18h-2.4v-7.2h2.4zm0-9.6h-2.4V6h2.4z" style="fill:#fff;stroke-width:1.20001"/></g></svg></button>
		</div>`);
	}

	if (user_data.sort_date && active_main != "history") {
		if (!user_data.backwards) { episode_html = episode_html.reverse(); }

		episode_html.sort((a, b) => {
			var a_date = a.slice(21, 31);
			var b_date = b.slice(21, 31);

			if (user_data.backwards) {
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
	else if (active_main == "history") {
		episode_html.sort((a, b) => {
			var a_date = a.slice(47, 71);
			var b_date = b.slice(47, 71);

			// if (user_data.backwards) {
				if (a_date < b_date) { return 1; }
				if (a_date > b_date){ return -1; }
			// }
			// else {
			//	if (a_date < b_date) { return -1; }
			//	if (a_date > b_date){ return 1; }
			// }
			return 0;
		});
	}
	else if (!user_data.backwards) {
		episode_html = episode_html.slice(0, first_episode_index).reverse().concat(episode_html.slice(first_episode_index));
	}

	// show episoden either with observer or not
	if (user_data.observer) {
		observer.disconnect();

		episoden_list.innerHTML = episode_html.join("");

		for (var i = 0; i < episoden_list.children.length; i++) {
			observer.observe(episoden_list.children[i]);
		}
	}
	else episoden_list.innerHTML = episode_html.join("");
}

//#################################################################################################
// load user data
var user_data = {list:[]}, last_provider_selected, watch_list_count = 0, ignore_list_count = 0;
var input_user_id = document.getElementById("user_id");

async function loadData() {
	var json_user_data = window.localStorage.getItem("user_data");
	changeIdButton("new_id");

	// setup according to user data
	if (json_user_data != null) {
		user_data = JSON.parse(json_user_data);

		// int list sorting
		user_data.theme = !user_data.theme ?? !standard_settings.theme;
		user_data.backwards = !user_data.backwards ?? !standard_settings.backwards;
		user_data.sort_date = !user_data.sort_date ?? !standard_settings.sort_date;
		user_data.hide_episode_title = !user_data.hide_episode_title ?? !standard_settings.hide_episode_title;
		user_data.observer = !user_data.observer ?? !standard_settings.observer;
		toggleTheme();
		toggleOrder();
		toggleSort();
		toggleEpisodeTitle();

		// read remote episode data and overwrite local episode data (null can be removed)
		disconnectId();
		if (user_data.user_id != undefined) {
			var response = await fetch("", {
				method: "POST",
				body: user_data.user_id,
			});


			if (response.status == 200) {
				var response_object = await response.json();

				user_data.list = response_object.list;
				user_data.a_name = response_object.a_name;

				changeIdButton("delete_id"); // action.js
				input_user_id.value = user_data.user_id;
				chronicle.href = "chronik.html/?id=" + user_data.user_id;
				console.log("Server Daten vom " + response_object.a_latest_upload + " wurden geladen.");
			}
			else if (response.status == 502) {
				openDialog(false, "<p>Die registierte ID ist fehlerhaft oder entfernt worden!</p>");
				disconnectId();
			}
			else {
				openDialog(false, "<p>Benutzer Daten konnten nicht heruntergeladen werden!</p>");
				console.error(response);
			}
		}

		// int episode data: history, watchlist, ignore_list
		for (var i = 0; i < user_data.list.length; i++) {
			var episode = user_data.list[i];
			var found_episode = false;

			// init counters
			if (episode.list == "true") watch_list_count++;

			if (episode.ignored == "true") ignore_list_count++;

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
		user_data = standard_settings;

		showAside('settings'); //actions.js
		if (window.innerWidth <= 506) overflowMenu(false);
	}

	// setup selected provider (deezer = 0, youtube = 1, spotify = 2, apple = 3)
	last_provider_selected = document.getElementById("provider_" + (user_data.provider ?? standard_settings.provider));
	last_provider_selected.classList.add("provider_selected");

	// setup zufällige folge
	settings_random_amount.value = user_data.random_amount ?? standard_settings.random_amount;
	for (type in standard_settings.random_settings) {
		var random_settings = user_data.random_settings ?? standard_settings.random_settings;
		document.getElementById("type_selection_" + type).checked = random_settings[type];
	}

	// setup cover size
	document.getElementById("settings_cover_size").value = user_data.cover_size ?? standard_settings.cover_size;
	changeCoverSize(user_data.cover_size); // actions.js
	aside.classList.remove('cover_size_hidden')

	// load html
	loadEpisodes();
}

loadData();

// store user data in local storage and upload local episode data if needed
async function storeUserData(remote) {
	var json_user_data = JSON.stringify(user_data);
	window.localStorage.setItem("user_data", json_user_data);

	if (remote && user_data.user_id != undefined) {
		var remote_data = {};
		remote_data.a_name = user_data.a_name;
		remote_data.a_latest_upload = new Date();
		remote_data.list = user_data.list;

		var fetch_body = {
			id: user_data.user_id,
			data: remote_data
		}
	
		var json_fetch_body = JSON.stringify(fetch_body);
	
		var response = await fetch("", {
			method: "POST",
			body: json_fetch_body,
		});

		if (response.status == 200) {
			console.log("Uploaded Episode data");
		}
		else {
			openDialog(false, "<p>Benutzer Daten konnte nicht hochgeladen werden!</p>");
			console.error(response);
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

// remove episode from user_data list of no value defined
function checkRemoval(user_data_index, episoden_index) {
	var episode_data = user_data.list[user_data_index];

	if (
		episode_data.list == undefined &&
		episode_data.ignored == undefined &&
		episode_data.history == undefined
	) {
		user_data.list.splice(user_data_index, 1);
		episoden[episoden_index].user_data_index = undefined;
	}
}

//#################################################################################################
var play_box = document.getElementById("info_play");

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
		checkRemoval(user_data_index, episoden_index);

		if (watch_list_count == 0 && active_main == "watch_list") {
			main.classList.add("show_not_found");
		}
		if ((active_aside == "info" || active_aside == "random_episode") && (play_box.dataset.index == episoden_index)) {
			play_box.classList.remove("in_watch_list");
			document.getElementById(episoden_index).classList.remove("in_watch_list");
		}
	}
	// Add to Watchlist
	else {
		el_button.parentNode.classList.add("in_watch_list");
		watch_list_count++;
		episode_data.list = "true";

		if (active_main == "watch_list") {
			main.classList.remove("show_not_found");
		}
		if ((active_aside == "info" || active_aside == "random_episode") && (play_box.dataset.index == episoden_index)) {
			play_box.classList.add("in_watch_list");
			document.getElementById(episoden_index).classList.add("in_watch_list");
		}
	}

	storeUserData(true);
}

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
		checkRemoval(user_data_index, episoden_index);

		if (ignore_list_count == 0 && active_main == "ignore_list") {
			main.classList.add("show_not_found");
		}
		if ((active_aside == "info" || active_aside == "random_episode") && (play_box.dataset.index == episoden_index)) {
			play_box.classList.remove("in_ignore_list");
			document.getElementById(episoden_index).classList.remove("in_ignore_list");
		}
	}
	// Add to Ignore List
	else {
		el_button.parentNode.classList.add("in_ignore_list");
		ignore_list_count++;
		episode_data.ignored = "true";

		if (active_main == "ignore_list") {
			main.classList.remove("show_not_found");
		}
		if ((active_aside == "info" || active_aside == "random_episode") && (play_box.dataset.index == episoden_index)) {
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
	
	document.getElementById(episoden_index).classList.remove("no_history");

	// store current date
	if (date == undefined) {
		episode_data.history = new Date();
	}
	// remove stored date
	else if (date == false) {
		episode_data.history = undefined;
		checkRemoval(user_data_index, episoden_index);
		info_history.value = "nie";
		document.getElementById(episoden_index).classList.add("no_history");
	}
	// store predefined date
	else {
		episode_data.history = date;
	}

	storeUserData(true);

	// refresh viewable data
	if (active_main == "history" && episoden_list.querySelectorAll("div:not(.no_history)").length == 0) {
		main.classList.add("show_not_found");
	}

	// Click counter
	// if (user_role != "hidden" && date != undefined && date != false) {
	// 	fetch("");
	// }
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
	var year = new Date().getFullYear();
	if (size <= 9 && finished_input) {
		finished_input = false;
		edit_history.style.display = "inline-block";
		done_history.style.display = "none";
	}

	if ((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 96 && evt.keyCode <= 105)) {
		if (size == 2 && info_history.value > 31) {
			info_history.value = "31";
		}
		if (size == 5 && Number(info_history.value.split(".")[1]) > 12) {
			info_history.value = info_history.value.slice(0, -2) + "12";
		}
		if (size == 10 && Number(info_history.value.split(".")[2]) < 2000 && info_history.value != "01.01.1999") {
			info_history.value = info_history.value.slice(0, -4) + year;
		}
		if (size == 10) {
			finished_input = true;
			edit_history.style.display = "none";
			done_history.style.display = "inline-block";
		}

		if ((size == 2 && info_history.value < 32)) {
			info_history.value += ".";        
		}
		else if (size == 5 && Number(info_history.value.split(".")[1]) < 13) {
			info_history.value += "." + Math.floor(year/100);
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
