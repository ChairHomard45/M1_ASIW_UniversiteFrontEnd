<script setup lang="ts">
import CustomTable from '@/presentation/components/tables/CustomTable.vue';
import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { UE } from '@/domain/entities/Ue';
import { Parcours } from '@/domain/entities/Parcours';

import { UEDAO } from '@/domain/daos/UEDAO';
import { NoteDAO } from '@/domain/daos/NoteDAO';
import { Note } from '@/domain/entities/Note';
import SelectParcoursForm from '@/presentation/components/forms/SelectParcoursForm.vue';
import Swal from 'sweetalert2';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';
import NoteTable from '@/presentation/components/tables/NoteTable.vue';

const selectParcoursForm = ref<typeof SelectParcoursForm | null>(null);

const currentUe = ref<UE>(new UE(null, '', '', [])); // Pass an empty array for Parcours.
const Listparcours = ref<Parcours[]>([]);
const ListNotes = ref<Note[]>([]);

const route = useRoute();

const formatterSuppression = (ue: UE) => {
  return '<span class="bi bi-dash text-danger"></span>';
};

const onDeleteParcours = (p: Parcours) => {
  Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer ce ue ?',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      Listparcours.value = Listparcours.value.filter((par) => {
        return par.ID !== p.ID;
      });

      ListNotes.value = ListNotes.value.filter((note) => {
        return note.Etudiant?.Parcours?.ID !== p.ID;
      });

      const pIndextemp = currentUe.value.Parcours?.findIndex((par) => {
        return par.ID === p.ID;
      })

      if(pIndextemp !== -1){
        currentUe.value.Parcours?.splice(pIndextemp,1);
      }

      if (currentUe.value && currentUe.value.ID) {
        UEDAO.getInstance()
          .update(currentUe.value.ID, currentUe.value)
          .then((modifiedUE) => {
            alert('Ue Modifier avec succès');
            currentUe.value = modifiedUE;
          })
          .catch((ex) => {
            alert(ex.message);
          });
      }
    }
  });
};

const formatterNote = (note: Note) => {
  return '<span class="bi bi-dash text-danger"></span>';
}

const columnNotes = [
  { field: 'Nom', label: 'Nom', style: null, formatter: null, onClick: null },
  { field: 'Prenom', label: 'Prenom', style: null, formatter: null, onClick: null },
  { field: 'Value', label: 'Value', style: 'width: 90px;text-align:center;', formatter: formatterNote, onClick: null }
];

const columnParcours = [
  { field: 'NomParcours', label: 'NomParcours', style: 'null', formatter: null, onClick: null },
  {
    field: 'DeleteParcours',
    label: 'DeleteParcours',
    formatter: formatterSuppression,
    onClick: onDeleteParcours,
    style: 'width: 40px;text-align:center;'
  }
];

// UE -> Parcours -> Inscrit : Etudiant ->

const dataNotes = computed(() => {
  return ListNotes.value.map((note) => ({
    Nom: note.Etudiant?.Nom, // Safely handle null values
    Prenom: note.Etudiant?.Prenom,
    Value: note.Value || -1
  }));
});

const dataParcours = computed(() => currentUe.value.Parcours);

function genID(num: number) {
  return num + 100;
}

