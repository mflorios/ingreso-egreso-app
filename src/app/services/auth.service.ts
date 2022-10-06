import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Firestore, collectionData, collection, doc,setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
              private firestore: Firestore) { }

  initAuthListener() {
    this.auth.authState.subscribe(fuser => {
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
    })
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
