function toggleCollapsibleContent() {
	// Khoi's comment: minor code change using `forEach`, not important
	// See ./js/tabs.js for behaviour regarding main tabs
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
	// Add listening event for collapsible content
	toggleCollapsibleContent();
});