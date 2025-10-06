import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DivisionService } from '../../../Application/Division/Services/division.service';
import { Division } from '../../Modules/Division.model';
import { DivisionFormComponent } from '../division-form/division-form.component';
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-division-list',
  standalone: true,
  imports: [CommonModule,
    NzTableModule,
    NzSpinModule,
    NzButtonModule,
    NzSelectModule,
    NzIconModule,],
  templateUrl: './division-list.component.html',
  styleUrl: './division-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DivisionListComponent implements OnInit {
  divisions: Division[] = [];
  subdivisionsMap: { [divisionId: number]: Division[] } = {};
  loading = true;
  viewMode: 'list' | 'tree' = 'list';
  activeTab: 'divisions' | 'collaborators' = 'divisions';
  rowSelection = {
    type: 'checkbox'
  };

  constructor(
    private divisionService: DivisionService,
    private modal: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.loadDivisions();
  }

  loadDivisions(): void {
    this.divisionService.getAllDivisions().subscribe({
      next: (data) => {
        this.divisions = data.data.items;
        this.loading = false;

        // Cargar subdivisiones para cada división
        this.divisions.forEach((div) => {
          this.divisionService.getSubdivisions(div.id).subscribe({
            next: (subs) => {
              this.subdivisionsMap[div.id] = subs.data.items || [];
            },
            error: () => {
              this.subdivisionsMap[div.id] = [];
            },
          });
        });
      },
      error: (err) => {
        console.error('❌ Error al cargar divisiones:', err);
        this.loading = false;
      },
    });
  }

  // Crear nueva división
  openCreateModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Crear nueva división',
      nzContent: DivisionFormComponent,
      nzData: { divisions: this.divisions },
      nzFooter: null,
    });

    const instance = modalRef.getContentComponent();

    instance.submitForm.subscribe((formValue: any) => {
      this.divisionService.createDivision(formValue).subscribe({
        next: () => {
          this.message.success('✅ División creada correctamente');
          modalRef.close();
          this.loadDivisions();
        },
        error: () => {
          this.message.error('❌ Error al crear división');
        },
      });
    });
  }

  // Editar división existente
  openEditModal(division: Division): void {
    const modalRef = this.modal.create({
      nzTitle: 'Editar división',
      nzContent: DivisionFormComponent,
      nzData: {
        divisions: this.divisions,
        initialData: division,
      },
      nzFooter: null,
    });

    const instance = modalRef.getContentComponent();

    instance.submitForm.subscribe((formValue: any) => {
      this.divisionService.updateDivision(division.id, formValue).subscribe({
        next: () => {
          this.message.success('✏️ División actualizada correctamente');
          modalRef.close();
          this.loadDivisions();
        },
        error: () => {
          this.message.error('❌ Error al actualizar división');
        },
      });
    });
  }

  // Eliminar división
  deleteDivision(id: number): void {
    this.divisionService.deleteDivision(id).subscribe({
      next: () => {
        this.message.success('🗑️ División eliminada correctamente');
        this.loadDivisions();
      },
      error: () => {
        this.message.error('❌ Error al eliminar división');
      },
    });
  }

  get totalCollaborators(): number {
    return this.divisions.reduce((acc, div) => acc + (div.collaborators || 0), 0);
  }

  openSubdivisionsModal(division: Division): void {
    const subs = this.subdivisionsMap[division.id] || [];

    this.modal.info({
      nzTitle: `Subdivisiones de ${division.name}`,
      nzContent: subs.length > 0
        ? subs.map(sub => `• ${sub.name} (Nivel: ${sub.level}, Colaboradores: ${sub.collaborators})`).join('<br>')
        : 'No hay subdivisiones registradas.',
      nzOkText: 'Cerrar',
      nzWidth: 600,
    });
  }


}
