var css_root = document.querySelector(':root');
var body = document.getElementsByTagName("body")[0];

// handle when which nav button should be active
function handleNav(visible_element, type, keep_open) {
	visible_element = "nav_" + visible_element;
	var currently_visible = document.getElementsByClassName(type + " nav_active")[0];

	// currently no visible element
	if (currently_visible == undefined && visible_element != "nav_undefined") {
		document.getElementById(visible_element).classList.add("nav_active");
		return true;
	}
	// same element is visible -> keep open
	else if (currently_visible.id == visible_element && keep_open == true) {
		return undefined;
	}
	// same element is visible -> close it
	else if (currently_visible.id == visible_element) {
		currently_visible.classList.remove("nav_active");
		return false;
	}
	// other element is active
	else if (visible_element != "nav_undefined") {
		currently_visible.classList.remove("nav_active");
		document.getElementById(visible_element).classList.add("nav_active");
		return currently_visible.id.replace("nav_", "");
	}
	// go to standard setting of type
	else {
		currently_visible.classList.remove("nav_active");
		return false;
	}
}

//#################################################################################################
// Aside
var aside = document.getElementsByTagName("aside")[0];
var active_aside = undefined;

function showAside(visible_element, keep_open) {
	current_active = active_aside;
	active_aside = visible_element;

	var action = handleNav(visible_element, "toggle_aside", keep_open);

	// load element, aside is currently hidden
	if (action == true) {
		aside.classList.add("show_" + visible_element);
		infoHeight();
	}
	// close element
	else if (action == false) {
		active_aside = undefined;
		css_root.style.setProperty("--aside_height", "0");
		preventScroll(false);
		
		setTimeout(function(){
			aside.classList.remove("show_" + current_active);
		}, 300);
	}
	// load element, close currently loaded element
	else if (action != undefined) {
		aside.classList.add("show_" + visible_element);
		aside.classList.remove("show_" + action);
		infoHeight();
	}

	// close ignore list
	if (active_main == "ignore_list") {
		document.getElementById("nav_ignore_list").classList.remove("nav_active");
		main.classList.remove("show_ignore_list");
		active_main = undefined;
	}
}

// calc aside height
var is_small_screen = false;

