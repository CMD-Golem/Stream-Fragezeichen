// function main() {
// 	for (var i = 0; i < episoden.length; i++) {
// 		episoden[i].inhalt = test[i].inhalt;
// // 		var number = episoden[i].number.toString();
// // 		if (number.length == 2) {
// // 			number = "0" + number;
// // 		}
// // 		episoden[i].number = number;

// // 		var name = episoden[i].name;
// // 		name = name.slice(4);

// // 		if (name.includes("Und")) {
// // 			name = name.replace("Und", "und");
// // 		}

// // 		episoden[i].name = name;
// 	}
// }
var provider, provider_link, backwards, active_type, user_list = [], watch_list_count = 0;

function setup() {
	// int selected provider
	provider = window.localStorage.getItem("provider");
	if (provider == null) { provider = "youtube"; }

	if (provider == "deezer") { provider_link = 0; } 
	else if (provider == "spotify") { provider_link = 2; }
	else if (provider == "apple") { provider_link = 3; }
	else { provider_link = 1; } // Youtube

	// int list sorting
	backwards = window.localStorage.getItem("backwards");
	if (backwards == "false") { backwards = false; }
	else { backwards = true; }

	active_type = "all";

	// int user list
	var json_user_list = window.localStorage.getItem("user_list");

	if (json_user_list != null) {
		user_list = JSON.parse(json_user_list);

		for (var i = 0; i < user_list.length; i++) {
			var episode = user_list[i];
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

setup();

// store user list
document.addEventListener("visibilitychange", function() {
	if (document.hidden) {
		console.log("Saved User data")
		json_user_list = JSON.stringify(user_list);
		window.localStorage.setItem("user_list", json_user_list)
	}
});

// change user list
function changeUserList(array_id, history, list) {
	var in_array = false;
	var add_class = "";

	// if (user_list[0] == undefined) { return; }

	for (var i = 0; i < user_list.length; i++) {
		if (user_list[i].array_id == array_id) {
			in_array = i;
		}
	}

	// add episode to user list if not existing
	if (in_array === false) {
		var in_array = user_list.push({array_id:array_id, history:"", list:""});
		in_array--;
	}

	// change history
	if (history != "" || user_list[in_array].history != "") {
		user_list[in_array].history = history;
	}

	// change watch list
	if (list == "true") {
		user_list[in_array].list = "true";
		add_class += "in_watch_list ";
	}
	else if (list == "false") { user_list[in_array].list = ""; }

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
var test = [];

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
			<div data-history="${episode.history}" id="${number}" class="${episode_class}" data-array="normal_${i}" data-filter="die drei fragezeichen ??? ${number} ${episode.name}">
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
			<div data-history="${episode.history}" id="${episode.number}" class="${episode_class}" data-array="special_${i}" data-filter="die drei fragezeichen ??? ${episode.search} ${episode.name}">
				<a ${href} class="img_play_box">
					<img src="img_special/special_${episode.number}.jpg" alt="${episode.name}">
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
			var a_date = a.slice(23, 47);
			var b_date = b.slice(23, 47);

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

	test = html;
	
	episoden_list.innerHTML = html.join("");
}

loadEpisodes("all");

// sort episode list
var el_sort_list = document.getElementById("sort_list");

function toggleOrder() {
	if (backwards) {
		el_sort_list.style.transform = "scaleY(-1)";
	}
	else {
		el_sort_list.style.transform = "scaleY(1)";
	}

	backwards = !backwards;
	window.localStorage.setItem("backwards", backwards);
	
	if (show_history) {
		loadEpisodes("history");
	}
	else {
		loadEpisodes(active_type);
	}
}

//#################################################################################################
// Aside
var aside = document.getElementsByTagName("aside")[0];
var aside_content = document.getElementsByClassName("aside_content");
var show_aside = false;

function hideAside() {
	show_aside = false;
	show_settings = false;
	aside.style.height = "0";
	settings_button.classList.remove("set_active");

	setTimeout(function(){
		aside.style.overflow = "hidden";
		aside_content[0].style.display = "none";
		aside_content[1].style.display = "none";
	}, 200);
}

// show episode info
var info_href = document.getElementById("info_href");
var info_img = document.getElementById("info_img");
var info_name = document.getElementById("info_name");
var info_history = document.getElementById("info_history");
var info_content = document.getElementById("info_content");

function showInfo(array_id) {
	var episode_id = array_id.split("_");
	aside_content[0].style.display = "flex";
	aside_content[1].style.display = "none";

	// img
	if (episode_id[0] == "normal") {
		var episode = episoden[episode_id[1]];
		info_img.src = `img/episode_${parseInt(episode.number)}.jpg`;
	}
	else {
		var episode = special[episode_id[1]];
		info_img.src = `img_special/special_${episode.number}.jpg`;
	}

	// history
	info_href.setAttribute("onclick", "refreshHistory(" + array_id + ")");
	var history = episode.history;
	if (history == "" || history == undefined) {
		history = "nie";
	}
	else {
		var history = new Date(history).toLocaleDateString("fr-CH");
	}
	info_history.value = history;

	// link and text
	info_href.href = episode.href[provider_link];
	info_name.innerHTML = episode.name;
	info_content.innerHTML = episode.inhalt;

	if (!show_aside) {
		show_aside = true;
		aside.style.height = "340px";
		aside.style.overflow = "visible";
	}

	// Prepare Edit History
	info_history.dataset.array = array_id;
	date_input.disabled = true;
	edit_history.style.display = "inline-block";
	done_history.style.display = "none";

	// Settings
	show_settings = false;
	settings_button.classList.remove("set_active");
}

// show settings
var settings_button = document.getElementsByClassName("active_blue")[0];
var show_settings = false;

function showSettings() {
	aside_content[0].style.display = "none";
	aside_content[1].style.display = "block";
	settings_button.classList.add("set_active");

	if (!show_aside) {
		show_aside = true;
		aside.style.height = "340px";
		aside.style.overflow = "visible";
	}
	if (show_settings) {
		show_settings = false;
		hideAside();
	}
	else {
		show_settings = true;
	}
}

//#################################################################################################
// Settings
// Provider
var last_provider_selected = document.getElementById(provider);
last_provider_selected.classList.add("provider_selected");

function selectProvider(el_button) {
	last_provider_selected.classList.remove("provider_selected");
	el_button.classList.add("provider_selected");

	last_provider_selected = el_button;
	provider = el_button.id;
	
	if (provider == "deezer") { provider_link = 0; } 
	else if (provider == "spotify") { provider_link = 2; }
	else if (provider == "apple") { provider_link = 3; }
	else { provider_link = 1; } // Youtube

	loadEpisodes(active_type);
	window.localStorage.setItem("provider", provider);
}

//

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
		changeUserList(array_id, "", "true");
	}
	else {
		// Remove from Watchlist
		element.classList.remove("in_watch_list");
		watch_list_count--;
		changeUserList(array_id, "", "false");

		if (watch_list_count == 0 && show_watch_list) {
			no_watch_list.style.display = "block";
		}
	}
}

var show_watch_list = false;

function showWatchList(el) {
	removeActiveNav("watch_list");
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

	changeUserList(array_id, new Date(), "");
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

	changeUserList(info_history.dataset.array, date, "");
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
	removeActiveNav("history");
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

//#################################################################################################
// Search
var article = document.getElementsByTagName("ol")[0].children;
var input = document.getElementById("site_search");
var not_found = document.getElementById("not_found");

function siteSearch() {
	var search_input = input.value.toUpperCase().split(" ");

	for (var i = 0; i < article.length; i++) {
		var search_data = article[i].dataset.filter.toUpperCase().split(" ");
		var hide = false;

		// Search: loop trough array from input
		for (var j = 0; j < search_input.length; j++) {
			var prehide = true;

			// Check if keywords are in input
			for (var k = 0; k < search_data.length; k++) {
				if (search_data[k].startsWith(search_input[j])) { var prehide = false; }
			}
			if (prehide == false && hide != true) { var hide = false; }
			else { var hide = true; }
		}

		// hide/ unhide
		if (hide == true) {
			article[i].classList.add("hide_search");
		}
		else {
			article[i].classList.remove("hide_search");
		}
	}

	// not found
	var hide_search = document.getElementsByClassName("hide_search").length;

	if (article.length - hide_search <= 0) {
		not_found.style.display = "block";
	}
	else {
		not_found.style.display = "none";
	}
}

var search_checkbox = document.getElementById("nav_search_button");

function startSearch() {
	if (!search_checkbox.checked) {
		// loadEpisodes("all");
		setTimeout(function(){ input.focus() }, 100);
		if (show_watch_list == true) {
			showWatchList();
		}
	}
	else {
		input.value = "";
		// siteSearch();
		// loadEpisodes(active_type);
	}
}

function removeActiveNav(sel_button) {
	var nav_active = document.getElementsByClassName("nav_active");
	loadEpisodes(active_type);

	for (var i = 0; i < nav_active.length; i++) {
		nav_active[i].classList.remove("nav_active")
	}

	if (sel_button != "watch_list") {
		show_watch_list = false;
		document.querySelector(":root").style.setProperty("--watch_list", "block");
		no_watch_list.style.display = "none";
	}
	if (sel_button != "history") {
		show_history = false;
	}
}