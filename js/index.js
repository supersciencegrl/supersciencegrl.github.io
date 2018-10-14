$(".sidebar").height(Math.max($(".content").height(),$(".sidebar").height()));

var mobile = window.matchMedia("(max-width: 300px)")
mediaQuery(mobile)
mobile.addListener(mediaQuery)

  // Not gonna lie, this was copy-pasted from https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_eff_animate_smoothscroll
function mediaQuery(mobile) {
  if (mobile.matches) {

$(document).ready(function(){
  // Add smooth scrolling to elements with class linkjump
  $(".linkjump").on('click', function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      event.preventDefault();
      // Store hash
      var hash = this.hash;
      // Animate smooth page scroll in 250 ms
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 250, function(){
       // Add # to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});
  } 
  else {

  }
}