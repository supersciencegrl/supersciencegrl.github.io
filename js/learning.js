var learningAllCheckbox = document.getElementById("learningAllCheckbox");
var learningIntroCheckbox = document.getElementById("learningIntroCheckbox");
var learningAdvCheckbox = document.getElementById("learningAdvCheckbox");
var learningSpecialistCheckbox = document.getElementById("learningSpecialistCheckbox");

var learningAnalCheckbox = document.getElementById("learningAnalCheckbox");
var learningCompCheckbox = document.getElementById("learningCompCheckbox");

var topicCheckboxes = [learningAnalCheckbox, learningCompCheckbox];

var allResources = document.getElementsByClassName("div-literature");
var introResources = document.getElementsByClassName("intro");
var advResources = document.getElementsByClassName("adv");
var specialistResources = document.getElementsByClassName("specialist");

var analResources = document.getElementsByClassName("anal");
var compResources = document.getElementsByClassName("comp");

/**
 * Resets the level filter to show all resources.
 * 
 * This function unchecks the specific level checkboxes (Introductory,
 * Advanced, and Specialist) and checks the "All" checkbox. It then
 * iterates through the `allResources` array, making every resource visible
 */
function removeLevelFilter() {
	var i;
	// Uncheck the intro/advanced/specialist checkboxes
	learningIntroCheckbox.checked = false;
	learningAdvCheckbox.checked = false;
	learningSpecialistCheckbox.checked = false;
	// Uncheck the analytical/computational checkboxes
	learningAnalCheckbox.checked = false;
	learningCompCheckbox.checked = false;
	// Check the 'all' checkbox
	learningAllCheckbox.checked = true;
	// Make all resources visible
	for (i = 0; i < allResources.length; i++) {
		allResources[i].style.display = "block";
	}
}

function topicFilters(topicCheckbox, topicResources) {
	// Uncheck all checkboxes for topics except for topicCheckbox
	var t;
	for (t = 0; t < topicCheckboxes.length; t++) {
		thisCheckbox = topicCheckboxes[t]
		if (thisCheckbox !== topicCheckbox) {
			thisCheckbox.checked = false
		}
	}
	// Iterate over all resources and check whether they are currently visible
	var i;
	for (i = 0; i < allResources.length; i++) {
		var resource = allResources[i];
		if (resource.style.display === "block") {
			// If resource is currently visible but does not contain the desired topic, hide it
			if (!topicResources.includes(resource) {
				resource.style.display = "none";
			}
		}
	}
}

function filterLearning() {
	var i;
	// Uncheck the "All" checkbox when filtering by specific levels
	learningAllCheckbox.checked = false;
	// If no checkboxes are checked, reset the filter to show all resources
	if (
		!learningAllCheckbox.checked && 
		!learningIntroCheckbox.checked && !learningAdvCheckbox.checked && !learningSpecialistCheckbox.checked &&
		!learningAnalCheckbox.checked && !learningCompCheckbox.checked
	) {
		removeLevelFilter()
	}
	else {
		// Show or hide intro resources based on checkbox state
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
		// Show or hide advanced resources based on checkbox state
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
		// Show or hide specialist resources based on checkbox state
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
		if (learningAnalCheckbox.checked) {
			topicFilters(learningAnalCheckbox, analResources)
		}
		if (learningCompCheckbox.checked) {
			topicFilters(learningCompCheckbox, compResources)
		}
	}
}