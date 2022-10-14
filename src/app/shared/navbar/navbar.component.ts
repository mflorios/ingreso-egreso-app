import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {

  userName!: string | undefined
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select('user')
      .subscribe(user => {
        this.userName = user.user?.nombre
      })

  }

}
