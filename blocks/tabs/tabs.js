// tabs.js
export default function decorate(block) {
  const isWrapperAlready = block.classList.contains('tabs-wrapper');
  const tabsWrapper = isWrapperAlready ? block : document.createElement('div');
  if (!isWrapperAlready) {
    tabsWrapper.className = 'tabs-wrapper';
  }

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs block';
  tabsContainer.dataset.blockName = 'tabs';
  tabsContainer.dataset.blockStatus = 'loaded';

  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');

  const panelElements = [];
  const tabItems = [...block.children];

  tabItems.forEach((tabEl, index) => {
    const tabLabel = tabEl.querySelector(':scope > div:nth-child(1)')?.textContent.trim() || `Tab ${index + 1}`;
    const tabContent = tabEl.querySelector(':scope > div:nth-child(2)')?.innerHTML || '';

    const tabId = `tab-${index}`;
    const panelId = `tabpanel-${index}`;

    const tabButton = document.createElement('button');
    tabButton.className = 'tabs-tab';
    tabButton.id = tabId;
    tabButton.setAttribute('aria-controls', panelId);
    tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('type', 'button');
    tabButton.textContent = tabLabel;
    tabList.appendChild(tabButton);

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.id = panelId;
    panel.setAttribute('aria-labelledby', tabId);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    panel.innerHTML = tabContent;
    panelElements.push(panel);
  });

  tabsContainer.append(tabList, ...panelElements);

  const buttons = tabList.querySelectorAll('.tabs-tab');
  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.setAttribute('aria-selected', 'false'));
      panelElements.forEach((p) => p.setAttribute('aria-hidden', 'true'));

      btn.setAttribute('aria-selected', 'true');
      panelElements[i].setAttribute('aria-hidden', 'false');
    });
  });

  if (!isWrapperAlready) {
    tabsWrapper.appendChild(tabsContainer);
    block.replaceWith(tabsWrapper);
  } else {
    block.innerHTML = '';
    block.appendChild(tabsContainer);
  }
}
