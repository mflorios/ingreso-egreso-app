import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos!: IngresoEgreso[]
  ingresosSubscription!: Subscription
  constructor(private store: Store<AppStateWithIngreso>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresosSubscription = this.store.select('ingresosEgresos')
    .subscribe(({items}) => this.ingresosEgresos = items)
  }

  ngOnDestroy(): void {
    this.ingresosSubscription.unsubscribe();
  }
  borrar(uid: string | undefined) {
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
      .then( () => Swal.fire('Borrado', 'Item borrado', 'success'))
      .catch( err => Swal.fire('Error', err.message, 'error'))
  }

}
