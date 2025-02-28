export class MenuLinkUtils {
  static activeLink(details, links, url) {

    links.forEach(link => {
      const href = link.getAttribute('href');

      if (href === url) {
        link.classList.add('active-link');

        // Открываем только тот details, который содержит активную ссылку используя метод closest
        const parentDetails = link.closest("details");
        if (parentDetails) {
          parentDetails.setAttribute('open', 'open');
        }
      } else {
        link.classList.remove('active-link');
      }
    });
  }
}