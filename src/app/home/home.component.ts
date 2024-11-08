import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  constructor() {

  }

  selectFolder = async () => {
    const folderPath = await (window as any).api.selectFolder()
    console.log(folderPath)
  }

}
