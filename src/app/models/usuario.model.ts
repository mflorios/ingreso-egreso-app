export class Usuario {
  static fromFirebase({email, uid, nombre}: Usuario) {
    return new Usuario(uid, nombre, email)
  }

  constructor(
      public uid: string | undefined,
      public nombre: string,
      public email: string | undefined | null,

  ){}
}
