export default function decorate(block) {
  // Store the original rows data
  const rows = [...block.children];
  const listStack = []; // Stack to keep track of nested lists
  let currentLevel = -1;

  // Clear the block content
  block.innerHTML = '';

  // Process each row in the block
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 3) {
      const content = cells[0].textContent.trim();
      const type = cells[1].textContent.trim();
      const level = parseInt(cells[2].textContent.trim(), 10) || 0;

      // Handle level changes
      if (level > currentLevel) {
        // Going deeper - create nested list
        const newList = document.createElement(type);
        
        if (level === 0) {
          // Top level list
          block.appendChild(newList);
        } else if (listStack.length > 0) {
          // Nested list - attach to last item of parent list
          const parentList = listStack[listStack.length - 1];
          const lastItem = parentList.lastElementChild;
          if (lastItem) {
            lastItem.appendChild(newList);
          }
        }
        
        listStack.push(newList);
        currentLevel = level;
      } else if (level < currentLevel) {
        // Going back up - pop from stack
        while (listStack.length > level + 1) {
          listStack.pop();
        }
        currentLevel = level;
        
        // Check if we need a new list at this level
        const currentList = listStack[listStack.length - 1];
        if (!currentList || currentList.tagName.toLowerCase() !== type) {
          const newList = document.createElement(type);
          
          if (level === 0) {
            block.appendChild(newList);
          } else if (listStack.length > 1) {
            const parentList = listStack[listStack.length - 2];
            const lastItem = parentList.lastElementChild;
            if (lastItem) {
              lastItem.appendChild(newList);
            }
          }
          
          listStack[listStack.length - 1] = newList;
        }
      } else if (level === currentLevel) {
        // Same level - check if we need a new list type
        const currentList = listStack[listStack.length - 1];
        if (!currentList || currentList.tagName.toLowerCase() !== type) {
          const newList = document.createElement(type);
          
          if (level === 0) {
            block.appendChild(newList);
          } else if (listStack.length > 1) {
            const parentList = listStack[listStack.length - 2];
            const lastItem = parentList.lastElementChild;
            if (lastItem) {
              lastItem.appendChild(newList);
            }
          }
          
          listStack[listStack.length - 1] = newList;
        }
      }

      // Create list item and add to current list
      const li = document.createElement('li');
      li.textContent = content;
      
      const currentList = listStack[listStack.length - 1];
      if (currentList) {
        currentList.appendChild(li);
      }
    }
  });
}