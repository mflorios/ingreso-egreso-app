import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubscription!: Subscription;
  ingresosSubs!: Subscription;
  constructor(private store: Store<AppState>,
              private ingresoEgresoSrv: IngresoEgresoService) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('user')
    .pipe(
      filter(us => us.user !== null)
      )
      .subscribe(({user}) => {

        this.ingresosSubs = this.ingresoEgresoSrv.initIngresosEgresosListener(user ?  user?.uid: undefined)
          .subscribe(ingresosEgresos => {
            this.store.dispatch(ingresoEgresoActions.setItems({items: ingresosEgresos}))
          })
      });
    }

    ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
      this.ingresosSubs.unsubscribe();
    }

}
