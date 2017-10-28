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

document.getElementById("defaultTab").click();