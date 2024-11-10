import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TreeTableModule } from 'primeng/treetable';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, PanelModule, TreeTableModule],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  window = (window as any)
  process_ongoing = false
  logs: string[] = []
  stats: TreeNode[] = []

  constructor() { }

  selectFolder = async () => {
    this.process_ongoing = true
    const folderPath = await (window as any).api.selectFolder();
    if (folderPath) {
      this.logs = []
      this.stats = []
      const stats = await this.getFolderStats(folderPath)
      if (!this.process_ongoing) {
        this.logs.push("Process cancelled")
      } else if(stats) {
        this.stats = [ stats ]
      }
    }
    this.process_ongoing = false
  }

  getFolderStats = async (thePath: string) => {
    if(!this.process_ongoing) return
    this.logs.push(thePath)
    const isDir = await this.window.api.isDirectory(thePath)
    if(isDir) {
      const children = await this.window.api.readDir(thePath)
      const ar: TreeNode[] = []
      var sum = 0
      for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const childStats = await this.getFolderStats(`${thePath}/${child}`)
        if(childStats) {
          ar.push(childStats)
          sum += childStats.data.size
        } 
      }
      return { data: { path: thePath, size: sum }, children: ar  }
    } else {
      const size = await this.window.api.fileSize(thePath)
      return { data: { path: thePath, size: size }  }
    }
  }

}
