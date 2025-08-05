export default function decorate(block) {
  const listStack = []; // Stack to keep track of nested lists
  let currentList = null;
  let currentListType = null;
  let currentLevel = -1;

  // Process each row in the block (each row represents a list item from authoring)
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    
    // Extract values from authoring screen input
    // cells[0] = Content, cells[1] = Type, cells[2] = Level
    if (cells.length >= 3) {
      const content = cells[0].textContent.trim(); // Get content from authoring
      const type = cells[1].textContent.trim();    // Get list type (ul/ol) from authoring
      const level = parseInt(cells[2].textContent.trim(), 10) || 0; // Get nest level from authoring

      // Skip empty content
      if (!content) return;

      // Handle level changes for nested structure
      if (level > currentLevel) {
        // Going deeper - create nested list
        if (currentList && listStack.length > 0 && level > 0) {
          const lastLi = currentList.lastElementChild;
          if (lastLi) {
            const nestedList = document.createElement(type);
            lastLi.appendChild(nestedList);
            listStack.push(nestedList);
            currentList = nestedList;
          }
        } else if (level === 0) {
          // Top level list
          currentList = document.createElement(type);
          listStack.push(currentList);
          block.appendChild(currentList);
        }
        currentListType = type;
        currentLevel = level;
      } else if (level < currentLevel) {
        // Going back up - pop from stack
        while (listStack.length > level + 1) {
          listStack.pop();
        }
        
        if (listStack.length > level) {
          currentList = listStack[level];
          currentLevel = level;
          
          // Check if we need to change list type at this level
          if (currentList && currentList.tagName.toLowerCase() !== type) {
            // Remove current list from stack and create new one
            listStack.splice(level, 1);
            const newList = document.createElement(type);
            listStack.splice(level, 0, newList);
            currentList = newList;
            
            if (level === 0) {
              block.appendChild(currentList);
            } else if (level > 0 && listStack[level - 1]) {
              const parentList = listStack[level - 1];
              const lastLi = parentList.lastElementChild;
              if (lastLi) {
                lastLi.appendChild(currentList);
              }
            }
          }
          currentListType = type;
        }
      } else if (level === currentLevel && currentListType !== type) {
        // Same level but different type - create new list
        if (level === 0) {
          currentList = document.createElement(type);
          listStack[0] = currentList;
          block.appendChild(currentList);
        } else if (level > 0 && listStack[level - 1]) {
          const newList = document.createElement(type);
          listStack[level] = newList;
          currentList = newList;
          const parentList = listStack[level - 1];
          const lastLi = parentList.lastElementChild;
          if (lastLi) {
            lastLi.appendChild(currentList);
          }
        }
        currentListType = type;
      }

      // Create and add list item with content from authoring
      if (currentList) {
        const li = document.createElement('li');
        li.textContent = content; // Use content from authoring screen
        currentList.appendChild(li);
      }
    }
  });

  // Clear the original table structure but keep the generated lists
  const lists = [...block.querySelectorAll('ul, ol')];
  block.textContent = '';
  lists.forEach((list) => block.appendChild(list));
}
