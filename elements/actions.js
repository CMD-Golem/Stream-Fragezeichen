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

// Overflow menu for navbar on mobile
var show_overflow_menu = false;

function overflowMenu() {
	show_overflow_menu = !show_overflow_menu;
	refreshNavButtons();

	if (show_overflow_menu) { nav_buttons.classList.add("overflow_menu"); }
	else { nav_buttons.classList.remove("overflow_menu"); }
}

//#################################################################################################
// Aside
var aside = document.getElementsByTagName("aside")[0];
var aside_content = document.getElementsByClassName("aside_content");
var css_root = document.querySelector(':root');
var show_aside = false;
var show_random_episode = false;
var show_settings = false;
var show_account = false;
var show_info = false;


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

// hide aside on touchmove
// var main_el = document.getElementsByTagName("main")[0];
// if (navigator.maxTouchPoints > 0 ) {
// 	main_el.addEventListener("touchmove", function(){ if (show_aside) { hideAside(); }});
// }

// prevent scroll
var body = document.getElementsByTagName("body")[0];
var prevents_scroll = false;

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

// calc height
var is_small_screen = false;

function infoHeight() {
	var description_header_height = info_name.parentElement.parentElement.scrollHeight;
	var window_height = window.innerHeight;
	var window_width = window.innerWidth;
	var show_small_screen = false;

	if (show_info || show_random_episode) {
		// Height for Desktop view
		if (window_width > 682) {
			var aside_height = "340px";
			var info_height = (248 - info_name.parentElement.scrollHeight - info_author.parentElement.scrollHeight) + "px";
		}
		// Height for small screens (mobile with open keyboard)
		else if (window_height <= 600 && window_width <= 682) {
			var aside_height = (window_height - 120) + "px";
			var info_height = "unset";
			show_small_screen = true;
		}
		// Height for small screens but text doesn't fit on page without scrolling (description_header_height + 224 >= window_height - 220)
		else if (description_header_height + 444 >= window_height) {
			var aside_height = (window_height - 120) + "px";
			var info_height = "unset";
			show_small_screen = true;
		}
		// Height for small screens but text fits on page without scrolling
		else if (description_header_height + 444 < window_height) {
			var aside_height = (description_header_height + 224) + "px";
			var info_height = "unset";
		}

		css_root.style.setProperty("--description_height", info_height);
	}

	// Account Settings Height
	else if (show_settings) {
		aside_height = "400px";
		// Height for small screens (mobile with open keyboard)
		if (window_height <= 600 && window_width <= 682) {
			var aside_height = (window_height - 120) + "px";
			show_small_screen = true;
		}
	}

	// Account Settings Height
	else if (show_account) {
		if (window_height <= 580 && window_width <= 458) {
			var aside_height = (window_height - 120) + "px";
			show_small_screen = true;
		}
		else if (window_width <= 458) {
			aside_height = "400px";
		}
		else {
			aside_height = "270px";
		}
	}

	// change small_screen class when needed
	if (!is_small_screen && show_small_screen) {
		is_small_screen = true;
		aside.classList.add("small_screen");
		preventScroll(true);
	}
	else if (is_small_screen && !show_small_screen) {
		is_small_screen = false;
		aside.classList.remove("small_screen");
		preventScroll(false);
	}

	css_root.style.setProperty("--aside_height", aside_height);
}

visualViewport.addEventListener("resize", infoHeight);

//#################################################################################################
// Random Episode
var random_settings = [20, true, true, false, false, false, false, false, false, false];
// var all_possible_episoden, filtered_episoden;

