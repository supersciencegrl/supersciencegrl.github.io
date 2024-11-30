const learningAllCheckbox = document.getElementById("learningAllCheckbox");
const learningIntroCheckbox = document.getElementById("learningIntroCheckbox");
const learningAdvCheckbox = document.getElementById("learningAdvCheckbox");
const learningSpecialistCheckbox = document.getElementById("learningSpecialistCheckbox");

const learningAnalCheckbox = document.getElementById("learningAnalCheckbox");
const learningCompCheckbox = document.getElementById("learningCompCheckbox");

const topicCheckboxes = [learningAnalCheckbox, learningCompCheckbox];

const allResources = document.getElementsByClassName("div-literature");
const introResources = document.getElementsByClassName("intro");
const advResources = document.getElementsByClassName("adv");
const specialistResources = document.getElementsByClassName("specialist");

const analResources = document.getElementsByClassName("anal");
const compResources = document.getElementsByClassName("comp");

/**
 * Resets the level filter to show all resources.
 * 
 * This function unchecks the specific level checkboxes (Introductory,
 * Advanced, and Specialist) and checks the "All" checkbox. It then
 * iterates through the `allResources` array, making every resource visible
 */
function removeLevelFilter() {
	let i;
	// Uncheck the intro/advanced/specialist checkboxes
	learningIntroCheckbox.checked = false;
	learningAdvCheckbox.checked = false;
	learningSpecialistCheckbox.checked = false;
	// Uncheck the analytical/computational checkboxes
	// learningAnalCheckbox.checked = false;
	// learningCompCheckbox.checked = false;
	// Check the 'all' checkbox
	learningAllCheckbox.checked = true;
	// Make all resources visible
	for (i = 0; i < allResources.length; i++) {
		allResources[i].style.display = "block";
	}
}

function filterLearning() {
	let i;
	// Uncheck the "All" checkbox when filtering by specific levels
	learningAllCheckbox.checked = false;
	// If no checkboxes are checked, reset the filter to show all resources
	if (
		!learningAllCheckbox.checked && 
		!learningIntroCheckbox.checked && !learningAdvCheckbox.checked && !learningSpecialistCheckbox.checked
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
	}
	// Then filter by topics if needed
	filterTopics()
}

function topicFilters(topicCheckbox, topicResources) {
	const topicResourcesArray = Array.from(topicResources)
	// Uncheck all checkboxes for topics except for topicCheckbox
	let t;
	for (t = 0; t < topicCheckboxes.length; t++) {
		let thisCheckbox = topicCheckboxes[t]
		if (thisCheckbox !== topicCheckbox) {
			thisCheckbox.checked = false
		}
	}
	// Iterate over all resources and check whether they are currently visible
	let i;
	for (i = 0; i < allResources.length; i++) {
		let resource = allResources[i];
		if (resource.style.display !== "none") {
			// If resource is currently visible but does not contain the desired topic, hide it
			if (!topicResourcesArray.includes(resource)) {
				resource.style.display = "none";
			}
		}
	}
}

function filterTopics() {
	if (learningAnalCheckbox.checked) {
		topicFilters(learningAnalCheckbox, analResources)
	}
	if (learningCompCheckbox.checked) {
		topicFilters(learningCompCheckbox, compResources)
	}
}