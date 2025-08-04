export default function decorate(block) {
  // Store the original rows data
  const rows = [...block.children];
  let currentList = null;
  let currentListType = null;

  // Clear the block content
  block.innerHTML = '';

  // Process each row in the block
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const content = cells[0].textContent.trim();
      const type = cells[1].textContent.trim();

      // If list type changes or no current list, create new list
      if (!currentList || currentListType !== type) {
        if (currentList) {
          block.appendChild(currentList);
        }
        currentList = document.createElement(type);
        currentListType = type;
      }

      // Create list item
      const li = document.createElement('li');
      li.textContent = content;
      currentList.appendChild(li);
    }
  });

  // Add the final list if it exists
  if (currentList) {
    block.appendChild(currentList);
  }
}