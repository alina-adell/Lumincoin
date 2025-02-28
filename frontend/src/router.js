import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Logout} from "./components/auth/logout.js";
import {Main} from "./components/main.js";
import config from "./config/config.js";
import {HttpService} from "./services/http-service.js";
import {AuthUtils} from "./utils/auth-utils.js";
import {Revenue} from "./components/revenues/revenues.js";
import {RevenueAdd} from "./components/revenues/revenue-add.js";
import {RevenueEdit} from "./components/revenues/revenue-edit.js";
import {Expenses} from "./components/expenses/expenses.js";
import {ExpenseAdd} from "./components/expenses/expense-add.js";
import {ExpenseEdit} from "./components/expenses/expense-edit.js";
import {AllFinance} from "./components/all-finance/all-finance.js";
import {AllFinanceEdit} from "./components/all-finance/all-finance-edit.js";
import {AllFinanceAdd} from "./components/all-finance/all-finance-add.js";

export class Router {
  constructor() {
    this.contentPageElement = document.getElementById('content');

    this.routes = [
      {
        route: '#/signup',
        title: 'Регистрация',
        template: '/templates/signup.html',
        layout: false,
        load: () => {
          new SignUp();
        }
      },
      {
        route: '#/login',
        title: 'Вход',
        template: '/templates/login.html',
        layout: false,
        load: () => {
          new Login();
        }
      },
      {
        route: '#/logout',
        load: () => {
          new Logout();
        }
      },
      {
        route: '#/main',
        title: 'Главная',
        template: '/templates/main.html',
        layout: '/templates/layout.html',
        styles: ['/styles/main.css'],
        load: () => {
          new Main();
        }
      },
      {
        route: '#/revenues',
        title: 'Доходы',
        template: '/templates/revenues/revenues.html',
        layout: '/templates/layout.html',
        styles: ['/styles/revenues/revenues.css'],
        load: () => {
          new Revenue();
        }
      },
      {
        route: '#/revenue-add',
        title: 'Создание дохода',
        template: '/templates/revenues/revenues-add.html',
        layout: '/templates/layout.html',
        styles: ['/styles/revenues/revenues-add.css'],
        load: () => {
          new RevenueAdd();
        }
      },
      {
        route: '#/revenue-edit',
        title: 'Редактирование дохода',
        template: '/templates/revenues/revenues-edit.html',
        layout: '/templates/layout.html',
        styles: ['/styles/revenues/revenues-edit.css'],
        load: () => {
          new RevenueEdit();
        }
      },
      {
        route: '#/expenses',
        title: 'Расходы',
        template: '/templates/expenses/expenses.html',
        layout: '/templates/layout.html',
        styles: ['/styles/expenses/expenses.css'],
        load: () => {
          new Expenses();
        }
      },
      {
        route: '#/expense-add',
        title: 'Создание расхода',
        template: '/templates/expenses/expenses-add.html',
        layout: '/templates/layout.html',
        styles: ['/styles/expenses/expenses-add.css'],
        load: () => {
          new ExpenseAdd();
        }
      },
      {
        route: '#/expense-edit',
        title: 'Редактирование расхода',
        template: '/templates/expenses/expenses-edit.html',
        layout: '/templates/layout.html',
        styles: ['/styles/expenses/expenses-edit.css'],
        load: () => {
          new ExpenseEdit();
        }
      },
      {
        route: '#/all-finance',
        title: 'Доходы и Расходы',
        template: '/templates/all-finance/all-finance.html',
        layout: '/templates/layout.html',
        styles: ['/styles/all-finance/all-finance.css'],
        load: () => {
          new AllFinance();
        }
      },
      {
        route: '#/all-finance-add',
        title: 'Создание дохода/расхода',
        template: '/templates/all-finance/all-finance-add.html',
        layout: '/templates/layout.html',
        styles: ['/styles/all-finance/all-finance-add.css'],
        load: () => {
          new AllFinanceAdd();
        }
      },
      {
        route: '#/all-finance-edit',
        title: 'Редактирование дохода/расхода',
        template: '/templates/all-finance/all-finance-edit.html',
        layout: '/templates/layout.html',
        styles: ['/styles/all-finance/all-finance-edit.css'],
        load: () => {
          new AllFinanceEdit();
        }
      },
    ];

    this.currentStyles = [];
  }

