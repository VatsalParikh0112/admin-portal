import { Component, OnInit, inject, signal } from '@angular/core';

import { AdminService } from '../../core/services/admin.service';
import { Pharmacy, VerificationStatus } from '../../core/models/pharmacy.models';

@Component({
  selector: 'app-verification',
  imports: [],
  templateUrl: './verification.html',
})
export class Verification implements OnInit {
  private readonly adminService = inject(AdminService);

  public readonly tabs: VerificationStatus[] = ['pending', 'approved', 'rejected'];
  public readonly activeTab = signal<VerificationStatus>('pending');
  public readonly pharmacies = signal<Pharmacy[]>([]);
  public readonly loading = signal(false);
  public readonly actingId = signal<string | null>(null);

  public ngOnInit(): void {
    this.load();
  }

  public selectTab(tab: VerificationStatus): void {
    this.activeTab.set(tab);
    this.load();
  }

  public load(): void {
    this.loading.set(true);
    this.adminService.getPharmacies(this.activeTab()).subscribe({
      next: res => {
        this.pharmacies.set(res.pharmacies);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  public approve(p: Pharmacy): void {
    this.act(p._id, 'approved');
  }

  public reject(p: Pharmacy): void {
    const reason = window.prompt(`Reject ${p.name}? Optional reason:`) ?? '';
    this.act(p._id, 'rejected', reason);
  }

  private act(id: string, status: 'approved' | 'rejected', reason?: string): void {
    this.actingId.set(id);
    this.adminService.setVerification(id, status, reason).subscribe({
      next: () => {
        this.actingId.set(null);
        this.pharmacies.update(list => list.filter(x => x._id !== id));
      },
      error: () => this.actingId.set(null),
    });
  }

  public fullAddress(p: Pharmacy): string {
    const a = p.address;
    return [a?.street, a?.city, a?.state, a?.pincode].filter(Boolean).join(', ');
  }
}
