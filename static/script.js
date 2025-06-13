// Persistence for tabs
document.addEventListener("DOMContentLoaded", () => {
    const tabElms = document.querySelectorAll('button[data-bs-toggle="tab"]');
    const lastTabId = localStorage.getItem("activeTab");
  
    // Activer le dernier onglet connu (si trouvé)
    if (lastTabId) {
      const triggerEl = document.querySelector(`button[data-bs-target="${lastTabId}"]`);
      if (triggerEl) {
        const tab = new bootstrap.Tab(triggerEl);
        tab.show();
      }
    }
  
    // Sauvegarder chaque clic sur un onglet
    tabElms.forEach(el => {
      el.addEventListener("shown.bs.tab", (e) => {
        localStorage.setItem("activeTab", e.target.getAttribute("data-bs-target"));
      });
    });
  });

  

// Dark/Light mode
// OS theme detection
const stored = localStorage.getItem('dark-mode');
      
// Check if the user changed the mode
if (stored === 'enabled') {
    document.body.classList.add('dark-mode');
} else if (stored !== 'disabled') {
    // If the user didn't set the mode, use the OS one
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('dark-mode', 'dark');
    } else {
        localStorage.setItem('dark-mode', 'light');
    }
}

const storedTheme = localStorage.getItem('dark-mode');
const switchToggle = document.getElementById('darkModeSwitch');

if (storedTheme) {
    document.documentElement.setAttribute('data-bs-theme', storedTheme);
    switchToggle.checked = storedTheme === 'dark';
    } 
else {
    const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', systemPref);
    switchToggle.checked = systemPref === 'dark';
    }

switchToggle.addEventListener('change', () => {
    const darkTheme = switchToggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', darkTheme);
    localStorage.setItem('dark-mode', darkTheme);
});



//Dropzone
Dropzone.autoDiscover = false;
new Dropzone("#gcode-dropzone", {
    acceptedFiles: ".3mf",
    maxFilesize: 2000000,
    uploadMultiple: true
});
