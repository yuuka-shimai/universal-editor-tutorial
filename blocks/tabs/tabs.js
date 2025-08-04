// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  // タブリストコンテナ作成
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabBlocks = [...block.children]; // 各 <div> タブブロック
  const panels = [];

  tabBlocks.forEach((tabBlock, i) => {
    const [labelWrapper, contentWrapper] = [...tabBlock.children];
    const labelEl = labelWrapper?.querySelector('div, p') || labelWrapper;
    const contentEl = contentWrapper || tabBlock;

    const labelText = labelEl?.textContent?.trim() || `Tab ${i + 1}`;
    const id = toClassName(labelText);

    // タブボタン作成
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = labelEl?.innerHTML || labelText;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    // クリックイベント
    button.addEventListener('click', () => {
      block.querySelectorAll('.tabs-panel').forEach((panel) =>
        panel.setAttribute('aria-hidden', 'true')
      );
      tablist.querySelectorAll('.tabs-tab').forEach((btn) =>
        btn.setAttribute('aria-selected', 'false')
      );
      panel.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-selected', 'true');
    });

    tablist.appendChild(button);

    // タブパネル作成
    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('aria-hidden', !!i);
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('role', 'tabpanel');

    const innerWrapper = document.createElement('div');
    while (contentEl.firstChild) {
      innerWrapper.appendChild(contentEl.firstChild);
    }

    panel.appendChild(innerWrapper);
    panels.push(panel);
  });

  // DOMに追加
  block.innerHTML = '';
  block.appendChild(tablist);
  panels.forEach((p) => block.appendChild(p));
}
