import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import {  Subscription } from 'rxjs';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm!: FormGroup
  cargando!: boolean;
  uiSubscription!: Subscription
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading)
  }

  crearUsuario() {
    // Swal.showLoading()

    if(this.registroForm.invalid){return}
    this.store.dispatch(ui.isLoading())
    const {nombre, correo, password} = this.registroForm.value;
    this.authService.crearUsuario(nombre,correo,password).then(credenciales => {
      console.log(credenciales);
      // Swal.close();
      this.store.dispatch(ui.stopLoading())
      this.router.navigate(['/'])
    }).catch(err => {Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.message

    });
    this.store.dispatch(ui.stopLoading())
    // Swal.hideLoading()
  });


  }

}
