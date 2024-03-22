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

  // create info content section
  const infoContent = document.createElement("div");
  infoContent.className = "information--section--content";
  infoSection.append(infoContent);

  // create content title
  const contentTitle = document.createElement("p");
  contentTitle.className = "information--section--title";
  contentTitle.innerText = item.title;
  infoContent.append(contentTitle);

  // create content description
  const contentDescription = document.createElement("p");
  contentDescription.className = "information--section--description";
  contentDescription.innerText = item.description;
  infoContent.append(contentDescription);

  // create content date
  const contentDate = document.createElement("p");
  contentDate.className = "information--section--date";
  contentDate.innerText = item.date;
  infoContent.append(contentDate);

  // create icons
  const contentIcons = document.createElement("div");
  contentIcons.className = "icons";
  infoSection.append(contentIcons);

  // create view icon
  const contentViewIcon = document.createElement("img");
  contentViewIcon.className = "cursor--pointer";
  contentViewIcon.setAttribute("id", `icon--section--${item.id}`);
  contentViewIcon.src = "./assets/images/view.svg";
  contentViewIcon.alt = "view icon";
  contentIcons.append(contentViewIcon);

  // create delete icon
  const contentDeleteIcon = document.createElement("img");
  contentDeleteIcon.className = "cursor--pointer";
  contentDeleteIcon.setAttribute("id", `icon--section--${item.id}`);
  contentDeleteIcon.src = "./assets/images/delete.svg";
  contentDeleteIcon.alt = "delete icon";
  contentIcons.append(contentDeleteIcon);

  // create edit icon
  const contentEditIcon = document.createElement("img");
  contentEditIcon.className = "cursor--pointer";
  contentEditIcon.setAttribute("id", `icon--section--${item.id}`);
  contentEditIcon.src = "./assets/images/edit.svg";
  contentEditIcon.alt = "edit icon";
  contentIcons.append(contentEditIcon);

  // view and delete and edit
  contentDeleteIcon.addEventListener("click", (event) => {
    confirmAndDelete(event, infoSection);
  });

  contentViewIcon.addEventListener("click", (event) =>
    showPopUp(event, contentDate)
  );
  contentEditIcon.addEventListener("click", (event) => editSubmits(event));
}

// confirm Delete
function confirmAndDelete(e, infoSection) {
  e.preventDefault();

  // pop up modal
  const deleteConfirmSec = document.getElementById("delete-section");
  deleteConfirmSec.style.display = "flex";

  const deleteBtn = document.getElementById("delete-content-delete");

  // Remove the previous event listener from the delete button
  deleteBtn.removeEventListener("click", handleDeleteClick);

  // Add the new event listener to the delete button
  deleteBtn.addEventListener("click", handleDeleteClick);

  let deletedItem;

  function handleDeleteClick() {
    deleteConfirmSec.style.display = "none";
    const idToDelete = infoSection.id.split("--")[2];
    const index = inputList.findIndex((item) => item.id === +idToDelete);

    deletedItem = inputList.splice(index, 1);

    infoSection.classList.add("hidden");

    // Remove the event listener after it's been executed
    deleteBtn.removeEventListener("click", handleDeleteClick);

    // Show the undo message
    showUndoMessage(infoSection, deletedItem);
  }

  // cancel button
  const cancelBtn = document.getElementById("delete-content-cancel");
  cancelBtn.addEventListener("click", () => {
    deleteConfirmSec.style.display = "none";
    deleteBtn.removeEventListener("click", handleDeleteClick);
  });

  window.addEventListener("click", (event) => {
    if (event.target === deleteConfirmSec) {
      deleteConfirmSec.style.display = "none";
      deleteBtn.removeEventListener("click", handleDeleteClick);
    }
  });
}
