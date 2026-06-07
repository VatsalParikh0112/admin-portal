import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../core/services/admin.service';
import { Pharmacy } from '../../core/models/pharmacy.models';

@Component({
  selector: 'app-pharmacies',
  imports: [FormsModule, DatePipe],
  templateUrl: './pharmacies.html',
})
export class Pharmacies implements OnInit {
  private readonly adminService = inject(AdminService);

  public readonly pharmacies = signal<Pharmacy[]>([]);
  public readonly loading = signal(false);
  public readonly actingId = signal<string | null>(null);
  public readonly search = signal('');

  // Only approved pharmacies are manageable here (pending ones live in Verification).
  public readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const approved = this.pharmacies().filter(p => p.verificationStatus === 'approved');
    if (!q) return approved;
    return approved.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        (p.email ?? '').toLowerCase().includes(q) ||
        (p.address?.city ?? '').toLowerCase().includes(q),
    );
  });

  public ngOnInit(): void {
    this.load();
  }

  public load(): void {
    this.loading.set(true);
    this.adminService.getPharmacies().subscribe({
      next: res => {
        this.pharmacies.set(res.pharmacies);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  public warn(p: Pharmacy): void {
    const message = window.prompt(`Warning message for ${p.name}:`);
    if (!message) return;
    this.run(p._id, this.adminService.warn(p._id, message));
  }

  public disable(p: Pharmacy): void {
    const reason = window.prompt(`Disable ${p.name}? Reason (e.g. non-payment):`) ?? '';
    this.run(p._id, this.adminService.setAccountStatus(p._id, 'disabled', reason));
  }

  public enable(p: Pharmacy): void {
    this.run(p._id, this.adminService.setAccountStatus(p._id, 'active'));
  }

  private run(id: string, obs: ReturnType<AdminService['warn']>): void {
    this.actingId.set(id);
    obs.subscribe({
      next: res => {
        this.actingId.set(null);
        this.pharmacies.update(list => list.map(p => (p._id === id ? res.pharmacy : p)));
      },
      error: () => this.actingId.set(null),
    });
  }

  public fullAddress(p: Pharmacy): string {
    const a = p.address;
    return [a?.street, a?.city, a?.state, a?.pincode].filter(Boolean).join(', ');
  }

  public statusBadge(p: Pharmacy): string {
    switch (p.accountStatus) {
      case 'disabled':
        return 'bg-red-100 text-red-700';
      case 'warned':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-emerald-100 text-emerald-700';
    }
  }
}
