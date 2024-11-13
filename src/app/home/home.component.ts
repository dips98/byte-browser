import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TreeTableModule } from 'primeng/treetable';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, PanelModule, TreeTableModule, CommonModule],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  window = (window as any)
  process_ongoing = false
  logs = ''
  stats: TreeNode[] = []
  uri = ''

  constructor (private zone: NgZone) { }

  ngOnInit(): void {
    this.window.api.onLogs((path: string) => {
      
      this.zone.run(() => {
        console.log(path)
        // this.logs =path
      })
    })
  }

  getFolderStats = async () => {
    const startTime = performance.now()
    this.logs = ""
    const folderPath = await (window as any).api.selectFolder();
    this.process_ongoing = true
    const folderStats = await (window as any).api.getFolderStats(folderPath);
    console.log(folderStats)
    this.process_ongoing = false
    const endTime = performance.now()
    console.log(`Test took ${(endTime - startTime) /1000} sec`)
  }

  import = async () => {
    const fileData = await this.window.api.importFile()
    if(fileData) this.stats = JSON.parse(fileData)
  }

}
