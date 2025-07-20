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

function toggleTheme() {
	user_data.theme = !user_data.theme;
	document.getElementById("settings_toggle_theme").checked = user_data.theme;
	storeUserData(false);
	
	if (user_data.theme) {
		var set_dark = document.styleSheets[0].cssRules[3];
		var set_light = document.styleSheets[0].cssRules[2];
	}
	else {
		var set_dark = document.styleSheets[0].cssRules[2];
		var set_light = document.styleSheets[0].cssRules[3];
	}

	set_dark.media.mediaText = "(prefers-color-scheme: dark)";
	set_light.media.mediaText = "(prefers-color-scheme: light)";
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

// hide aside with touch
var hide_aside = document.getElementsByClassName("hide_aside_pill")[0];
var touch_store = {};
hide_aside.addEventListener("touchstart", (e) => {
	touch_store.start = e.touches[0].clientY;
	touch_store.height = aside.offsetHeight;
	touch_store.tbefore = new Date().getTime();
	touch_store.before = e.touches[0].clientY;
});


hide_aside.addEventListener("touchmove", (e) => {
	touch_store.before = touch_store.now;
	touch_store.now = e.touches[0].clientY;
	touch_store.tbefore = touch_store.tnow;
	touch_store.tnow = new Date().getTime();
	var distance = Math.min(0, touch_store.now - touch_store.start);
	e.preventDefault();

	if (distance < 0) aside.style.transform = `translateY(${distance}px)`;
});

hide_aside.addEventListener("touchend", (e) => {
	var distance = Math.max(0, touch_store.start - touch_store.now);
	if (distance > touch_store.height / 2 || (touch_store.tbefore - touch_store.tnow) / (touch_store.before - touch_store.now) >= -1) {
		css_root.style.setProperty("--aside_height", "0");
		aside.classList.remove("show_" + active_aside);
		active_aside = undefined;
		handleNav(active_aside, "toggle_aside");
		preventScroll(false);

		setTimeout(function(){
			aside.style.transform = "";
		}, 400);
	}
	else aside.style.transform = "";
});

// calc aside height
function infoHeight() {
	if (active_aside == undefined) return;

	var info_height = "unset";
	var aside_padding = 80;
	aside.classList.remove("small_screen");

	if (window.innerWidth > 710) {
		if (active_aside == "info" || active_aside == "random_episode") {
			info_height = (248 - info_name.parentElement.scrollHeight - info_author.parentElement.scrollHeight) + "px";
			var aside_height = 340;
		}
		else if (active_aside == "settings" || active_aside == "random_settings" || active_aside == "list_settings") var aside_height = 400;
		else if (active_aside == "user_data") var aside_height = 280;
		preventScroll(false);
	}
	else {
		if (active_aside == "info" || active_aside == "random_episode") aside.classList.add("small_screen");
		if (window.matchMedia("(pointer: coarse)").matches) aside_padding = 110;
		var aside_height = window.innerHeight - 121.6;
		preventScroll(true);
	}

	css_root.style.setProperty("--aside_height", aside_height + "px");
	css_root.style.setProperty("--aside_padding", "calc(100% - " + aside_padding + "px)");
	css_root.style.setProperty("--description_height", info_height);
}

// prevent scroll
var prevents_scroll = false;

function preventScroll(enable) {
	if (enable && !prevents_scroll) {
		body.style.overflow = "hidden";
		prevents_scroll = true;
	}
	else if (!enable && prevents_scroll) {
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

		// remove unreleased episodes
		if (episode.href[0] == "#new") continue;

		// remove ignored episodes
		if (!user_data.random_settings[episode.type]) continue;
		if (episode.user_data_index != undefined && user_data.list[episode.user_data_index].ignored == "true") continue;

		// store history
		var history = undefined;
		if (episode.user_data_index != undefined) history = user_data.list[episode.user_data_index].history;

		// check unlistened
		if (history == undefined) {
			history = "1999-01-01T00:00:00.000Z";
			not_listened_counter_all++;
			if (!episode.random_shown) not_listened_counter_filtered++;
		}

		// array with all episodes
		all_possible_episoden.push({episoden_index:i, history:history});

		// array without already shown episodes
		if (!episode.random_shown) filtered_episoden.push({episoden_index:i, history:history});
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
		if (a.history < b.history) return -1; // sort a before b
		if (a.history > b.history) return 1; // sort a after b
		return 0;
	});


	// set max_length to not_listened_counter if it is bigger
	if (not_listened_counter >= user_data.random_amount) {
		var max_length = not_listened_counter;
	}
	// decrease max_length if not enough episodes possible as defined in settings
	else var max_length = random_episoden.length;

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
	if (min_length < 10) min_length = "0" + min_length;

	if (hours_length != 0) hours_length = hours_length + "h ";
	else hours_length = ""

	document.getElementById("info_duration").innerHTML = hours_length + min_length + "min";

	// history
	info_href.setAttribute("onclick", `refreshHistory('${episoden_index}', new Date())`);
	if (episode.user_data_index == undefined) info_history.value = "nie";
	else if (user_data.list[episode.user_data_index].history == undefined) info_history.value = "nie";
	else info_history.value = new Date(user_data.list[episode.user_data_index].history).toLocaleDateString("fr-CH");

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
	if (is_random_episode) showAside("random_episode", true);
	else showAside("info", true);
	
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
	var confirm_msg = await openDialog(true, "<p>Deine lokalen und synchronisierten Nutzerdaten werden unwiederruflich gelöscht! Deine ID bleibt ohne Daten bestehen.</p>");
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
				openDialog(false, "<p>Die Datei enthält keine Nutzerdaten!</p>");
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
		catch (e) {
			openDialog(false, "<p>Die Datei ist beschädigt!</p>");
			console.error(e);
		};
	}
}

