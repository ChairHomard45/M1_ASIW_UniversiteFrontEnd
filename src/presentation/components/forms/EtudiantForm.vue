<template>
  <CustomModal :isOpen="isOpen">
    <template v-slot:title>
      <template v-if="currentEtudiant && currentEtudiant.ID"> Modification de l'etudiant </template>
      <template v-else> Nouvelle Etudiant </template>
    </template>
    <template v-slot:body>
      <div class="text-start mt-1 mb-1">
        <form>
          <CustomInput v-model="currentEtudiant.NumEtud" id="NumEtud" libelle="NumEtud" type="text"
                       placeholder="Numéro Etudiant" :error="formErrors.NumEtud" />
          <CustomInput v-model="currentEtudiant.Nom" class="mt-2" id="nom" libelle="Nom" type="text"
                       placeholder="Nom de l'Etudiant" :error="formErrors.Nom" />
          <CustomInput v-model="currentEtudiant.Prenom" class="mt-2" id="prenom" libelle="Prenom" type="text"
                       placeholder="Prenom de l'Etudiant" :error="formErrors.Prenom" />
          <CustomInput v-model="currentEtudiant.Email" class="mt-2" id="email" libelle="Email" type="email"
                       placeholder="Email de l'Etudiant" :error="formErrors.Email" />
          <div class="form-group">
            <label for="intitule">Parcours :</label>
            <v-select label="NomParcours" v-model="currentEtudiant.Parcours"
                      :options="parcoursOptions"></v-select>
            <div v-if="formErrors.Parcours" class="invalid-feedback">
              {{ formErrors.Parcours }}
            </div>
          </div>
        </form>
      </div>
      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.danger" @click="closeForm">
        Annuler
      </CustomButton>
      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.primary" @click="saveEtudiant">
        Enregistrer
      </CustomButton>
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import CustomModal from '@/presentation/components/modals/CustomModal.vue';
import { defineExpose, defineProps, onBeforeMount, ref, watch } from 'vue';
import { Etudiant } from '@/domain/entities/Etudiant';
import { EtudiantDAO } from '@/domain/daos/EtudiantDAO';
import type { Parcours } from '@/domain/entities/Parcours';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';

const currentEtudiant = ref<Etudiant>(new Etudiant(null, null, null, null, null, null));
const isOpen = ref(false);

const parcoursOptions = ref<Parcours[]>([]);

const emit = defineEmits(['create:etudiant', 'update:etudiant']);

const openForm = (etudiant: Etudiant | null = null) => {
  isOpen.value = true;

  if (etudiant) {
    currentEtudiant.value = etudiant;
  } else {
    currentEtudiant.value = new Etudiant(null, null, null, null, null, null);
  }
};

const closeForm = () => {
  isOpen.value = false;
  currentEtudiant.value = new Etudiant(null, null, null, null, null, null);
};

const saveEtudiant = () => {
  if (formErrors.value.NumEtud || formErrors.value.Nom || formErrors.value.Prenom || formErrors.value.Prenom || formErrors.value.Email) {
    return;
  }

  if (currentEtudiant.value.ID) {
    EtudiantDAO.getInstance().update(currentEtudiant.value.ID,currentEtudiant.value).then((modifiedEtudiant) => {
      alert('Etudiant Modifier avec succès');
      emit('update:etudiant', modifiedEtudiant);
      closeForm();
    }).catch((ex) => {
      alert(ex.message);
    });
  } else {
    EtudiantDAO.getInstance().create(currentEtudiant.value).then((newEtudiant) => {
      alert('Etudiant créé avec succès');
      emit('create:etudiant', newEtudiant);
      closeForm();
    }).catch((ex) => {
      alert(ex.message);
    });
  }
};

const formErrors = ref<{
  NumEtud : string | null;
  Nom: string | null;
  Prenom: string | null;
  Email: string | null;
  Parcours: Parcours | null;
}>({ NumEtud : null,
  Nom: null,
  Prenom: null,
  Email: null,
  Parcours: null
});

const props = defineProps({
  etudiant: {
    type: Object as () => Etudiant | null,
    required: false,
    default: null,
  },
});

onBeforeMount(() => {
  if (props.etudiant) {
    currentEtudiant.value = props.etudiant;
  }

  // Chargement de la liste des parcours
  ParcoursDAO.getInstance().list().then((parcours) => {
    parcoursOptions.value = parcours
  });
});

defineExpose({
  openForm,
  closeForm,
});

watch(() => currentEtudiant.value.NumEtud, () => {
  if (!currentEtudiant.value.NumEtud
    || currentEtudiant.value.NumEtud.trim() === ''
    || currentEtudiant.value.NumEtud.length < 3) {
    formErrors.value.NumEtud = 'Le numéro etudiant doit faire au moins 3 caractères';
  } else {
    formErrors.value.NumEtud = null;
  }
});

</script>