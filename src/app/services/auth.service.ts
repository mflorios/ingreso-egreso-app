import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Firestore, collectionData, collection, doc,setDoc, docData   } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
import * as ingEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription!: Subscription;
  private _userN!: Usuario | null;

  public get userN() {
    return {...this._userN}
  }


  constructor(public auth: AngularFireAuth,
              private firestore: Firestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe(fuser => {
      // console.log(fuser?.uid);
      if(fuser){
         const user = doc(this.firestore, `${fuser.uid}/usuario`);
        // pp.
        //  const coll = collection(this.firestore,`${fuser.uid}/usuario`);
        //  collectionData(pp).subscribe(fuser2 => )
         this.userSubscription = docData(user).subscribe((fuser2: any) => {
                                  console.log(fuser2);
                                  const user = Usuario.fromFirebase(fuser2);
                                  this._userN = user;
                                  this.store.dispatch(authActions.setUser({user: user}))

                                 })
        //
      }else{
        this._userN = null
        this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser())
        this.store.dispatch(ingEgresoActions.unSetItems());
      }

    });
  }

  crearUsuario(nombre: string, email:string, password:string) {
    // console.log({nombre, email, password});
    return this.auth.createUserWithEmailAndPassword(email,password)
            .then(({user}) => {
              const newUser = new Usuario(user?.uid, nombre, user?.email)
              const docUser = doc(this.firestore,`${user?.uid}/usuario`);
              return setDoc(docUser, {...newUser})


            });
  }

  loginUsuario(email: string, password:string) {
    return this.auth.signInWithEmailAndPassword(email,password)
  }

  logOut() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fuser => fuser != null)
    );
  }


}
