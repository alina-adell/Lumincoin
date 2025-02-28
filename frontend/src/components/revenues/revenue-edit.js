import {HttpService} from "../../services/http-service.js";
import config from "../../config/config.js";
import {UrlUtils} from "../../utils/urliutils.js";
import {MenuLinkUtils} from "../../utils/menu-link-utils.js";

export class RevenueEdit {
  constructor() {
    this.inputNameCategoryElement = document.getElementById('inputCategoryName');
    this.categorySaveElement = document.getElementById('categorySave');
    this.categorySaveBackElement = document.getElementById('categorySaveBack');
    const id = UrlUtils.getUrlParams('id');
    if (!id) {
      window.location.href = '#/revenues';
    }

    this.getCategory(id).then();
    this.categorySaveElement.addEventListener('click', this.updateCategory.bind(this, id));
    this.categorySaveBackElement.addEventListener('click', (e) => {
      window.location.href = '#/revenues';
    });
    this.activeLink();
  }

  //Активация пунктов меню
  activeLink() {
    const details = document.querySelectorAll("details");
    const link = document.querySelectorAll('.link-sidebar');
    MenuLinkUtils.activeLink(details, link, '#/revenues');
  }

  //Получение выбранной категории по id
  async getCategory(id) {
    try {
      const result = await HttpService.request(config.host + '/categories/income/' + id, 'GET');
      if (result && !result.error) {
        this.inputNameCategoryElement.value = result.title;
      }
    } catch (e) {
      throw new Error("Ошибка получения категории " + e);
    }
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

  //Запрос на обновление категории
  async updateCategory(id) {
    if (this.validateForm()) {
      try {
        const result = await HttpService.request(config.host + '/categories/income/' + id, 'PUT', {title: this.inputNameCategoryElement.value});
        if (result && !result.error) {
          window.location.href = '#/revenues';
        }
      } catch (e) {
        throw new Error("Ошибка получения категории " + e);
      }
    }
  }
}