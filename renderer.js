const { ipcRenderer, ipcMain } = require("electron");
const Papa = require("papaparse");

function logToMain(message) {
  ipcRenderer.send("log-message", message);
}

const form = document.getElementById("uploadForm");
const output = document.getElementById("output");

ipcRenderer.on("show-alert", (event, message) => {
  alert(message);
});
const saveButton = document.createElement("button");
saveButton.textContent = "Save XML File";
saveButton.onclick = async () => {
  ipcRenderer.send("openSave");
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let version = document.getElementById("releaseVersion").value;
  let ukprn = document.getElementById("ukprn").value;
  let file = document.getElementById("csvFile").files[0];
  Papa.parse(file, {
    complete: (results) => {
      const dataArray = results.data;
      ipcRenderer.send("upload-csv", dataArray, version, ukprn);
    },
  });

  logToMain("submit completed");
});

ipcRenderer.on("xml-created", (event, filename) => {
  const outputDiv = document.getElementById("output");
  const downloadLink = document.createElement("a");
  outputDiv.appendChild(saveButton);
  logToMain("xml creation completed");
});

ipcRenderer.on("xml-creation-failed", (event, errorMessage) => {
  const outputDiv = document.getElementById("output");
  outputDiv.textContent = `Error creating XML: ${errorMessage}`;
});

ipcRenderer.on("xml-validation-errors", (event, results) => {
  const errorDisplay = document.getElementById("formatErrors");
  errorDisplay.innerHTML = "";
  const h2 = document.createElement("h2");
  h2.textContent = "Errors and Warnings";
  errorDisplay.appendChild(h2);
  errorDisplay.appendChild(document.createElement("br"));
  h2.textContent = "Errors and Warnings";
  results.errors.forEach((error) => {
    const p = document.createElement("p");
    p.textContent = error;
    errorDisplay.appendChild(p);
    errorDisplay.appendChild(document.createElement("br"));
  });
  logToMain("xml validation completed");
});
