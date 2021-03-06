import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  AuthenticationService, RegistrationService, EventDetail, EventRegistration,
  EventRegistrationGroup, EventPayment, SkinsType
} from '../../../core';
import { ToasterService } from 'angular2-toaster';
import { cloneDeep } from 'lodash';
import { PaymentComponent } from '../../../shared/payments/payment.component';

@Component({
  selector: 'app-skins',
  templateUrl: './skins.component.html',
  styleUrls: ['./skins.component.css']
})
export class SkinsComponent implements OnInit {

  @ViewChild(PaymentComponent, { static: false }) paymentComponent?: PaymentComponent;

  public eventDetail: EventDetail = new EventDetail({});
  public originalGroup: EventRegistrationGroup = new EventRegistrationGroup({});
  public group?: EventRegistrationGroup;  // This is the one bound to the user screen
  public paymentGroup?: EventRegistrationGroup; // This is the one bound to the payment modal
  public payment?: EventPayment;

  constructor(private authService: AuthenticationService,
    private registrationService: RegistrationService,
    private location: Location,
    private toaster: ToasterService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data
      .subscribe(data => {
        if (data.eventDetail instanceof EventDetail) {
          this.eventDetail = data.eventDetail;
          this.findGroup();
        }
      });
  }

  findGroup() {
    this.registrationService.getRegistrationGroup(this.eventDetail.id, this.authService.user.member.id)
      .subscribe((group: EventRegistrationGroup) => {
        this.originalGroup = cloneDeep(group);
        this.group = group;
        this.payment = new EventPayment();
        this.originalGroup.registrations.forEach(reg => {
          if (this.eventDetail.skinsType === SkinsType.None) {
            reg.disableSkins = true;
          } else if (this.eventDetail.skinsType === SkinsType.Team) {
            reg.disableSkins = (reg.slotNumber > 0);
          }
        });
      });
  }

  cancelSkins(): void {
    this.location.back();
  }

  hasSkins(id: number, skinsType: string): boolean {
    if (skinsType.toLowerCase() === 'net') {
      return this.originalGroup.registrations.some(r => r.id === id && (r.isNetSkinsFeePaid || r.disableSkins));
    }
    return this.originalGroup.registrations.some(r => r.id === id && (r.isGrossSkinsFeePaid || r.disableSkins));
  }

  hasGreensFee(id: number): boolean {
    return this.originalGroup.registrations.some(r => r.id === id && r.isGreensFeePaid);
  }

  hasCartFee(id: number): boolean {
    return this.originalGroup.registrations.some(r => r.id === id && r.isCartFeePaid);
  }

  newFees(reg: EventRegistration): number {
    let fee = 0.0;
    const original: any = this.originalGroup.registrations.find(r => r.id === reg.id);
    if (original && reg.isGreensFeePaid && !original.isGreensFeePaid) {
      fee += this.eventDetail.greensFee;
    }
    if (original && reg.isGrossSkinsFeePaid && !original.isGrossSkinsFeePaid) {
      fee += this.eventDetail.skinsFee;
    }
    if (original && reg.isNetSkinsFeePaid && !original.isNetSkinsFeePaid) {
      fee += this.eventDetail.skinsFee;
    }
    if (original && reg.isCartFeePaid && !original.isCartFeePaid) {
      fee += this.eventDetail.cartFee;
    }
    return fee;
  }

  updatePayment(): void {
    if (this.group && this.payment) {
      let subtotal = 0.0;
      this.group.registrations.forEach(reg => {
        subtotal += this.newFees(reg);
      });
      this.payment.update(subtotal);
    }
  }

  openPayment(): void {
    if (this.group && this.payment) {
      this.paymentGroup = cloneDeep(this.group);
      this.paymentGroup.payment = this.payment;
      // only submit registrations that have been touched
      const registrations = [];
      for (let i = 0; i < this.originalGroup.registrations.length; i++) {
        const touched = (this.group.registrations[i].isNetSkinsFeePaid && !this.originalGroup.registrations[i].isNetSkinsFeePaid) ||
          (this.group.registrations[i].isGrossSkinsFeePaid && !this.originalGroup.registrations[i].isGrossSkinsFeePaid) ||
          (this.group.registrations[i].isGreensFeePaid && !this.originalGroup.registrations[i].isGreensFeePaid) ||
          (this.group.registrations[i].isCartFeePaid && !this.originalGroup.registrations[i].isCartFeePaid);
        if (touched) {
          registrations.push(cloneDeep(this.group.registrations[i]));
        }
      }
      if (registrations.length > 0) {
        this.paymentGroup.registrations = registrations;
        if (this.paymentComponent) {
          this.paymentComponent.open();
        }
      }
    }
  }

  paymentComplete(result: boolean): void {
    if (result) {
      this.location.back();
    }
  }
}
