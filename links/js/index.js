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
  evt.currentTarget.className += " currentTab";
}

if (window.location.href.indexOf("Reference-Tools") > -1) {
	setTimeout(function() {
		document.getElementById("tab-Reference-Tools").click();
	},300);
} else if (window.location.href.indexOf("Writing-and-Presentation-Tools") > -1) {
	setTimeout(function() {
		document.getElementById("tab-Writing-and-Presentation-Tools").click();
	},300);
} else if (window.location.href.indexOf("Coding") > -1) {
	setTimeout(function() {
		document.getElementById("tab-Coding").click();
	},300);
} else if (window.location.href.indexOf("HTE") > -1) {
	setTimeout(function() {
		document.getElementById("tab-HTE").click();
	},300);
} else if (window.location.href.indexOf("Interesting") > -1) {
	setTimeout(function() {
		document.getElementById("tab-Interesting").click();
	},300);
} else {
	document.getElementById("defaultTab").click();
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

// Collapsible
var coll = document.getElementsByClassName("collapsible");
var i;
for (i = 0; i < coll.length; i++) {
	coll[i].addEventListener("click", function() {
		this.classList.toggle("collapsibleActive");
		var collapsibleContent = this.nextElementSibling;
		if (collapsibleContent.style.display === "block") {
			collapsibleContent.style.display = "none";
		} else {
			collapsibleContent.style.display = "block";
		}
	});
}