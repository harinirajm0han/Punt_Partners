
const googleFontsApi = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyA90YiJPvrzAltLK45u5-rW4NbsibkAqBQ';
import html2pdf from 'html2pdf.js';


const element = document.getElementById('content');
const options = {
  margin: 1,
  filename: 'document.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
};
html2pdf().from(element).set(options).save();

async function loadGoogleFonts() {
    const response = await fetch(googleFontsApi);
    const data = await response.json();
    const fonts = data.items;
  
    const fontFamilySelector = document.getElementById('fontFamilySelector');
    fonts.forEach(font => {
      const option = document.createElement('option');
      option.value = font.family;
      option.textContent = font.family;
      fontFamilySelector.appendChild(option);
    });
  }
  
  // Initialize font weight options
  function initializeFontWeightOptions(font) {
    const fontWeightSelector = document.getElementById('fontWeightSelector');
    fontWeightSelector.innerHTML = ''; // Clear existing options
  
    font.variants.forEach(variant => {
      const option = document.createElement('option');
      option.value = variant;
      option.textContent = variant;
      fontWeightSelector.appendChild(option);
    });
  }
  
  // Apply font family and variant
  function applyFontFamily(fontFamily) {
    const content = document.getElementById('content');
    content.style.fontFamily = fontFamily;
    const italicToggle = document.getElementById('italicToggle');
    italicToggle.disabled = true; // Disable italic toggle initially
  }
  
  // Apply font weight and italic
  function applyFontWeight(fontWeight) {
    const content = document.getElementById('content');
    const [weight, style] = fontWeight.split('italic');
    content.style.fontWeight = weight;
    content.style.fontStyle = style ? 'italic' : 'normal';
  
    const italicToggle = document.getElementById('italicToggle');
    italicToggle.checked = !!style;
    italicToggle.disabled = false;
  }
  
  // Autosave function
  function autosave() {
    const content = document.getElementById('content').innerHTML;
    localStorage.setItem('content', content);
  }
  
  // Load saved content
  function loadSavedContent() {
    const savedContent = localStorage.getItem('content');
    if (savedContent) {
      document.getElementById('content').innerHTML = savedContent;
    }
  }
  
  // Reset content
  function resetContent() {
    document.getElementById('content').innerHTML = '';
    localStorage.removeItem('content');
  }
  
  // Event listeners
  document.getElementById('fontFamilySelector').addEventListener('change', function () {
    applyFontFamily(this.value);
    const selectedFont = this.options[this.selectedIndex].text;
    initializeFontWeightOptions(selectedFont);
  });
  
  document.getElementById('fontWeightSelector').addEventListener('change', function () {
    applyFontWeight(this.value);
  });
  
  document.getElementById('italicToggle').addEventListener('change', function () {
    const content = document.getElementById('content');
    content.style.fontStyle = this.checked ? 'italic' : 'normal';
  });
  
  document.getElementById('resetButton').addEventListener('click', resetContent);
  
  document.getElementById('saveButton').addEventListener('click', autosave);
  
  // Load saved content on page load
  window.addEventListener('DOMContentLoaded', (event) => {
    loadGoogleFonts();
    loadSavedContent();
  });
  
  function formatDoc(cmd, value = null) {
    if (value) {
      document.execCommand(cmd, false, value);
    } else {
      document.execCommand(cmd);
    }
  }
  
  function addLink() {
    const url = prompt('Insert url');
    formatDoc('createLink', url);
  }
  
  const content = document.getElementById('content');
  
  content.addEventListener('mouseenter', function () {
    const a = content.querySelectorAll('a');
    a.forEach(item => {
      item.addEventListener('mouseenter', function () {
        content.setAttribute('contenteditable', false);
        item.target = '_blank';
      });
      item.addEventListener('mouseleave', function () {
        content.setAttribute('contenteditable', true);
      });
    });
  });
  
  const showCode = document.getElementById('show-code');
  let active = false;
  
  showCode.addEventListener('click', function () {
    showCode.dataset.active = !active;
    active = !active;
    if (active) {
      content.textContent = content.innerHTML;
      content.setAttribute('contenteditable', false);
    } else {
      content.innerHTML = content.textContent;
      content.setAttribute('contenteditable', true);
    }
  });
  
  const filename = document.getElementById('filename');
  
  function fileHandle(value) {
    if (value === 'new') {
      content.innerHTML = '';
      filename.value = 'untitled';
    } else if (value === 'txt') {
      const blob = new Blob([content.innerText]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename.value}.txt`;
      link.click();
    } else if (value === 'pdf') {
      html2pdf(content).save(filename.value);
    }
  }