import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginPage {
  protected form!: FormGroup;
  protected hidePassword: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ionViewWillEnter() {
    this.form.reset();
  }

  protected async login() {
    if (this.form.valid) {
      const account = {
        username: this.form.get('username')?.value,
        password: this.form.get('password')?.value,
      };

      (await this.authService.login(account)).subscribe({
        next: async (response) => {},
        error: (error) => {
          console.error('Error', error);
        },
        complete: () => {},
      });
    }
  }

  protected togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  protected toRegister() {
    this.router.navigateByUrl('/register');
  }

  protected getErrorText(controlName: string): string {
    const control = this.form.get(controlName)!;

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    return '';
  }
}