//#################################################################################################
// User Id
// show correct buttons
var new_id = document.getElementById("new_id");
var delete_id = document.getElementById("delete_id");
var check_id = document.getElementById("check_id");
var remove_id = document.getElementById("remove_id");
var chronicle = document.getElementById("chronicle");

function changeIdButton(button) {
	new_id.style.display = "none";
	delete_id.style.display = "none";
	check_id.style.display = "none";
	remove_id.style.display = "none";
	chronicle.style.display = "none";

	if (button == "new_id") {
		new_id.style.display = "inline-block";
	}
	else if (button == "delete_id") {
		delete_id.style.display = "inline-block";
		remove_id.style.display = "inline-block";
		chronicle.style.display = "inline-block";
	}
	else if (button == "check_id") {
		check_id.style.display = "inline-block";
	}
}

function importNewIdShow() {
	if (input_user_id.value.length == 18) {
		changeIdButton("check_id");
	}
	else {
		changeIdButton("new_id");
	}
}

async function importNewId() {
	var confirm_msg = await openDialog(true, "<p>Durch das Einfügen dieser ID werden deine lokalen Episoden Daten überschrieben!</p>");
	if (confirm_msg == true) {
		user_data.user_id = input_user_id.value;
		chronicle.href = "chronik.html/?id=" + user_data.user_id;
		storeUserData(false);
		document.location.reload();
	}
}

async function createId() {
	if (user_data.user_id != undefined) return;

	var remote_data = {};
	remote_data.a_name = user_data.a_name;
	remote_data.a_latest_upload = new Date();
	remote_data.list = user_data.list;

	var json_remote_data = JSON.stringify(remote_data);

	// var response = await fetch("", {
	// 	method: "POST",
	// 	body: json_remote_data,
	// });

	// if (response.status == 200) {
	// 	var response_object = await response.json();

	// 	user_data.user_id = response_object.user_id;
	// 	input_user_id.value = user_data.user_id;
	// 	chronicle.href = "chronik.html/?id=" + user_data.user_id;
	// 	storeUserData(false);

	// 	changeIdButton("delete_id");
	// 	openDialog(false, `
	// 		<h1>Geräteübergreifenden Synchronisation</h1>
	// 		<p>Die ID wurde generiert. Füge diese ID anschliessend auf den gewünschten Geräten ein.</p>
	// 		<p><span style="font-weight: bold; color: var(--red);">Wichtig</span>: Pro ID darf immer nur ein Gerät gleichzeitig mit der Webseite verbunden sein, um Datenverluste zu vermeiden. Beim Wechsel des Geräts muss die Webseite immer neu geladen werden, damit alle Änderungen korrekt übernommen werden.</p>
	// 		<p>Sollten Synchronisierungsprobleme auftreten, können unter Chronik alle Änderungen der letzten 5 Tage angezeigt und wiederhergestellt werden.</p>
	// 	`);
	// }
	// else {
		openDialog(false, "<p>ID konnte nicht erstellt werden!</p>");
		console.error(response);
	// }
}

