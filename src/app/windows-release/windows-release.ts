import { Component } from '@angular/core';
import { WindowsVariantUpload } from "../windows-variant-upload/windows-variant-upload";

@Component({
  selector: 'app-windows-release',
  imports: [WindowsVariantUpload],
  templateUrl: './windows-release.html',
  styleUrl: './windows-release.css',
})
export class WindowsRelease {

}
