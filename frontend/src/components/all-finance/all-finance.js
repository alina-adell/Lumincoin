import {HttpService} from "../../services/http-service.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";

export class AllFinance {
  constructor() {
    this.btnPeriodElement = document.querySelectorAll('.btn-main');
    this.tableBodyElement = document.getElementById('tableBody');
    this.inputFromDate = document.getElementById('inputFromDate');
    this.inputToDate = document.getElementById('inputToDate');
    this.modalElement = document.getElementById('modal');
    this.modalBtnRemoveElement = document.getElementById('btnRemove');
    this.modalBtnCancelElement = document.getElementById('btnCancel');
    this.btnAddRevenueElement = document.getElementById('addRevenue');
    this.btnAddExpenseElement = document.getElementById('addExpense');

    this.btnAddRevenueElement.addEventListener('click', () => {
      window.location.hash = '#/all-finance-add' + '?type=income';
    });
    this.btnAddExpenseElement.addEventListener('click', () => {
      window.location.hash = '#/all-finance-add' + '?type=expense';
    });
    this.btnEventListener();
    this.getPeriodData().then();
  }

  //Событие кликов по кнопкам фильтров
  btnEventListener() {
    this.btnPeriodElement.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const period = e.target.getAttribute('data-period');

        this.resetValidation();
        if (period === "interval") {
          if (!this.validateForm()) {
            e.preventDefault();
            return;
          }
        }
        this.getPeriodData(period).then();
      });
    });
  }

  //Валидация полей
  validateForm() {
    let isValid = true;

    if (this.inputFromDate.value) {
      this.inputFromDate.classList.remove('is-invalid');
    } else {
      this.inputFromDate.classList.add('is-invalid');
      isValid = false;
    }

    if (this.inputToDate.value) {
      this.inputToDate.classList.remove('is-invalid');
    } else {
      this.inputToDate.classList.add('is-invalid');
      isValid = false;
    }
    return isValid;
  }

  //Сброс валидационных сообщений
  resetValidation() {
    this.inputFromDate.classList.remove('is-invalid');
    this.inputToDate.classList.remove('is-invalid');
  }

  //Получение данных по кнопкам фильтров
  async getPeriodData(period) {
    let url;
    try {
      this.tableBodyElement.innerHTML = '';
      if (period === "interval") {
        url = `${config.host}/operations?period=interval&dateFrom=${this.inputFromDate.value}&dateTo=${this.inputToDate.value}`
      } else if (period) {
        url = `${config.host}/operations?period=${period}`
      } else {
        url = `${config.host}/operations`
      }
      const result = await HttpService.request(url);
      if (result) {
        this.showOperationsInTable(result);
      }
    } catch (e) {
      throw new Error("Ошибка при запросе данных", e);
    }
  }

  //Отрисовка таблицы
  showOperationsInTable(data) {
    data.forEach((element, i) => {
      let trElement = document.createElement("tr");
      trElement.insertCell().innerText = i + 1;
      trElement.insertCell().innerHTML = CommonUtils.getOperationsType(element.type);
      trElement.insertCell().innerText = element.category;
      trElement.insertCell().innerText = element.amount + '$';
      trElement.insertCell().innerText = element.date.replaceAll('-', '.');
      trElement.insertCell().innerText = element.comment;
      trElement.insertCell().innerHTML = `
      <button class="btn p-0 delete-category">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               class="bi bi-trash3" viewBox="0 0 16 16">
            <path
                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
          </svg>
        </button>
        <a href="#/all-finance-edit?id=${element.id}" class="btn p-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               class="bi bi-pencil" viewBox="0 0 16 16">
            <path
                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
          </svg>
        </a>
      `;

      //Событие клика по кнопке удаления строки таблицы
      trElement.querySelector('.delete-category').addEventListener('click', () => {
        this.modalElement.classList.add('open');

        this.modalBtnRemoveElement.onclick = () => {
          this.deleteCategory(element.id, trElement).then();
          this.modalElement.classList.remove('open');
        }

        this.modalBtnCancelElement.onclick = () => {
          this.modalElement.classList.remove('open');
        }
      });

      this.tableBodyElement.appendChild(trElement);
    });
  }

  //Запрос на удаление операции
  async deleteCategory(id, trElement) {
    try {
      const result = await HttpService.request(config.host + '/operations/' + id, 'DELETE');
      if (result) {
        trElement.remove();
      } else {
        throw new Error(result.message);
      }
    } catch (e) {
      throw new Error("Ошибка удаления категории " + e);
    }
  }
}