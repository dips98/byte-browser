import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TreeTableModule } from 'primeng/treetable';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, PanelModule, TreeTableModule, CommonModule, InputNumberModule, FormsModule],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  window = (window as any)
  process_ongoing = false
  stats: TreeNode[] = []
  uri = ''
  searchFilter = 0

  constructor (private messageService: MessageService) { }

  ngOnInit(): void {}

  getFolderStats = async () => {
    const startTime = new Date().getTime()
    console.log(startTime)
    const folderPath = await (window as any).api.selectFolder();
    this.process_ongoing = true
    const folderStats = await (window as any).api.getFolderStats(folderPath);
    this.stats = [folderStats]
    this.process_ongoing = false
    const endTime = new Date().getTime()
    console.log(endTime)
    console.log(`Test took ${(endTime - startTime) /1000} sec`)
    this.messageService.add({ severity: 'success', summary: 'Process complete', detail: 'Successfully fetched stats for '+ folderPath });
  }

  import = async () => {
    const fileData = await this.window.api.importFile()
    if(fileData) this.stats = JSON.parse(fileData)
    this.messageService.add({ severity: 'success', summary: 'Import complete', detail: 'Successfully imported json' });
  }

}