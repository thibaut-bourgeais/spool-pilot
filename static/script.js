// gcode lister
async function populatePreview() {
  const container = document.getElementById("filePreviewContainer");

  // Avoid duplicates
  container.innerHTML = "";

  fetch("/available_files")
    .then(res => res.json())
    .then(data => {
      //console.log("Fetching .3mf list...");
      data.files.forEach((file, index) => {
        fileRenamed = file.replace(/\.3mf$/i, '');
        const col = document.createElement("div");
        col.classList.add("col-md-3", "mb-4");

        const checkboxId = `checkbox-${index}`;

        col.innerHTML = `
          <div class="card shadow-sm bg-light-subtle file-card position-relative" data-index="${index}">
            <input type="checkbox" id="${checkboxId}" class="form-check-input file-checkbox position-absolute top-0 start-0 m-2" />
            <img src="/thumbnail/${file}" class="card-img-top" alt="${file}" style="object-fit: contain; max-height: 200px; max-width: 100%;">
            <h6 class="card-title text-center text-truncate" title="${fileRenamed}">${fileRenamed}</h6>
          </div>
        `;

        container.appendChild(col);
      });

      document.querySelectorAll('.file-card').forEach(card => {
        const checkbox = card.querySelector('.file-checkbox');
      
        // Clic sur la carte
        card.addEventListener('click', (e) => {
          if (!e.target.classList.contains('file-checkbox')) {
            checkbox.checked = !checkbox.checked;
            card.classList.toggle('checked', checkbox.checked);
            updateAddButtonState();
          }
        });
      
        // Clic direct sur la checkbox
        checkbox.addEventListener('change', () => {
          card.classList.toggle('checked', checkbox.checked);
          updateAddButtonState();
        });
      });
      

      updateAddButtonState();

      //console.log("Files found :", data.files);
    });
}

document.getElementById("refresh-button").addEventListener("click", async () => {
  await populatePreview();
});

function updateAddButtonState() {
  const anyChecked = document.querySelectorAll('.file-checkbox:checked').length > 0;
  document.getElementById('add-to-queue-button').disabled = !anyChecked;
}



document.addEventListener("DOMContentLoaded", () => {
  console.log(document.getElementById("filePreviewContainer"));
  
  // Persistence for tabs
  const tabElms = document.querySelectorAll('button[data-bs-toggle="tab"]');
  const lastTabId = localStorage.getItem("activeTab");

  // Activate last openned (saved) tab
  if (lastTabId) {
    const triggerEl = document.querySelector(`button[data-bs-target="${lastTabId}"]`);
    if (triggerEl) {
      const tab = new bootstrap.Tab(triggerEl);
      tab.show();
    }
  }

  // Save state at every click on a tab
  tabElms.forEach(el => {
    el.addEventListener("shown.bs.tab", (e) => {
      localStorage.setItem("activeTab", e.target.getAttribute("data-bs-target"));
    });
  });
  
  // Add a listener for the tabs
  document.querySelector('#tab-overview').addEventListener('shown.bs.tab', () => {
    populatePreview();
  });
  // Trigger the preview now if already active
  if (document.querySelector('#tab-overview').classList.contains('active')) {
    populatePreview();
  }
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

// Used when we click on "use this"
function selectFile(filename) {
  const input = document.getElementById("filename");
  if (input) input.value = filename;
}