function getRandomEpisode() {
	var all_possible_episoden = [];
	var filtered_episoden = [];

	for (var i = 0; i < episoden.length; i++) {
		var episode = episoden[i];
		var not_listened_counter_all = 0;
		var not_listened_counter_filtered = 0;
		var keep = false;

		if (random_settings[1] && episode.type == "normal") { keep = true; }
		else if (random_settings[2] && episode.type == "special") { keep = true; }
		else if (random_settings[3] && episode.type == "advent_calender") { keep = true; }
		else if (random_settings[4] && episode.type == "headphones") { keep = true; }
		else if (random_settings[5] && episode.type == "short_story") { keep = true; }
		else if (random_settings[6] && episode.type == "film") { keep = true; }
		else if (random_settings[7] && episode.type == "live") { keep = true; }
		else if (random_settings[8] && episode.type == "audiobook") { keep = true; }
		else if (random_settings[9] && episode.type == "documentation") { keep = true; }

		// remove unreleased episodes
		if (episode.href[0] == "#new") { keep = false; }

		// remove ignored episodes
		if (episode.user_data_index != undefined && user_data.list[episode.user_data_index].ignored == "true") { keep = false; }

		// generate arrays array
		if (keep) {
			var history;
			if (episode.user_data_index != undefined) {
				history = user_data.list[episode.user_data_index].history;
			}
			if (history == undefined) {
				history = "1999-01-01T00:00:00.000Z";
				not_listened_counter_all++;
				if (episode.random_shown) { not_listened_counter_filtered++; }
			}

			// array with all episodes
			all_possible_episoden.push({episoden_index:i, history:history});

			// array without already shown episodes
			if (!episode.random_shown) { filtered_episoden.push({episoden_index:i, history:history}); }
		}
	}

	// if there are not shown episodes, use filtered_episoden array
	if (filtered_episoden.length != 0) { 
		var random_episoden = filtered_episoden; 
		var not_listened_counter = not_listened_counter_filtered;
	}
	else {
		var random_episoden = all_possible_episoden;
		var not_listened_counter = not_listened_counter_all;
	}

	// sort array by the history
	random_episoden.sort((a, b) => {
		if (a.history < b.history) { return -1; } // sort a before b
		if (a.history > b.history) { return 1; } // sort a after b
		return 0;
	});

	// decrease max_length if not enough episodes possible as defined in settings
	if (random_settings[0] >= random_episoden.length) {
		var max_length = random_episoden.length;
	}
	// set max_length to not_listened_counter if it is bigger
	else if (random_settings[0] <= not_listened_counter) {
		var max_length = not_listened_counter;
	}
	else {
		var max_length = random_settings[0] + 1;
	}

	// get random episode
	var random_episode = random_episoden[Math.floor(Math.random() * max_length)];
	episoden[random_episode.episoden_index].random_shown = true;
	showInfo(random_episode.episoden_index, true);
}

// episode info
var info_play = document.getElementById("info_play");
var info_href = document.getElementById("info_href");
var info_name = document.getElementById("info_name");
var info_author = document.getElementById("info_author");

function showInfo(episoden_index, is_random_episode) {
	var episode = episoden[episoden_index];

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

	document.getElementById("info_duration").innerHTML = hours_length + min_length + "min";

	// history
	info_href.setAttribute("onclick", `refreshHistory('${episoden_index}', new Date())`);
	if (episode.user_data_index == undefined) {
		info_history.value = "nie";
	}
	else if (user_data.list[episode.user_data_index].history == undefined) {
		info_history.value = "nie";
	}
	else {
		info_history.value = new Date(user_data.list[episode.user_data_index].history).toLocaleDateString("fr-CH");
	}

	// link and text
	info_href.href = episode.href[user_data.provider];
	info_name.innerHTML = episode.name;
	info_author.innerHTML = episode.book_author;
	document.getElementById("info_img").src = `img/${episode.number}.jpg`;
	document.getElementById("info_release").innerHTML = episode.release.slice(0, 4);
	document.getElementById("info_summary").innerHTML = episode.content;

	// Ignore List
	info_play.classList = "";
	info_play.dataset.index = episoden_index;

	if (episode.user_data_index != undefined) {
		if (user_data.list[episode.user_data_index].list == "true") {
			info_play.classList.add("in_watch_list");
		}
		if (user_data.list[episode.user_data_index].ignored == "true") {
			info_play.classList.add("in_ignore_list");
		}
	}

	// Settings
	if (is_random_episode) {
		show_info = false;
		show_random_episode = true;
	}
	else {
		show_info = true;
		show_random_episode = false;
	}
	
	show_settings = false;
	show_account = false;
	refreshAside();
	infoHeight();
	refreshNavButtons();
	
	// Prepare Edit History (defined in main.js)
	info_history.disabled = true;
	edit_history.style.display = "inline-block";
	done_history.style.display = "none";
	done_history.setAttribute("onclick", `saveEditHistory("${episoden_index}")`);
}


//#################################################################################################
// Show Watch list, History
var show_watch_list = false;
var show_ignore_list = false;
var show_history = false;

function showWatchList() {
	show_watch_list = !show_watch_list;
	show_history = false;
	show_ignore_list = false;
	refreshList();
}

