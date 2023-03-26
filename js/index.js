function smoothScroll() {
	const anchors = document.querySelectorAll('.linkjump')
	anchors.forEach(function (linkjumpClick) {
		linkjumpClick.addEventListener('click', function (e) {
			var hash = this.hash;
			if (hash !== "") {
				event.preventDefault();
				$('html, body').animate({
					scrollTop: $(hash).offset().top
				}, 250, function() {
					window.location.hash = hash;
				});
			}
		})
	})
}

function eatHamburger() {
	var hamburger = document.getElementById("hamburger");
	hamburger.addEventListener('click', function() {
		var ham = document.getElementById("top-bar");
		ham.classList.toggle("menuActive");
	})
}

function addCopyCodeButtons() {
	let blocks = document.querySelectorAll("pre");
	blocks.forEach((block) => {
		// Only add button if browser supports Clipboard API
		if (navigator.clipboard) {
			let button = document.createElement("button");
			button.innerHTML = "<i class="fa-regular fa-copy" aria-label="Copy code"></i>";
			block.appendChild(button);
			button.addEventListener("click", async () => {
				await copyCode(block);
			});
		}
	});
}
	
$(document).ready(function(){
	// Add 'onclick' listening event for each linkjump button
	smoothScroll();
	// Add 'onclick' listening event for mobile hamburger menu
	eatHamburger();
	// Add 'copy code' buttons to all pre elements with code children
	addCopyCodeButtons();
});