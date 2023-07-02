const copyButton = "<i class=\"fa-regular fa-copy\" aria-label=\"Copy code\"></i>";
function addCopyCodeButtons() {
	let blocks = document.getElementsByClassName("copiable");
	
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
	let text = block.innerText;
	
	await navigator.clipboard.writeText(text);
	// Visual feedback that the task is completed
	button.innerHTML = codeCopied;
	
	setTimeout(() => {
		button.innerHTML = copyButton;
	}, 800);
}

$(document).ready(function(){
	// Add 'copy code' buttons to all elements of class 'copiable'
	addCopyCodeButtons();
});