<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';

import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import UEForm from '@/presentation/components/forms/UEForm.vue';
import CustomTable from '../components/tables/CustomTable.vue';

import { UE } from '@/domain/entities/Ue';
import { UEDAO } from '@/domain/daos/UEDAO';

const ue = ref<UE[]>([]);

const formatterEdition = (ue: UE) => {
  return '<i class="bi bi-pen-fill text-primary"></i>';
};

const formatterSuppression = (ue: UE) => {
  return '<i class="bi bi-trash-fill text-danger"></i>';
};

const onUeCreated = (newue: UE) => {
  ue.value.unshift(newue);
};

const onUeUpdated = (id: number, modifiedUe: UE) => {
    ue.value[id] = modifiedUe;
};

const onDeleteUe = (p: UE) => {
  Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer ce ue ?',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      UEDAO.getInstance().delete(p.ID!).then(() => {
        ue.value = ue.value.filter((ue) => ue.ID !== p.ID);
      }).catch(() => {
        alert('Une erreur est survenue lors de la suppression du ue');
      });
    }
  })
}

const columns = [
  { field: 'EditionUE', style: 'width: 32px;text-align:center;', label: 'Edition', formatter: formatterEdition, onClick: (p: UE) => ueForm.value?.openForm(p) },
  { field: 'ID', label: 'ID', formatter: null },
  { field: 'NumeroUe', label: 'Numéro', formatter: null, onClick: null },
  { field: 'Intitule', label: 'Intitulé', formatter: null, onClick: null },
  { field: 'DeleteUE', label: 'Suppression', formatter: formatterSuppression, onClick: onDeleteUe, style: 'width: 32px;text-align:center;' },
];

const ueForm = ref<typeof UEForm | null>(null);

onMounted(() => {
  UEDAO.getInstance().list().then((data) => {
    ue.value = data;
  });
});
</script>

<template>
  <div class="container-fluid">
    <div class="card mt-5">
      <div class="card-header">
        <div class="card-title">
          <h4>Liste des UES</h4>
        </div>
        <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.info" @click="() => ueForm?.openForm()">
          Ajouter une ue
        </CustomButton>
      </div>
      <div class="card-body">
        <CustomTable idAttribute="ID" :columns="columns" :data="ue" />
      </div>
    </div>
  </div>
  <UEForm ref="ueForm" @create:ue="onUeCreated" @update:ue="onUeUpdated" />
</template>