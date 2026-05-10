import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type AppLanguage } from '../i18n/language.model';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
  language: AppLanguage;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = 'https://sebastian-hedwig.de/api/contact';

  constructor(private http: HttpClient) {}

  sendContact(payload: ContactPayload) {
    return this.http.post(this.apiUrl, payload);
  }
}
