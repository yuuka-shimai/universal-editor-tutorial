// tabs.js

import { decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const tabsWrapper = document.createElement('div');
  tabsWrapper.className = 'tabs-wrapper';

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs block';
  tabsContainer.dataset.blockName = 'tabs';
  tabsContainer.dataset.blockStatus = 'loaded';
  tabsContainer.setAttribute('data-aue-resource', block.getAttribute('data-aue-resource') || '');
  tabsContainer.setAttribute('data-aue-type', 'component');
  tabsContainer.setAttribute('data-aue-behavior', 'component');
  tabsContainer.setAttribute('data-aue-model', 'tabs');
  tabsContainer.setAttribute('data-aue-label', 'Tabs');

  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');

  const tabItems = [...block.children];
  const panelElements = [];

  tabItems.forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    const tabLabel = li.querySelector('[data-name="tab"]')?.textContent.trim() || `Tab ${index + 1}`;
    const tabContent = li.querySelector('[data-name="tabText"]')?.innerHTML || '';

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
  tabsWrapper.appendChild(tabsContainer);
  block.replaceWith(tabsWrapper);

  const buttons = tabList.querySelectorAll('.tabs-tab');
  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.setAttribute('aria-selected', 'false'));
      panelElements.forEach((p) => p.setAttribute('aria-hidden', 'true'));

      btn.setAttribute('aria-selected', 'true');
      panelElements[i].setAttribute('aria-hidden', 'false');
    });
  });

  decorateIcons(tabsWrapper);
}
