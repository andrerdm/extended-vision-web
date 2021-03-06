import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { FirebaseProvider } from '../../providers/firebase/FirebaseProvider';
import { AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { BeaconData } from '../../models/BeaconData';
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public user: string;
    public beaconList: Observable<BeaconData[]>;
    public closeResult: string;
    public selectedBeacon: BeaconData;

    constructor(public fp: FirebaseProvider, public modalService: NgbModal) {
    }

    ngOnInit() {
        this.beaconList = this.fp.listBeacons();
        this.beaconList.forEach(console.log);
    }

    edit(content, oldBeacon: BeaconData) {
        this.selectedBeacon = {
            key: oldBeacon.key,
            name: oldBeacon.name,
            id: oldBeacon.id,
            signalStrength: oldBeacon.signalStrength,
            message: oldBeacon.message
        };

        this.modalService.open(content).result.then(newBeacon => {
            console.log(newBeacon);
            this.fp.update(oldBeacon, newBeacon);
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult);
        });
    }

    exclude(content, b) {
        this.modalService.open(content).result.then(result => {
            this.fp.delete(b); 
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult);
        });
    }

    create(content) {
        this.selectedBeacon = {
            name: "",
            id: "",
            signalStrength: "",
            message: ""
        };

        this.modalService.open(content).result.then(result => {
            this.fp.create(result);
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult);
        });
    }
    
    getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

    getSignal(level) {
        console.log(level);
        switch(level) {
            case '1' : 
                return "Fraco - 1M";
            case '2' :
                return "Médio - 2M";
            case '3' :
                return "Forte - 3M";
            default :
                return "Forte - 3M";
        }
    }

}
