import { parentPort, workerData } from "worker_threads";
import { lstatSync, readdirSync, statSync } from 'original-fs';
import { TreeNode } from "primeng/api";

const getFolderStats = (thePath: string) => {
    const isDir = lstatSync(thePath).isDirectory()
    if(isDir) {
      const children = readdirSync(thePath)
      const ar: TreeNode[] = []
      var sum = 0
      for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const childStats = getFolderStats(`${thePath}/${child}`)
        if(childStats) {
          childStats.data.name = child
          ar.push(childStats)
          sum += childStats.data.size
        } 
      }
      return { data: { path: thePath, size: sum }, children: ar  }
    } else {
      const size = statSync(thePath).size
      return { data: { path: thePath, name: '', size: size }  }
    }
}

const folderStats = [getFolderStats(workerData.thePath)]
parentPort?.postMessage(folderStats)