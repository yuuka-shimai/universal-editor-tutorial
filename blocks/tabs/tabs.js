// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Extracts tab data from Universal Editor structure
 * @param {Element} tabBlock - The tab block element
 * @returns {Object} Tab data with label and content
 */
function extractTabData(tabBlock) {
  // Check for Universal Editor structure (tablabel and tabtext)
  const tablabelEl = tabBlock.querySelector('[data-aue-prop="tablabel"]');
  const tabtextEl = tabBlock.querySelector('[data-aue-prop="tabtext"]');

  if (tablabelEl && tabtextEl) {
    return {
      label: tablabelEl.textContent?.trim() || 'Tab',
      content: tabtextEl,
      isUniversalEditor: true,
    };
  }

  // Fallback to traditional structure
  const [labelWrapper, contentWrapper] = [...tabBlock.children];
  const labelEl = labelWrapper?.querySelector('div, p') || labelWrapper;
  const contentEl = contentWrapper || tabBlock;

  return {
    label: labelEl?.textContent?.trim() || 'Tab',
    content: contentEl,
    isUniversalEditor: false,
  };
}

/**
 * Creates a tab button element
 * @param {string} label - Tab label text
 * @param {string} id - Tab identifier
 * @param {boolean} isActive - Whether this tab is active
 * @param {Element} originalElement - Original element for instrumentation
 * @returns {Element} Tab button element
 */
function createTabButton(label, id, isActive, originalElement) {
  const button = document.createElement('button');
  button.className = 'tabs-tab';
  button.id = `tab-${id}`;
  button.textContent = label;
  button.setAttribute('aria-controls', `tabpanel-${id}`);
  button.setAttribute('aria-selected', isActive);
  button.setAttribute('role', 'tab');
  button.setAttribute('type', 'button');

  // Move Universal Editor instrumentation to the button
  if (originalElement) {
    moveInstrumentation(originalElement, button);
  }

  return button;
}

/**
 * Creates a tab panel element
 * @param {string} id - Tab identifier
 * @param {boolean} isActive - Whether this tab is active
 * @param {Element} contentEl - Content element
 * @param {boolean} isUniversalEditor - Whether using Universal Editor structure
 * @returns {Element} Tab panel element
 */
function createTabPanel(id, isActive, contentEl, isUniversalEditor) {
  const panel = document.createElement('div');
  panel.className = 'tabs-panel';
  panel.id = `tabpanel-${id}`;
  panel.setAttribute('aria-hidden', !isActive);
  panel.setAttribute('aria-labelledby', `tab-${id}`);
  panel.setAttribute('role', 'tabpanel');

  const innerWrapper = document.createElement('div');

  if (isUniversalEditor) {
    // For Universal Editor, clone the content to preserve instrumentation
    innerWrapper.appendChild(contentEl.cloneNode(true));
  } else {
    // For traditional structure, move all children
    while (contentEl.firstChild) {
      innerWrapper.appendChild(contentEl.firstChild);
    }
  }

  panel.appendChild(innerWrapper);
  return panel;
}

/**
 * Handles tab switching
 * @param {Element} block - The tabs block element
 * @param {Element} activeButton - The button that was clicked
 * @param {Element} activePanel - The panel to show
 */
function switchTab(block, activeButton, activePanel) {
  // Hide all panels and deactivate all buttons
  block.querySelectorAll('.tabs-panel').forEach((panel) => {
    panel.setAttribute('aria-hidden', 'true');
  });

  block.querySelectorAll('.tabs-tab').forEach((button) => {
    button.setAttribute('aria-selected', 'false');
  });

  // Show active panel and activate button
  activePanel.setAttribute('aria-hidden', 'false');
  activeButton.setAttribute('aria-selected', 'true');

  // Dispatch custom event for analytics or other integrations
  block.dispatchEvent(new CustomEvent('tabchange', {
    detail: {
      activeTab: activeButton.id,
      activePanel: activePanel.id,
    },
  }));
}

/**
 * Adds keyboard navigation support
 * @param {Element} tablist - The tablist element
 */
function addKeyboardNavigation(tablist) {
  tablist.addEventListener('keydown', (e) => {
    const buttons = [...tablist.querySelectorAll('.tabs-tab')];
    const currentIndex = buttons.findIndex((button) => button === e.target);

    let nextIndex;
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
        break;
      case 'Home':
        e.preventDefault();
        buttons[0].focus();
        buttons[0].click();
        break;
      case 'End':
        e.preventDefault();
        buttons[buttons.length - 1].focus();
        buttons[buttons.length - 1].click();
        break;
      default:
        break;
    }
  });
}

export default async function decorate(block) {
  // Create the tablist container
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabBlocks = [...block.children];
  const panels = [];
  const buttons = [];

  // Process each tab block
  tabBlocks.forEach((tabBlock, index) => {
    const tabData = extractTabData(tabBlock);
    const id = toClassName(tabData.label) || `tab-${index + 1}`;
    const isActive = index === 0;

    // Create tab button
    const button = createTabButton(
      tabData.label,
      id,
      isActive,
      tabData.isUniversalEditor ? tabBlock.querySelector('[data-aue-prop="tablabel"]') : null,
    );

    // Create tab panel
    const panel = createTabPanel(id, isActive, tabData.content, tabData.isUniversalEditor);

    // Add click handler
    button.addEventListener('click', () => {
      switchTab(block, button, panel);
    });

    buttons.push(button);
    panels.push(panel);
    tablist.appendChild(button);
  });

  // Add keyboard navigation
  addKeyboardNavigation(tablist);

  // Clear the block and rebuild with new structure
  block.innerHTML = '';
  block.appendChild(tablist);
  panels.forEach((panel) => {
    block.appendChild(panel);
  });

  // Set initial focus management
  const firstButton = buttons[0];
  if (firstButton) {
    firstButton.setAttribute('tabindex', '0');
    buttons.slice(1).forEach((button) => {
      button.setAttribute('tabindex', '-1');
    });
  }

  // Update tabindex on tab changes
  block.addEventListener('tabchange', (e) => {
    buttons.forEach((button) => {
      button.setAttribute('tabindex', button.id === e.detail.activeTab ? '0' : '-1');
    });
  });
}
