import {HttpService} from "../../services/http-service.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {UrlUtils} from "../../utils/urliutils.js";

export class AllFinanceEdit {
  constructor() {
    this.selectTypeElement = document.getElementById('selectType');
    this.selectCategoryElement = document.getElementById('selectCategory');
    this.inputAmountElement = document.getElementById('inputAmount');
    this.inputDateElement = document.getElementById('inputDate');
    this.inputCommentElement = document.getElementById('inputComment');
    this.btnCategorySaveElement = document.getElementById('categorySave');
    this.btnCategorySaveBackElement = document.getElementById('categorySaveBack');
    const id = UrlUtils.getUrlParams('id');
    if (!id) {
      window.location.href = '#/all-finance';
      return;
    }

    this.getCategory(id).then();
    this.btnCategorySaveElement.addEventListener('click', this.updateCategory.bind(this, id));
    this.btnCategorySaveBackElement.addEventListener('click', () => {
      window.location.href = '#/all-finance';
    });

    this.selectTypeElement.addEventListener('change', () => {
      this.updateCategoryOptions().then();
    });
  }

  //Получение категорий для select
  async getCategoryOption(type) {
    const options = await CommonUtils.getOperationCategory(type);
    this.selectCategoryElement.innerHTML = '';
    for (let i = 0; i < options.length; i++) {
      const option = document.createElement("option");
      option.value = options[i].title;
      option.innerText = options[i].title;
      option.setAttribute("data-id", options[i].id);
      this.selectCategoryElement.appendChild(option);
    }
  }

  //Получение выбранной категории по id
  async getCategory(id) {
    try {
      const result = await HttpService.request(config.host + '/operations/' + id);
      if (result && !result.error) {
        this.selectTypeElement.querySelectorAll('option').forEach(element => {
          if (result.type === element.value) {
            element.selected = true;
          }
        });
        await this.getCategoryOption(result.type);
        this.selectCategoryElement.querySelectorAll('option').forEach(element => {
          if (result.category === element.value) {
            element.selected = true;
          }
        });
        this.inputAmountElement.value = result.amount;
        this.inputDateElement.value = result.date;
        this.inputCommentElement.value = result.comment;
      }
    } catch (e) {
      throw new Error("Ошибка получения категории " + e);
    }
  }

  //Если изменён тип, то меняем категории в select
  async updateCategoryOptions() {
    const selectedCategoryType = this.selectTypeElement.value;
    if (selectedCategoryType) {
      await this.getCategoryOption(selectedCategoryType);
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

  //Запрос на обновление операции
  async updateCategory(id) {
    if (this.validateForm()) {
      try {
        const categoryId = +this.getOptionCategoryId();

        const result = await HttpService.request(config.host + '/operations/' + id, 'PUT', {
          type: this.selectTypeElement.value,
          amount: +this.inputAmountElement.value,
          date: this.inputDateElement.value,
          comment: this.inputCommentElement.value,
          category_id: categoryId,
        });
        if (result && !result.error) {
          window.location.href = '#/all-finance';
        }
      } catch (e) {
        throw new Error("Ошибка получения категории " + e);
      }
    }
  }
}