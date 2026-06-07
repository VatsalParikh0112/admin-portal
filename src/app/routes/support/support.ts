import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AdminService } from '../../core/services/admin.service';
import { SupportTicket, TicketStatus } from '../../core/models/support.models';

@Component({
  selector: 'app-support',
  imports: [DatePipe],
  templateUrl: './support.html',
})
export class Support implements OnInit {
  private readonly adminService = inject(AdminService);

  public readonly tabs: TicketStatus[] = ['open', 'in_progress', 'resolved'];
  public readonly activeTab = signal<TicketStatus>('open');
  public readonly tickets = signal<SupportTicket[]>([]);
  public readonly loading = signal(false);
  public readonly actingId = signal<string | null>(null);

  public ngOnInit(): void {
    this.load();
  }

  public selectTab(tab: TicketStatus): void {
    this.activeTab.set(tab);
    this.load();
  }

  public load(): void {
    this.loading.set(true);
    this.adminService.getTickets(this.activeTab()).subscribe({
      next: res => {
        this.tickets.set(res.tickets);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  public reply(t: SupportTicket): void {
    const response = window.prompt(`Reply to ${t.name || t.email} (emails the requester):`);
    if (!response) return;
    this.update(t._id, { response, status: 'resolved' });
  }

  public setStatus(t: SupportTicket, status: TicketStatus): void {
    this.update(t._id, { status });
  }

  private update(id: string, payload: { status?: TicketStatus; response?: string }): void {
    this.actingId.set(id);
    this.adminService.updateTicket(id, payload).subscribe({
      next: () => {
        this.actingId.set(null);
        // If status changed, it leaves the current tab.
        if (payload.status && payload.status !== this.activeTab()) {
          this.tickets.update(list => list.filter(x => x._id !== id));
        } else {
          this.load();
        }
      },
      error: () => this.actingId.set(null),
    });
  }
}
