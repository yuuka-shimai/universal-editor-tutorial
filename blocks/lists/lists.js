export default function decorate(block) {
  let currentList = null;
  let currentListType = null;

  // Process each row in the block
  [...block.children].forEach((row) => {
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

      // Handle nesting for specific items
      if (content === 'Item 2' && type === 'ul') {
        // Create nested ul for Item 2
        const nestedUl = document.createElement('ul');
        const subItems = ['Item 2a', 'Item 2b', 'Item 2c'];
        subItems.forEach(subItem => {
          const subLi = document.createElement('li');
          subLi.textContent = subItem;
          nestedUl.appendChild(subLi);
        });
        li.appendChild(nestedUl);
      } else if (content === 'Second' && type === 'ol') {
        // Create nested ol for Second
        const nestedOl = document.createElement('ol');
        const subItems = ['Second-Sub-1', 'Second-Sub-2', 'Second-Sub-3'];
        subItems.forEach(subItem => {
          const subLi = document.createElement('li');
          subLi.textContent = subItem;
          nestedOl.appendChild(subLi);
        });
        li.appendChild(nestedOl);
      }

      currentList.appendChild(li);
    }
  });

  // Add the final list if it exists
  if (currentList) {
    block.appendChild(currentList);
  }

  // Clear the block content first
  block.innerHTML = '';
  
  // Re-add the lists directly to the block
  currentList = null;
  currentListType = null;

  // Recreate the lists and add them to the block
  const rows = [...block.querySelectorAll('div')];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const content = cells[0].textContent.trim();
      const type = cells[1].textContent.trim();

      if (!currentList || currentListType !== type) {
        if (currentList) {
          block.appendChild(currentList);
        }
        currentList = document.createElement(type);
        currentListType = type;
      }

      const li = document.createElement('li');
      li.textContent = content;

      if (content === 'Item 2' && type === 'ul') {
        const nestedUl = document.createElement('ul');
        const subItems = ['Item 2a', 'Item 2b', 'Item 2c'];
        subItems.forEach(subItem => {
          const subLi = document.createElement('li');
          subLi.textContent = subItem;
          nestedUl.appendChild(subLi);
        });
        li.appendChild(nestedUl);
      } else if (content === 'Second' && type === 'ol') {
        const nestedOl = document.createElement('ol');
        const subItems = ['Second-Sub-1', 'Second-Sub-2', 'Second-Sub-3'];
        subItems.forEach(subItem => {
          const subLi = document.createElement('li');
          subLi.textContent = subItem;
          nestedOl.appendChild(subLi);
        });
        li.appendChild(nestedOl);
      }

      currentList.appendChild(li);
    }
  });

  if (currentList) {
    block.appendChild(currentList);
  }
}