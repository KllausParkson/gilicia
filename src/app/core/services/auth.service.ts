import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { ToastService } from './toast.service';
//import * as  firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { AngularFireAuth } from "@angular/fire/compat/auth";

import { Observable, of } from 'rxjs';
import { switchMap } from "rxjs/operators";

@Injectable()
export class AuthService implements CanActivate {
    public token: string;
    public userOne;
    user: Observable<any>;

    constructor(private router: Router,
        private toast: ToastService,
        private afs: AngularFirestore,
        private afAuth: AngularFireAuth) {
        this.user = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        );
    }

    async createFirebaseuser(appleResponse) {
        // const provider = new firebase.default.auth.OAuthProvider('apple.com')
        // const credential = provider.credential({
        //     idToken: appleResponse.identityToken


        // })
        // const userCredential = await this.afAuth.signInWithCredential(credential);
        // this.updateUserData(userCredential.user, appleResponse.givenName, appleResponse.familyName)
    }

    updateUserData(user, firstName, lastName) {
        const userRef: AngularFirestoreDocument = this.afs.doc(`users/${user.uid}`)
        let data = {
            email: user.email
        }

        if (firstName) {
            data['first_name'] = firstName
        }
        if (lastName) {
            data['last_name'] = lastName
        }

        return userRef.set(data, { merge: true })
    }
    logout() {
        this.afAuth.signOut();
    }

    canActivate(routeAc: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.token = localStorage.getItem('one.token');
        this.userOne = JSON.parse(localStorage.getItem('one.user'));

        if (!this.token) {
            this.toast.presentToast('Você precisa estar autenticado para acessar esta pagina!', 'danger');
            this.router.navigate(['/login']);
            return false;
        }

        let claim: any = routeAc.data[0];

        if (claim !== undefined) {
            let claim = routeAc.data[0]['claim'];
            if (claim) {
                if (!this.userOne.claims) {
                    this.toast.presentToast('Você não tem permissão para acessar esta pagina!', 'danger');
                    this.router.navigate(['/login']);
                    return false;
                }
                let userClaims = this.userOne.claims[claim.nome]?.some(x => x === claim.valor);
                if (!userClaims) {
                    this.toast.presentToast('Você não tem permissão para acessar esta pagina!', 'danger');
                    this.router.navigate(['/login']);
                    return false;
                }
            }
        }

        return true;
    }
}