// var serie = JSON.parse(spezial_json);

function main() {
	var folges = episoden_list.getElementsByTagName("div");
	for (var i = 0; i < folges.length; i++) {
		console.log(folges[i].dataset.release);



		// for (var j = 0; j < episode.length; j++) {
		// 	if (special[j].number == episode.number) {
		// 		seri = special[j];
		// 		break;
		// 	}
		}

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
}

//#################################################################################################
// settings, aside
// hideAside(); showInfo(); showSettings();
// selectProvider(); siteSearch(); startSearch();
// removeActiveNav();


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
	info_content.innerHTML = episode.content;

	aside.style.height = "340px";

	if (!show_aside) {
		show_aside = true;
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

	aside.style.height = "400px";

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

function removeActiveNav(sel_button) {
	var nav_active = document.getElementsByClassName("nav_active");
	loadEpisodes(active_type); // main.js

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