function infoHeight() {
	var description_header_height = info_name.parentElement.parentElement.scrollHeight;
	var window_height = window.innerHeight;
	var window_width = window.innerWidth;
	var show_small_screen = false;

	if (active_aside == "info" || active_aside == "random_episode") {
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

	// Settings Height
	else if (active_aside == "settings") {
		aside_height = "400px";
		// Height for small screens (mobile with open keyboard)
		if (window_height <= 600 && window_width <= 682) {
			var aside_height = (window_height - 120) + "px";
			show_small_screen = true;
		}
	}

	// User Data Height
	else if (active_aside == "user_data") {
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

// prevent scroll
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

visualViewport.addEventListener("resize", infoHeight);

//#################################################################################################
// Random Episode
function getRandomEpisode() {
	var all_possible_episoden = [];
	var filtered_episoden = [];
	var not_listened_counter_all = 0;
	var not_listened_counter_filtered = 0;

	for (var i = 0; i < episoden.length; i++) {
		var episode = episoden[i];
		var keep = false;

		if (user_data.random_settings[1] && episode.type == "normal") { keep = true; }
		else if (user_data.random_settings[2] && episode.type == "special") { keep = true; }
		else if (user_data.random_settings[3] && episode.type == "advent_calender") { keep = true; }
		else if (user_data.random_settings[4] && episode.type == "headphones") { keep = true; }
		else if (user_data.random_settings[5] && episode.type == "short_story") { keep = true; }
		else if (user_data.random_settings[6] && episode.type == "film") { keep = true; }
		else if (user_data.random_settings[7] && episode.type == "live") { keep = true; }
		else if (user_data.random_settings[8] && episode.type == "audiobook") { keep = true; }
		else if (user_data.random_settings[9] && episode.type == "documentation") { keep = true; }

		// remove unreleased episodes
		if (episode.href[0] == "#new") { keep = false; }

		// remove ignored episodes
		if (episode.user_data_index != undefined && user_data.list[episode.user_data_index].ignored == "true") { keep = false; }

		// generate arrays array
		if (keep) {
			var history = undefined;
			if (episode.user_data_index != undefined) {
				history = user_data.list[episode.user_data_index].history;
			}
			if (history == undefined) {
				history = "1999-01-01T00:00:00.000Z";
				not_listened_counter_all++;
				if (!episode.random_shown) { not_listened_counter_filtered++; }
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

	var defined_max_length = user_data.random_settings[0];

	// decrease max_length if not enough episodes possible as defined in settings
	if (defined_max_length >= random_episoden.length) {
		var max_length = random_episoden.length;
	}
	// set max_length to not_listened_counter if it is bigger
	else if (defined_max_length <= not_listened_counter) {
		var max_length = not_listened_counter;
	}
	else {
		var max_length = defined_max_length + 1;
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

	// show in aside
	if (is_random_episode) {
		showAside("random_episode", true);
	}
	else {
		showAside("info", true);
	}
	
	// Prepare Edit History (defined in main.js)
	info_history.disabled = true;
	edit_history.style.display = "inline-block";
	done_history.style.display = "none";
	done_history.setAttribute("onclick", `saveEditHistory("${episoden_index}")`);
}

//#################################################################################################
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
async function resetUserData() {
	var confirm_msg = confirm("Deine lokalen und synchronisierten Nutzerdaten werden unwiederruflich gelöscht! Deine ID bleibt ohne Daten bestehen.");
	if (confirm_msg == true) {
		var user_id = user_data.user_id;
		var a_name = user_data.a_name;

		user_data = standard_settings;

		user_data.user_id = user_id;
		user_data.a_name = a_name;

		storeUserData(true);
		document.location.reload();
	}
}

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
// User Id
// show correct buttons
var new_id = document.getElementById("new_id");
var delete_id = document.getElementById("delete_id");
var check_id = document.getElementById("check_id");
var remove_id = document.getElementById("remove_id");

function changeIdButton(button) {
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

function importNewIdShow() {
	if (input_user_id.value.length == 18) {
		changeIdButton("check_id");
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

async function createId() {
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

		changeIdButton("delete_id");
	}
	else {
		alert("ID konnte nicht erstellt werden!");
		console.log(response);
		console.log(response_object);
	}
}

function disconnectId() {
	input_user_id.value = "";
	user_data.user_id = undefined;
	storeUserData(false);
	changeIdButton("new_id");
}

async function deleteId() {
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
	main.classList.remove('hide_watch_list');

	user_data.cover_size = size;
	storeUserData(false);
	
	if (size == "0") {
		var size_array = ["120px", "40px", "9px", "71px", "71px", "71px", "9px"];
		main.classList.add('hide_watch_list');
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

// change visibility of episode titles
function toggleEpisodeTitle() {
	user_data.hide_episode_title = !user_data.hide_episode_title;
	document.getElementById("settings_episode_title").checked = user_data.hide_episode_title;
	storeUserData(false);
	
	if (user_data.hide_episode_title) {
		episoden_list.classList.add('hide_episode_title');;
	}
	else {
		episoden_list.classList.remove('hide_episode_title');
	}
}

// change direction of episode list
function toggleOrder() {
	user_data.backwards = !user_data.backwards;
	document.getElementById("settings_sort_list").checked = !user_data.backwards;
	storeUserData(false);
	loadEpisodes();

	if (user_data.backwards) {
		document.getElementById("sort_list").style.transform = "scaleY(1)";
	}
	else {
		document.getElementById("sort_list").style.transform = "scaleY(-1)";
	}
}

// sort episode list according to release date or numbering
function toggleSort() {
	user_data.sort_date = !user_data.sort_date;
	document.getElementById("settings_episode_number").checked = user_data.sort_date;
	storeUserData(false);
	loadEpisodes();

	if (user_data.sort_date) {
		document.getElementById("episode_number").style.display = "flex";
		document.getElementById("release_date").style.display = "none";
	}
	else {
		document.getElementById("episode_number").style.display = "none";
		document.getElementById("release_date").style.display = "flex";
	}
}


//#################################################################################################
// show episoden list
var episoden_list = document.getElementsByTagName("ol")[0];
var main = document.getElementsByTagName("main")[0];
var active_main = undefined;

function showEpisoden(visible_element, counter) {
	current_active = active_main;
	active_main = visible_element;

	var action = handleNav(visible_element, "toggle_episoden");
	
	// show or hide not found message
	if (counter == 0) { main.classList.add("show_not_found"); }
	else { main.classList.remove("show_not_found"); }

	// load list, currently episode list is visible
	if (action == true) {
		main.classList.add("show_" + visible_element);
	}
	// close element
	else if (action == false) {
		main.classList.remove("show_" + current_active);
		active_main = undefined;
	}
	// load element, close currently loaded element
	else if (action != undefined) {
		main.classList.add("show_" + visible_element);
		main.classList.remove("show_" + action);
	}

	loadEpisodes();
}

function showHistory() {
	var counter = episoden_list.querySelectorAll("div:not(.no_history)").length;
	showEpisoden("history", counter);
}

//#################################################################################################
// Overflow menu for navbar on mobile
function overflowMenu(show_overflow_menu) {
	var overflow_menu_hidden = search_box.parentNode.classList.contains("overflow_menu");
	var overflow_menu_button = document.getElementById("nav_overflow_menu");

	if (show_overflow_menu == true && overflow_menu_hidden) {
		search_box.parentNode.classList.add("overflow_menu");
		overflow_menu_button.classList.add("nav_active");
	}
	else if (show_overflow_menu == false && !overflow_menu_hidden) {
		search_box.parentNode.classList.remove("overflow_menu");
		overflow_menu_button.classList.remove("nav_active");
	}
	else {
		search_box.parentNode.classList.toggle("overflow_menu");
		overflow_menu_button.classList.toggle("nav_active");
	}
}

// Search
var article = document.getElementsByTagName("ol")[0].children;
var input = document.getElementById("site_search");
var search_box = document.getElementById("search_box");
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

function startSearch() {
	showEpisoden("search");

	if (active_main == "search") {
		search_box.style.display = "flex";
		if (window.screen.width <= 506) {
			search_box.parentNode.style.justifyContent = "flex-end";
			showAside("search");
			overflowMenu(false);
		}

		setTimeout(function(){ input.focus() }, 100);
	}
	else {
		input.value = "";
		search_box.style.display = "none";
		if (window.screen.width <= 506) {
			search_box.parentNode.removeAttribute("style");
			aside.classList.remove("show_search");
		}
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

// also reactivate episode counter in refreshHistory() in main.js
// userCounter();