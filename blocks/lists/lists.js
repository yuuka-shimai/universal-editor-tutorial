export default function decorate(block) {
  const listType = block.dataset.listType === 'ordered' ? 'ol' : 'ul';
  const rootList = document.createElement(listType);

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // 各セルをチェックしてネストされたリストをサポート
    const cells = [...row.children];

    if (cells.length === 0) return;

    // 最初のセルはメインのリストアイテム
    li.textContent = cells[0].textContent;

    // 2列目以降があればネストされたリストとして扱う
    if (cells.length > 1) {
      const nestedListType = cells[1].dataset.nestedListType === 'ordered' ? 'ol' : 'ul';
      const nestedList = document.createElement(nestedListType);
      cells[1].innerText.split('\n').forEach((nestedItem) => {
        if (nestedItem.trim()) {
          const nestedLi = document.createElement('li');
          nestedLi.textContent = nestedItem.trim();
          nestedList.appendChild(nestedLi);
        }
      });
      li.appendChild(nestedList);
    }

    rootList.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(rootList);
}
