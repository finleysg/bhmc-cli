import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  AuthenticationService, RegistrationService, EventDetail, EventRegistration,
  SlotPayment, EventRegistrationGroup, EventPayment
} from '../../../core';
import { ToasterService } from 'angular2-toaster';
import { cloneDeep } from 'lodash';
import { map, tap, catchError } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';
import { PaymentComponent } from '../../../shared/payments/payment.component';

@Component({
  selector: 'app-skins',
  templateUrl: './skins.component.html',
  styleUrls: ['./skins.component.css']
})
export class SkinsComponent implements OnInit {

  @ViewChild(PaymentComponent) paymentComponent: PaymentComponent;

  public eventDetail: EventDetail;
  public originalGroup: EventRegistrationGroup;
  public group: EventRegistrationGroup;  // This is the one bound to the user screen
  public paymentGroup: EventRegistrationGroup; // This is the one bound to the payment modal
  public payment: EventPayment;

  constructor(private authService: AuthenticationService,
    private registrationService: RegistrationService,
    private location: Location,
    private toaster: ToasterService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { eventDetail: EventDetail }) => {
        this.eventDetail = data.eventDetail;
        this.findGroup();
      });
  }

  findGroup() {
    this.registrationService.getRegistrationGroup(this.eventDetail.id, this.authService.user.member.id)
      .subscribe((group: EventRegistrationGroup) => {
        this.originalGroup = cloneDeep(group);
        this.group = group;
        this.payment = new EventPayment();
      });
  }

  cancelSkins(): void {
    this.location.back();
  }

  hasSkins(id: number, skinsType: string): boolean {
    if (skinsType.toLowerCase() === 'net') {
      return this.originalGroup.registrations.some(r => r.id === id && r.isNetSkinsFeePaid);
    }
    return this.originalGroup.registrations.some(r => r.id === id && r.isGrossSkinsFeePaid);
  }

  hasGreensFee(id: number): boolean {
    return this.originalGroup.registrations.some(r => r.id === id && r.isGreensFeePaid);
  }

  newFees(reg: EventRegistration): number {
    let fee = 0.0;
    const original: EventRegistration = this.originalGroup.registrations.find(r => r.id === reg.id);
    if (original && reg.isGreensFeePaid && !original.isGreensFeePaid) {
      fee += this.eventDetail.greensFee;
    }
    if (original && reg.isGrossSkinsFeePaid && !original.isGrossSkinsFeePaid) {
      fee += this.eventDetail.skinsFee;
    }
    if (original && reg.isNetSkinsFeePaid && !original.isNetSkinsFeePaid) {
      fee += this.eventDetail.skinsFee;
    }
    return fee;
  }

  updatePayment(): void {
    let subtotal = 0.0;
    this.group.registrations.forEach(reg => {
      subtotal += this.newFees(reg);
    });
    this.payment.update(subtotal);
  }

  openPayment(): void {
    this.paymentGroup = cloneDeep(this.group);
    this.paymentGroup.payment = this.payment;
    // only submit registrations that have been touched
    const registrations = [];
    for (let i = 0; i < this.originalGroup.registrations.length; i++) {
      const touched = (this.group.registrations[i].isNetSkinsFeePaid && !this.originalGroup.registrations[i].isNetSkinsFeePaid) ||
        (this.group.registrations[i].isGrossSkinsFeePaid && !this.originalGroup.registrations[i].isGrossSkinsFeePaid) ||
        (this.group.registrations[i].isGreensFeePaid && !this.originalGroup.registrations[i].isGreensFeePaid);
      if (touched) {
        registrations.push(cloneDeep(this.group.registrations[i]));
      }
    }
    if (registrations.length > 0) {
      this.paymentGroup.registrations = registrations;
      this.paymentComponent.open();
    }
  }

  paymentComplete(result: boolean): void {
    if (result) {
      this.location.back();
    }
  }
}
