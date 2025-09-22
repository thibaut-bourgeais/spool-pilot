async function populateStock() {
    const container = document.querySelector(".bento-grid");
    container.innerHTML = "";
  
    const res = await fetch("/stock_items");
    const data = await res.json();
  
    data.items.forEach(item => {
      const bento = document.createElement("div");
      bento.classList.add("bento-item");
      if (item.size === "2x1") bento.classList.add("size-2x1");
  
      let colorsHTML = "";
      if (item.colors) {
        const colorList = item.colors.split(",");
        colorsHTML = `<div style="margin: 0.5rem 0">` +
          colorList.map(c => `<span class="color-dot" style="background: ${c.trim()}"></span>`).join('') +
          `</div>`;
      }
  
      bento.innerHTML = `
        <div style="font-weight: bold">${item.name}</div>
        ${colorsHTML}
        <div style="font-size: 0.9rem">
          ${item.quantity} ${item.type}s
          ${item.weight_kg ? `— ${item.weight_kg} kg total` : ''}
        </div>
        <div class="action-buttons">
          <button class="btn-sm"><i class="bi bi-plus-circle"></i></button>
          <button class="btn-sm"><i class="bi bi-dash-circle"></i></button>
          <button class="btn-sm delete"><i class="bi bi-trash-fill"></i></button>
        </div>
      `;
      container.appendChild(bento);
    });
  }
  