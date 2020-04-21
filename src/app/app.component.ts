import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'farmly-portal';
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  openXl(content) {
    this.modalService.open(content, { size: 'xl' });
  }
}
