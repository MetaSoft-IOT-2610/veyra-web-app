import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';

const staffMemberList = () =>
  import('./views/staff-member-list/staff-member-list').then((m) => m.StaffMemberList);
const staffMemberForm = () =>
  import('./views/staff-member-form/staff-member-form').then((m) => m.StaffMemberForm);
const staffMemberDetail = () =>
  import('./views/staff-member-detail/staff-member-detail').then((m) => m.StaffMemberDetail);
const contractList = () =>
  import('./views/contract-list/contract-list').then((m) => m.ContractList);
const contractForm = () =>
  import('./views/contract-form/contract-form').then((m) => m.ContractForm);

/** Segmentos de ruta del módulo (usados en router config y navegación). */
export const hcmPaths = {
  staff: 'staff',
  staffDetail: 'staff/:id/show',
  staffNew: 'staff/new',
  staffEdit: 'staff/:id/edit',
  contractList: 'staff/:id/contracts',
  contractNew: 'staff/:id/contracts/new',
} as const;

/** Navegación programática: `router.navigate(hcmNav.staff())` */
export const hcmNav = {
  staff: () => ['/hcm', hcmPaths.staff],
  staffNew: () => ['/hcm', hcmPaths.staff, 'new'],
  staffDetail: (id: number | string) => ['/hcm', hcmPaths.staff, id, 'show'],
  staffEdit: (id: number | string) => ['/hcm', hcmPaths.staff, id, 'edit'],
  contracts: (staffId: number | string) => ['/hcm', hcmPaths.staff, staffId, 'contracts'],
  contractNew: (staffId: number | string) => ['/hcm', hcmPaths.staff, staffId, 'contracts', 'new'],
} as const;

const hcmRoutes: Routes = [
  definePageRoute({
    path: hcmPaths.staff,
    name: 'hcm.staff.list',
    loadComponent: staffMemberList,
    page: {
      title: 'Personal',
      module: 'Personal',
      description: 'Gestión del personal de la residencia',
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: hcmPaths.staffDetail,
    name: 'hcm.staff.detail',
    loadComponent: staffMemberDetail,
    page: {
      title: 'Detalle del personal',
      module: 'Personal',
      description: 'Información del miembro del equipo',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: hcmPaths.staffNew,
    name: 'hcm.staff.new',
    loadComponent: staffMemberForm,
    page: {
      title: 'Nuevo personal',
      module: 'Personal',
      description: 'Registrar un nuevo miembro del equipo',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: hcmPaths.staffEdit,
    name: 'hcm.staff.edit',
    loadComponent: staffMemberForm,
    page: {
      title: 'Editar personal',
      module: 'Personal',
      description: 'Actualizar datos del miembro del equipo',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: hcmPaths.contractList,
    name: 'hcm.contract.list',
    loadComponent: contractList,
    page: {
      title: 'Contratos',
      module: 'Personal',
      description: 'Contratos asociados al personal',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: hcmPaths.contractNew,
    name: 'hcm.contract.new',
    loadComponent: contractForm,
    page: {
      title: 'Nuevo contrato',
      module: 'Personal',
      description: 'Registrar un contrato para el personal',
      showBackButton: true,
    },
  }),
];

export { hcmRoutes };
