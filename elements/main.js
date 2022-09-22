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

// int selected provider
var provider = window.localStorage.getItem("provider");
if (provider == null) { var provider = "youtube"; }

// int list sorting
var backwards = window.localStorage.getItem("backwards");
if (backwards == "false") { var backwards = false; }
else { var backwards = true; }

var active_type = "normal";


// int user list
var user_list = [], watch_list_count = 0;
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
	// if (history != "" || user_list[in_array].history != "") {
	// 	user_list[in_array].history = history;
	// }
	console.log(user_list)

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

function loadEpisodes(load_type) {
	var html = [];

	if (provider == "deezer") { var link = 0; } 
	else if (provider == "spotify") { var link = 2; }
	else if (provider == "apple") { var link = 3; }
	else { var link = 1; } // Youtube

	// load normal episods if load type isnt special
	if (load_type != "special") {
		for (var i = 0; i < episoden.length; i++) {
			var episode = episoden[i];
			var number = parseInt(episode.number);
			var episode_class = episode.class
	
			if (episode.href[link] != "#" && episode.href[0] != "#new") {
				var href = `href="${episode.href[link]}" target="_blank" onclick="refreshHistory(this, 'normal')"`;
			}
			else if (episode.href[0] == "#new") {
				var href = `href="#" onclick="alert('Diese Folge ist erst ab dem ${episode.href[1]} verfügbar.');"`;
			}
			else {
				var href = 'href="#"';
				episode_class += "not_aviable ";
			}
	
			html.push(`
			<div id="${number}" class="${episode_class}" data-array="normal_${i}" data-filter="die drei fragezeichen ??? ${number} ${episode.name}">
				<a ${href} class="img_play_box">
					<img src="img/episode_${number}.jpg" alt="Folge ${episode.number}: ${episode.name}">
					<p><b>Folge ${episode.number}</b>: ${episode.name}</p>
					<button class="control_button play" title="Abspielen"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 2.5714996,-1e-7 V 24 L 21.428642,12 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				</a>
				<button class="control_button add" title="Zur Watch List hinzufügen" onclick="toggleWatchList(this, 'normal')"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 24,13.714286 H 13.714286 V 24 H 10.285714 V 13.714286 H 0 V 10.285714 H 10.285714 V 0 h 3.428572 V 10.285714 H 24 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				<button class="control_button remove" title="Von Watch List entfernen" onclick="toggleWatchList(this, 'normal')"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 0 10.285156 L 0 13.714844 L 10.285156 13.714844 L 13.714844 13.714844 L 24 13.714844 L 24 10.285156 L 13.714844 10.285156 L 10.285156 10.285156 L 0 10.285156 z " style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				<button class="control_button info" title="Folgeninhalt anzeigen" onclick="showInfo('normal_${i}')"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0Zm1.2 18h-2.4v-7.2h2.4zm0-9.6h-2.4V6h2.4z" style="fill:#fff;stroke-width:1.20001"></path></g></svg></button>
			</div>`);
		}
		if (backwards) {
			html.reverse();
		}
	}
	// load special episods if load type isnt normal
	if (load_type != "normal") {
		for (var i = 0; i < special.length; i++) {
			var episode = special[i];
			var episode_class = episode.class
	
			if (episode.href[link] != "#" || episode.href[0] != "#new") {
				var href = `href="${episode.href[link]}" target="_blank" onclick="refreshHistory(this, 'special')"`;
			}
			else if (episode.href[0] == "#new") {
				var href = `href="#" onclick="alert('Diese Folge ist erst ab dem ${episode.href[1]} verfügbar.');"`;
			}
			else {
				var href = 'href="#"';
				episode_class += "not_aviable ";
			}

			html.push(`
			<div id="${episode.number}" class="${episode_class}" data-array="special_${i}" data-filter="die drei fragezeichen ??? ${episode.search} ${episode.name}">
				<a ${href} class="img_play_box">
					<img src="img_special/special_${episode.number}.jpg" alt="${episode.name}">
					<p>${episode.name}</p>
					<button class="control_button play" title="Abspielen"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 2.5714996,-1e-7 V 24 L 21.428642,12 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				</a>
				<button class="control_button add" title="Zur Watch List hinzufügen" onclick="toggleWatchList(this, 'special')"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 24,13.714286 H 13.714286 V 24 H 10.285714 V 13.714286 H 0 V 10.285714 H 10.285714 V 0 h 3.428572 V 10.285714 H 24 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				<button class="control_button remove" title="Von Watch List entfernen" onclick="toggleWatchList(this, 'special')"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 0 10.285156 L 0 13.714844 L 10.285156 13.714844 L 13.714844 13.714844 L 24 13.714844 L 24 10.285156 L 13.714844 10.285156 L 10.285156 10.285156 L 0 10.285156 z " style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				<button class="control_button info" title="Folgeninhalt anzeigen" onclick="showInfo('normal_${i}')"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0Zm1.2 18h-2.4v-7.2h2.4zm0-9.6h-2.4V6h2.4z" style="fill:#fff;stroke-width:1.20001"></path></g></svg></button>
			</div>`);
		}
	}
	
	episoden_list.innerHTML = html.join("");
}

loadEpisodes("normal");

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
	loadEpisodes(active_type);
	window.localStorage.setItem("backwards", backwards);
}

//#################################################################################################
// show episode info
function showInfo(array_id) {
	var episode_id = array_id.split("_");
	if (episode_id[0] == "normal") {
		var episode = episoden[episode_id[1]];
	}
	else {
		var episode = special[episode_id[1]];
	}
	console.log(epsiode.inhalt)
}

function hideInfo() {

}

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

function showWatchList() {
	if (show_watch_list) {
		document.querySelector(":root").style.setProperty("--watch_list", "block");
		show_watch_list = false;
		no_watch_list.style.display = "none";
		// loadEpisodes(active_type);
	}
	else {
		document.querySelector(":root").style.setProperty("--watch_list", "none");
		show_watch_list = true;
		// loadEpisodes("all");
		if (watch_list_count == 0) {
			no_watch_list.style.display = "block";
		}
	}
}


//#################################################################################################
// History
function refreshHistory(element) {
	// var date = new Date();

	// changeUserList(element.dataset.array, date, "");

	// show history in html !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

function showHistory() {
	loadEpisodes("all");
}

//#################################################################################################
// Provider
var last_provider_selected = document.getElementById(provider);
last_provider_selected.classList.add("provider_selected");

function selectProvider(el_button) {
	// var button_selected = el_button.classList.contains("provider_selected");
	last_provider_selected.classList.remove("provider_selected");

	// if (!button_selected) {
		el_button.classList.add("provider_selected");
	// }

	last_provider_selected = el_button;
	provider = el_button.id;
	loadEpisodes(active_type);
	window.localStorage.setItem("provider", provider);
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
		loadEpisodes("all");
		setTimeout(function(){ input.focus() }, 100);
		if (show_watch_list == true) {
			showWatchList();
		}
	}
	else {
		input.value = "";
		// siteSearch();
		loadEpisodes(active_type);
	}
}