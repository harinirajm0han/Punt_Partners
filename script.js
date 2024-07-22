document.addEventListener("DOMContentLoaded", () => {
    const fontFamilySelect = document.getElementById("font-family");
    const fontWeightSelect = document.getElementById("font-weight");
    const fontVariantSelect = document.getElementById("font-variant");
    const italicToggle = document.getElementById("italic-toggle");
    const textEditor = document.getElementById("text-editor");
    const saveButton = document.getElementById("save-button");
    const resetButton = document.getElementById("reset-button");
  
    const availableFonts = [];
    const fontWeights = {
      Roboto: [100, 300, 400, 500, 700, 900],
      "Open Sans": [300, 400, 600, 700],
      Lato: [100, 300, 400, 700]
      // Add more fonts and weights as needed
    };
  
    // Fetch Google Fonts
    fetch(
      "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyC7DcAliXAsQZLKjuSZgo53FHczjedfG34 "
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          data.items.forEach((font) => {
            availableFonts.push(font.family);
            const option = document.createElement("option");
            option.value = font.family;
            option.textContent = font.family;
            fontFamilySelect.appendChild(option);
          });
          fontFamilySelect.value = "Roboto"; // Set a default value
          updateFontWeights();
        } else {
          console.error("Unexpected data structure:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching fonts:", error);
      });
  
    // Update font weights based on the selected font family
    function updateFontWeights() {
      const selectedFont = fontFamilySelect.value;
      const weights = fontWeights[selectedFont] || [];
      fontWeightSelect.innerHTML = "";
      weights.forEach((weight) => {
        const option = document.createElement("option");
        option.value = weight;
        option.textContent = weight;
        fontWeightSelect.appendChild(option);
      });
      fontWeightSelect.value = "400"; // Set a default value
      updateFontVariants();
    }
  
    // Update font variants based on the selected font family
    function updateFontVariants() {
      const selectedFont = fontFamilySelect.value;
      // Simple example; adjust if needed based on actual font support
      const variants = {
        Roboto: ["normal", "italic", "bold"],
        "Open Sans": ["normal", "italic", "bold"],
        Lato: ["normal", "italic", "bold"]
      };
      const variantSelect = document.getElementById("font-variant");
      variantSelect.innerHTML = "";
      (variants[selectedFont] || []).forEach((variant) => {
        const option = document.createElement("option");
        option.value = variant;
        option.textContent = variant.charAt(0).toUpperCase() + variant.slice(1);
        variantSelect.appendChild(option);
      });
      variantSelect.value = "normal"; // Set a default value
    }
  
    // Apply selected styles to the text editor
    function applyEditorStyles() {
      const fontFamily = fontFamilySelect.value;
      const fontWeight = fontWeightSelect.value;
      const fontVariant = fontVariantSelect.value;
      const isItalic = italicToggle.checked;
  
      textEditor.style.fontFamily = fontFamily;
      textEditor.style.fontWeight = fontWeight;
      textEditor.style.fontStyle =
        fontVariant === "italic" || isItalic ? "italic" : "normal";
  
      // Save to local storage
      localStorage.setItem("fontFamily", fontFamily);
      localStorage.setItem("fontWeight", fontWeight);
      localStorage.setItem("fontVariant", fontVariant);
      localStorage.setItem("italic", isItalic);
      localStorage.setItem("content", textEditor.value);
    }
  
    // Load saved settings from local storage
    function loadSavedSettings() {
      const savedFontFamily = localStorage.getItem("fontFamily") || "Roboto";
      const savedFontWeight = localStorage.getItem("fontWeight") || "400";
      const savedFontVariant = localStorage.getItem("fontVariant") || "normal";
      const savedItalic = localStorage.getItem("italic") === "true";
      const savedContent = localStorage.getItem("content") || "Hello World";
  
      fontFamilySelect.value = savedFontFamily;
      fontWeightSelect.value = savedFontWeight;
      fontVariantSelect.value = savedFontVariant;
      italicToggle.checked = savedItalic;
      textEditor.value = savedContent;
  
      updateFontWeights();
      updateFontVariants();
      applyEditorStyles();
    }
  
    // Save the text editor content as a .txt file
    function saveFile() {
      const blob = new Blob([textEditor.value], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.txt";
      a.click();
      URL.revokeObjectURL(url);
    }
  
    // Reset the text editor to default values
    function resetEditor() {
      textEditor.value = "Hello World";
      fontFamilySelect.value = "Roboto";
      fontWeightSelect.value = "400";
      fontVariantSelect.value = "normal";
      italicToggle.checked = false;
      applyEditorStyles();
    }
  
    // Event listeners for changes and button clicks
    fontFamilySelect.addEventListener("change", () => {
      updateFontWeights();
      updateFontVariants();
      applyEditorStyles();
    });
  
    fontWeightSelect.addEventListener("change", () => {
      applyEditorStyles();
    });
  
    fontVariantSelect.addEventListener("change", () => {
      applyEditorStyles();
    });
  
    italicToggle.addEventListener("change", () => {
      applyEditorStyles();
    });
  
    saveButton.addEventListener("click", saveFile);
    resetButton.addEventListener("click", resetEditor);
  
    loadSavedSettings();
  });
  