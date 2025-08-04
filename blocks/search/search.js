import { readBlockConfig } from '../../scripts/aem.js';

export default function decorate(block) {
  const config = readBlockConfig(block);
  console.log('[Block Config]', config); // { placeholder: '検索してください' }

  const placeholder = config.placeholder || 'Search.....';

  const wrapper = document.createElement('div');
  wrapper.className = 'search-block-wrapper';

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'search-input';
  input.placeholder = placeholder;

  wrapper.appendChild(input);
  block.innerHTML = '';
  block.appendChild(wrapper);
}
