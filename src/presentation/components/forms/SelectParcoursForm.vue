<script setup lang="ts">
import { defineExpose, defineProps, onBeforeMount, ref } from 'vue';
import { Parcours } from '@/domain/entities/Parcours';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import CustomModal from '@/presentation/components/modals/CustomModal.vue';
import { UEDAO } from '@/domain/daos/UEDAO';
import { UE } from '@/domain/entities/Ue';

const emit = defineEmits(['selected:parcours']);
const isOpen = ref(false);

const currentUe = ref<UE>(new UE(null, null, null, null));
const parcoursOptions = ref<Parcours[]>([]);
const parcoursList = ref<Parcours[]>([]);

const props = defineProps({
  ue: {
    type: Object as () => UE | null,
    required: false,
    default: null,
  },
});


const saveParcours = () => {
  console.log('rest', currentUe.value, currentUe.value.ID);
  currentUe.value.Parcours = [...(currentUe.value.Parcours || []), ...parcoursList.value];
  if (currentUe.value && currentUe.value.ID) {
    UEDAO.getInstance().update(currentUe.value.ID, currentUe.value).then((newUE : UE) => {
      alert('UE Modifié avec succès');
      emit('selected:parcours', newUE);
      console.log(newUE);
      closeForm();
    }).catch((ex) => {
      alert(ex.message);
    });
  }
}


const openForm = (ue: UE | null = null) => {
  isOpen.value = true;
  if (ue && ue.Parcours){
    currentUe.value = ue;
    parcoursList.value = ue.Parcours;
  }
};

const closeForm = () => {
  isOpen.value = false;
};

onBeforeMount(() => {
  if (props.ue){
    currentUe.value = props.ue;
    parcoursList.value = currentUe.value.Parcours ? currentUe.value.Parcours : [];
  }
  ParcoursDAO.getInstance().list().then((allParcours) => {
    console.log(parcoursList);
    parcoursOptions.value = allParcours.filter((parcour: Parcours) => {
      return !parcoursList.value.includes(parcour)
    });
  }).catch((error) => {
    console.error('Error loading parcours from DAO:', error);
  });
});


defineExpose({
  openForm,
  closeForm,
});
</script>

<template>
  <CustomModal :isOpen="isOpen">
    <template v-slot:title>
      <template v-if="isOpen"> Ajout de Parcours </template>
    </template>
    <template v-slot:body>
      <div class="text-start mt-1 mb-1">
        <form>
          <div class="form-group">
            <label for="parcours">Liste Parcours :</label>
            <v-select multiple v-model="currentUe.Parcours" :options="parcoursOptions" label="NomParcours"></v-select>
          </div>
        </form>
      </div>
      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.danger" @click="closeForm">
        Annuler
      </CustomButton>
      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.primary" @click="saveParcours">
        Enregistrer
      </CustomButton>
    </template>
  </CustomModal>
</template>

<style scoped>
</style>
