export default function decorate(block) {
  // Create the wrapper div with class
  const wrapper = document.createElement('div');
  wrapper.className = 'default-content-wrapper';

  // Create the unordered list structure
  const ul = document.createElement('ul');

  // Item 1
  const li1 = document.createElement('li');
  li1.textContent = 'Item 1';
  ul.appendChild(li1);

  // Item 2 with nested list
  const li2 = document.createElement('li');
  li2.textContent = 'Item 2';

  // Nested unordered list for Item 2
  const nestedUl = document.createElement('ul');

  const li2a = document.createElement('li');
  li2a.textContent = 'Item 2a';
  nestedUl.appendChild(li2a);

  const li2b = document.createElement('li');
  li2b.textContent = 'Item 2b';
  nestedUl.appendChild(li2b);

  const li2c = document.createElement('li');
  li2c.textContent = 'Item 2c';
  nestedUl.appendChild(li2c);

  li2.appendChild(nestedUl);
  ul.appendChild(li2);

  // Item 3
  const li3 = document.createElement('li');
  li3.textContent = 'Item 3';
  ul.appendChild(li3);

  // Add the unordered list to wrapper
  wrapper.appendChild(ul);

  // Create the ordered list structure
  const ol = document.createElement('ol');

  // First
  const oli1 = document.createElement('li');
  oli1.textContent = 'First';
  ol.appendChild(oli1);

  // Second with nested ordered list
  const oli2 = document.createElement('li');
  oli2.textContent = 'Second';

  // Nested ordered list for Second
  const nestedOl = document.createElement('ol');

  const oli2a = document.createElement('li');
  oli2a.textContent = 'Second-Sub-1';
  nestedOl.appendChild(oli2a);

  const oli2b = document.createElement('li');
  oli2b.textContent = 'Second-Sub-2';
  nestedOl.appendChild(oli2b);

  const oli2c = document.createElement('li');
  oli2c.textContent = 'Second-Sub-3';
  nestedOl.appendChild(oli2c);

  oli2.appendChild(nestedOl);
  ol.appendChild(oli2);

  // Third
  const oli3 = document.createElement('li');
  oli3.textContent = 'Third';
  ol.appendChild(oli3);

  // Fourth
  const oli4 = document.createElement('li');
  oli4.textContent = 'Fourth';
  ol.appendChild(oli4);

  // Add the ordered list to wrapper
  wrapper.appendChild(ol);

  // Clear the block and append the wrapper
  block.textContent = '';
  block.appendChild(wrapper);
}
