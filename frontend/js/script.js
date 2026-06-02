const analyzeBtn = document.getElementById("analyzeBtn");

const docType = document.getElementById("docType");
const fileInput = document.getElementById("fileInput");
const textInput = document.getElementById("textInput");

const loading = document.getElementById("loading");

const resultSection =
    document.getElementById("resultSection");

const resultText =
    document.getElementById("resultText");


analyzeBtn.addEventListener("click", async () => {

    const selectedType = docType.value;
    const file = fileInput.files[0];
    const text = textInput.value.trim();

    // Validation

    if (!file && !text) {

        alert(
            "Please upload a PDF or paste document text."
        );

        return;
    }

    // Create form data

    const formData = new FormData();

    formData.append(
        "docType",
        selectedType
    );

    if (file) {
        formData.append(
            "file",
            file
        );
    }

    if (text) {
        formData.append(
            "text",
            text
        );
    }

    // Show loading

    loading.classList.remove("hidden");

    resultSection.classList.add("hidden");

    analyzeBtn.disabled = true;
    analyzeBtn.innerText = "Analyzing...";

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/analyze",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        loading.classList.add("hidden");

        analyzeBtn.disabled = false;
        analyzeBtn.innerText =
            "Analyze Document";

        // Handle backend error

        if (
            data.status === "error" ||
            data.error
        ) {

            resultText.textContent =
                data.message ||
                data.error ||
                "Something went wrong.";

            resultSection.classList.remove(
                "hidden"
            );

            return;
        }

        // Show result

        resultText.textContent =
            data.result;

        resultSection.classList.remove(
            "hidden"
        );

        // Scroll to result

        resultSection.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        loading.classList.add("hidden");

        analyzeBtn.disabled = false;
        analyzeBtn.innerText =
            "Analyze Document";

        resultText.textContent =
            "Unable to connect to backend. Make sure Flask is running.";

        resultSection.classList.remove(
            "hidden"
        );

        console.error(error);
    }

});