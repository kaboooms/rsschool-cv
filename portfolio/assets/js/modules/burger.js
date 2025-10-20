export const initBurgerHandler = () => {
    let burger = document.querySelector('.hamburger__menu');

    document.querySelector('#hamburger').addEventListener('click', () => {
        const expanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', !expanded);

        burger.classList.toggle('active')

        document.body.classList.toggle('no-scroll', !expanded);
    })

    document.querySelectorAll('.hamburger-menu__item').forEach((item) => {
        item.addEventListener('click', () => {
            const expanded = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', !expanded);

            burger.classList.toggle('active')

            document.body.classList.toggle('no-scroll', !expanded);
        })
    })
}