import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  userName!: string | undefined;
  userSub!: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.userSub = this.store
      .select('user')
      .pipe(
        filter(({user}) => user !== null)
      )
      .subscribe((us) => (this.userName = us.user?.nombre));
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  logOut() {
    this.authService.logOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
