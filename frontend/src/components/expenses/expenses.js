import {HttpService} from "../../services/http-service.js";
import config from "../../config/config.js";

export class Expenses {
  constructor() {
    this.cardBoxElement = document.querySelector('.card-box');
    this.modalElement = document.getElementById('modal');
    this.modalBtnRemoveElement = document.getElementById('btnRemove');
    this.modalBtnCancelElement = document.getElementById('btnCancel');

    this.showCardExpenses().then();
  }

  //Отрисовка карточек
  async showCardExpenses() {
    try {
      const result = await HttpService.request(config.host + '/categories/expense');
      if (result && !result.error) {
        result.forEach(category => {
          let cardElement = document.createElement("div");
          cardElement.classList.add("card", "p-1");
          cardElement.innerHTML = `
          <div class="card-body flex-grow-1">
            <h4 class="card-title mb-3">${category.title}</h4>
            <div class="action d-flex flex-column flex-sm-row gap-2">
              <a href="#/expense-edit?id=${category.id}" class="btn btn-primary">Редактировать</a>
              <button id="deleteCategory" class="btn btn-danger delete-category">Удалить</button>
            </div>
          </div>`;

          //Взаимодействие с модальным окном
          cardElement.querySelector('.delete-category').addEventListener('click', () => {
            this.modalElement.classList.add('open');

            this.modalBtnRemoveElement.onclick = () => {
              this.deleteCardExpense(category.id, cardElement);
              this.modalElement.classList.remove('open');
            }

            this.modalBtnCancelElement.onclick = () => {
              this.modalElement.classList.remove('open');
            }

          });
          this.cardBoxElement.appendChild(cardElement);
        });

        let addCategoryElement = document.createElement("a");
        addCategoryElement.href = "#/expense-add";
        addCategoryElement.classList.add("btn", "btn-add-revenue", "border", "border-1");
        addCategoryElement.innerHTML = `<img src="images/svg/plus-mini-1523-svgrepo-com.svg" alt="plus" width="15px" height="15px">`;
        this.cardBoxElement.appendChild(addCategoryElement);
      }
    } catch (e) {
      throw new Error("Возникла ошибка при получении категории доходов " + e);
    }
  }

  //Удаление карточки
  async deleteCardExpense(id, cardElement) {
    try {
      const result = await HttpService.request(config.host + '/categories/expense/' + id, 'DELETE');
      if (result) {
        cardElement.remove();
      } else {
        throw new Error(result.message);
      }
    } catch (e) {
      throw new Error("Ошибка удаления категории " + e);
    }
  }
}