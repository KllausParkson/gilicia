import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private NativeStorage: NativeStorage) { }

  public set(key: string, item: any) {
    this.NativeStorage.setItem(key, item)
      .then(
        () => { },
        error => console.error('Error storing item', error)
      );
  }

  public get(key: string) {
    return this.NativeStorage.getItem(key)
  }

  public clear() {
    return this.NativeStorage.clear()
  }

  public remove(key: string) {
    return this.NativeStorage.remove(key)
  }

  public getKeys() {
    return this.NativeStorage.keys()
  }
}
