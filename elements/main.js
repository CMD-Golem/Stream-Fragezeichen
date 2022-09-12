function main() {
	for (var i = 0; i < episoden.length; i++) {
		var number = episoden[i].number.toString();
		if (number.length == 2) {
			number = "0" + number;
		}
		episoden[i].number = number;

		var name = episoden[i].name;
		name = name.slice(4);

		if (name.includes("Und")) {
			name = name.replace("Und", "und");
		}

		episoden[i].name = name;
	}
}


var episoden_list = document.getElementsByTagName("ol")[0];
var provider = "youtube";
var backwards = true;

function loadEpisodes() {
	var html = [];

	if (provider == "deezer") { var link = 0; } 
	else if (provider == "spotify") { var link = 2; }
	else if (provider == "apple") { var link = 3; }
	else { var link = 1; } // Youtube

	for (var i = 0; i < episoden.length; i++) {
		var episode = episoden[i];
		var number = parseInt(episode.number);
		html.push(`
		<a href="${episode.href[link]}" target="_blank" id="${number}" data-filter="die drei fragezeichen ??? ${episode.number} ${episode.name}">
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
	episoden_list.innerHTML = html.join("");
}

loadEpisodes();


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
		if (watch_list_count == 0) {
			// no_watch_list.
		}
	}
}

var show_watch_list = false;

function showWatchList() {
	if (show_watch_list) {
		document.querySelector(":root").style.setProperty("--watch_list", "block");
		show_watch_list = false;
	}
	else {
		document.querySelector(":root").style.setProperty("--watch_list", "none");
		show_watch_list = true;
	}
}

//#################################################################################################
// Provider
var last_provider_selected = document.getElementsByClassName("provider_selected")[0];

function selectProvider(el_button) {
	var button_selected = el_button.classList.contains("provider_selected");
	last_provider_selected.classList.remove("provider_selected");

	if (!button_selected) {
		el_button.classList.add("provider_selected");
	}

	last_provider_selected = el_button;
	provider = el_button.id;
	load_episodes();
}


//#################################################################################################
// Search
var article = document.getElementsByTagName("ol")[0].children;
var input = document.getElementById("site_search");
var not_found = document.getElementById("not_found");

function siteSearch() {
	var filter = input.value.toUpperCase();
	setTimeout(function(){ input.focus(); }, 100);

	for (var i = 0; i < article.length; i++) {
		var filterwords = article[i].dataset.filter;
		if (filterwords.toUpperCase().indexOf(filter) > -1) {
			article[i].classList.remove("hide_search");
		} else {
			article[i].classList.add("hide_search");
		}
	}
	var hide_search = document.getElementsByClassName("hide_search").length;

	if (article.length - hide_search <= 0) {
		not_found.style.display = "block";
	}
	else {
		not_found.style.display = "none";
	};
};