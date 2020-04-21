import { Component,OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'farmly-portal';
  closeResult: string;
  trucks;
  currentTruck;
  currentDelivery;
  deliveries;
  deliveryDates;
  stops;
  inventory;

  constructor(private modalService: NgbModal,private http:HttpClient) {
    this.trucks = [];
    this.currentTruck = this.trucks ? this.trucks[0] : null;
    this.currentDelivery = this.currentTruck ? this.currentTruck['deliveries'][0] : null 
    // console.log(JSON.stringify(this.currentDelivery))

  }

  

  openXl(content,index=0) {
    this.currentTruck = this.trucks[index]
    this.deliveries = this.currentTruck ? this.currentTruck['deliveries'] : null
    this.currentDelivery = this.currentTruck['deliveries'][0]
    let duplicateStops = this.currentDelivery['route'].split('->').slice(1,)
    this.stops = duplicateStops.reduce(function(acc, cur) {
      if (acc.prev !== cur) {
        acc.result.push(cur);
        acc.prev = cur;
      }
      return acc;
    }, {
      result: []
    }).result;
    this.inventory = []
    this.currentDelivery['inventory'].map(product=>this.inventory.push(`${product['product']['sharetribeid'].slice(0,4)} - ${product['product']['name']}`))
    this.modalService.open(content, { size: 'xl' });
  }

  setDelivery(index=0){
    this.currentDelivery = this.currentTruck['deliveries'][index]
    let duplicateStops = this.currentDelivery['route'].split('->').slice(1,)
    this.stops = duplicateStops.reduce(function(acc, cur) {
      if (acc.prev !== cur) {
        acc.result.push(cur);
        acc.prev = cur;
      }
      return acc;
    }, {
      result: []
    }).result;
    this.inventory = []
    console.log(this.currentDelivery['inventory'])
    this.currentDelivery['inventory'].map(product=>this.inventory.push(`${product['product']['sharetribeId'].slice(0,4)} - ${product['product']['name']}`))
  }

  getNextDelivery(truckIndex=0){
    let deliveries = this.trucks[truckIndex]['deliveries']
    this.deliveryDates = []
    deliveries.map(delivery=>(typeof delivery.deliveryDate == 'object' ? this.deliveryDates.push(delivery.deliveryDate['$date']) : ''))
    // console.log(Math.max((...this.deliveryDates)))
    let today = new Date().getTime()
    let nextDelivery = 1;
    this.deliveryDates.map(date=>date>nextDelivery ? nextDelivery = date : '')
    return new Date(nextDelivery * 1000).toUTCString().slice(0,12);
  }

  formattedDate(date){
    return new Date(date['$date'] * 1000).toUTCString().slice(0,12);
  }

  ngOnInit(){
    let getTrucksEndpoint = 'http://localhost:5000/get-trucks'
    this.http.get(getTrucksEndpoint).subscribe(
      response=>{
        this.trucks = response['data']
      }
    )
  }
}
