console.log("base.js");

const users = [...document.querySelectorAll("[data-user-full-name]")];

const username = document.querySelector("#username");
const fullName = document.querySelector("#full-name");
const email = document.querySelector("#email");
const contact = document.querySelector("#contact");
const genders = document.querySelector("#genders");
const clearFilterBtn = document.querySelector("#clear-filter-button");
const hideElement = (element) => element.style.display = "none";
const showElement = (element) => element.style.display = "";

const clearFields = () => {
  [username
    , fullName
    , email
    , contact
    , genders
  ].forEach((e)=> { e.value = "" });
};

const changeVisibility = function(event) {
  const [
          inpUsername,
          inpFullName,
          inpEmail,
          inpContact
        ] = [
          username.value,
          fullName.value,
          email.value,
          contact.value
        ].map(val => val.trim().toLowerCase());
  const [
         inpGender
        ] = [
          genders.value
        ];
  
  users.forEach(user => {
    const dataSet = user.dataset
    const [
            dUsername,
            dFullName,
            dEmail,
            dContact,
            dGender
          ] = [
            dataSet.userUsername,
            dataSet.userFullName,
            dataSet.userEmail,
            dataSet.userContact,
            dataSet.userGender
          ].map(val => val.trim().toLowerCase());

    const showFullName = dFullName.includes(inpFullName);
    const showEmail = dEmail.includes(inpEmail);
    const showUserName = dUsername.includes(inpUsername);
    const showContact = dContact.includes(inpContact);
    const showGender = (dGender == inpGender || inpGender == "")
    
    const showOrNot = (showFullName 
                        && showEmail 
                        && showUserName 
                        && showContact 
                        && showGender
                      );
    
    showOrNot ?  showElement(user) : hideElement(user);
  })
};

username.addEventListener("keyup", changeVisibility)
fullName.addEventListener("keyup", changeVisibility)
email.addEventListener("keyup", changeVisibility)
contact.addEventListener("keyup", changeVisibility)
genders.addEventListener("change", changeVisibility)

clearFilterBtn.addEventListener("click", () => users.forEach((user) => {
  showElement(user);
  clearFields();
}));

clearFields();


const searchBtn = document.querySelector("#search-button");
searchBtn.addEventListener("click", (event) => {
  
  const value = "AGE";
  const errors = []
  if (!value) {
    errors.push("Search field can't be blank")
  } else if(value.length < 3) {
    errors.push("Search field must have minimum 3 characters")
  }
  if (!errors.length) {
    location.href = `/doctors/search?query=${value}`;
  } else {
    showErrorInNotificationCard(errors, 5000);
  }
});