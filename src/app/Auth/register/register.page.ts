import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { AccountModel } from 'src/app/model/account.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class RegisterPage {
  form!: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      name: '',
      username: '',
      email: '',
      password: '',
      phone: '',
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  register() {
    const newAccount: AccountModel = {
      name: this.form.get('name')?.value,
      email: this.form.get('email')?.value,
      phone: this.form.get('phone')?.value,
      username: this.form.get('username')?.value,
      password: this.form.get('password')?.value,
      createDate: new Date(),
      updateDate: new Date(),
      role: 'user',
      projects: [],
    };

    this.authService.register(newAccount).subscribe({
      next: (response) => {
        console.log('Successfully Create an account.');
      },
      error: (error) => {
        console.error('Error', error);
      },
      complete: () => {
        this.router.navigateByUrl('/login');
      },
    });
  }

  toLogin() {
    this.router.navigateByUrl('/login');
  }
}
