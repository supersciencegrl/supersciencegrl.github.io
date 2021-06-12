$(".sidebar").height(Math.max($(".content").height(),$(".sidebar").height()));

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
  
  evt.currentTarget.className =+ " currentTab";
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

  // Not gonna lie, this was copy-pasted from https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_eff_animate_smoothscroll
$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {
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

$(document).ready(function(){
	// Add 'onclick' listening event for each Tab button
	displayTabOnClick();

	// Add listening event for collapsible content
	toggleCollapsibleContent();

	// Check URL to display correct tab content
	directLinkToTab();
});