function showHistory() {
	show_history = !show_history;
	show_watch_list = false;
	show_ignore_list = false;
	refreshList();
}

function showIgnoreList() {
	show_ignore_list = !show_ignore_list;
	show_watch_list = false;
	show_history = false;
	refreshList();
}

function refreshList() {
	no_watch_list.style.display = "none";
	no_history.style.display = "none";
	no_ignore_list.style.display = "none";

	episoden_list.classList.remove("show_history");
	episoden_list.classList.remove("show_watch_list");
	episoden_list.classList.remove("show_ignore_list");

	if (show_watch_list) {
		// loadEpisodes(); // main.js
		episoden_list.classList.add("show_watch_list");
		if (watch_list_count == 0) { no_watch_list.style.display = "block"; }
	}
	else if (show_history) {
		loadEpisodes(); // main.js
		episoden_list.classList.add("show_history");
		if (episoden_list.querySelectorAll("div:not(.no_history)").length == 0) { no_history.style.display = "block"; }
	}
	else if (show_ignore_list) {
		episoden_list.classList.add("show_ignore_list");
		if (ignore_list_count == 0) { no_ignore_list.style.display = "block"; }
	}
	else {
		loadEpisodes(); // main.js
	}
	refreshNavButtons();
}

//#################################################################################################
// Settings
function showSettings() {
	if (show_settings) { hideAside(); }
	else {
		show_settings = true;
		show_account = false;
		show_random_episode = false;
		show_info = false;
		infoHeight();
		refreshNavButtons();
	}
	refreshAside();
}

// Provider
function selectProvider(el_button) {
	last_provider_selected.classList.remove("provider_selected");
	el_button.classList.add("provider_selected");

	last_provider_selected = el_button;
	user_data.provider = parseInt(el_button.id.replace("provider_", ""));

	loadEpisodes(); // main.js
	storeUserData(false); // main.js
}

//#################################################################################################
// User data
var new_id = document.getElementById("new_id");
var delete_id = document.getElementById("delete_id");
var check_id = document.getElementById("check_id");
var remove_id = document.getElementById("remove_id");

function showAccount() {
	if (show_account) { hideAside(); }
	else {
		show_account = true;
		show_settings = false;
		show_random_episode = false;
		show_info = false;
		infoHeight();
		refreshNavButtons();

		if (user_data.user_id != undefined) {
			changeAccountButton("delete_id");
			input_user_id.value = user_data.user_id;
		}
		else { changeAccountButton("new_id"); }
	}
	refreshAside();
}

// reset user data
async function resetUserData() {
	var confirm_msg = confirm("Deine lokalen und synchronisierten Nutzerdaten werden unwiederruflich gelöscht! Deine ID bleibt ohne Daten bestehen.");
	if (confirm_msg == true) {
		// reset local data and only keep user id
		var json_user_data = JSON.stringify({user_id: user_data.user_id});
		window.localStorage.setItem("user_data", json_user_data);

		// reset remote data
		if (user_data.user_id != undefined) {
			var remote_data = {};
			remote_data.latest_upload = new Date();
			remote_data.a_name = user_data.a_name;

			var fetch_body = {
				id: user_data.user_id,
				data: remote_data
			}
		
			var json_fetch_body = JSON.stringify(fetch_body);
		
			await fetch("/.netlify/functions/db_update", {
				method: "POST",
				body: json_fetch_body,
			});
		}

		document.location.reload();
	}
}

// export user data
function exportUserData() {
	storeUserData(false);
	var link = document.createElement('a');
	link.download = "Stream-Fragezeichen Daten.json";
	link.href = "data:text/plain;charset=utf-8," + JSON.stringify(user_data);
	link.click();
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
			new_user_data = JSON.parse(json_user_data);
			if (new_user_data.provider == undefined || new_user_data.backwards == undefined || new_user_data.sort_date == undefined) {
				alert("Die Datei enthält keine Nutzerdaten!");
			}
			else {
				// keep current user id if not defined in new user data
				if (new_user_data.user_id == undefined && user_data.user_id != undefined) {
					new_user_data.user_id = user_data.user_id;
					json_user_data = JSON.stringify(new_user_data);
				}

				window.localStorage.setItem("user_data", json_user_data);
				document.location.reload();
			}
		}
		catch (e) { alert("Die Datei ist beschädigt!") }
	}
}

