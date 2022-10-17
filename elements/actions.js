// var serie = JSON.parse(serie_json);

function main() {
	for (var i = 0; i < special.length; i++) {
		var book_author = "";
		var track_author = "";

		for (var j = 0; j < serie.length; j++) {
			if (special[i].name == serie[j].titel) {
				book_author = serie[j].autor;
				track_author = serie[j].hörspielskriptautor;
				break;
			}
		}

		special[i].book_author = book_author;
		special[i].track_author = track_author;
	}
}

//#################################################################################################
// settings, aside



//#################################################################################################
// Nav
var overflow_menu_button = document.getElementById("overflow_menu");
var watch_list_button = document.getElementById("nav_watch_list");
var history_button = document.getElementById("nav_history");
var random_episode_button = document.getElementById("nav_random_episode");
var search_button = document.getElementById("nav_search");
var settings_button = document.getElementById("nav_settings");
var account_button = document.getElementById("nav_account");

function refreshNavButtons() {
	overflow_menu_button.classList.remove("nav_active");
	watch_list_button.classList.remove("nav_active");
	history_button.classList.remove("nav_active");
	random_episode_button.classList.remove("nav_active");
	search_button.classList.remove("nav_active");
	settings_button.classList.remove("nav_active");
	account_button.classList.remove("nav_active");

	if (show_overflow_menu) { overflow_menu_button.classList.add("nav_active"); }
	if (show_watch_list) { watch_list_button.classList.add("nav_active"); }
	if (show_history) { history_button.classList.add("nav_active"); }
	if (show_random_episode) { random_episode_button.classList.add("nav_active"); }
	if (show_search) { search_button.classList.add("nav_active"); }
	if (show_settings) { settings_button.classList.add("nav_active"); }
	if (show_account) { account_button.classList.add("nav_active"); }
}

//#################################################################################################
// Aside
var aside = document.getElementsByTagName("aside")[0];
var aside_content = document.getElementsByClassName("aside_content");
var show_aside = false;


function refreshAside() {
	if (!show_aside) {
		show_aside = true;
		aside.style.overflow = "visible";
	}

	aside_content[0].style.display = "none";
	aside_content[1].style.display = "none";
	aside_content[2].style.display = "none";

	if (show_settings) { aside_content[1].style.display = "block"; }
	else if (show_account) { aside_content[2].style.display = "block"; }
	else if (show_info || show_random_episode) { aside_content[0].style.display = "flex"; }
	else { hideAside(); }

	// console.log("show_random_episode: " + show_random_episode)
	// console.log("show_settings: " + show_settings)
	// console.log("show_account: " + show_account)
	// console.log("show_info: " + show_info)
}

function hideAside() {
	show_aside = false;
	show_random_episode = false;
	show_settings = false;
	show_account = false;
	show_info = false;

	refreshNavButtons();

	aside.style.height = 0;
	setTimeout(function(){
		aside.style.overflow = "hidden";
		aside_content[0].style.display = "none";
		aside_content[1].style.display = "none";
		aside_content[2].style.display = "none";
	}, 200);
}

//#################################################################################################
// Show Aside Tabs
var show_random_episode = false;
var show_settings = false;
var show_account = false;
var show_info = false;
var test2 = [];

function getRandomEpisode() {
	// if (show_random_episode) {
	// 	show_random_episode = false;
	// 	hideAside();
	// }
	// else {
		if (!show_random_episode) {
			show_random_episode = true;
			show_account = false;
			show_settings = false;
			show_info = false;
			aside.style.height = aside_height + "px";
			refreshNavButtons();
			refreshAside();
		}
		
		// random episode from the 20 longest not heard
		var history_array = episoden.slice(); //.concat(special)

		history_array.sort((a, b) => {
			if (a.history == undefined || a.history == "") {a.history = "1899-01-01T00:00:00.000Z";}
			if (b.history == undefined || b.history == "") { b.history = "1899-01-01T00:00:00.000Z";}

			var a_date = a.history;
			var b_date = b.history;

			if (a_date < b_date) { return -1; }
			if (a_date > b_date){ return 1; }
			return 0;
		});
		var oldest_index = 19;
		for (var i = 20; i < history_array.length; i++) {
			if (history_array[i].history == history_array[oldest_index].history) {
				oldest_index = i;
			}
			else {break;}
		}
		history_array.length = oldest_index + 1;
		var random_index = Math.floor(Math.random() * oldest_index + 1);
		showInfo(history_array[random_index].array_link, true);
	// }
}

function showSettings() {
	if (show_settings) {
		show_settings = false;
		aside.style.height = 0;
		hideAside();
	}
	else {
		show_settings = true;
		show_account = false;
		show_random_episode = false;
		show_info = false;
		aside.style.height = "400px";
		refreshNavButtons();
	}
	refreshAside();
}

