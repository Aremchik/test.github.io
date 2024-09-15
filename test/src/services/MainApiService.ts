import axios, { AxiosInstance } from "axios";

export class MainApiService {
  static BASE_URL = "https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs";
  static TOKEN_KEY = "authToken";

  http: AxiosInstance;
  token: string | null = null;

  constructor() {
    this.http = axios.create({
      baseURL: MainApiService.BASE_URL,
    });

    this.token = localStorage.getItem(MainApiService.TOKEN_KEY);
    if (this.token) {
      this.http.defaults.headers.common["x-auth"] = this.token;
    }
  }

  async login(username: string, password: string): Promise<void> {
    const response = await this.http.post("/login", {
      username,
      password,
    });
    this.token = response.data.data.token;

    if (this.token) {
      localStorage.setItem(MainApiService.TOKEN_KEY, this.token);
    }
    this.http.defaults.headers.common["x-auth"] = this.token;
  }

  async getUserDocs(): Promise<any> {
    if (!this.token) throw new Error("Необходимо авторизоваться");
    const response = await this.http.get("/userdocs/get");
    return response.data?.data;
  }

  async createUserDoc(data: {
    companySigDate: string;
    companySignatureName: string;
    documentName: string;
    documentStatus: string;
    documentType: string;
    employeeNumber: string;
    employeeSigDate: string;
    employeeSignatureName: string;
  }): Promise<any> {
    if (!this.token) throw new Error("Необходимо авторизоваться");

    const response = await this.http.post("/userdocs/create", data);
    return response.data.data;
  }

  async deleteUserDoc(id: string): Promise<void> {
    if (!this.token) throw new Error("Необходимо авторизоваться");

    const response = await this.http.post(`/userdocs/delete/${id}`);
    if (response.data.error_code !== 0) {
      throw new Error("Ошибка при удалении записи");
    }
  }

  async updateUserDoc(
    id: string,
    data: {
      companySigDate: string;
      companySignatureName: string;
      documentName: string;
      documentStatus: string;
      documentType: string;
      employeeNumber: string;
      employeeSigDate: string;
      employeeSignatureName: string;
    }
  ): Promise<any> {
    if (!this.token) throw new Error("Необходимо авторизоваться");

    const response = await this.http.post(`/userdocs/set/${id}`, data);
    if (response.data.error_code !== 0) {
      throw new Error("Ошибка при изменении записи");
    }
    return response.data.data;
  }
}
