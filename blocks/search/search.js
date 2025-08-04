import {
  createOptimizedPicture,
  decorateIcons,
} from '../../scripts/aem.js';

const searchParams = new URLSearchParams(window.location.search);

function clearSearchResults(block) {
  const searchResults = block.querySelector('.search-results');
  if (searchResults) searchResults.innerHTML = '';
}

function clearSearch(block) {
  clearSearchResults(block);
  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());
  }
}

function highlightTerms(text, terms) {
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;

  const lowerText = text.toLowerCase();
  const matches = terms.flatMap((term) => {
    const result = [];
    let idx = lowerText.indexOf(term);
    while (idx !== -1) {
      result.push({ start: idx, end: idx + term.length });
      idx = lowerText.indexOf(term, idx + term.length);
    }
    return result;
  });

  matches.sort((a, b) => a.start - b.start);

  matches.forEach(({ start, end }) => {
    if (start > lastIndex) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
    }
    const mark = document.createElement('mark');
    mark.textContent = text.slice(start, end);
    fragment.appendChild(mark);
    lastIndex = end;
  });

  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  return fragment;
}

function renderResult(result, searchTerms) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = result.path;

  if (result.image) {
    const wrapper = document.createElement('div');
    wrapper.className = 'search-result-image';
    const pic = createOptimizedPicture(result.image, '', false, [{ width: '375' }]);
    wrapper.append(pic);
    a.append(wrapper);
  }

  if (result.title) {
    const title = document.createElement('p');
    title.className = 'search-result-title';
    title.append(highlightTerms(result.title, searchTerms));
    a.append(title);
  }

  if (result.description) {
    const desc = document.createElement('p');
    desc.className = 'search-result-description';
    desc.append(highlightTerms(result.description, searchTerms));
    a.append(desc);
  }

  li.append(a);
  return li;
}

async function fetchData(source) {
  try {
    const resp = await fetch(source);
    const json = await resp.json();
    return json.data || [];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch data', e);
    return [];
  }
}

function filterData(terms, data) {
  return data.filter((item) => {
    const content = `${item.title} ${item.description} ${item.path}`.toLowerCase();
    return terms.every((term) => content.includes(term));
  });
}

async function handleSearch(e, block, config) {
  const searchValue = e.target.value;
  if (searchValue.length < 3) {
    clearSearch(block);
    return;
  }

  searchParams.set('q', searchValue);
  const url = new URL(window.location.href);
  url.search = searchParams.toString();
  window.history.replaceState({}, '', url.toString());

  const terms = searchValue.toLowerCase().split(/\s+/).filter(Boolean);
  const data = await fetchData(config.source);
  const filtered = filterData(terms, data);

  const results = block.querySelector('.search-results');
  results.innerHTML = '';

  if (filtered.length === 0) {
    const li = document.createElement('li');
    results.classList.add('no-results');
    li.textContent = 'No results found.';
    results.append(li);
    return;
  }

  filtered.forEach((result) => {
    const li = renderResult(result, terms);
    results.append(li);
  });
}

export default function decorate(block) {
  const [searchWrapper] = block.children;
  searchWrapper.className = 'search-box';

  // プレースホルダー文字列を取得
  const placeholder = searchWrapper.textContent.trim() || 'Search...';

  // 検索アイコン
  const icon = document.createElement('span');
  icon.className = 'icon icon-search';

  // 検索入力フィールド
  const input = document.createElement('input');
  input.setAttribute('type', 'search');
  input.className = 'search-input';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder);

  // イベント追加
  input.addEventListener('input', (e) => handleSearch(e, block, { source: '/query-index.json' }));
  input.addEventListener('keyup', (e) => { if (e.code === 'Escape') clearSearch(block); });

  // 初期値対応
  if (searchParams.get('q')) {
    input.value = searchParams.get('q');
    input.dispatchEvent(new Event('input'));
  }

  // DOM構築
  searchWrapper.replaceChildren(icon, input);
  const resultList = document.createElement('ul');
  resultList.className = 'search-results';
  block.append(resultList);

  decorateIcons(block);
}
