"use strict";

// Main variables
const informationSection = document.getElementById("information--section");
const form = document.getElementById("info--form");
const modalSection = document.getElementById("modal--section");
let formTitleInput = document.getElementById("title");
let formDescriptionInput = document.getElementById("description");
let formDetailsInput = document.getElementById("details");
let inputList = [];
let currentId = 0;

// Validation
// Error messages
const titleError = document.getElementById("title--error");
const detailError = document.getElementById("details--error");
// check if title and details input are empty
function isValidForm() {
  detailError.style.display = formDetailsInput.value ? "none" : "block";
  titleError.style.display = formTitleInput.value ? "none" : "block";

  // disappeared error if user type in title input
  formTitleInput.addEventListener("input", (event) => {
    event.preventDefault();
    titleError.style.display = formTitleInput.value ? "none" : "block";
  });

  // disappeared error if user type details in input
  formDetailsInput.addEventListener("input", (event) => {
    event.preventDefault();
    detailError.style.display = formDetailsInput.value ? "none" : "block";
  });

  return !formTitleInput.value && !formDetailsInput.value
    ? false
    : !formTitleInput.value
    ? detailError.style.display
    : !formDetailsInput.value
    ? titleError.style.display
    : true;
}

// get input form values
function getFormValues() {
  return {
    title: formTitleInput.value,
    description: formDescriptionInput.value,
    details: formDetailsInput.value,
  };
}

// clean input values
function cleanInputValues() {
  formTitleInput.value = "";
  formDescriptionInput.value = "";
  formDetailsInput.value = "";
}

// create an object from input values
function createInputObject(formValues, newDate, submitDate) {
  return {
    id: ++currentId,
    title: formValues.title,
    description: formValues.description,
    details: formValues.details,
    date: submitDate,
    numericDate: newDate.getTime(),
    editDate: "",
  };
}

// get the submit date
function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
}

function createInfoSection(item) {
  // create info div
  const infoSection = document.createElement("div");
  infoSection.id = `information--section--${item.id}`;
  infoSection.className = "information--section";
  informationSection.prepend(infoSection);

  // create left border
  const leftBorder = document.createElement("div");
  leftBorder.className = "information--section--left-border";
  infoSection.append(leftBorder);
}
