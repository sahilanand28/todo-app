import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule],
  template: `
    <mat-toolbar color="primary">Todo App</mat-toolbar>
    <div class="main-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .main-container {
        padding: 16px;
      }
    `,
  ],
})
export class AppComponent {
  title = 'Todo App';
}
