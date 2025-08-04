export default function decorate(block) {
  // Create the wrapper div with class
  const wrapper = document.createElement('div');
  wrapper.className = 'default-content-wrapper';

  const listStack = []; // Stack to keep track of nested lists
  let currentList = null;
  let currentListType = null;
  let currentLevel = -1;

  // Process each row in the block
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 3) {
      const content = cells[0].textContent.trim();
      const type = cells[1].textContent.trim();
      const level = parseInt(cells[2].textContent.trim(), 10) || 0;

      // Handle level changes
      if (level > currentLevel) {
        // Going deeper - create nested list
        if (currentList && listStack.length > 0) {
          const lastLi = listStack[listStack.length - 1].lastElementChild;
          const nestedList = document.createElement(type);
          lastLi.appendChild(nestedList);
          listStack.push(nestedList);
          currentList = nestedList;
        } else if (level === 0) {
          // Top level list
          currentList = document.createElement(type);
          listStack.push(currentList);
        }
        currentListType = type;
        currentLevel = level;
      } else if (level < currentLevel) {
        // Going back up - pop from stack
        while (listStack.length > level + 1) {
          listStack.pop();
        }
        currentList = listStack[listStack.length - 1];
        currentLevel = level;
        
        // Check if we need to change list type at this level
        if (currentList.tagName.toLowerCase() !== type) {
          listStack.pop();
          currentList = document.createElement(type);
          listStack.push(currentList);
          if (level === 0) {
            wrapper.appendChild(currentList);
          } else {
            const parentList = listStack[listStack.length - 2];
            const lastLi = parentList.lastElementChild;
            lastLi.appendChild(currentList);
          }
        }
        currentListType = type;
      } else if (level === currentLevel && currentListType !== type) {
        // Same level but different type - create new list
        if (level === 0) {
          currentList = document.createElement(type);
          listStack[0] = currentList;
          wrapper.appendChild(currentList);
        } else {
          listStack.pop();
          currentList = document.createElement(type);
          listStack.push(currentList);
          const parentList = listStack[listStack.length - 2];
          const lastLi = parentList.lastElementChild;
          lastLi.appendChild(currentList);
        }
        currentListType = type;
      }

      // Add top-level lists to wrapper
      if (level === 0 && !wrapper.contains(currentList)) {
        wrapper.appendChild(currentList);
      }

      // Create list item
      const li = document.createElement('li');
      li.textContent = content;
      currentList.appendChild(li);
    }
  });

  // Clear the block and append the wrapper
  block.textContent = '';
  block.appendChild(wrapper);
}
