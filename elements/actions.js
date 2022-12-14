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
var css_root = document.querySelector(':root');
var show_aside = false;


function refreshAside() {
	// if aside isnt' visible, make it visible
	if (!show_aside) {
		show_aside = true;
		aside.style.overflow = "visible";
	}

	// hide content of aside
	aside_content[0].style.display = "none";
	aside_content[1].style.display = "none";
	aside_content[2].style.display = "none";

	// show content of needed aside again
	if (show_settings) { aside_content[1].style.display = "block"; }
	else if (show_account) { aside_content[2].style.display = "block"; }
	else if (show_info || show_random_episode) { aside_content[0].style.display = "flex"; }
	else { hideAside(); }
}

function hideAside() {
	css_root.style.setProperty("--aside_height", "0");
	if (show_random_episode || show_info) {
		css_root.style.setProperty("--description_height", "unset");
	}
	
	setTimeout(function(){
		aside.style.overflow = "hidden";
		aside_content[0].style.display = "none";
		aside_content[1].style.display = "none";
		aside_content[2].style.display = "none";
	}, 200);

	show_aside = false;
	show_random_episode = false;
	show_settings = false;
	show_account = false;
	show_info = false;

	refreshNavButtons();
	preventScroll(false);
}

//#################################################################################################
// Show Aside Tabs
var show_random_episode = false;
var show_settings = false;
var show_account = false;
var show_info = false;

function getRandomEpisode() {
	// random episode from the select_random_amount longest not heard
	var history_array = episoden.slice(); //.concat(special)
	var select_random_amount = 20;

	// sort history array by the history
	history_array.sort((a, b) => {
		if (a.history == undefined || a.history == "") {a.history = "1899-01-01T00:00:00.000Z";}
		if (b.history == undefined || b.history == "") { b.history = "1899-01-01T00:00:00.000Z";}

		var a_date = a.history;
		var b_date = b.history;

		if (a.href[0] == "#new") { a_date = "3000-01-01T00:00:00.000Z"}

		if (a_date < b_date) { return -1; } // sort a before b
		if (a_date > b_date) { return 1; } // sort a after b
		return 0;
	});

	var oldest_index = select_random_amount - 1;
	// increase oldest_index by one if element in array has same date
	for (var i = select_random_amount; i < history_array.length; i++) {
		if (history_array[i].history == history_array[oldest_index].history) {
			oldest_index = i;
		}
		else {break;}
	}

	history_array.length = oldest_index + 1;
	var random_index = Math.floor(Math.random() * oldest_index + 1);

	// show aside
	show_random_episode = true;
	showInfo(history_array[random_index].array_link, true);
}

function showSettings() {
	if (show_settings) {
		show_settings = false;
		css_root.style.setProperty("--aside_height", "0");
		hideAside();
	}
	else {
		show_settings = true;
		show_account = false;
		show_random_episode = false;
		show_info = false;
		css_root.style.setProperty("--aside_height", "400px");
		refreshNavButtons();
	}
	refreshAside();
}

function showAccount() {
	if (show_account) {
		show_account = false;
		css_root.style.setProperty("--aside_height", "0");
		hideAside();
	}
	else {
		show_account = true;
		show_settings = false;
		show_random_episode = false;
		show_info = false;
		css_root.style.setProperty("--aside_height", "370px");
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

	if (hours_length != 0) { hours_length = hours_length + "h " }
	else {hours_length = ""}

	info_panel.innerHTML = `${episode.book_author} - ${episode.release.slice(0, 4)} - ${hours_length}${min_length}min`

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
	refreshAside();
	infoHeight();
	refreshNavButtons();
	
	// Prepare Edit History (defined in main.js)
	info_history.dataset.array = array_id;
	info_history.disabled = true;
	edit_history.style.display = "inline-block";
	done_history.style.display = "none";
}

//#################################################################################################
// calc height
var window_height = window.innerHeight;
var window_width = window.innerWidth;

function infoHeight() {
	var aside_needed_height = aside.firstElementChild.scrollHeight;
	var description_header_height = info_name.parentElement.parentElement.scrollHeight;
	var window_without_nav = window_height - 220;

	// Height for Desktop view
	if (window_width > 682) {
		var aside_height = 340;
		var info_height = (340 - 92 - description_header_height) + "px";
	}
	// Height for small screens (mobile with open keyboard)
	else if (window_height <= 600 && window_width <= 682) {
		var aside_height = window_height - 120;
		var info_height = "unset";
		preventScroll(true);
	}
	// Height for small screens but text doesn't fit on page without scrolling
	else if (aside_needed_height >= window_without_nav) {
		var aside_height = window_without_nav;
		var info_height = (window_without_nav - description_header_height - 238) + "px";
	}
	// Height for small screens but text fits on page without scrolling
	else if (aside_needed_height < window_without_nav) {
		var aside_height = aside_needed_height;
		var info_height = "unset";
	}

	css_root.style.setProperty("--aside_height", aside_height + "px");
	css_root.style.setProperty("--description_height", info_height);
}



var body = document.getElementsByTagName("body")[0];
var main_el = document.getElementsByTagName("main")[0];
var prevents_scroll = false;

window.addEventListener("resize", function(){
	window_height = window.innerHeight;
	window_width = window.innerWidth;
	if (show_info || show_random_episode) { infoHeight(); }
});

// hide aside on touchmove
if (navigator.maxTouchPoints > 0 ) {
	main_el.addEventListener("touchmove", function(){ if (show_aside) { hideAside(); }});
}

function preventScroll(prevent_scroll) {
	if (prevent_scroll && !prevents_scroll) {
		body.style.overflow = "hidden";
		prevents_scroll = true;
	}
	else if (!prevent_scroll && prevents_scroll) {
		body.style.overflow = "visible";
		prevents_scroll = false;
	}
}

//#################################################################################################
// Settings
// Provider
function selectProvider(el_button) {
	last_provider_selected.classList.remove("provider_selected");
	el_button.classList.add("provider_selected");

	last_provider_selected = el_button;
	provider_link = parseInt(el_button.id.replace("provider_", ""));
	console.log(provider_link)

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
				alert("Die Datei enth??lt keine Nutzerdaten!");
			}
			else { // all in main.js
				setup(json_user_data);
				storeUserData();
				document.location.reload();
			}
		}
		catch (e) { alert("Die Datei ist besch??digt!") }
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

// Overflow menu for navbar on mobile
var show_overflow_menu = false;

function overflowMenu() {
	show_overflow_menu = !show_overflow_menu;
	refreshNavButtons();

	if (show_overflow_menu) { nav_buttons.classList.add("overflow_menu"); }
	else { nav_buttons.classList.remove("overflow_menu"); }
}




//#################################################################################################
// Calc ms
function calcDuration(min, s) {
	return (min * 60 + s) * 1000;
}


// User counter
var local_date = new Date();
var user_role = window.localStorage.getItem("user_role"); // window.localStorage.setItem("user_role", "hidden")

async function userCounter() {
	var current_day = local_date.getFullYear + "." + local_date.getMonth + "." + local_date.getDay;
	var was_counted = window.localStorage.getItem("user_counter");

	if (was_counted != current_day && user_role != "hidden") {
		window.localStorage.setItem("user_counter", current_day);

		var country_response = await fetch("/get-country");
		var geo_data = await country_response.json();
		fetch(`/.netlify/functions/user_counter/` + geo_data.geo.geo.country.name);
	}
}

userCounter();