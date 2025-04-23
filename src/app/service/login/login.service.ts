import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/config/config';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class LoginService {
  getUser() {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) {}

  async login(username: string, password: string): Promise<any> {
    console.log('login', username, password);
    const response$ = this.http.post(
      `${environment.baseUrl}${config.api.endpoint.auth.login}`,
      { username, password }
    );
    return await lastValueFrom(response$);
  }

  async logout() {
    return this.http.post(`${environment.baseUrl}${config.api.endpoint.auth.logout}`, {});
  }

}
