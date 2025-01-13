<script setup lang="ts">

import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import EtudiantForm from '@/presentation/components/forms/EtudiantForm.vue';
import CustomTable from '@/presentation/components/tables/CustomTable.vue';
import { onMounted, ref } from 'vue';
import { Etudiant } from '@/domain/entities/Etudiant';
import Swal from 'sweetalert2';
import { EtudiantDAO } from '@/domain/daos/EtudiantDAO';

const etudiant = ref<Etudiant[]>([]);

const formatterEdition = (etudiant: Etudiant) => {
  return '<i class="bi bi-pen-fill text-primary"></i>';
};

const formatterSuppression = (etudiant: Etudiant) => {
  return '<i class="bi bi-trash-fill text-danger"></i>';
};

const formatterParcours = (etudiant: Etudiant) => {
  return etudiant.Parcours?.NomParcours || '';
};

const onEtudiantCreated = (newEtudiant: Etudiant) => {
  etudiant.value.unshift(newEtudiant);
};

const onEtudiantUpdated = (id: number, modifiedEtudiant: Etudiant) => {
  etudiant.value[id] = modifiedEtudiant;
};

const onDeleteEtudiant = (p: Etudiant) => {
  Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer cette etudiant ?',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      EtudiantDAO.getInstance().delete(p.ID!).then(() => {
        etudiant.value = etudiant.value.filter((etudiants) => etudiants.ID !== p.ID);
      }).catch(() => {
        alert('Une erreur est survenue lors de la suppression de l`etudiant');
      });
    }
  })
}

const columns = [
  { field: 'EditionEtudiant', style: 'width: 32px;text-align:center;', label: 'Edition', formatter: formatterEdition, onClick: (p: Etudiant) => etudiantForm.value?.openForm(p) },
  { field: 'ID', label: 'ID', formatter: null },
  { field: 'NumEtud', label: 'NumEtud', formatter: null, onClick: null },
  { field: 'Nom', label: 'Nom', formatter: null, onClick: null },
  { field: 'Prenom', label: 'Prenom', formatter: null, onClick: null },
  { field: 'Email', label: 'Email', formatter: null, onClick: null },
  { field: 'Parcours', label: 'Parcours', formatter: formatterParcours, onClick: null },
  { field: 'DeleteEtudiant', label: 'Suppression', formatter: formatterSuppression, onClick: onDeleteEtudiant, style: 'width: 32px;text-align:center;' },
];

const etudiantForm = ref<typeof EtudiantForm | null>(null);

onMounted(() => {
  EtudiantDAO.getInstance().list().then((data) => {
    etudiant.value = data;
  });
});
</script>

<template>
  <div class="container-fluid">
    <div class="card mt-5">
      <div class="card-header">
        <div class="card-title">
          <h4>Liste des Etudiants</h4>
        </div>
        <CustomButton class="mt-1" :color="BootstrapButtonEnum.info" @click="() => etudiantForm?.openForm()">
          Ajouter un Etudiant
        </CustomButton>
      </div>
      <div class="card-body">
        <CustomTable idAttribute="ID" :columns="columns" :data="etudiant" />
      </div>
    </div>
  </div>
  <EtudiantForm ref="etudiantForm" @create:etudiant="onEtudiantCreated" @update:etudiant="onEtudiantUpdated" />
</template>
