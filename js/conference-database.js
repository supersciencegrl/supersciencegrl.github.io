const cancelledCheckbox = document.getElementById("cancelled-checkbox");
const filterHam = document.getElementById("filter-menu");
const btnContainer = document.getElementById("btnContainer");
const btns = btnContainer.getElementsByClassName("btn");

// I know this is verbose af. I'm not gonna change it
function priceList() {
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
		}
	}
	else if (student.checked) {
		for (i = 0; i < standardOutput.length; i++) {
			standardOutput[i].style.display = "none";
		}
		for (i = 0; i < studentOutput.length; i++) {
			studentOutput[i].style.display = "table-cell";
		}
		for (i = 0; i < academicOutput.length; i++) {
			academicOutput[i].style.display = "none";
		}
	}
	else if (academic.checked) {
		for (i = 0; i < standardOutput.length; i++) {
			standardOutput[i].style.display = "none";
		}
		for (i = 0; i < studentOutput.length; i++) {
			studentOutput[i].style.display = "none";
		}
		for (i = 0; i < academicOutput.length; i++) {
			academicOutput[i].style.display = "table-cell";
		}
	}
	else {
		for (i = 0; i < standardOutput.length; i++) {
			standardOutput[i].style.display = "table-cell";
		}
		for (i = 0; i < studentOutput.length; i++) {
			studentOutput[i].style.display = "none";
		}
		for (i = 0; i < academicOutput.length; i++) {
			academicOutput[i].style.display = "none";
		}
	}
}

function toggleCancelledEventVisibility() {
	/**
	* Removes cancelled and postponed events from a table based on user input
	*/
	const cancelledOutput = document.getElementsByClassName("cancelled");
	const postponedOutput = document.getElementsByClassName("postponed");
	let i;
	// If no filter is applied, show/hide events based on checkbox state
	if (!(window.location.hash)) {
		cancelledCheckbox.disabled = false;
		if (cancelledCheckbox.checked) {
			for (i = 0; i < cancelledOutput.length; i++) {
				cancelledOutput[i].style.display = "none";
			}
			for (i = 0; i < postponedOutput.length; i++) {
				postponedOutput[i].style.display = "none";
			}
		}
		else {
			for (i = 0; i < cancelledOutput.length; i++) {
				cancelledOutput[i].style.display = "table-row";
			}
			for (i = 0; i < postponedOutput.length; i++) {
				postponedOutput[i].style.display = "table-row";
			}
		}
	}
	// Always hide cancelled/postponed events when filters are applied
	else {
		for (i = 0; i < cancelledOutput.length; i++) {
			cancelledOutput[i].style.display = "none";
		}
		for (i = 0; i < postponedOutput.length; i++) {
			postponedOutput[i].style.display = "none";
		}
	}
}

function directLinkToSubset() {
	/**
	* Filters table rows based on the hash fragment in the URL to display the relevant rows
	*/
	if (window.location.hash) {
		// Check and disable filter checkbox
		cancelledCheckbox.disabled = true;
		cancelledCheckbox.checked = true;
		// Determine relevant class and show filter label
		const hash = window.location.href.split("#")[1];
		const contentClass = `c${hash}`;
		const allContent = document.querySelectorAll(".body");
		const filterLabel = document.getElementById("filterLabel");
		let callContent, subsetContent, othersContent, synonymsContent;
		// Show filter label
		filterLabel.innerHTML = `Filter: ${hash}`;
		// Hide all rows at first
		Array.from(allContent).forEach((content) => {
			content.style.display = "none";
		});
		// Show all "call" class
		callContent = document.getElementsByClassName("call");
		Array.from(callContent).forEach((content) => {
			content.style.display = "table-row";
		});
		// Show all relevant rows
		subsetContent = document.getElementsByClassName(contentClass);
		Array.from(subsetContent).forEach((content) => {
			content.style.display = "table-row";
		});
		// Hard code rows with particular parent classes
		// Med chem is included under both chembio and synthesis
		const parentsOfMedChem = ["cchembio", "csynthesis"];
		if (parentsOfMedChem.includes(contentClass)) {
			othersContent = document.getElementsByClassName("cmedchem");
			Array.from(othersContent).forEach((content) => {
				content.style.display = "table-row";
			});
		}
		// Process is included under synthesis
		if (contentClass === "csynthesis") {
			othersContent = document.getElementsByClassName("cprocess");
			Array.from(othersContent).forEach((content) => {
				content.style.display = "table-row";
			});
		}
		// Hardcode class name synonyms
		switch (contentClass) {
			case "cagrochemistry":
				synonymsContent = document.getElementsByClassName("cagro");
				break;
			case "canalytical":
				synonymsContent = document.getElementsByClassName("canal");
				break;
			case "ceducation":
				synonymsContent = document.getElementsByClassName("cedu");
				break;
			case "cenvironment":
				synonymsContent = document.getElementsByClassName("cenv");
				break;
			case "cformulation":
				synonymsContent = document.getElementsByClassName("cform");
				break;
			case "cinorganic":
				synonymsContent = document.getElementsByClassName("cinorg");
				break;
			case "cphysical":
				synonymsContent = document.getElementsByClassName("cphys");
				break;
			default:
				synonymsContent = [];
		}
		Array.from(synonymsContent).forEach((content) => {
			content.style.display = "table-row";
		});
	}
}