onMounted(() => {
  const IdUe = route.params.id ? Number(route.params.id) : null;

  if (IdUe) {
    UEDAO.getInstance()
      .get(IdUe)
      .then((data) => {
        currentUe.value = data;
        Listparcours.value = data.Parcours ? data.Parcours : [];

        if (Listparcours.value && Listparcours.value.length > 0 && currentUe.value.ID) {
          for (const par of Listparcours.value) {
            if (par.Inscrit && par.Inscrit.length > 0) {
              for (const Inscr of par.Inscrit) {
                if (Inscr.ID) {
                  NoteDAO.getInstance()
                    .getByIds(currentUe.value.ID, Inscr.ID)
                    .then((data) => {
                      if (data.length > 0) {
                        // Update ListNotes for students with notes
                        ListNotes.value = ListNotes.value.concat(data);
                      } else {
                        // Track the student with no notes
                        if (Inscr.ID)
                          ListNotes.value = ListNotes.value.concat(
                            new Note(genID(Inscr.ID), Inscr, currentUe.value, -1)
                          );
                      }
                    })
                    .catch((error) => {
                      console.error('Error fetching data:', error);
                    });
                }
              }
            }
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  } else {
    console.error('Missing route parameter');
  }
});

const onParcoursSelected = (ue: UE) => {
  currentUe.value = ue;
  Listparcours.value = ue.Parcours ?? [];
};

const formErrors = ref<{
  NumeroUe: string | null;
  Intitule: string | null;
  parcours: string | null;
}>({
  NumeroUe: null,
  Intitule: null,
  parcours: null,
});

const onSave = () => {
  if (!currentUe.value.NumeroUe || currentUe.value.NumeroUe.length < 3) {
    formErrors.value.NumeroUe = 'Le numéro d\'ue doit faire au moins 3 caractères';
    return;
  }
  if (!currentUe.value.Intitule || currentUe.value.Intitule.length < 3) {
    formErrors.value.Intitule = 'L\'intitulé doit faire au moins 3 caractères';
    return;
  }

  if (currentUe.value && currentUe.value.ID) {
    UEDAO.getInstance()
      .update(currentUe.value.ID, currentUe.value)
      .then((modifiedUE) => {
        alert('Ue Modifier avec succès');
        currentUe.value = modifiedUE;
      })
      .catch((ex) => {
        alert(ex.message);
      });
  }

};


watch(() => currentUe.value.Intitule, () => {
  if (!currentUe.value.Intitule || currentUe.value.Intitule.trim() === '' || currentUe.value.Intitule.length < 3) {
    formErrors.value.Intitule = 'L\'intitulé doit faire au moins 3 caractères';
  }
});

watch(() => currentUe.value.NumeroUe, () => {
  if (!currentUe.value.NumeroUe || currentUe.value.NumeroUe.trim() === '' || currentUe.value.NumeroUe.length < 3) {
    formErrors.value.NumeroUe = 'Le numéro d\'ue doit faire au moins 3 caractères';
  }
});

</script>

<template>
  <div class="container p-4 d-flex flex-row gap-3" style="height: 100vh">
    <div class="d-flex flex-column gap-4 w-50">
      <!-- FORM -->
      <div class="card p-3 gap-3">
        <form>
          <div class="row">
            <div class="col-md-4">
              <div>
                <CustomInput
                  v-model="currentUe.NumeroUe"
                  id="numeroue"
                  libelle="Numéro d'UE"
                  type="text"
                  placeholder="Numéro d'UE"
                  :error="null"
                />
              </div>
            </div>
            <div class="col-md-8">
              <div>
                <CustomInput
                  v-model="currentUe.Intitule"
                  id="intitule"
                  libelle="Intitulé de l'UE"
                  type="text"
                  placeholder="Intitulé de 'UE"
                  :error="null"
                />
              </div>
            </div>
          </div>
        </form>
        <div class="col-12 d-flex justify-content-end">
          <CustomButton class="px-md-4" :color="BootstrapButtonEnum.info" @click="onSave">
            Enregistrer
          </CustomButton>
        </div>
      </div>

      <div class="card flex-grow-1">
        <div class="card-header">
          <div class="card-title">
            <h4>Notes</h4>
          </div>
        </div>
        <div class="card-body">
          <NoteTable type="tableInv" :columns="columnNotes" :data="dataNotes" id-attribute="ID">
            <!-- Pass the formatterNote as a slot -->
            <template v-slot:Value="{ item }">
              <div class="d-flex d-row ">
                <!-- Here we check if the value is -1 and use CustomInput if true -->
                  <input  style="width: 32px" v-model="item.Value" :value="item.Value === -1 ? '__' : item.Value" :id="item.Nom" placeholder="__"/>
                  / 20
              </div>
            </template>
          </NoteTable>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column gap-4 w-50">
      <div class="card flex-grow-1">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div class="card-title">
            <h4>Parcours</h4>
          </div>
          <div class="card-title">
            <a href="#" class="text-decoration-none" @click="() => selectParcoursForm?.openForm()">
              <span class="fs-1 fw-bold text-success">+</span>
            </a>
          </div>
        </div>
        <div class="card-body">
          <CustomTable
            type="tableInv"
            id-attribute="NomParcours"
            :columns="columnParcours"
            :data="dataParcours"
          />
        </div>
      </div>
    </div>
  </div>
  <SelectParcoursForm
    ref="selectParcoursForm"
    :ue="currentUe"
    @selected:parcours="onParcoursSelected"
  ></SelectParcoursForm>
</template>
