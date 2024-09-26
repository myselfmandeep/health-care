const scrolledBar = document.querySelector(".scrolled-bar");
const body = document.querySelector("body");

const handelScrollBar = function() {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const maxScrollY = scrollHeight - clientHeight;
  const scrolledPer = (window.scrollY / maxScrollY) * 100;

  const availWidth = body.scrollWidth;
  scrolledBar.style.width = `${(availWidth * scrolledPer) / 100}px`;
}

handelScrollBar();

window.addEventListener("scroll", handelScrollBar);
