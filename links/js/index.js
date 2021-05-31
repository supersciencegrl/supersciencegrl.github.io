function displayTabOnClick() {
	const tabs = document.querySelectorAll('.tabButton')
	tabs.forEach(function (tabButton) {
		tabButton.addEventListener('click', function (e) {
			let tabContentId = tabButton.id.split(/\-(.+)/)[1]
			openTab(e, tabContentId);
		})
	})
}

function replaceUrlHash(tabName) {
	let newUrl = `${window.location.href.split("#")[0]}#${tabName}`;
	history.replaceState(null, null, newUrl);
}


function openTab(evt, tabName) {
	var i, tabContent, tabButton;
	tabContent = document.getElementsByClassName("tabContent");
	for (i = 0; i < tabContent.length; i++) {
		tabContent[i].style.display = "none";
	}
	tabButton = document.getElementsByClassName("tabButton");
	for (i = 0; i < tabButton.length; i++) {
		tabButton[i].className = tabButton[i].className.replace(" currentTab", "");
	}
	document.getElementById(tabName).style.display = "block";

	// Set new URL
	replaceUrlHash(tabName);

	evt.currentTarget.className += " currentTab";
}

function directLinkToTab() {
	if (window.location.hash) {
		const hash = window.location.href.split("#")[1];
		openTab(this, hash);
	} else {
		const firstTab = document.querySelector('.tabButton')
		firstTab.click();
	}
}

function toggleCollapsibleContent() {
	// Khoi's comment: minor code change using `forEach`, not important
	const collapsibleItems = document.querySelectorAll(".collapsible,.collapsibleInline");
	Array.from(collapsibleItems).forEach(function (element) {
		element.addEventListener("click", function () {
			this.classList.toggle("collapsibleActive");
			var collapsibleContent = this.nextElementSibling;
			if (collapsibleContent.style.display === "block") {
				collapsibleContent.style.display = "none";
			} else {
				collapsibleContent.style.display = "block";
			}
		});
	})
}

$(document).ready(function(){
	// Add 'onclick' listening event for each Tab button
	displayTabOnClick();

	// Add listening event for collapsible content
	toggleCollapsibleContent();

	// Check URL to display correct tab content
	directLinkToTab();
});