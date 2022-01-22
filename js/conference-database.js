function pricelist() {
  var standard = document.getElementById("standard-price");
  var student = document.getElementById("student-price");
  var academic = document.getElementById("academic-price");
  var standardOutput = document.getElementsByClassName("standard");
  var studentOutput = document.getElementsByClassName("student");
  var academicOutput = document.getElementsByClassName("academic");
  var i;
  if (standard.checked) {
    for (i = 0; i < standardOutput.length; i++) {
    standardOutput[i].style.display = "table-cell";
  }
  	for (i = 0; i < studentOutput.length; i++) {
    studentOutput[i].style.display = "none";
  }
  	for (i = 0; i < academicOutput.length; i++) {
    academicOutput[i].style.display = "none";
  }}
  else if (student.checked) {
    for (i = 0; i < standardOutput.length; i++) {
    standardOutput[i].style.display = "none";
  }
  	for (i = 0; i < studentOutput.length; i++) {
    studentOutput[i].style.display = "table-cell";
  }
  	for (i = 0; i < academicOutput.length; i++) {
    academicOutput[i].style.display = "none";
  }}
  else if (academic.checked) {
    for (i = 0; i < standardOutput.length; i++) {
    standardOutput[i].style.display = "none";
  }
  	for (i = 0; i < studentOutput.length; i++) {
    studentOutput[i].style.display = "none";
  }
  	for (i = 0; i < academicOutput.length; i++) {
    academicOutput[i].style.display = "table-cell";
  }}
  else {
    for (i = 0; i < standardOutput.length; i++) {
    standardOutput[i].style.display = "table-cell";
  }
  	for (i = 0; i < studentOutput.length; i++) {
    studentOutput[i].style.display = "none";
  }
  	for (i = 0; i < academicOutput.length; i++) {
    academicOutput[i].style.display = "none";
  }}
}

function removecancelled() {
  var box = document.getElementById("cancelled-checkbox");
  var cancelledOutput = document.getElementsByClassName("cancelled");
  var postponedOutput = document.getElementsByClassName("postponed");
  var i;
  if (box.checked) {
	for (i = 0; i < cancelledOutput.length; i++) {
	cancelledOutput[i].style.display = "none";
	}
	for (i = 0; i < postponedOutput.length; i++) {
	postponedOutput[i].style.display = "none";
  }}
  else {
	for (i = 0; i < cancelledOutput.length; i++) {
	cancelledOutput[i].style.display = "table-row";
	}
	for (i = 0; i < postponedOutput.length; i++) {
	postponedOutput[i].style.display = "table-row";
  }}
}

function directLinkToSubset() {
	if (window.location.hash) {
		const hash = window.location.href.split("#")[1];
		const contentClass = "c".concat(hash)
		// Hide all rows by default
		allContent = document.getElementsByClassName("body");
		for (i = 0; i < allContent.length; i++) {
			allContent[i].style.display = "none";
		}
		// Show all "call" class
		call = document.getElementsByClassName("call");
		for (i = 0; i < call.length; i++) {
			call[i].style.display = "table-row";
		}
		// Show all relevant rows
		subset = document.getElementsByClassName(contentClass);
		for (i = 0; i < subset.length; i++) {
			subset[i].style.display = "table-row";
		}
		// Hard code rows with particular parent classes
		parentsOfMedChem = ["cchembio", "csynthesis"]
		if (parentsOfMedChem.includes(contentClass)) {
			others = document.getElementsByClassName("cmedchem");
			for (i = 0; i < others.length; i++) {
				others[i].style.display = "table-row";
			}
		}
		if (contentClass === "csynthesis") {
			others = document.getElementsByClassName("cprocess");
			for (i = 0; i < others.length; i++) {
				others[i].style.display = "table-row";
			}
		}
	}
}

function replaceUrlHash(tabName) {
	let newUrl = `${window.location.href.split("#")[0]}#${tabName}`;
	history.replaceState(null, null, newUrl);
}

function filterButton(tabName) {
	replaceUrlHash(tabName);
	directLinkToSubset();
}

var btnContainer = document.getElementById("btnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
	btns[i].addEventListener("click", function(){
		var current = document.getElementsByClassName("activeFilter");
		current[0].className = current[0].className.replace(" activeFilter", "");
		this.className += " activeFilter";
	});
}

$(document).ready(function(){
	// Check URL to display automation events only as necessary
	directLinkToSubset();
});