function removeActiveFilter() {
	/**
	* Removes the "activeFilter" class from the first element with that class.
	*/
	const activeFilter = document.getElementsByClassName("activeFilter");
	if (activeFilter.length) {
		activeFilter[0].classList.remove("activeFilter");
	}
}

function removeFilter() {
	/**
	* Removes the filter from the table rows
	*/
	const allContent = document.getElementsByClassName("body");
	Array.from(allContent).forEach(content => {
		content.style.display = "table-row";
	});
	history.pushState("", document.title, `${window.location.pathname}${window.location.search}`);
	const filterLabel = document.getElementById("filterLabel");
	filterLabel.innerHTML = "";
	cancelledCheckbox.disabled = false;
}
function removeFilterMobile() {
	/**
	* Removes the filter from the table rows
	*/
	removeFilter();
	const filterLabel = document.getElementById("filterLabel");
	filterLabel.innerHTML = "Filter: all";
	filterHam.classList.remove("menuSlide");
}

function applyFilter(tabName) {
	/**
	* Sets the URL hash to a specific tab name and filters table rows based on the hash fragment in the URL to display the relevant rows.
	* @param {string} tabName - The name of the tab to set the URL hash to.
	*/
	replaceUrlHash(tabName);
	directLinkToSubset();
}
function applyFilterMobile(tabName) {
	/**
	* Sets the URL hash to a specific tab name and filters table rows based on the hash fragment in the URL to display the relevant rows. Closes the filter menu.
	* @param {string} tabName - The name of the tab to set the URL hash to.
	*/
	applyFilter(tabName);
	// Close the filter menu
	filterHam.classList.remove("menuSlide");
}

function replaceUrlHash(tabName) {
	/**
	* Replaces the hash in the URL with the specified tab name.
	* @param {string} tabName - The name of the tab to display in the URL hash.
	*/
	const baseUrl = window.location.href.split("#")[0];
	const newUrl = `${baseUrl}#${tabName}`;
	history.replaceState(null, null, newUrl);
}

function eatFilterHamburger() {
	/**
	* Attaches a click event listener to the filter hamburger menu to toggle its visibility
	*/
	const filterHamburger = document.getElementById("filter-menu-hamburger");
	filterHamburger.addEventListener('click', function() {
		filterHam.classList.toggle("menuSlide");
	});
}

/**
 * Add event listeners to filter buttons and toggle their active state
 */
function addFilterButtonListeners() {
	// Add event listener to each filter button
	const btnsArray = Array.from(btns);
	btnsArray.forEach((button) => {
		button.addEventListener("click", () => {
			removeActiveFilter();
			button.classList.add("activeFilter");
		});
	});
}

function isMobileDevice() {
	/**
	* Check if the user is using a mobile device, based on screen width and height (in case landscape mode). 
	* @returns {boolean} Whether or not the user is on a mobile device.
	*/
	if (window.matchMedia("(max-width: 480px)").matches) {
		return true;
	} else {
		return false;
	}
}

// Call the removeActiveFilter function if the page has a hash on load
if (window.location.hash) {
	removeActiveFilter();
}

$(document).ready(function(){
	// Add event listeners to the filter buttons and toggle their active state
	addFilterButtonListeners();
	// Check URL to display automation events only as necessary
	directLinkToSubset();
	if (isMobileDevice()) {
		// Add 'onclick' listening event for filters on mobile devices
		eatFilterHamburger();
		// Display "Filter: all" if no hash exists in the url on mobile devices
		if (!(window.location.hash)) {
			document.getElementById("filterLabel").innerHTML = "Filter: all";
		}
	}
});