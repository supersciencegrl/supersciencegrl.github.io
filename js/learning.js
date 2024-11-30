const learningAllCheckbox = document.getElementById("learningAllCheckbox");
const learningIntroCheckbox = document.getElementById("learningIntroCheckbox");
const learningAdvCheckbox = document.getElementById("learningAdvCheckbox");
const learningSpecialistCheckbox = document.getElementById("learningSpecialistCheckbox");

const levelCheckboxes = [learningIntroCheckbox, learningAdvCheckbox, learningSpecialistCheckbox];

const learningAnalCheckbox = document.getElementById("learningAnalCheckbox");
const learningCompCheckbox = document.getElementById("learningCompCheckbox");

const topicCheckboxes = [learningAnalCheckbox, learningCompCheckbox];

const allResources = document.getElementsByClassName("div-literature");
const introResources = document.getElementsByClassName("intro");
const advResources = document.getElementsByClassName("adv");
const specialistResources = document.getElementsByClassName("specialist");

// Must be same length and order as levelCheckboxes
const levelResources = [introResources, advResources, specialistResources]

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
	// Check the 'all' checkbox
	learningAllCheckbox.checked = true;
	// Make all resources visible
	for (i = 0; i < allResources.length; i++) {
		allResources[i].style.display = "block";
	};
	// Now filter by topic if needed
	filterTopics();
}

/**
 * Filters resources based on the state of a specific level checkbox.
 * 
 * This function checks if a given level checkbox is checked, and if so,
 * it sets the display style of all associated resources to "block", making them visible.
 * It is used to manage the visibility of resources corresponding to a specific learning level.
 * 
 * @param {HTMLElement} thisLevelCheckbox - The checkbox element representing the specific learning 
 *     level.
 * @param {HTMLCollection | NodeList} thisLevelResources - A collection of DOM elements 
 *     corresponding to resources for the specific level.
 */
function filterLevel(thisLevelCheckbox, thisLevelResources) {
	let i;
	if (thisLevelCheckbox.checked) {
		for (i = 0; i < thisLevelResources.length; i++) {
			thisLevelResources[i].style.display = "block";
		}
	}
}

/**
 * Filters learning resources based on the state of level and topic checkboxes.
 * 
 * This function first unchecks the "All" level checkbox to ensure specific levels are filtered.
 * It checks if no level-specific checkboxes are checked and calls `removeLevelFilter` to show all 
 * resources. If any level checkboxes are active, it hides all resources initially, then iterates 
 * over the level checkboxes, using `filterLevel` to display resources for checked levels. Finally, 
 * it applies additional topic-based filtering by calling `filterTopics`.
 */
function filterLearning(topicCheckbox=undefined) {
	let i;
	// Uncheck the "All" checkbox when filtering by specific levels
	learningAllCheckbox.checked = false;
	// If no checkboxes are checked, reset the filter to show all resources
	if (
		!learningAllCheckbox.checked && 
		!learningIntroCheckbox.checked && 
		!learningAdvCheckbox.checked && 
		!learningSpecialistCheckbox.checked
	) {
		removeLevelFilter()
	}
	else {
		// Initially, hide all resources
		for (i = 0; i < allResources.length; i++) {
			allResources[i].style.display = "none";
		}
		// Iterate over all levelCheckboxes and re-show levelResources accordingly
		let b;
		for (b = 0; b < levelCheckboxes.length; b++) {
			filterLevel(levelCheckboxes[b], levelResources[b])
		}
	};
	if (topicCheckbox) {
		// Uncheck all checkboxes for topics except for topicCheckbox
		let t;
		for (t = 0; t < topicCheckboxes.length; t++) {
			let thisCheckbox = topicCheckboxes[t]
			if (thisCheckbox !== topicCheckbox) {
				thisCheckbox.checked = false
			}
		}
		// Now filter by topic
		filterTopics();
	}
}

/**
 * Filters resources based on a selected topic checkbox, hiding unrelated resources.
 * 
 * This function takes a specific topic checkbox and its associated resources.
 * It unchecks all other topic checkboxes, ensuring only the selected topic is active.
 * Then, it iterates over all resources, hiding those that do not belong to the selected topic
 * and are currently visible.
 * 
 * @param {HTMLElement} topicCheckbox - The checkbox element representing the selected topic. 
 * @param {HTMLCollection} topicResources - A collection of resources related to the selected topic.
 */
function filterSpecificTopic(topicCheckbox, topicResources) {
	const topicResourcesArray = Array.from(topicResources)
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

/**
 * Filters resources based on the selected topic checkbox.
 * 
 * This function checks which topic checkbox is selected and calls the 
 * `filterSpecificTopic` function with the corresponding resources. If 
 * `learningAnalCheckbox` is checked, it filters using `analResources`. 
 * If `learningCompCheckbox` is checked, it filters using `compResources`.
 * If no topic checkbox is checked, the function does nothing. 
 */
function filterTopics() {
	if (learningAnalCheckbox.checked) {
		filterSpecificTopic(learningAnalCheckbox, analResources)
	}
	else if (learningCompCheckbox.checked) {
		filterSpecificTopic(learningCompCheckbox, compResources)
	}
}