function disconnectId() {
	input_user_id.value = "";
	user_data.user_id = undefined;
	chronicle.href = "chronik.html";
	storeUserData(false);
	changeIdButton("new_id");
}

async function deleteId() {
	var confirm_msg = await openDialog(false, "<p>Deine ID und die dazugehörigen Daten werden unwiederruflich gelöscht!</p><p>Lokale Daten beleiben aber weiterhin bestehen.</p>");
	if (confirm_msg == true) {
		var response = await fetch("", {
			method: "POST",
			body: user_data.user_id,
		});

		if (response.status == 200) disconnectId();
		else {
			openDialog(false, "<p>ID konnte nicht gelöscht werden!</p>");
			console.error(response);
		}
	}
}


//#################################################################################################
// list settings
// Cover size
function changeCoverSize(size) {
	user_data.cover_size = size;
	var screen_width = document.body.clientWidth;

	if (screen_width >= 310) var max_width = 260;
	else var max_width = screen_width - 50;

	if (screen_width < 710) aside.classList.add("cover_size_hidden");

	// define cover size (max_width - min_width) * size_percentage / 100 + min_width
	var cover_size = (max_width - 120) * size / 100 + 120;

	// calc depending on size
	if (cover_size <= 150) {
		var play_button_size = 40;
		var play_button_right = 0.054 * cover_size + 3;
		var buttons_left = play_button_right;
		var play_button_top = cover_size - 40 - play_button_right;
		var watch_list_top = 100;
		var info_button_top = play_button_top;
		main.classList.add('hide_watch_list');
	}
	else {
		var play_button_size = 60;
		var play_button_right = 0.054 * cover_size + 3;
		var buttons_left = 0.00029 * cover_size * cover_size - 0.068 * cover_size + 12;
		var play_button_top = 0.00303 * cover_size * cover_size - 0.33 * cover_size + 65;
		var watch_list_top = play_button_top + 20;
		var info_button_top = watch_list_top - (0.057 * cover_size + 43);
		main.classList.remove('hide_watch_list');
	}

	// set
	css_root.style.setProperty("--cover_size", cover_size + "px");
	css_root.style.setProperty("--play_button_size", play_button_size + "px");
	css_root.style.setProperty("--play_button_top", play_button_top + "px");
	css_root.style.setProperty("--watch_list_top", watch_list_top + "px");
	css_root.style.setProperty("--info_button_top", info_button_top + "px");
	css_root.style.setProperty("--play_button_right", play_button_right + "px");
	css_root.style.setProperty("--buttons_left", buttons_left + "px");
}

function saveCoverSize() {
	if (document.body.clientWidth < 710) aside.classList.remove('cover_size_hidden');
	storeUserData(false);
}

// change visibility of episode titles
function toggleEpisodeTitle() {
	user_data.hide_episode_title = !user_data.hide_episode_title;
	document.getElementById("settings_episode_title").checked = user_data.hide_episode_title;
	storeUserData(false);
	
	if (user_data.hide_episode_title) episoden_list.classList.add('hide_episode_title');
	else episoden_list.classList.remove('hide_episode_title');
}

