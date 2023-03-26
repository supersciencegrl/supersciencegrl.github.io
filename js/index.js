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

const copyButton = "<i class=\"fa-regular fa-copy\" aria-label=\"Copy code\"></i>";
function addCopyCodeButtons() {
	let blocks = document.querySelectorAll("pre");
	
	blocks.forEach((block) => {
		// Only add button if browser supports Clipboard API
		if (navigator.clipboard) {
			let button = document.createElement("button");
			button.innerHTML = copyButton;
			block.appendChild(button);
			button.addEventListener("click", async () => {
				await copyCode(block, button);
			});
		}
	});
}

async function copyCode(block, button) {
	const codeCopied = "<i class=\"fa-solid fa-check\" aria-hidden=\"true\"></i>";
	let code = block.querySelector("code");
	let text = code.innerText;
	
	await navigator.clipboard.writeText(text);
	// Visual feedback that the task is completed
	button.innerHTML = codeCopied;
	
	setTimeout(() => {
		button.innerHTML = copyButton;
	}, 800);
}

$(document).ready(function(){
	// Add 'onclick' listening event for each linkjump button
	smoothScroll();
	// Add 'onclick' listening event for mobile hamburger menu
	eatHamburger();
	// Add 'copy code' buttons to all pre elements with code children
	addCopyCodeButtons();
});