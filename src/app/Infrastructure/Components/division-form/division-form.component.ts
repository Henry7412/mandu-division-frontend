import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { Division } from '../../Modules/Division.model';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-division-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
  ],
  templateUrl: './division-form.component.html',
  styleUrl: './division-form.component.scss',
})
export class DivisionFormComponent implements OnInit {
  form!: FormGroup;
  divisions: Division[] = [];
  initialData: any;

  @Output() submitForm = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: { divisions: Division[], initialData?: any }
  ) { }

  ngOnInit(): void {
    this.divisions = this.data.divisions || [];
    this.initialData = this.data.initialData || null;

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      level: [null, [Validators.required]],
      collaborators: [null, [Validators.required]],
      ambassador: [''],
      parentDivisionId: [null],
    });

    if (this.initialData) {
      this.form.patchValue({
        ...this.initialData,
        parentDivisionId: this.initialData.parentDivision?.id || null,
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }
}
