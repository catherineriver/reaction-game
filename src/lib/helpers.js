export default (hash, element) => {
  if (window.location.hash === hash) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const offset = rect.top || 0;
        const height = rect.height || 0;
        window.scrollTo(0, window.pageYOffset + offset - window.innerHeight / 2 + height / 2);
      }, 550);
    });
    document.querySelector('body').classList.add('is-blured-reaction-test');
  }

  const removeBlur = () => {
    element.removeEventListener('click', removeBlur);
    document.querySelector('body').classList.remove('is-blured-reaction-test');
  };

  element.addEventListener('click', removeBlur);
};
