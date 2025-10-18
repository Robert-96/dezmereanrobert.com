document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('scroll-to-top-button');
  const wrapper = document.getElementById('scroll-to-top-wrapper');

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY < 50) {
      wrapper.classList.add('md:hidden')
    } else {
      wrapper.classList.remove('md:hidden')
    }
  });
});
