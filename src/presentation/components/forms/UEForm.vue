<template>
  <CustomModal :isOpen="isOpen">
    <template v-slot:title>
      <template v-if="currentUe && currentUe.ID"> Modification de l'UE </template>
      <template v-else> Nouvelle UE </template>
    </template>
    <template v-slot:body>
      <div class="text-start mt-1 mb-1">
        <form>
          <CustomInput v-model="currentUe.NumeroUe" class="mt-2" id="numeroue" libelle="Numéro" type="text"
                       placeholder="Numéro d'UE" :error="formErrors.NumeroUe" />
          <CustomInput v-model="currentUe.Intitule" id="intitule" libelle="Intitulé" type="text"
                       placeholder="Intitulé de l'UE" :error="formErrors.Intitule" />
          <div class="form-group">
            <label for="intitule">Parcours :</label>
            <v-select multiple label="NomParcours" v-model="currentUe.Parcours"
                      :options="parcoursOptions"></v-select>
            <div v-if="formErrors.parcours" class="invalid-feedback">
              {{ formErrors.parcours }}
            </div>
          </div>
        </form>
      </div>

      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.danger" @click="closeForm">
        Annuler
      </CustomButton>
      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.primary" @click="saveUE">
        Enregistrer
      </CustomButton>
    </template>
  </CustomModal>
</template>

<script setup lang="ts">

import { ref, onBeforeMount, defineExpose, defineProps, watch } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import { UE } from '@/domain/entities/Ue';

import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import CustomModal from '@/presentation/components/modals/CustomModal.vue';

import { UEDAO } from '@/domain/daos/UEDAO';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';
import type { Parcours } from '@/domain/entities/Parcours';



const currentUe = ref<UE>(new UE(null, null, null, null));

const isOpen = ref(false);

const formErrors = ref<{
  NumeroUe: string | null;
  Intitule: string | null;
  parcours: string | null;
}>({
  NumeroUe: null,
  Intitule: null,
  parcours: null,
});



const parcoursOptions = ref<Parcours[]>([]);

const openForm = (ue: UE | null = null) => {
  isOpen.value = true;
  if (ue) {
    currentUe.value = ue;
  } else {
    currentUe.value = new UE(null,null,null,null);
  }
};

const closeForm = () => {
  isOpen.value = false;
  currentUe.value = new UE(null, null, null, null);
};



const saveUE = () => {

  if (formErrors.value.Intitule || formErrors.value.NumeroUe) {
    return;
  }

  if (currentUe.value.ID) {

    UEDAO.getInstance().update(currentUe.value.ID,currentUe.value).then((modifiedUE) => {
      alert('Ue Modifier avec succès');
      emit('update:ue', modifiedUE);
      closeForm();
    }).catch((ex) => {
      alert(ex.message);
    });

  } else {
    UEDAO.getInstance().create(currentUe.value).then((newUE) => {
      alert('UE créée avec succès');
      emit('create:ue', newUE);
      closeForm();
    }).catch((ex) => {
      alert(ex.message);
    });
  }
};



const props = defineProps({
  ue: {
    type: Object as () => UE | null,
    required: false,
    default: null,
  },
});



const emit = defineEmits(['create:ue', 'update:ue']);

onBeforeMount(() => {
  if (props.ue) {
    currentUe.value = props.ue;
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



watch(() => props.ue, (newUE) => {
  if (newUE) {
    currentUe.value = newUE;
    openForm();
  }
});



watch(() => currentUe.value.Intitule, () => {
  if (!currentUe.value.Intitule || currentUe.value.Intitule.trim() === '' || currentUe.value.Intitule.length < 3) {
    formErrors.value.Intitule = 'L\'intitulé doit faire au moins 3 caractères';
  } else {
    formErrors.value.Intitule = null;
  }
});

watch(() => currentUe.value.NumeroUe, () => {
  if (!currentUe.value.NumeroUe || currentUe.value.NumeroUe.trim() === '' || currentUe.value.NumeroUe.length < 3) {
    formErrors.value.NumeroUe = 'Le numéro d\'ue doit faire au moins 3 caractères';
  } else {
    formErrors.value.NumeroUe = null;
  }
});
</script>