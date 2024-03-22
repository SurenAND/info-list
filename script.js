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

// Undo the deleted
function showUndoMessage(infoSection, deletedItem) {
  const undoMessage = document.createElement("div");
  undoMessage.id = "undo-message";
  undoMessage.classList.add("scale-up-animation");
  undoMessage.textContent = "Item deleted. Click to undo.";
  undoMessage.style.backgroundColor = "var(--secondary--color)";
  undoMessage.style.color = "white";
  undoMessage.style.fontWeight = "bold";
  undoMessage.style.fontSize = "0.9rem";
  undoMessage.style.padding = "0.5rem 1rem";
  undoMessage.style.borderRadius = "5px";
  undoMessage.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
  undoMessage.style.marginTop = "1.5rem";

  // Append the undo message to the parent of the deleted section
  infoSection.parentNode.insertBefore(undoMessage, infoSection.nextSibling);

  undoMessage.addEventListener("click", () => {
    undoMessage.remove();
    const idToUndo = infoSection.id.split("--")[2];
    const index = inputList.findIndex((item) => item.id === +idToUndo);
    inputList.splice(index, 0, deletedItem[0]);
    infoSection.classList.remove("hidden");
  });

  // Clear the timeout when the user clicks the undo message
  let timeoutId = setTimeout(() => {
    deleteItemPermanently(infoSection);
    undoMessage.remove();
    timeoutId = null;
  }, 3000);

  // Clear the timeout if the user clicks the undo message
  undoMessage.addEventListener("click", () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  });
}

// delete the item permanently if not undo
function deleteItemPermanently(infoSection) {
  const idToDelete = infoSection.id.split("--")[2];
  const index = inputList.findIndex((item) => item.id === +idToDelete);
  infoSection.remove();
}

// View Modal PopUp
function showPopUp(e, date) {
  e.preventDefault();

  // get button id number
  const viewBtnId = e.target.id;
  const viewBtnIdNumber = viewBtnId.split("--")[2];

  const index = inputList.findIndex((item) => item.id === +viewBtnIdNumber);
  // make the modal

  // title
  const modalTitle = document.getElementById("modal--header--title");
  modalTitle.innerText = inputList[index].title;

  // description
  const modalDescription = document.getElementById(
    "modal--header--description"
  );
  modalDescription.innerText = inputList[index].description;

  // details
  const modalDetail = document.getElementById("modal--body--detail");
  modalDetail.innerText = inputList[index].details;

  // submit date
  const modalDate = document.getElementById("modal--footer--date");
  modalDate.innerText = date.innerText;

  // pop up modal
  modalSection.style.display = "flex";

  //close modal
  const close = document.getElementById("modal--close");
  close.addEventListener("click", () => {
    modalSection.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modalSection) {
      modalSection.style.display = "none";
    }
  });
}

//Edit the selected
function editSubmits(e) {
  e.preventDefault();

  // remove submit button and add update button
  document.getElementById("submit-button").style.display = "none";
  document.getElementById("update-button").style.display = "block";

  // get inputs from inputList array
  const editBtn = e.target;
  const editBtnId = editBtn.id;
  const editBtnIdNumber = editBtnId.split("--")[2];

  const index = inputList.findIndex((item) => item.id === +editBtnIdNumber);

  // innerText inputs from inputList array into the input tags
  formTitleInput.value = inputList[index].title;
  formDescriptionInput.value = inputList[index].description;
  formDetailsInput.value = inputList[index].details;

  // edit the new submitted
  document.getElementById("update-button").onclick = function () {
    if (isValidForm() === true) {
      // edit the selected index of array
      inputList[index].title = formTitleInput.value;
      inputList[index].description = formDescriptionInput.value;
      inputList[index].details = formDetailsInput.value;

      // Edited Date
      const toEditDate = new Date();
      const editedDate = ` (Edited on ${toEditDate.getFullYear()}/${
        toEditDate.getMonth() + 1
      }/${toEditDate.getDate()} - ${toEditDate.getHours()}:${toEditDate.getMinutes()}:${toEditDate.getSeconds()})`;

      inputList[index].editDate = inputList[index].date + editedDate;

      // innerText inputs from inputList array into the edited section
      const editedContentTitle = editBtn.parentNode.parentNode.querySelector(
        ".information--section--title"
      );
      const editedContentDescription =
        editBtn.parentNode.parentNode.querySelector(
          ".information--section--description"
        );
      const editedContentDate = editBtn.parentNode.parentNode.querySelector(
        ".information--section--date"
      );

      editedContentTitle.innerText = inputList[index].title;
      editedContentDescription.innerText = inputList[index].description;
      editedContentDate.innerText = inputList[index].editDate;
    }

    cleanInputValues();

    // remove update button and restore submit button
    document.getElementById("submit-button").style.display = "block";
    document.getElementById("update-button").style.display = "none";
  };
}

// dropDown Btn
const dropdowns = document.getElementById("dropdown");
const chevron = document.getElementById("chevron");
const select = document.getElementById("select");
const selected = document.getElementById("selected");
const menu = document.getElementById("menu");
const options = document.querySelectorAll(".menu li");

select.addEventListener("click", () => {
  select.classList.toggle("select-clicked");
  chevron.classList.toggle("chevron--rotate");
  menu.classList.toggle("menu-open");
});

window.addEventListener("mouseup", function (event) {
  if (event.target != select && event.target.parentNode != select) {
    select.classList.remove("select-clicked");
    chevron.classList.remove("chevron--rotate");
    menu.classList.remove("menu-open");
  }
});

options.forEach((option) => {
  option.addEventListener("click", (event) => {
    selected.innerText = option.innerText;
    select.classList.remove("select-clicked");
    chevron.classList.remove("chevron--rotate");
    menu.classList.remove("menu-open");

    sortingFunction(event);
  });
});

// sorting
function sortingFunction(e) {
  const sortBy = e.target.innerText;
  if (sortBy === "Newest") {
    inputList.sort((a, b) => {
      const dateB = new Date(b.numericDate);
      const dateA = new Date(a.numericDate);
      return dateB - dateA;
    });
  } else if (sortBy === "Oldest") {
    inputList.sort((a, b) => {
      const dateB = new Date(b.numericDate);
      const dateA = new Date(a.numericDate);
      return dateA - dateB;
    });
  } else if (sortBy === "A - Z") {
    inputList.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Update the informationSection's child nodes based on the sorted inputList
  const sortedSections = [];
  inputList.forEach((item) => {
    const section = document.getElementById(`information--section--${item.id}`);
    if (section) {
      sortedSections.push(section);
    }
  });

  // Remove existing child nodes
  while (informationSection.firstChild) {
    informationSection.removeChild(informationSection.firstChild);
  }

  // Insert sorted child nodes
  sortedSections.forEach((section) => {
    informationSection.appendChild(section);
  });
}
