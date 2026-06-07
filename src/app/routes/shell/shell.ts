import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AdminService } from '../../core/services/admin.service';
import { AdminStats } from '../../core/models/support.models';
import { FindPharmaLogo } from '../../shared/Logos/find-pharma-logo/find-pharma-logo';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FindPharmaLogo],
  templateUrl: './shell.html',
})
export class Shell implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);

  public readonly stats = signal<AdminStats | null>(null);
  public readonly sidebarOpen = signal(false);
  public readonly confirmLogoutOpen = signal(false);

  public ngOnInit(): void {
    this.refreshStats();
  }

  public toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  public closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  public askLogout(): void {
    this.closeSidebar();
    this.confirmLogoutOpen.set(true);
  }

  public cancelLogout(): void {
    this.confirmLogoutOpen.set(false);
  }

  public refreshStats(): void {
    this.adminService.getStats().subscribe({
      next: res => this.stats.set(res.stats),
      error: () => {},
    });
  }

  public logout(): void {
    this.adminService.logout();
    this.router.navigate(['/login']);
  }
}
