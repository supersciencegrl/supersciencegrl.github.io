// Not sure what this is for since you don't have any item with `.sidebar`
// $(".sidebar").height(Math.max($(".content").height(),$(".sidebar").height()));

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

  // if (window.location.href.indexOf("Reference-Tools") > -1) {
  //   // setTimeout(function() {
  //     document.getElementById("tab-Reference-Tools").click();
  //   // },300);
  // } else if (window.location.href.indexOf("Writing-Tools") > -1) {
  //   // setTimeout(function() {
  //     document.getElementById("tab-Writing-Tools").click();
  //   // },300);
  // } else if (window.location.href.indexOf("Coding") > -1) {
  //   // setTimeout(function() {
  //     document.getElementById("tab-Coding").click();
  //   // },300);
  // } else if (window.location.href.indexOf("HTE") > -1) {
  //   // setTimeout(function() {
  //     document.getElementById("tab-HTE").click();
  //   // },300);
  // } else if (window.location.href.indexOf("Interesting") > -1) {
  //   // setTimeout(function() {
  //     document.getElementById("tab-Interesting").click();
  //   // },300);
  // } else {
  //   document.getElementById("defaultTab").click();
  // }
}

function toggleCollapsibleContent() {
	// // Collapsible
	// var coll = document.getElementsByClassName("collapsible");
	// var i;
	// for (i = 0; i < coll.length; i++) {
	// 	coll[i].addEventListener("click", function() {
	// 		this.classList.toggle("collapsibleActive");
	// 		var collapsibleContent = this.nextElementSibling;
	// 		if (collapsibleContent.style.display === "block") {
	// 			collapsibleContent.style.display = "none";
	// 		} else {
	// 			collapsibleContent.style.display = "block";
	// 		}
	// 	});
	// }

  // Khoi's comment: minor code change using `forEach`, not important
  const collapsibleItems = document.getElementsByClassName("collapsible");
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

// Khoi's comment: I don't think this block apply to anything on this page
// // Collapsible inlines
// var collinline = document.getElementsByClassName("collapsibleInline");
// var i;
// for (i = 0; i < collinline.length; i++) {
// 	collinline[i].addEventListener("click", function() {
// 		this.classList.toggle("collapsibleActive");
// 		var collapsibleDropdown = this.nextElementSibling;
// 		if (collapsibleDropdown.style.display === "block") {
// 			collapsibleDropdown.style.display = "none";
// 		} else {
// 			collapsibleDropdown.style.display = "block";
// 		}
// 	});
// }

  // Not gonna lie, this was copy-pasted from https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_eff_animate_smoothscroll
$(document).ready(function () {
  // Khoi's comment: I don't think this block apply to anything on this page since you don't have anchor link to any part on the page.
  // That is why I commented it out.

  // // Add smooth scrolling to all links
  // $("a").on('click', function(event) {
  //   // Make sure this.hash has a value before overriding default behavior
  //   if (this.hash !== "") {
  //     event.preventDefault();
  //     // Store hash
  //     var hash = this.hash;
  //     // Animate smooth page scroll in 250 ms
  //     $('html, body').animate({
  //       scrollTop: $(hash).offset().top
  //     }, 250, function(){
  //      // Add # to URL when done scrolling (default click behavior)
  //       window.location.hash = hash;
  //     });
  //   } // End if
  // });

  // Add 'onclick' listening event for each Tab button
  displayTabOnClick();

  // Add listening event for collapsible content
  toggleCollapsibleContent();

  // Check URL to display correct tab content
  directLinkToTab();
});