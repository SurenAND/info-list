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
