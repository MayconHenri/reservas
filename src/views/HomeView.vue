<template>
  <v-container class="d-flex justify-center" fluid>
    <v-card max-width="1000px" elevation="0" class="pa-0">
      <v-img
        src="@/assets/logo.jpg"
        max-height="150"
        contain
        class="mx-auto my-2"
      ></v-img>

      <v-card-title class="text-h4 font-weight-bold">Joninha Arts</v-card-title>

      <v-card-subtitle class="text-body-2 subtitle" max-width="400">
        <v-list dense class="pa-0">
          <v-list-item class="pa-0 ma-0 contact">
            <v-icon class="mr-2" size="18">mdi-map-marker</v-icon>
            <span class="text-body-2"
              >R. Jornalista José Árabe Dias Filho, 25 - Jacarecica, Maceió -
              AL, 57032-032</span
            >
          </v-list-item>

          <v-list-item class="pa-0 ma-0 contact">
            <v-icon class="mr-2" size="18">mdi-phone</v-icon>
            <a
              href="tel:+5582993499307"
              class="text-decoration-none text-black text-body-2"
            >
              (82) 99349-9307
            </a>
          </v-list-item>

          <v-list-item class="pa-0 ma-0 contact">
            <v-icon class="mr-2" size="18" color="green">mdi-whatsapp</v-icon>
            <a
              href="https://api.whatsapp.com/send?phone=5582993499307&text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida!"
              target="_blank"
              class="text-decoration-none text-black text-body-2"
            >
              (82) 99349-9307
            </a>
          </v-list-item>
        </v-list>
      </v-card-subtitle>

      <v-text-field
        v-model="searchQuery"
        label="Pesquisar serviço"
        class="mx-4 mt-4"
        variant="outlined"
        elevation="0"
      ></v-text-field>
      <v-expansion-panels v-model="panel" multiple elevation="0" class="pt-4">
        <v-expansion-panel>
          <v-expansion-panel-title class="font-weight-bold text-h5">
            Populares
            <v-chip class="ml-4" variant="outlined"
              >{{ popularServices.length }} Serviços</v-chip
            >
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(item, index) in popularServices" :key="index">
              <v-row align="center" class="py-4">
                <v-col cols="8">
                  <p class="text-body-1 font-weight-medium">{{ item.name }}</p>
                  <p class="text-body-2">
                    {{
                      item.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    }}
                    - <span>{{ formatTime(item.time) }}</span>
                  </p>
                </v-col>
                <v-col cols="4" class="d-flex justify-end">
                  <v-btn color="#343f53" size="small" @click="reservar(item)"
                    >Reservar</v-btn
                  >
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel v-if="showServicesPanel">
          <v-expansion-panel-title class="font-weight-bold text-h5">
            Serviços
            <v-chip class="ml-4" variant="outlined"
              >{{ filteredServices.servicos.length }} Serviços</v-chip
            >
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div
              v-for="(item, index) in filteredServices.servicos"
              :key="index"
            >
              <v-row align="center" class="py-4">
                <v-col cols="8">
                  <p class="text-body-1 font-weight-medium">{{ item.name }}</p>
                  <p class="text-body-2">
                    {{
                      item.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    }}
                    - <span>{{ formatTime(item.time) }}</span>
                  </p>
                </v-col>
                <v-col cols="4" class="d-flex justify-end">
                  <v-btn color="#343f53" size="small" @click="reservar(item)"
                    >Reservar</v-btn
                  >
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel v-if="showCombosPanel">
          <v-expansion-panel-title class="font-weight-bold text-h5">
            Combos
            <v-chip class="ml-4" variant="outlined"
              >{{ filteredServices.combos.length }} Combos</v-chip
            >
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(item, index) in filteredServices.combos" :key="index">
              <v-row align="center" class="py-4">
                <v-col cols="8">
                  <p class="text-body-1 font-weight-medium">{{ item.name }}</p>
                  <p class="text-body-2">
                    {{
                      item.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    }}
                    - <span>{{ formatTime(item.time) }}</span>
                  </p>
                </v-col>
                <v-col cols="4" class="d-flex justify-end">
                  <v-btn color="#343f53" size="small" @click="reservar(item)"
                    >Reservar</v-btn
                  >
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel v-if="showCombosPanel">
          <v-expansion-panel-title class="font-weight-bold text-h5">
            Planos
            <v-chip class="ml-4" variant="outlined"
              >{{ filteredServices.planos.length }} Planos</v-chip
            >
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(item, index) in filteredServices.planos" :key="index">
              <v-row align="center" class="py-4">
                <v-col cols="8">
                  <p class="text-body-1 font-weight-medium">{{ item.name }}</p>
                  <p class="text-body-2">
                    {{
                      item.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    }}
                    - <span>{{ formatTime(item.time) }}</span>
                  </p>
                </v-col>
                <v-col cols="4" class="d-flex justify-end">
                  <v-btn color="#343f53" size="small" @click="adquirir"
                    >Adquirir</v-btn
                  >
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import {
  getFilteredServices,
  getPopularServices,
  formatTime,
} from "@/services/services"

import { showToastSuccess, showToastError } from "@/utils/toastUtils";

export default defineComponent({
  setup() {
    const showCombosPanel = ref(true)
    const showServicesPanel = ref(true)
    const showPlanoPanel = ref(true)
    const panel = ref([0, 1, 2])
    const searchQuery = ref("")
    const selectedTags = ref<string[]>([])
    const tags = ["Serviços", "Planos", "Combo"]

    const filteredServices = computed(() =>
      getFilteredServices(searchQuery.value, selectedTags.value)
    )
    const popularServices = computed(() => getPopularServices())

    const reservar = (item: any) => {
      localStorage.setItem("item", JSON.stringify(item))
      window.location.href = "/reserva"
    }

    const adquirir = () => {
      showToastError("Em desenvolvimento!")
    }

    return {
      showCombosPanel,
      showServicesPanel,
      showPlanoPanel,
      panel,
      searchQuery,
      selectedTags,
      tags,
      filteredServices,
      popularServices,
      formatTime,
      reservar,
      adquirir,
    }
  },
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

* {
  font-family: "Poppins", sans-serif;
}

.v-card-title {
  font-size: 2rem;
}

.v-card-subtitle {
  font-size: 1rem;
}

.v-expansion-panel-title {
  font-size: 1.25rem;
}

.v-btn {
  font-size: 0.875rem;
}

.v-chip {
  font-size: 0.875rem;
}

.subtitle {
  max-width: 400px;
  white-space: normal;
}

.contact {
  min-height: 32px;
}
</style>
