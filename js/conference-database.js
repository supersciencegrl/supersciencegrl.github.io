function pricelist() {
  var standard = document.getElementById("standard-price");
  var student = document.getElementById("student-price");
  var academic = document.getElementById("academic-price");
  var standardOutput = document.getElementsByClassName("standard");
  var studentOutput = document.getElementsByClassName("student");
  var academicOutput = document.getElementsByClassName("academic");
  var i;
  if (standard.checked) {
    for (i = 0; i < standardOutput.length; i++) {
    standardOutput[i].style.display = "table-cell";
  }
  	for (i = 0; i < studentOutput.length; i++) {
    studentOutput[i].style.display = "none";
  }
  	for (i = 0; i < academicOutput.length; i++) {
    academicOutput[i].style.display = "none";
  }}
  else if (student.checked) {
    for (i = 0; i < standardOutput.length; i++) {
    standardOutput[i].style.display = "none";
  }
  	for (i = 0; i < studentOutput.length; i++) {
    studentOutput[i].style.display = "table-cell";
  }
  	for (i = 0; i < academicOutput.length; i++) {
    academicOutput[i].style.display = "none";
  }}
  else if (academic.checked) {
    for (i = 0; i < standardOutput.length; i++) {
    standardOutput[i].style.display = "none";
  }
  	for (i = 0; i < studentOutput.length; i++) {
    studentOutput[i].style.display = "none";
  }
  	for (i = 0; i < academicOutput.length; i++) {
    academicOutput[i].style.display = "table-cell";
  }}
  else {
    for (i = 0; i < standardOutput.length; i++) {
    standardOutput[i].style.display = "table-cell";
  }
  	for (i = 0; i < studentOutput.length; i++) {
    studentOutput[i].style.display = "none";
  }
  	for (i = 0; i < academicOutput.length; i++) {
    academicOutput[i].style.display = "none";
  }}
}