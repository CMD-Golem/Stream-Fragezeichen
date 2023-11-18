var spoilers = document.getElementsByTagName("details");

function spoiler(e, close_others) {
	if (e.target) {
		var el = e.target.parentElement;
		if (e.target.nodeName != "A") { e.preventDefault(); }
		if (e.target.nodeName != "SUMMARY") { return; }
	}
	else { var el = e; }
	

	if (!el.classList.contains("active")) { var spoiler_active = true; }
	if (close_others) {
		for (var i = 0; i < spoilers.length; i++) {
			spoilers[i].classList.remove("active");
			spoilers[i].style.maxHeight = "37px";
		}
	}

	if (spoiler_active) {
		el.classList.add("active");
		el.style.maxHeight = el.scrollHeight + "px";
	}
	else if (!close_others) {
		el.classList.remove("active");
		el.style.maxHeight = "37px";
	}
}