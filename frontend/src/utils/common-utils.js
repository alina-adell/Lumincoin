import config from "../config/config.js";
import {HttpService} from "../services/http-service.js";

export class CommonUtils {
  static getOperationsType(operationType) {
    let type = null;
    switch (operationType) {
      case config.operationsType.expense:
        type = `<span class="text-danger">расход</span>`;
        break;
      case config.operationsType.income:
        type = `<span class="text-success">доход</span>`;
        break;
        default:
          type = `<span class="text-dark">-</span>`;
    }
    return type;
  }

  static async getOperationCategory(type) {
    let url = null;
    if (type === "expense") {
      url = `${config.host}/categories/expense`;
    } else {
      url = `${config.host}/categories/income`;
    }
    try {
      const result = await HttpService.request(url);
      if (result && !result.error) {
        return result;
      }
    } catch (e) {
      throw  new Error("Ошибка при загрузке категорий", e);
    }
  }
}