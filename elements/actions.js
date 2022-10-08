// var serie = JSON.parse(spezial_json);

// function main() {
// 	var folges = episoden_list.getElementsByTagName("div");
// 	for (var i = 0; i < folges.length; i++) {
// 		console.log(folges[i].dataset.release);



		// for (var j = 0; j < episode.length; j++) {
		// 	if (special[j].number == episode.number) {
		// 		seri = special[j];
		// 		break;
		// 	}
		// }

// 		if (serie.content == "") {
// 			serie.content = seri.
// 		}
// 		episode.content = seri.beschreibung;
// 		episode.release = seri.veröffentlichungsdatum;

// 		delete episode.inhalt;

// 		try {
// 			episode.length = seri.kapitel[seri.kapitel.length - 1].end;
// 		}
// 		catch (i) {
// 			console.error(episode.name);
// 		}
// 	}
// }

//#################################################################################################
// settings, aside
// hideAside(); showInfo(); showSettings();
// selectProvider(); siteSearch(); startSearch();


//#################################################################################################
// Aside
var aside = document.getElementsByTagName("aside")[0];
var aside_content = document.getElementsByClassName("aside_content");
var show_aside = false;

function refreshAside() {
	if (!show_aside) {
		show_aside = true;
		aside.style.height = "340px";
		aside.style.overflow = "visible";
	}

	aside_content[0].style.display = "none";
	aside_content[1].style.display = "none";
	aside_content[2].style.display = "none";

	if (show_settings) { aside_content[1].style.display = "block"; }
	else if (show_account) { aside_content[2].style.display = "block"; }
	else { aside_content[0].style.display = "flex"; }
}

function hideAside() {
	show_aside = false;
	show_settings = false;
	show_account = false;
	show_random_episode = false;
	aside.style.height = "0";
	settings_button.classList.remove("set_active");
	account_button.classList.remove("set_active");

	setTimeout(function(){
		aside.style.overflow = "hidden";
		aside_content[0].style.display = "none";
		aside_content[1].style.display = "none";
		aside_content[2].style.display = "none";
	}, 200);
}

//#################################################################################################
// Show Aside Tabs
// episode info
var info_href = document.getElementById("info_href");
var info_img = document.getElementById("info_img");
var info_name = document.getElementById("info_name");
var info_content = document.getElementById("info_content");

function showInfo(array_id) {
	var episode_id = array_id.split("_");
	aside_content[0].style.display = "flex";
	aside_content[1].style.display = "none";
	aside_content[2].style.display = "none";

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
	info_history.value = history; // main.js

	// link and text
	info_href.href = episode.href[provider_link];
	info_name.innerHTML = episode.name;
	info_content.innerHTML = episode.content;

	aside.style.height = "340px";

	if (!show_aside) {
		show_aside = true;
		aside.style.overflow = "visible";
	}

	// calc hight of text for scroll
	setTimeout(function(){ info_content.style.height = (aside.clientHeight - info_name.parentElement.parentElement.clientHeight - 92) + "px"; }, 500);

	// Prepare Edit History (defined in main.js)
	info_history.dataset.array = array_id;
	info_history.disabled = true;
	edit_history.style.display = "inline-block";
	done_history.style.display = "none";

	// Settings
	show_settings = false;
	show_account = false;
	show_random_episode = false;
	settings_button.classList.remove("set_active");
	account_button.classList.remove("set_active");
}


// settings
var show_settings = false;

function showSettings() {
	aside_content[0].style.display = "none";
	aside_content[1].style.display = "block";
	aside_content[2].style.display = "none";
	settings_button.classList.add("set_active");
	account_button.classList.remove("set_active");

	aside.style.height = "340px";

	if (!show_aside) {
		show_aside = true;
		aside.style.overflow = "visible";
	}
	if (show_settings) {
		show_settings = false;
		hideAside();
	}
	else {
		show_settings = true;
		show_account = false;
		show_random_episode = false;
	}
}


// account settings
var show_account = false;

function showAccount() {
	aside_content[0].style.display = "none";
	aside_content[1].style.display = "none";
	aside_content[2].style.display = "block";
	account_button.classList.add("set_active");
	settings_button.classList.remove("set_active");

	aside.style.height = "340px";

	if (!show_aside) {
		show_aside = true;
		aside.style.overflow = "visible";
	}
	if (show_account) {
		show_account = false;
		hideAside();
	}
	else {
		show_account = true;
		show_settings = false;
		show_random_episode = false;
	}
}


// random episode
var show_random_episode = false;

function showRandomEpisode() {
	aside_content[0].style.display = "block";
	aside_content[1].style.display = "none";
	aside_content[2].style.display = "none";
	account_button.classList.add("set_active");
	settings_button.classList.remove("set_active");

	aside.style.height = "340px";

	if (!show_aside) {
		show_aside = true;
		aside.style.overflow = "visible";
	}
	if (show_random_episode) {
		show_random_episode = false;
		hideAside();
	}
	else {
		show_random_episode = true;
		show_account = false;
		show_settings = false;
	}
}


//#################################################################################################
// Nav
var watch_list_button = document.getElementById("nav_watch_list");
var history_button = document.getElementById("nav_history");
var random_episode_button = document.getElementById("nav_random_episode");
var settings_button = document.getElementById("nav_settings");
var account_button = document.getElementById("nav_account");

function refreshNavButtons() {
	watch_list_button.classList.remove("nav_active");
	history_button.classList.remove("nav_active");
	random_episode_button.classList.remove("nav_active");
	settings_button.classList.remove("nav_active");
	account_button.classList.remove("nav_active");

	if (show_watch_list) { watch_list_button.classList.add("nav_active"); }
	if (show_history) { history_button.classList.add("nav_active"); }
	if (show_random_episode) { random_episode_button.classList.add("nav_active"); }
	if (show_settings) { settings_button.classList.add("nav_active"); }
	if (show_account) { account_button.classList.add("nav_active"); }
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

	loadEpisodes(active_type); // main.js
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
		// loadEpisodes("all"); // main.js
		setTimeout(function(){ input.focus() }, 100);
		if (show_watch_list == true) {
			showWatchList();
		}
	}
	else {
		input.value = "";
		siteSearch();
		// loadEpisodes(active_type); // main.js
	}
}

function removeSelNav(sel_button) {
	var set_active = document.getElementsByClassName("set_active");

	for (var i = 0; i < set_active.length; i++) {
		set_active[i].classList.remove("set_active")
	}
}