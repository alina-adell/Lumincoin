import {UrlUtils} from "../../utils/urliutils.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {HttpService} from "../../services/http-service.js";
import config from "../../config/config.js";

export class AllFinanceAdd {
  constructor() {
    this.selectTypeElement = document.getElementById("selectType");
    this.selectCategoryElement = document.getElementById("selectCategory");
    this.inputAmountElement = document.getElementById("inputAmount");
    this.inputDateElement = document.getElementById("inputDate");
    this.inputCommentElement = document.getElementById("inputComment");
    this.btnCategoryAddElement = document.getElementById("categoryAdd");
    this.btnCategoryAddBackElement = document.getElementById("categoryAddBack");
    const type = UrlUtils.getUrlParams('type');
    if (!type) {
      window.location.href = '#/all-finance';
      return;
    }

    this.selectedType(type);
    this.getCategoryOption(type).then();
    this.btnCategoryAddElement.addEventListener('click', this.createCategory.bind(this));
    this.btnCategoryAddBackElement.addEventListener('click', () => {
      window.location.href = '#/all-finance';
    });
  }

  //Блокировка option если выбран тот или иной тип операции
  selectedType(type) {
    this.selectTypeElement.querySelectorAll('option').forEach(element => {
      if (type === element.value) {
        element.selected = true;
        element.removeAttribute('disabled');
      } else {
        element.setAttribute('disabled', 'disabled');
      }
    });
  }

  //Отрисовка select категорий по типу операции
  async getCategoryOption(type) {
    const options = await CommonUtils.getOperationCategory(type);
    for (let i = 0; i < options.length; i++) {
      const option = document.createElement("option");
      option.value = options[i].title;
      option.innerText = options[i].title;
      option.setAttribute("data-id", options[i].id);
      this.selectCategoryElement.appendChild(option);
    }
  }

  //Валидация полей
  validateForm() {
    let isValid = true;

    if (this.inputAmountElement.value.trim()) {
      this.inputAmountElement.classList.remove('is-invalid');
    } else {
      this.inputAmountElement.classList.add('is-invalid');
      isValid = false;
    }

    if (this.inputDateElement.value.trim() && this.inputDateElement.value.match(/[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])/)) {
      this.inputDateElement.classList.remove('is-invalid');
    } else {
      this.inputDateElement.classList.add('is-invalid');
      isValid = false;
    }
    return isValid;
  }

  //Получение id из атрибута выбранного option для категорий
  getOptionCategoryId() {
    const selectedOption = this.selectCategoryElement.querySelector(`option[value="${this.selectCategoryElement.value}"]`);
    return selectedOption ? selectedOption.getAttribute('data-id') : null;
  }

  //Запрос на создание операции
  async createCategory() {
    if (this.validateForm()) {
      const categoryId = +this.getOptionCategoryId();
      try {
        const result = await HttpService.request(config.host + '/operations', 'POST', {
          type: this.selectTypeElement.value,
          amount: this.inputAmountElement.value,
          date: this.inputDateElement.value,
          comment: this.inputCommentElement.value,
          category_id: categoryId
        });
        if (result && !result.error) {
          window.location.href = '#/all-finance';
        }
      } catch (e) {
        throw new Error(`Ошибка создания категории: ${this.selectTypeElement.textContent}`);
      }
    }
  }
}