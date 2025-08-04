export default function decorate(block) {
  // データ属性またはedsの渡し方によって取得方法が異なる場合があります
  const placeholder = block.dataset.placeholder || 'Search...';

  const wrapper = document.createElement('div');
  wrapper.className = 'search-block-wrapper';

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'search-input';
  input.placeholder = placeholder;

  // 必要に応じて検索ボタン等も追加できます
  // const button = document.createElement('button');
  // button.innerText = '検索';

  wrapper.appendChild(input);
  // wrapper.appendChild(button);

  block.innerHTML = '';
  block.appendChild(wrapper);
}