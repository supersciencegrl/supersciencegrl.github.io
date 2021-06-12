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
		document.getElementById(hash).classList.add("currentTab");
	} else {
		const firstTab = document.querySelector('.tabButton')
		firstTab.click();
	}
}

$(document).ready(function(){
	// Add 'onclick' listening event for each Tab button
	displayTabOnClick();

	// Check URL to display correct tab content
	directLinkToTab();
});