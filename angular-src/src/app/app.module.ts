import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PageNavComponent } from './components/page-nav/page-nav.component';
import { MembersComponent } from './components/members/members.component';
import { MemberstableComponent } from './components/memberstable/memberstable.component';
import { BusinessSettingsComponent } from './components/business-settings/business-settings.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { MembersService } from './services/members.service';

const appRoutes: Routes = [
{path: '', component: HomeComponent},
{path: 'register', component: RegisterComponent},
{path: 'login', component: LoginComponent},
{path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
{path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
{path: 'pricelist', component: BusinessSettingsComponent, canActivate: [AuthGuard]},
{path: 'members', component: MembersComponent, canActivate: [AuthGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    PageNavComponent,
    MembersComponent,
    MemberstableComponent,
    BusinessSettingsComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
  ],
  providers: [
    ValidateService,
    AuthService,
    AuthGuard,
    MembersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
