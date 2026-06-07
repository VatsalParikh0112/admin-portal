import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Pharmacy, VerificationStatus } from '../models/pharmacy.models';
import { AdminStats, SupportTicket, TicketStatus } from '../models/support.models';

interface AdminLoginResponse {
  success: boolean;
  token: string;
  admin: { _id: string; name: string; email: string };
}
interface PharmaciesResponse {
  success: boolean;
  pharmacies: Pharmacy[];
}
interface PharmacyResponse {
  success: boolean;
  message: string;
  pharmacy: Pharmacy;
}
interface TicketsResponse {
  success: boolean;
  tickets: SupportTicket[];
}
interface TicketResponse {
  success: boolean;
  message: string;
  ticket: SupportTicket;
}
interface StatsResponse {
  success: boolean;
  stats: AdminStats;
}

const TOKEN_KEY = 'admin_token';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly baseUrl = `${environment.apiUrl}/api/admin`;

  // Bearer token kept in sessionStorage (admin auth is header-based, not cookie).
  private readonly _token = signal<string | null>(
    this.isBrowser ? sessionStorage.getItem(TOKEN_KEY) : null,
  );
  public readonly isAuthenticated = computed(() => !!this._token());

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this._token()}` });
  }

  public login(email: string, password: string): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(res => {
        this._token.set(res.token);
        if (this.isBrowser) sessionStorage.setItem(TOKEN_KEY, res.token);
      }),
    );
  }

  public logout(): void {
    this._token.set(null);
    if (this.isBrowser) sessionStorage.removeItem(TOKEN_KEY);
  }

  // ─── Stats ───
  public getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.baseUrl}/stats`, { headers: this.headers() });
  }

  // ─── Pharmacies ───
  public getPharmacies(status?: VerificationStatus): Observable<PharmaciesResponse> {
    const url = status
      ? `${this.baseUrl}/pharmacies?status=${status}`
      : `${this.baseUrl}/pharmacies`;
    return this.http.get<PharmaciesResponse>(url, { headers: this.headers() });
  }

  public setVerification(
    id: string,
    status: 'approved' | 'rejected',
    reason?: string,
  ): Observable<PharmacyResponse> {
    return this.http.put<PharmacyResponse>(
      `${this.baseUrl}/pharmacies/${id}/status`,
      { status, reason },
      { headers: this.headers() },
    );
  }

  public warn(id: string, message: string): Observable<PharmacyResponse> {
    return this.http.post<PharmacyResponse>(
      `${this.baseUrl}/pharmacies/${id}/warn`,
      { message },
      { headers: this.headers() },
    );
  }

  public setAccountStatus(
    id: string,
    status: 'active' | 'disabled',
    reason?: string,
  ): Observable<PharmacyResponse> {
    return this.http.put<PharmacyResponse>(
      `${this.baseUrl}/pharmacies/${id}/account`,
      { status, reason },
      { headers: this.headers() },
    );
  }

  // ─── Support ───
  public getTickets(status?: TicketStatus): Observable<TicketsResponse> {
    const url = status ? `${this.baseUrl}/support?status=${status}` : `${this.baseUrl}/support`;
    return this.http.get<TicketsResponse>(url, { headers: this.headers() });
  }

  public updateTicket(
    id: string,
    payload: { status?: TicketStatus; response?: string },
  ): Observable<TicketResponse> {
    return this.http.put<TicketResponse>(`${this.baseUrl}/support/${id}`, payload, {
      headers: this.headers(),
    });
  }
}
