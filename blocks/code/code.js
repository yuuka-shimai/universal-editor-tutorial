export default function decorate(block) {
  const [codeWrapper] = block.children;

  const pre = document.createElement('pre');
  const code = document.createElement('code');

  code.textContent = codeWrapper.textContent.trim();

  pre.appendChild(code);
  codeWrapper.replaceChildren(pre);
}
