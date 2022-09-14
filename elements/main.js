// function main() {
// 	for (var i = 0; i < episoden.length; i++) {
// 		var number = episoden[i].number.toString();
// 		if (number.length == 2) {
// 			number = "0" + number;
// 		}
// 		episoden[i].number = number;

// 		var name = episoden[i].name;
// 		name = name.slice(4);

// 		if (name.includes("Und")) {
// 			name = name.replace("Und", "und");
// 		}

// 		episoden[i].name = name;
// 	}
// }


var episoden_list = document.getElementsByTagName("ol")[0];
var active_type = "normal";

var provider = window.localStorage.getItem("provider");
if (provider == null) {var provider = "youtube"; }

var backwards = window.localStorage.getItem("backwards");
if (backwards == "false") { var backwards = false; }
else { var backwards = true; }

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
	
			if (episode.href[link] != "" || episode.href[0] != "#new") {
				var href = `href="${episode.href[link]}" target="_blank" onclick="refreshHistory(this)"`;
			}
			else if (episode.href[0] == "#new") {
				var href = `href="#" onclick="isNew('${episode.href[1]}')"`;
			}
			else {
				var href = 'href="#" class="not_aviable"';
			}
	
			html.push(`
			<a ${href} id="${number}" data-filter="die drei fragezeichen ??? ${episode.number} ${episode.name}">
				<img src="img/episode_${number}.jpg" alt="Folge ${episode.number}: ${episode.name}">
				<p><b>Folge ${episode.number}</b>: ${episode.name}</p>
				<button class="add" title="Zur Watch List hinzufügen" onclick="toggleWatchList(this)"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 24,13.714286 H 13.714286 V 24 H 10.285714 V 13.714286 H 0 V 10.285714 H 10.285714 V 0 h 3.428572 V 10.285714 H 24 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				<button class="remove" title="Von Watch List entfernen" onclick="toggleWatchList(this)"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 0 10.285156 L 0 13.714844 L 10.285156 13.714844 L 13.714844 13.714844 L 24 13.714844 L 24 10.285156 L 13.714844 10.285156 L 10.285156 10.285156 L 0 10.285156 z " style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				<button class="play" title="Abspielen"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 2.5714996,-1e-7 V 24 L 21.428642,12 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
			</a>`);
		}
		if (backwards) {
			html.reverse();
		}
	}
	// load special episods if load type isnt normal
	if (load_type != "normal") {
		for (var i = 0; i < special.length; i++) {
			var episode = special[i];
	
			if (episode.href[link] != "" || episode.href[0] != "#new") {
				var href = `href="${episode.href[link]}" target="_blank" onclick="refreshHistory(this)"`;
			}
			else if (episode.href[0] == "#new") {
				var href = `href="#" onclick="isNew('${episode.href[1]}')"`;
			}
			else {
				var href = 'href="#" class="not_aviable"';
			}
	
			html.push(`
			<a ${href} id="${episode.number}" data-filter="die drei fragezeichen ??? ${episode.search} ${episode.name}">
				<img src="img_special/special_${episode.number}.jpg" alt="${episode.name}">
				<p>${episode.name}</p>
				<button class="add" title="Zur Watch List hinzufügen" onclick="toggleWatchList(this)"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 24,13.714286 H 13.714286 V 24 H 10.285714 V 13.714286 H 0 V 10.285714 H 10.285714 V 0 h 3.428572 V 10.285714 H 24 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				<button class="remove" title="Von Watch List entfernen" onclick="toggleWatchList(this)"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 0 10.285156 L 0 13.714844 L 10.285156 13.714844 L 13.714844 13.714844 L 24 13.714844 L 24 10.285156 L 13.714844 10.285156 L 10.285156 10.285156 L 0 10.285156 z " style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
				<button class="play" title="Abspielen"><svg viewBox="0 0 24 24" focusable="false"><g><path d="M 2.5714996,-1e-7 V 24 L 21.428642,12 Z" style="fill:#ffffff;stroke-width:1.71429"></path></g></svg></button>
			</a>`);
		}
	}
	
	episoden_list.innerHTML = html.join("");
}

loadEpisodes("normal");


var el_sort_list = document.getElementById("sort_list");

function toggleOrder() {
	if (backwards) {
		el_sort_list.style.transform = "scaleY(-1)";
	}
	else {
		el_sort_list.style.transform = "scaleY(1)";
	}

	backwards = !backwards;
	loadEpisodes();
	window.localStorage.setItem("backwards", backwards);
}

function isNew(unlock_day) {
	alert(`Diese Folge ist erst ab dem ${unlock_day} verfügbar.`)
}

//#################################################################################################
// Watchlist
var watch_list = [], watch_list_count = 0;
var no_watch_list = document.getElementById("no_watch_list");

function toggleWatchList(el_button) {
	window.event.preventDefault();
	var element = el_button.parentNode;

	if (!element.classList.contains("in_watch_list")) {
		// Add to Watchlist
		element.classList.add("in_watch_list");
		watch_list_count++;
		watch_list.push(element.id);
	}
	else {
		// Remove from Watchlist
		element.classList.remove("in_watch_list");
		watch_list_count--;

		for (var i = 0; i < watch_list.length; i++){                       
			if (watch_list[i] == element.id) { 
				watch_list.splice(i, 1); 
				i--;
			}
		}
		if (watch_list_count == 0 && show_watch_list) {
			no_watch_list.style.display = "block";
		}
	}
	window.localStorage.setItem("watch_list", JSON.stringify(watch_list));
}

var show_watch_list = false;

function showWatchList() {
	if (show_watch_list) {
		document.querySelector(":root").style.setProperty("--watch_list", "block");
		show_watch_list = false;
		no_watch_list.style.display = "none";
		loadEpisodes(active_type);
	}
	else {
		document.querySelector(":root").style.setProperty("--watch_list", "none");
		show_watch_list = true;
		loadEpisodes("all");
		if (watch_list_count == 0) {
			no_watch_list.style.display = "block";
		}
	}
}

// int watch list
var json_watch_list = window.localStorage.getItem("watch_list");
if (json_watch_list != null) {
	watch_list = JSON.parse(json_watch_list);
	watch_list_count = watch_list.length;

	for (var i = 0; i < watch_list.length; i++) {
		document.getElementById(watch_list[i]).classList.add("in_watch_list");
	}
}


//#################################################################################################
// History
var history = [];

function refreshHistory(element) {
	var episode_number = element.id;
	var in_history = false;
	var current_date = new Date()

	for (var i = 0; i < history.length; i++) {
		if (history[i].number == episode_number) {
			in_history = i;
		}
	}

	if (in_history == false) {
		history.push({number: episode_number, history: current_date})
	}
	else {
		history[in_history].history = current_date;
	}
	window.localStorage.setItem("history", JSON.stringify(history));
	// show history in html !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

function showHistory() {
	loadEpisodes("all");
}

// int history
var json_history = window.localStorage.getItem("history");
if (json_history != null) {
	history = JSON.parse(json_history);

	for (var i = 0; i < history.length; i++) {
		// show history in html !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// document.getElementById(history[i].number)
	}
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
	loadEpisodes();
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
	}
	else {
		input.value = "";
		// siteSearch();
		loadEpisodes(active_type);
	}
}