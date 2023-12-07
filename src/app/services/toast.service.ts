import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastOptions } from '../interface/toast-options.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async presentToast(options: ToastOptions) {
    const toast = await this.toastController.create(options);
    await toast.present();
  }
}
