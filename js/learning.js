var learningAllCheckbox = document.getElementById("learningAllCheckbox");
var learningIntroCheckbox = document.getElementById("learningIntroCheckbox");
var learningAdvCheckbox = document.getElementById("learningAdvCheckbox");
var learningSpecialistCheckbox = document.getElementById("learningSpecialistCheckbox");

var allResources = document.getElementsByClassName("div-literature");
var introResources = document.getElementsByClassName("intro");
var advResources = document.getElementsByClassName("adv");
var specialistResources = document.getElementsByClassName("specialist");

function removeLevelFilter() {
	var i;
	learningIntroCheckbox.checked = false;
	learningAdvCheckbox.checked = false;
	learningSpecialistCheckbox.checked = false;
	learningAllCheckbox.checked = true;
	for (i = 0; i < allResources.length; i++) {
		allResources[i].style.display = "block";
	}
}

function filterLearning() {
	var i;
	learningAllCheckbox.checked = false;
	if (!learningAllCheckbox.checked && !learningIntroCheckbox.checked && !learningAdvCheckbox.checked && !learningSpecialistCheckbox.checked) {
		removeLevelFilter()
	}
	else {
		if (learningIntroCheckbox.checked) {
			for (i = 0; i < introResources.length; i++) {
				introResources[i].style.display = "block";
			}
		}
		else {
			for (i = 0; i < introResources.length; i++) {
				introResources[i].style.display = "none";
			}
		}
		if (learningAdvCheckbox.checked) {
			for (i = 0; i < advResources.length; i++) {
				advResources[i].style.display = "block";
			}
		}
		else {
			for (i = 0; i < advResources.length; i++) {
				advResources[i].style.display = "none";
			}
		}
		if (learningSpecialistCheckbox.checked) {
			for (i = 0; i < specialistResources.length; i++) {
				specialistResources[i].style.display = "block";
			}
		}
		else {
			for (i = 0; i < specialistResources.length; i++) {
				specialistResources[i].style.display = "none";
			}
		}
	}
}