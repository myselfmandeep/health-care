
const hospitalList = document.querySelector("#hospital-name");
const specializationList = document.querySelector("#specialization-name");
export const doctorSearchField = document.querySelector("#search-doctor-name");
const filterResetBtn = document.querySelector("#filter-reset-btn");
const doctorCards = [...document.querySelectorAll("[data-hospital]")];
const chatWithDrBtn = [...document.querySelectorAll(".chat-with-doctor")];

const hideElement = (element) => element.style.display = "none";
const showElement = (element) => element.style.display = "";

const filterDoctors = function(event) {
  doctorCards.forEach((doctor) => {
    const dataSet    =  doctor.dataset
    const [doctorName, hospitalName, specialization] = [dataSet.doctorName, dataSet.hospital, dataSet.doctorSpecialization].map(e => e.trim().toLowerCase());
    const [doctorVal, hospitalVal, specializationVal] = [doctorSearchField.value, hospitalList.value, specializationList.value].map(e => e.trim().toLowerCase());
    const showHospital = (hospitalVal == hospitalName || hospitalVal == "");
    const showSpecialization = (specializationVal == specialization || specializationVal == "");
    const showDoctor = doctorName.includes(doctorVal);
    (showHospital && showSpecialization && showDoctor) ? showElement(doctor) : hideElement(doctor);
  });
};

hospitalList.addEventListener("change", function(event) {
  const params =  new URLSearchParams(window.location.search);
  !!params.get("page")          ? params.delete("page")           : "";
  !params.get("specialization") ? params.delete("specialization") : "";
  params.set("hospital", hospitalList.value)
  location.href = `?${params.toString()}`
});

specializationList.addEventListener("change", function(event) {
  const params =  new URLSearchParams(window.location.search);
  !params.get("page") ? "" : params.delete("page");
  !params.get("specialization") ? params.delete("specialization") : ""
  params.set("specialization", specializationList.value)
  location.href = `?${params.toString()}`
});

const selectValuesFromList = function() {
  const params = new URLSearchParams(window.location.search);
  const hospital = params.get("hospital");
  const specialization = params.get("specialization");
  hospitalList.value = hospital ? hospital : ""
  specializationList.value = specialization ? specialization : "" 
};

doctorSearchField.addEventListener("keyup", filterDoctors);
[specializationList,hospitalList].forEach(e=> e.value= "")

filterResetBtn.addEventListener("click", function(e) {
  if (!!location.search) {
    location.href = "/"
  }
  doctorCards.forEach(e=> showElement(e));
  doctorSearchField.value = "";
});

selectValuesFromList();

chatWithDrBtn.forEach(btn => {
  
  btn.addEventListener("click", (event) => {
    // event.preventDefault();
    const chatBtn = event.currentTarget;
    const drId = chatBtn.dataset.doctorId;
    const drName = chatBtn.dataset.doctorName;
  
    console.log(drId);
    localStorage.setItem("requestedChat", drId)
    localStorage.setItem("requestedUserName", drName)
  })
});