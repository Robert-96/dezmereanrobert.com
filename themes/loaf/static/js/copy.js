'use strict'

const clipboard_icon_svg = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>';
const checked_clipboard_svg = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>';

function createCopyButton(content) {
  const button = document.createElement('button');
  button.innerHTML = clipboard_icon_svg;
  button.classList.add('hidden', 'copy-button')

  let timeoutId = null;

  button.addEventListener('click', function () {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    navigator.clipboard.writeText(content);

    button.innerHTML = checked_clipboard_svg;
    button.classList.add('checked-copy-button');

    timeoutId = setTimeout(() => {
      button.innerHTML = clipboard_icon_svg;
      button.classList.remove('checked-copy-button');
    }, 1000);
  });

  return button;
}

document.addEventListener('DOMContentLoaded', function() {
  let elements = document.querySelectorAll('.prose pre');
  for (const element of elements) {
    const content = element.textContent;

    let button = createCopyButton(content);
    element.appendChild(button);

    element.classList.add('relative');

    element.addEventListener('mouseenter', function () {
      button.classList.remove('hidden');
    });
    element.addEventListener('mouseleave', function () {
      button.classList.add('hidden');
    });
  }
});
