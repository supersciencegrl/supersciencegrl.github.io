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
			
$(document).ready(function(){
	// Add 'onclick' listening event for each linkjump button
	smoothScroll();
});