//#################################################################################################
// Account
function changeAccountButton(button) {
	new_id.style.display = "none";
	delete_id.style.display = "none";
	check_id.style.display = "none";
	remove_id.style.display = "none";

	if (button == "new_id") {
		new_id.style.display = "inline-block";
	}
	else if (button == "delete_id") {
		delete_id.style.display = "inline-block";
		remove_id.style.display = "inline-block";
	}
	else if (button == "check_id") {
		check_id.style.display = "inline-block";
	}
}

// use new id
function importNewIdShow() {
	if (input_user_id.value.length == 18) {
		changeAccountButton("check_id");
	}
}

function importNewId() {
	var confirm_msg = confirm("Durch das Einfügen dieser ID werden deine lokalen Episoden Daten überschrieben!");
	if (confirm_msg == true) {
		user_data.user_id = input_user_id.value;
		storeUserData(false);
		document.location.reload();
	}
}

// create new db id
async function createDatabase() {
	if (user_data.user_id != undefined) {
		return
	}

	var json_user_data = JSON.stringify(user_data);

	var response = await fetch("/.netlify/functions/db_create", {
		method: "POST",
		body: json_user_data,
	});

	var response_object = await response.json();

	if (response.status == 200) {
		user_data.user_id = response_object.user_id;
		input_user_id.value = user_data.user_id;
		storeUserData(false);

		changeAccountButton("delete_id");
	}
	else {
		alert("ID konnte nicht erstellt werden!");
		console.log(response);
		console.log(response_object);
	}
}

// disconnect from db
function disconnectId() {
	input_user_id.value = "";
	user_data.user_id = undefined;
	storeUserData(false);
	changeAccountButton("new_id");
}

// delete db
async function deleteDatabase() {
	var confirm_msg = confirm("Deine ID und die dazugehörigen Daten werden unwiederruflich gelöscht! Lokale Daten beleiben aber weiterhin bestehen.");
	if (confirm_msg == true) {
		var response = await fetch("/.netlify/functions/db_delete", {
			method: "POST",
			body: user_data.user_id,
		});

		if (response.status == 200) {
			disconnectId();
		}
		else {
			alert("ID konnte nicht gelöscht werden!");
			console.log(response);
			console.log(await response.json());
		}
	}
}

//#################################################################################################
// Cover size
function changeCoverSize(size) {
	episoden_list.classList.remove('hide_watch_list');

	user_data.cover_size = size;
	
	if (size == "0") {
		var size_array = ["120px", "40px", "9px", "71px", "71px", "71px", "9px"];
		episoden_list.classList.add('hide_watch_list');
	}
	else if (size == "1") { var size_array = ["155px", "60px", "11px", "84px", "51px", "104px", "9px"]; }
	else if (size == "2") { var size_array = ["190px", "60px", "16px", "114px", "81px", "134px", "9px"]; }
	else if (size == "3") { var size_array = ["225px", "60px", "16px", "146px", "111px", "169px", "14px"]; }
	else if (size == "4") { var size_array = ["260px", "60px", "16px", "184px", "146px", "204px", "14px"]; }

	css_root.style.setProperty("--cover_size", size_array[0]);
	css_root.style.setProperty("--play_button_size", size_array[1]);
	css_root.style.setProperty("--play_button_right", size_array[2]);
	css_root.style.setProperty("--play_button_top", size_array[3]);
	css_root.style.setProperty("--info_button_top", size_array[4]);
	css_root.style.setProperty("--watch_list_top", size_array[5]);
	css_root.style.setProperty("--buttons_left", size_array[6]);
}

function toggleEpisodeTitle() {
	user_data.show_episode_title = !user_data.show_episode_title;
	episoden_list.classList.toggle('show_episode_title');
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
	}
}

//#################################################################################################
// Calc ms
function calcDuration(min, s) {
	return (min * 60 + s) * 1000;
}

// User counter
async function userCounter() {
	var local_date = new Date();
	var current_day = local_date.getFullYear + "." + local_date.getMonth + "." + local_date.getDay;
	var was_counted = window.localStorage.getItem("user_counter");
	var user_role = window.localStorage.getItem("user_role"); // window.localStorage.setItem("user_role", "hidden")

	if (was_counted != current_day && user_role != "hidden") {
		window.localStorage.setItem("user_counter", current_day);

		var country_response = await fetch("/get-country");
		var geo_data = await country_response.json();
		fetch(`/.netlify/functions/user_counter/` + geo_data.geo.geo.country.name);
	}
}

// userCounter();