// change direction of episode list
function toggleOrder() {
	user_data.backwards = !user_data.backwards;
	document.getElementById("settings_sort_list").checked = !user_data.backwards;
	storeUserData(false);
	loadEpisodes();

	if (user_data.backwards) document.getElementById("sort_list").style.transform = "scaleY(1)";
	else document.getElementById("sort_list").style.transform = "scaleY(-1)";
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
// Zufällige Folgen Settings
var settings_random_amount = document.getElementById("settings_random_amount")

function randomSelection(type) {
	user_data.random_settings[type] = !user_data.random_settings[type];
	storeUserData(false);
}

function changeRandomAmount() {
	var value = settings_random_amount.value.replace(/[^0-9.]/g, '')
	settings_random_amount.value = value;
	if (value >= 1) {
		user_data.random_amount = value;
		storeUserData(false);
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
	if (counter == 0) main.classList.add("show_not_found");
	else main.classList.remove("show_not_found");

	// load list, currently episode list is visible
	if (action == true) main.classList.add("show_" + visible_element);

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
function overflowMenu(manuall) {
	var action = search_box.parentNode.classList.contains("overflow_menu");
	var overflow_menu_button = document.getElementById("nav_overflow_menu");

	if (typeof manuall == "boolean") action = manuall;

	if (action) {
		search_box.parentNode.classList.remove("overflow_menu");
		overflow_menu_button.classList.remove("nav_active");
		css_root.style.setProperty("--overflow_menu_margin", "0px");
	}
	else {
		search_box.parentNode.classList.add("overflow_menu");
		overflow_menu_button.classList.add("nav_active");
		css_root.style.setProperty("--overflow_menu_margin", "60px");
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
				if (search_data[k].startsWith(search_input[j])) var prehide = false;
			}
			if (prehide == false && hide != true) var hide = false;
			else var hide = true;
		}

		// hide/ unhide
		if (hide == true) article[i].classList.add("hide_search");
		else article[i].classList.remove("hide_search");
	}

	// not found
	var hide_search = document.getElementsByClassName("hide_search").length;

	if (article.length - hide_search <= 0) not_found.style.display = "block";
	else not_found.style.display = "none";
}

function startSearch() {
	showEpisoden("search");

	if (active_main == "search") {
		search_box.style.display = "flex";
		if (window.screen.width <= 710 && active_aside != undefined) showAside();
		if (window.screen.width <= 506) {
			search_box.parentNode.style.justifyContent = "flex-end";
			overflowMenu(true);
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
// Error messages
var dialog = document.querySelector("dialog")

function openDialog(show_cancle, content) {
	return new Promise((resolve) => {
		dialog.showModal();

		if (show_cancle) {
			dialog.innerHTML = content +  `
				<div class="settings_box">
					<button id="dialog_ok" class='border_button settings_center'>OK</button>
					<button id="dialog_cancle" class='border_button settings_center'>Abbrechen</button>
				</div>`;
			
			document.getElementById("dialog_ok").addEventListener("click", () => {
				resolve(true);
				dialog.close();
			});
			document.getElementById("dialog_cancle").addEventListener("click", () => {
				resolve(false);
				dialog.close();
			});
		}
		else {
			dialog.innerHTML = content +  "<button id='dialog_ok' class='border_button settings_center'>OK</button>";
			document.getElementById("dialog_ok").addEventListener("click", () => {
				dialog.close();
			});
			resolve(true);
		}
	});
};

//#################################################################################################
// Calc ms
function calcDuration(min, s) {
	return (min * 60 + s) * 1000;
}

// User counter
// async function userCounter() {
// 	var local_date = new Date();
// 	var current_day = local_date.getFullYear + "." + local_date.getMonth + "." + local_date.getDay;
// 	var was_counted = window.localStorage.getItem("user_counter");
// 	var user_role = window.localStorage.getItem("user_role"); // window.localStorage.setItem("user_role", "hidden")

// 	if (was_counted != current_day && user_role != "hidden") {
// 		window.localStorage.setItem("user_counter", current_day);

// 		var country_response = await fetch();
// 		var geo_data = await country_response.json();
// 		fetch();
// 	}
// }

// also reactivate episode counter in refreshHistory() in main.js
// userCounter();