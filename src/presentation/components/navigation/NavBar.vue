<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="navigation d-flex flex-column flex-shrink-0 p-3" style="width: 280px">
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <span class="fs-4">Universite</span>
        </a>
        <hr>
        <ul class="nav nav-pills flex-column mb-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/">Accueil</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/parcours">Parcours</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/ue">Ue</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/etudiants">Etudiant</RouterLink>
          </li>
        </ul>
        <hr>
        <div class="dropdown">
            <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://avatars.githubusercontent.com/u/98680" alt="" width="32" height="32"
                    class="rounded-circle me-2">
                <strong>Enseignant</strong>
            </a>
            <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                <li><a class="dropdown-item" href="#">Paramètres</a></li>
                <li>
                    <hr class="dropdown-divider">
                </li>
                <li><a class="dropdown-item" href="#">Déconnexion</a></li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
a {
    color: inherit;
    text-decoration: none !important;
}

.navigation {
    background-color: #273656;
    color: white !important;
}
</style>
