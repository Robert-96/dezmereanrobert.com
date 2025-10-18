import AnchorJS from 'anchor-js';

const anchors = new AnchorJS();
anchors.options.placement = 'right';
anchors.options.icon = '#';
anchors.options.class = 'no-underline';

function updateExternalLinks() {
  const anchors = document.querySelectorAll('a');
  const regex = new RegExp(`/${window.location.host}/`, 'i');

  anchors.forEach((anchor) => {
    if (!regex.test(anchor.href)) {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateExternalLinks();
  anchors.add('.prose h2, .prose h3, .prose h4, .prose h5, .prose h6, .prose h7, .prose h8');
});
