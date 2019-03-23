import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';

import { debounceTime } from 'rxjs/operators';

import { Customer } from './customer';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmControl.value) {
    return null;
  }
  return { 'match': true };
}

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { 'range': true };
    }
    return null;
  };
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();
  emailMessage: string;
  card1Expanded: boolean;
  card2Expanded: boolean;
  card3Expanded: boolean;
  card4Expanded: boolean;
  card5Expanded: boolean;
  card6Expanded: boolean;
  phase1: boolean;
  phase2: boolean
  phase3: boolean;
  phase4: boolean;
  phase5: boolean;
  phase6: boolean;
  total: number =0;
  private validationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };

  get addresses(): FormArray {
    return <FormArray>this.customerForm.get('addresses');
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      company: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      }, { validator: emailMatcher }),
      phone: '',
      notification: 'email',
      rating: [null, ratingRange(1, 5)],
      sendCatalog: true,
      phase1: false,
      phase2: false,
      phase3: false,
      phase4: false,
      phase5: false,
      p1_addon_1: false,
      p1_addon_2: false,
      p1_addon_3: false,
      p1_addon_4: false,
      p1_addon_5: false,
      p2_addon_1: false,
      p2_addon_2: false,
      p2_addon_3: false,
      p2_addon_4: false,
      p2_addon_5: false,
      p2_addon_6: false,
      p2_addon_7: false,
      p3_addon_1: false,
      p3_addon_2: false,
      p3_addon_3: false,
      p4_addon_1: false,
      p4_addon_2: false,
      p4_addon_3: false,
      p4_addon_4: false,
      p4_addon_5: false,
      p5_addon_1: false,
      p5_addon_2: false,
      p5_addon_3: false,
      p5_addon_4: false,
      p5_addon_5: false,
      p5_addon_6: false,
      p5_addon_7: false,
      p5_addon_8: false,
      p5_addon_9: false,
      p5_addon_10: false,
      p5_addon_11: false,
      p5_addon_12: false,
      p5_addon_13: false,
      card1Expanded: false,
      card2Expanded: false,
      card3Expanded: false,
      card4Expanded: false,
      card5Expanded: false,
      card6Expanded: false,
      p6_addon_1: false,
      p6_addon_2: false,
      p6_addon_3: false,
      p6_addon_4: false,
      p6_addon_5: false,
      p6_addon_6: false,
      p6_addon_7: false,
      addresses: this.fb.array([this.buildAddress()])
    });

    this.customerForm.get('notification').valueChanges.subscribe(
      value => this.setNotification(value)
    );

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMessage(emailControl)
    );
  }

  addAddress(): void {
    this.addresses.push(this.buildAddress());
  }

  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: ['', Validators.required],
      street2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

  populateTestData(): void {
    this.customerForm.patchValue({
      firstName: 'Jack',
      lastName: 'Harkness',
      emailGroup: { email: 'jack@torchwood.com', confirmEmail: 'jack@torchwood.com' }
    });
    const addressGroup = this.fb.group({
      addressType: 'work',
      street1: 'Mermaid Quay',
      street2: '',
      city: 'Cardiff Bay',
      state: 'CA',
      zip: ''
    });
    this.customerForm.setControl('addresses', this.fb.array([addressGroup]));
  }

  save() {
    console.log(this.customerForm);
    if (this.customerForm.get('phase1')){
      this.total = this.total + 46048;
    }
    if (this.customerForm.get('phase2')){
      this.total = this.total + 46048;
    }
    if (this.customerForm.get('phase3')){
      this.total = this.total + 46048;
    }
    if (this.customerForm.get('phase4')){
      this.total = this.total + 76582;
    }
    if (this.customerForm.get('phase5')){
      this.total = this.total + 204699;
    }
    if (this.customerForm.get('phase6')){
      this.total = this.total + 128499;
    }
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    console.log('Total: ', this.total);
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    console.log(this.validationMessages);
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.emailMessage += this.validationMessages[key]).join(' ');
    }
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

}