function showAccount() {
	if (show_account) {
		show_account = false;
		aside.style.height = 0;
		hideAside();
	}
	else {
		show_account = true;
		show_settings = false;
		show_random_episode = false;
		show_info = false;
		aside.style.height = "400px";
		refreshNavButtons();
	}
	refreshAside();
}

// episode info
var info_href = document.getElementById("info_href");
var info_img = document.getElementById("info_img");
var info_name = document.getElementById("info_name");
var info_content = document.getElementById("info_content");
var info_panel = document.getElementById("info_panel");

function showInfo(array_id, is_random_episode) {
	var episode_id = array_id.split("_");

	// img
	if (episode_id[0] == "normal") {
		var episode = episoden[episode_id[1]];
		info_img.src = `img/episode_${parseInt(episode.number)}.jpg`;
	}
	else {
		var episode = special[episode_id[1]];
		info_img.src = `img_special/special_${episode.number}.jpg`;
	}

	// info panel with author, duration, release date
	var hours = episode.track_length /3600000;
	var hours_length = Math.trunc(hours);
	var min_length = Math.floor((hours - hours_length) *60)
	if ((min_length % 60) == 0 && min_length != 0) {
		hours_length = min_length /60;
		min_length = 0;
	}
	if (min_length < 10) { min_length = "0" + min_length; }

	info_panel.innerHTML = `${episode.book_author} - ${episode.release.slice(0, 4)} - ${Math.trunc(hours_length)}h ${min_length}min`

	// history
	info_href.setAttribute("onclick", "refreshHistory(" + array_id + ")");
	var history = episode.history;
	if (history == "1899-01-01T00:00:00.000Z" || history == undefined) {
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

	// Settings
	if (is_random_episode) {
		show_info = false;
	}
	else {
		show_info = true;
		show_random_episode = false
	}
	
	show_settings = false;
	show_account = false;
	aside.style.height = aside_height + "px";
	refreshAside();
	refreshNavButtons();

	// calc hight of text for scroll
	setTimeout(function(){ info_content.style.height = info_height - info_name.parentElement.parentElement.clientHeight + "px" }, 500);

	// Prepare Edit History (defined in main.js)
	info_history.dataset.array = array_id;
	info_history.disabled = true;
	edit_history.style.display = "inline-block";
	done_history.style.display = "none";
}

//#################################################################################################
// calc height
var info_height, aside_height;

function calcHeight() {
	var height = window.innerHeight;
	var width = window.innerWidth;

	if (width > 682) {
		aside_height = 340;
		info_height = (aside_height - 92);
	}
	
	else {
		aside_height = height - 122 - 100;
		info_height = (aside_height - 232);
	}
}

calcHeight();
window.addEventListener("resize", calcHeight);

//#################################################################################################
// Settings
// Provider
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

// reset/ export settings
function exportUserData() {
	storeUserData();
	var link = document.createElement('a');
	link.download = "Stream-Fragezeicen.de Daten.json";
	link.href = "data:text/plain;charset=utf-8," + JSON.stringify(user_data);
	link.click();
}

function resetUserData() {
	user_data = null;
	window.localStorage.removeItem("user_data");
	document.location.reload();
}

// import user data
var import_user_data = document.createElement('input');
import_user_data.type = 'file';
import_user_data.accept = '.json';

import_user_data.onchange = e => { 
	var reader = new FileReader();
	reader.readAsText(e.target.files[0],'UTF-8');

	reader.onload = readerEvent => {
		var json_user_data = readerEvent.target.result;

		try {
			user_data = JSON.parse(json_user_data);
			if (user_data.provider == undefined || user_data.backwards == undefined || user_data.sort_date == undefined) {
				alert("Die Datei enthält keine Nutzerdaten!");
			}
			else { // all in main.js
				setup(json_user_data);
				storeUserData();
				document.location.reload();
			}
		}
		catch (e) { alert("Die Datei ist beschädigt!") }
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

var search_box = document.getElementById("search_box");
var nav_buttons = search_box.parentNode;
var show_search = false;

function startSearch() {
	show_search = !show_search;
	refreshNavButtons();

	if (show_search) {
		show_history = false;
		show_watch_list = false;
		refreshList(); // main.js

		search_box.style.display = "flex";
		if (window.screen.width <= 506) {
			nav_buttons.style.justifyContent = "flex-end";
			hideAside();
		}
		if (show_overflow_menu) { overflowMenu(); }
		setTimeout(function(){ input.focus() }, 100);
	}
	else {
		input.value = "";
		search_box.style.display = "none";
		if (window.screen.width <= 506) { nav_buttons.removeAttribute("style"); }
		siteSearch();
		// loadEpisodes(active_type); // main.js
	}
}


var show_overflow_menu = false;

function overflowMenu() {
	show_overflow_menu = !show_overflow_menu;
	refreshNavButtons();

	if (show_overflow_menu) {
		// open
		nav_buttons.classList.add("overflow_menu");
	}
	else {
		// close
		nav_buttons.classList.remove("overflow_menu");
	}
}