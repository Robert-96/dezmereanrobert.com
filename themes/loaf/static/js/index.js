'use strict'

function updateExternalLinks() {
  const anchors = document.querySelectorAll('a');

  anchors.forEach((anchor) => {
    const regex = new RegExp('/' + window.location.host + '/');

    if(!regex.test(anchor.href)) {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener');
    }
  });
};

window.addEventListener('load', function() {
  updateExternalLinks();
});