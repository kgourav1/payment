document.getElementById("detect").addEventListener("click", () => {
  const upload = document.getElementById("upload");
  const resultsTable = document.getElementById("results");
  const amountsBody = document.getElementById("amounts");
  const loading = document.getElementById("loading");
  const sumButton = document.getElementById("sum");
  const sumResult = document.getElementById("sumResult");
  const totalSum = document.getElementById("totalSum");

  if (!upload.files.length) {
    alert("Please upload an image first.");
    return;
  }

  loading.classList.remove("hidden");
  resultsTable.classList.add("hidden");
  amountsBody.innerHTML = "";
  sumButton.classList.add("hidden");
  sumResult.classList.add("hidden");

  const file = upload.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    Tesseract.recognize(e.target.result, "eng", {
      logger: (m) => console.log(m), // Optional: Logs the progress of OCR
    })
      .then(({ data: { text } }) => {
        loading.classList.add("hidden");
        const numbers = extractNumbers(text); // Extract numbers from the detected text
        displayNumbersInTable(numbers); // Display extracted numbers in the table
        sumButton.classList.remove("hidden"); // Show sum button if numbers are found
      })
      .catch((err) => {
        loading.classList.add("hidden");
        alert("Error processing image: " + err.message);
      });
  };

  reader.readAsDataURL(file);
});

/**
 * Function to extract numbers from a string
 * @param {string} text - Extracted text from the image
 * @returns {Array} - Array of numbers in their original format
 */
function extractNumbers(text) {
  // Regular expression to match numbers including formats like 1234, 1234.0, etc.
  const regex = /\b\d+(\.\d+)?\b/g; // Matches integers and decimal numbers
  return text.match(regex) || [];
}

/**
 * Function to display extracted numbers in a table format
 * @param {Array} numbers - Array of extracted numbers
 */
function displayNumbersInTable(numbers) {
  const resultsTable = document.getElementById("results");
  const amountsBody = document.getElementById("amounts");

  if (numbers.length > 0) {
    resultsTable.classList.remove("hidden");
    numbers.forEach((number) => {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.textContent = Number(number.replace(".", "")) / 10;
      row.appendChild(cell);
      amountsBody.appendChild(row);
    });
  } else {
    alert("No numbers detected.");
  }
}

/**
 * Function to sum the detected numbers when the Sum button is clicked
 */
document.getElementById("sum").addEventListener("click", () => {
  const numbers = Array.from(document.querySelectorAll("#amounts td")).map(
    (td) => parseFloat(td.textContent)
  );
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  document.getElementById("totalSum").textContent = sum.toFixed(2);
  document.getElementById("sumResult").classList.remove("hidden");
});
