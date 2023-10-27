// Textarea
var el_textarea = document.getElementsByTagName("textarea");
for (var i = 0; i < el_textarea.length; i++) {
	el_textarea[i].addEventListener("input", textarea);
}

function textarea(edited_textarea) {
	edited_textarea.target.style.height = "auto";
	edited_textarea.target.style.height = edited_textarea.target.scrollHeight + 12 + "px";
}


// validate Form
var el_form = document.getElementsByTagName("form")[0];
var el_success = document.getElementsByTagName("section")[0];
var description = document.getElementById("description");
var subject = document.getElementById("subject");

async function validateForm() {
	event.preventDefault();
	
	if (document.getElementById("description").value == "" || document.getElementById("subject").value == "") {
		alert("Die Felder Betreff und Beschreibung müssen ausgefüllt werden.");
	}
	else {
		await fetch("/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams(new FormData(event.target)).toString(),
		})

		el_form.style.display = "none";
		el_success.style.display = "block";
		return true;
	}
}


// Prevent sending when pressing enter in input elements
var el_input = document.getElementsByTagName("input");
for (var i = 0; i < el_input.length; i++) {
	el_input[i].addEventListener("keydown", e => {
		if ((e.which == 13 || e.keyCode == 13) ) {
			e.preventDefault();
		}
	});
}