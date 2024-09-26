import { showSpinner } from "./spinner";

const pagination = document.querySelector(".pagination")
const perPage = document.querySelector("#per_page")

const defaultPerPage = function() {
  const url = new URL(location.href);
  const params = new URLSearchParams(url.search);
  const itemsPerPage = params.get("per_page")
  return itemsPerPage;
}
  
console.log(defaultPerPage());
const currentItemsPerPage = defaultPerPage()

const options = [...perPage.options];
options.forEach(opt => opt.value == currentItemsPerPage ? (opt.selected=true) : ""); 
  
perPage.addEventListener("change", function(event) {
  const value = event.currentTarget.value;
  showSpinner();
  if (pagination == null) {
    const url = new URL(location.href);
    const params = new URLSearchParams(url.search);
      params.set('page', 1);
      params.set('per_page', value);
      url.search = params.toString();
      location.href = url.toString();
  } else { 
    const links = [...pagination.querySelectorAll("a")]
    links.forEach(aTag => {
      const url = new URL(aTag.href);
      const params = new URLSearchParams(url.search);
      params.set('page', 1);
      params.set('per_page', value);
      url.search = params.toString();
      location.href = url.toString();
    });
  }
});
