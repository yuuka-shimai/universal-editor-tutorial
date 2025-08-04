export default function decorate(block) {
  // Create the wrapper div with class
  const wrapper = document.createElement('div');
  wrapper.className = 'default-content-wrapper';

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
          wrapper.appendChild(currentList);
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
    wrapper.appendChild(currentList);
  }

  // Clear the block and append the wrapper
  block.textContent = '';
  block.appendChild(wrapper);
}
