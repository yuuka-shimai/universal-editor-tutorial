// tabs.js

export default function decorate(block) {
  const tabsWrapper = document.createElement('div');
  tabsWrapper.className = 'tabs';

  const tabList = document.createElement('ul');
  tabList.className = 'tab-list';

  const tabPanels = document.createElement('div');
  tabPanels.className = 'tab-panels';

  const tabs = [...block.children];
  tabs.forEach((tabEl, index) => {
    const tabLabel = tabEl.querySelector('div:nth-child(1)')?.textContent.trim() || `Tab ${index + 1}`;
    const tabContent = tabEl.querySelector('div:nth-child(2)')?.innerHTML || '';

    const tabId = `tab-${index}`;
    const panelId = `panel-${index}`;

    const tab = document.createElement('li');
    tab.className = 'tab';
    tab.innerHTML = `<button role="tab" id="${tabId}" aria-controls="${panelId}" aria-selected="${index === 0}">${tabLabel}</button>`;
    tabList.appendChild(tab);

    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.innerHTML = tabContent;
    if (index !== 0) panel.hidden = true;
    tabPanels.appendChild(panel);
  });

  tabsWrapper.append(tabList, tabPanels);
  block.replaceChildren(tabsWrapper);

  const buttons = tabList.querySelectorAll('button[role="tab"]');
  const panels = tabPanels.querySelectorAll('.tab-panel');

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => {
        p.hidden = true;
      });

      btn.setAttribute('aria-selected', 'true');
      panels[i].hidden = false;
    });
  });
}
