var spoilers = document.getElementsByTagName("details");
for (var i = 0; i < spoilers.length; i++) { spoilers[i].style.maxHeight = spoilers[i].firstElementChild.scrollHeight + "px"; }

// var hash = window.location.hash;
// var hash_el = document.getElementById(hash.slice(1));

// if (hash_el != null) {
// 	hash_el.classList.add("active");
// 	hash_el.style.maxHeight = hash_el.scrollHeight + "px";
// }


function spoiler(el, close_others, e) {
	if (e.target.nodeName != "A") {
		e.preventDefault();
	}
	if (e.target.nodeName != "SUMMARY") {
		return;
	}

	if (!el.classList.contains("active")) {
		var spoiler_active = true;
	}

	if (close_others) {
		for (var i = 0; i < spoilers.length; i++) {
			spoilers[i].classList.remove("active");
			spoilers[i].style.maxHeight = spoilers[i].firstElementChild.scrollHeight + "px";
		}
	}

	if (spoiler_active) {
		el.classList.add("active");
		el.style.maxHeight = el.scrollHeight + "px";
	}
	else if (!close_others) {
		el.classList.remove("active");
		el.style.maxHeight = el.firstElementChild.scrollHeight + "px";
	}
}