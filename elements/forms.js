// Textarea
var el_textarea = document.getElementsByTagName("textarea");
for (var i = 0; i < el_textarea.length; i++) {
	el_textarea[i].addEventListener("input", (e) => {
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + 12 + "px";
	});
}


// send Form
async function sendForm() {
	var email = document.getElementById("email").value;
	var subject = document.getElementById("subject").value;
	var description = document.getElementById("description").value;
	
	if (description == "" || subject == "") {
		return alert("Die Felder Betreff und Beschreibung müssen ausgefüllt werden.");
	}

	var form_body = {
		subject: `Stream-Fragezeichen Kontakt`,
		body: `
			<p>Email: ${email}</p>
			<p>Betreff: ${subject}</p>
			<p>${description}</p>`
	};

	var response = await fetch("https://api.tabq.ch/forms-fg/mail", {
		method: "POST",
		body: JSON.stringify(form_body),
	});

	if (response.ok) {
		document.getElementById("form").style.display = "none";
		document.getElementById("success").style.display = "block";
	}
	else {
		var error = await response.text();
		console.error(error);
		alert("Es ist ein Fehler aufgetreten: " + error);
	}
}