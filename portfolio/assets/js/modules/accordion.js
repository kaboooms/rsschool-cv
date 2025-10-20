export const initAccordionHandler = () => {
    document.querySelectorAll('.accordion').forEach((accordion) => {
        accordion.querySelector('.accordion__title').addEventListener('click', () => {
            const expanded = accordion.getAttribute('aria-expanded') === 'true';
            accordion.setAttribute('aria-expanded', !expanded);
            console.log(accordion);
        })
    });
}