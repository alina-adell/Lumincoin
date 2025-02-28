import {HttpService} from "../../services/http-service.js";
import config from "../../config/config.js";
import {MenuLinkUtils} from "../../utils/menu-link-utils.js";

export class ExpenseAdd {
  constructor() {
    this.inputNameCategoryElement = document.getElementById('inputCategoryName');
    this.btnCategoryAddElement = document.getElementById('categoryAdd');
    this.btnCategoryAddBackElement = document.getElementById('categoryAddBack');

    this.btnCategoryAddElement.addEventListener('click', this.addCategory.bind(this));

    this.btnCategoryAddBackElement.addEventListener('click', () => {
      window.location.href = '#/expenses';
    });
    this.activeLink();
  }

  //Активация пунктов меню
  activeLink() {
    const details = document.querySelectorAll("details");
    const link = document.querySelectorAll('.link-sidebar');
    MenuLinkUtils.activeLink(details, link, '#/expenses');
  }

  //Валидация полей
  validateForm() {
    let isValid = true;

    if (this.inputNameCategoryElement.value.trim()) {
      this.inputNameCategoryElement.classList.remove('is-invalid');
    } else {
      this.inputNameCategoryElement.classList.add('is-invalid');
      isValid = false;
    }
    return isValid;
  }

  //Запрос на добавление категории
  async addCategory() {
    if (this.validateForm()) {
      try {
        const result = await HttpService.request(config.host + '/categories/expense', 'POST', {title: this.inputNameCategoryElement.value});
        if (result && !result.error) {
          window.location.href = '#/expenses';
        }
      } catch (e) {
        throw new Error ("Ошибка при создании категории " + e);
      }
    }
  }
}