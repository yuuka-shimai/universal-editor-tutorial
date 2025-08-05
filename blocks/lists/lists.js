export default function decorate(block) {
  // Get list type from block dataset or default to ul
  const listType = block.dataset.listType === 'ordered' ? 'ol' : 'ul';
  const rootList = document.createElement(listType);

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children];

    if (cells.length === 0) return;

    // First cell contains the main list item content
    const mainContent = cells[0].textContent.trim();
    if (mainContent) {
      li.textContent = mainContent;
    }

    // Handle nested items if present in additional cells
    if (cells.length > 1) {
      const nestedCell = cells[1];
      const nestedContent = nestedCell.textContent.trim();
      
      if (nestedContent) {
        // Determine nested list type from data attribute or default to ul
        const nestedListType = nestedCell.dataset.nestedListType === 'ordered' ? 'ol' : 'ul';
        const nestedList = document.createElement(nestedListType);
        
        // Split nested content by lines and create list items
        nestedContent.split('\n').forEach((nestedItem) => {
          const trimmedItem = nestedItem.trim();
          if (trimmedItem) {
            const nestedLi = document.createElement('li');
            nestedLi.textContent = trimmedItem;
            nestedList.appendChild(nestedLi);
          }
        });
        
        // Only append nested list if it has items
        if (nestedList.children.length > 0) {
          li.appendChild(nestedList);
        }
      }
    }

    // Only append list item if it has content
    if (li.textContent.trim() || li.children.length > 0) {
      rootList.appendChild(li);
    }
  });

  // Replace block content with the generated list
  block.textContent = '';
  block.appendChild(rootList);
}
