filterSelection("all")
function filterSelection(c) {
	var x, i;
	x = document.getElementsByClassName("filterDiv");
	if (c == "all") c = "";
	for (i = 0; i < x.length; i++) {
		w3RemoveClass(x[i], "filter-show");
		if (x[i].className.indexOf(c) > -1)
			w3AddClass(x[i], "filter-show");
	}
}

function w3AddClass(element, name) {
	var i, array1, array2;
	array1 = element.className.split(" ");
	array2 = name.split(" ");
	for (i = 0; i < array2.length; i++) {
		if (array1.indexOf(array2[i]) == -1) {element.className+= " " + array2[i];}
	}
}

function w3RemoveClass(element, name) {
	var i, array1, array2;
	array1 = element.className.split(" ");
	array2 = name.split(" ");
	for (i = 0; i < array2.length; i++) {
		while (array1.indexOf(array2[i]) > -1) {
			array1.splice(array1.indexOf(array2[i]), 1);
		}
	}
	element.className = array1.join(" ");
}

var btnContainer = document.getElementById("btnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
	btns[i].addEventListener("click", function(){
		var current = document.getElementsByClassName("activeFilter");
		current[0].className = current[0].className.replace(" activeFilter", "");
		this.className += " activeFilter";
	});
}