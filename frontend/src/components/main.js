import config from "../config/config.js";
import {HttpService} from "../services/http-service.js";

export class Main {
  constructor() {
    this.btnPeriodElement = document.querySelectorAll('.btn-main');
    this.inputFromDate = document.getElementById('inputFromDate');
    this.inputToDate = document.getElementById('inputToDate');
    this.chartOneCanvas = document.getElementById('revenuesChart');
    this.chartTwoCanvas = document.getElementById('expensesChart');

    this.chartOne = null;
    this.chartTwo = null;

    this.arrayCategoryRevenue = [];
    this.arrayAmountCategoryRevenue = [];
    this.arrayCategoryExpense = [];
    this.arrayAmountCategoryExpense = [];

    this.loadChartLibrary().then(() => {
      this.getPeriodData().then();
    });
    this.btnEventListener();
  }

  //Загрузка библиотеки Chart.js
  async loadChartLibrary() {
    if (typeof Chart === 'undefined') {
      await import('../../node_modules/chart.js/dist/chart.umd.js');
    }
  }

  //Событие клика по кнопкам фильтров
  btnEventListener() {
    this.btnPeriodElement.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const period = e.target.getAttribute('data-period');
        //Сброс ошибок валидации
        this.resetValidation();
        if (period === "interval") {
          if (!this.validateForm()) {
            e.preventDefault();
            return;
          }
        }
        //Обнуление данных в массивах
        this.arrayCategoryRevenue = [];
        this.arrayAmountCategoryRevenue = [];
        this.arrayCategoryExpense = [];
        this.arrayAmountCategoryExpense = [];
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
      if (period === "interval") {
        url = `${config.host}/operations?period=interval&dateFrom=${this.inputFromDate.value}&dateTo=${this.inputToDate.value}`
      } else if (period) {
        url = `${config.host}/operations?period=${period}`
      } else {
        url = `${config.host}/operations`
      }
      const result = await HttpService.request(url);
      if (result) {
        this.getArrayData(result);
        //Отрисовка графиков после получения данных
        this.renderChart();
      }
    } catch (e) {
      console.error("Ошибка при запросе данных", e);
    }
  }

  //Фильтрация полученных данных и запись их в массивы для графиков
  getArrayData(data) {
    const revenueData = data.filter(item => item.type === "income");
    this.arrayCategoryRevenue = revenueData.map(item => item.category);
    this.arrayAmountCategoryRevenue = revenueData.map(item => item.amount);

    const expenseData = data.filter(item => item.type === "expense");
    this.arrayCategoryExpense = expenseData.map(item => item.category);
    this.arrayAmountCategoryExpense = expenseData.map(item => item.amount);
  }

  //Отрисовка графиков
  renderChart() {
    if (this.chartOne) {
      this.chartOne.destroy();
    }

    //Если данных нет, то устанавливаем дефолтные данные
    const labelsRevenue = this.arrayCategoryRevenue.length ? this.arrayCategoryRevenue : ['Нет данных'];
    const dataRevenue = this.arrayAmountCategoryRevenue.length ? this.arrayAmountCategoryRevenue : [1];

    this.chartOne = new Chart(this.chartOneCanvas, {
      type: 'pie',
      data: {
        labels: labelsRevenue,
        datasets: [{
          label: 'Сумма',
          data: dataRevenue,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        boxSizing: 'border-box',
        layout: {
          padding: {
            bottom: 5
          }
        },
        plugin: {
          legend: {
            position: 'top',
          }
        },
        radius: '90%'
      }
    });

    if (this.chartTwo) {
      this.chartTwo.destroy();
    }

    const labelsExpense = this.arrayCategoryExpense.length ? this.arrayCategoryExpense : ['Нет данных'];
    const dataExpense = this.arrayAmountCategoryExpense.length ? this.arrayAmountCategoryExpense : [1];

    this.chartTwo = new Chart(this.chartTwoCanvas, {
      type: 'pie',
      data: {
        labels: labelsExpense,
        datasets: [{
          label: 'Сумма',
          data: dataExpense,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        boxSizing: 'border-box',
        layout: {
          padding: {
            bottom: 5
          }
        },
        plugin: {
          legend: {
            position: 'top',
          }
        },
        radius: '90%'
      }
    });
  }
}