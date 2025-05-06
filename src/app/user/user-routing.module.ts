import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../shared/interceptors/auth-interceptor';

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'USER' }
  },
  {
    path: 'movie/:id',
    component: MovieDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'USER' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true } ]
})
export class UserRoutingModule { }
