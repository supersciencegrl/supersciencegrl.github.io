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

//function eatHamburger() {
//	var ham = document.getElementById("top-bar");
//	ham.classList.toggle("menuActive");
//}
	
$(document).ready(function(){
	// Add 'onclick' listening event for each linkjump button
	smoothScroll();
	// Add 'onclick' listening event for mobile hamburger menu
	eatHamburger();
});