  //Роутинг по страницам
  async openRoute() {
    const hashRoute = window.location.hash.split('?')[0];
    const newRoute = this.routes.find(item => {
      return item.route === hashRoute;
    });

    if (!newRoute) {
      window.location.href = "#/login";
      return;
    }

    if (newRoute.route !== '#/login' && newRoute.route !== '#/signup' && !localStorage.getItem('accessToken')) {
      window.location.href = "#/login";
      return;
    }

    //Удаление текущих стилей страницы
    this.removeCurrentStyles();

    //Отрисовка страниц с layout и без него
    if (newRoute.template) {
      let content = this.contentPageElement;
      if (newRoute.layout) {
        this.contentPageElement.innerHTML = await fetch(newRoute.layout).then(response => response.text());
        content = document.getElementById('contentLayout');
      }
      content.innerHTML = await fetch(newRoute.template).then(response => response.text());

      //Активация пунктов меню
      this.activateMenuItem(newRoute);
      //Подгружаем имя и баланс
      this.showBalance().then();
      this.showUserName().then();
      //Выход из системы
      this.logout();
    }

    //Подключение стилей
    if (newRoute.styles) {
      this.linkStyles(newRoute.styles);
    }

    //Отображение заголовка страницы
    const titleElement = document.getElementById('titlePage');
    if (titleElement) {
      titleElement.innerText = newRoute.title;
    }
    //Выполнение функции загрузки функционала страницы
    if (typeof newRoute.load === 'function') {
      newRoute.load();
    }
  }

  //Отображение пользователя
  async showUserName() {
    this.userNameElement = document.querySelectorAll(".user-name");
    const userInfo = AuthUtils.getUserInfo();
    if (userInfo && this.userNameElement.length > 0) {
      this.userNameElement.forEach(el => el.innerText = userInfo.userName + " " + userInfo.userLastName);
    }
  }

  //Выход из системы
  logout() {
    const logoutElement = document.querySelectorAll(".person-out");
    const logoutLink = document.querySelectorAll(".logout");

    const toggleModalElement = () => {
      logoutLink.forEach(el => {
        el.classList.toggle("logout-open");
      });
    }

    logoutElement.forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleModalElement();
      });
    });
  }

  //Отображение баланса
  async showBalance() {
    this.balanceShowElement = document.querySelectorAll(".balance-number");
    try {
      const result = await HttpService.request(config.host + '/balance');
      if (result && typeof result.balance === 'number') {
        this.balanceShowElement.forEach(el => {el.innerText = result.balance});
      } else {
        throw new Error(result.message);
      }
    } catch (e) {
      console.error("Ошибка при получении баланса: ", e);
    }
  }

  //Активация пунктов меню
  activateMenuItem(route) {
    const details = document.querySelectorAll("details");
    //Массив с роутами для категорий
    const openDetailsRoutes = ['#/revenues', '#/expenses'];

    document.querySelectorAll('.layout .link-sidebar').forEach(item => {
      let href = item.getAttribute('href');

      if ((route.route.includes(href) && href !== '#/login' && href !== '#/signup')) {
        item.classList.add('active-link');

        if (openDetailsRoutes.includes(href)) {
          details.forEach(details => details.setAttribute('open', 'open'));
        }
      } else {
        item.classList.remove('active-link');
      }
    });
  }

  //Подключение стилей
  linkStyles(styles) {
    const headElement = document.querySelector('head');
    styles.forEach(stylePath => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = stylePath;
      headElement.appendChild(link);
      this.currentStyles.push(link);
    });
  }

  //Удаление стилей
  removeCurrentStyles() {
    this.currentStyles.forEach(styleElement => {
      styleElement.remove();
    });
    this.currentStyles = [];
  }
}