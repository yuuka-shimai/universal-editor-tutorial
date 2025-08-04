// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [...block.children];

  tabs.forEach((tab, i) => {
    const tabLabelEl = tab.querySelector(':scope > div > p'); // Tab Label を取得（構造により調整可）
    const tabTextEl = tab.querySelector(':scope > div + div'); // Tab Text を含むパネル部分

    const labelText = tabLabelEl?.textContent?.trim() || `Tab ${i + 1}`;
    const id = toClassName(labelText) || `tab${i + 1}`;

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tabLabelEl?.innerHTML || labelText;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    // set panel attributes
    tabTextEl.classList.add('tabs-panel');
    tabTextEl.id = `tabpanel-${id}`;
    tabTextEl.setAttribute('aria-hidden', !!i);
    tabTextEl.setAttribute('aria-labelledby', `tab-${id}`);
    tabTextEl.setAttribute('role', 'tabpanel');

    // click behavior
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabTextEl.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.appendChild(button);
    tabLabelEl.remove(); // 元のラベル削除（重複防止）
  });

  block.prepend(tablist);
}
