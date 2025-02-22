<template>
  <v-container class="mx-auto" elevation="8" max-width="360">
    <v-row class="py-4">
      <v-col cols="12" class="d-flex align-center">
        <v-btn variant="text" @click="goBack" icon="mdi-arrow-left"> </v-btn>
        <h3 class="custom-title ml-4" style="text-transform: capitalize">
          {{ formattedDate }}
        </h3>
      </v-col>
    </v-row>

    <v-sheet class="mx-auto" elevation="0" style="max-width: 100vw">
      <v-slide-group v-model="model" center-active show-arrows>
        <v-slide-group-item v-for="(day, index) in sevenDays" :key="index" :class="{ 'disabled-day': day.isSunday }"
          v-slot="{ isSelected, toggle }">
          <v-card :color="isSelected ? '#343F53' : 'white'" class="ma-2 d-flex flex-column align-center justify-center"
            height="80" width="50" @click="!day.isSunday && toggle()" elevation="0" style="border: 1px solid gray"
            :disabled="day.isSunday || day.isDisabled">
            <div class="d-flex fill-height align-center justify-center flex-column">
              <p class="text-capitalize text-center font-weight-small" style="margin-bottom: 5px">
                {{ day.dayName.slice(0, 3) }}
              </p>
              <span class="text-center font-weight-small">
                {{ day.date }}
              </span>
            </div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>

    <v-tabs v-model="tab" align-tabs="center" color="#343F53">
      <v-tab :value="1">Manhã</v-tab>
      <v-tab :value="2">Tarde</v-tab>
      <v-tab :value="3">Noite</v-tab>
    </v-tabs>
    <v-skeleton-loader v-if="isLoading" type="list-item"></v-skeleton-loader>
    <v-tabs-window v-model="tab" class="mt-2">
      <v-tabs-window-item :value="1" v-if="!isLoading">
        <v-btn-toggle v-model="morning" class="d-flex" mandatory>
          <div class="scrollable-container">
            <v-btn v-for="(hourObj, index) in morningHours" :key="index" color="#343F53" class="mr-20 button"
              rounded="lg" @click="selectHour(hourObj.hour, 'morning')"
              :class="{ 'selected-btn': isSelected(hourObj.hour, 'morning') }" style="border: 1px solid gray"
              :disabled="hourObj.isDisabled">
              {{ hourObj.hour }}
            </v-btn>
          </div>
        </v-btn-toggle>
      </v-tabs-window-item>

      <v-tabs-window-item :value="2">
        <v-btn-toggle v-model="afternoon" class="d-flex" mandatory v-if="!isLoading">
          <div class="scrollable-container">
            <v-btn v-for="(hourObj, index) in afternoonHours" :key="index" color="#343F53" class="mr-20 button"
              rounded="lg" @click="selectHour(hourObj.hour, 'morning')"
              :class="{ 'selected-btn': isSelected(hourObj.hour, 'afternoon') }" style="border: 1px solid gray"
              :disabled="hourObj.isDisabled">
              {{ hourObj.hour }}
            </v-btn>
          </div>
        </v-btn-toggle>
      </v-tabs-window-item>

      <v-tabs-window-item :value="3" v-if="!isLoading">
        <v-btn-toggle v-model="evening" class="d-flex" mandatory>
          <div class="scrollable-container">
            <v-btn v-for="(hourObj, index) in eveningHours" :key="index" color="#343F53" class="mr-20 button"
              rounded="lg" @click="selectHour(hourObj.hour, 'morning')"
              :class="{ 'selected-btn': isSelected(hourObj.hour, 'evening') }" style="border: 1px solid gray"
              :disabled="hourObj.isDisabled">
              {{ hourObj.hour }}
            </v-btn>
          </div>
        </v-btn-toggle>
      </v-tabs-window-item>
    </v-tabs-window>

    <v-card elevation="0" width="360" color="grey-lighten-3" class="rounded-lg">
      <v-card-title class="text-h5 font-weight-bold text-start">
        Resumo:
      </v-card-title>
      <v-card-text class="px-8 pt-4">
        <v-row style="padding: 0; margin: 0">
          <v-col cols="12" style="padding: 0; margin: 0">
            <span class="text-subtitle-1 font-weight-medium">Serviço(s): </span>
            <span class="text-body-1 font-weight-light" v-if="item?.name">
              {{ item?.name }}
            </span>

          </v-col>
        </v-row>
        <v-row style="padding: 0; margin: 0">
          <v-col cols="12" style="padding: 0; margin: 0">
            <span class="text-subtitle-1 font-weight-medium">Valor: </span>
            <span class="text-body-1 font-weight-light" v-if="item?.price">
              {{
                item?.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }}</span>
          </v-col>
        </v-row>
        <v-divider class="my-4"></v-divider>
        <v-row style="padding: 0; margin: 0">
          <v-col cols="12" style="padding: 0; margin: 0">
            <span class="text-subtitle-1 font-weight-medium">Marcação: </span>
            <span class="text-body-1 font-weight-light">
              {{ selectedFullDate }}
            </span>
            <span class="text-body-1 font-weight-light" v-if="selectedTime != '00:00'">, <strong> {{ selectedTime
                }}</strong>
            </span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-btn class="mx-auto my-6" color="#343F53" rounded block @click="this.dialogVisible = true">
      Finalizar
    </v-btn>
    <v-dialog v-model="dialogVisible" max-width="500px" persistent>
      <v-card>
        <v-toolbar color="#343F53" dark>
          <v-toolbar-title>Informações do Contato</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-text-field v-model="contato.nome" label="Nome Completo" required></v-text-field>
          <v-text-field v-model="contato.telefone" label="Telefone" required v-mask="maskTelefone"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="dialogVisible = false" dark>Fechar</v-btn>
          <v-btn color="#343F53" @click="finalizar" dark>Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCadastro" max-width="500px" persistent>
      <v-card>
        <v-toolbar color="#343F53" dark>
          <v-toolbar-title v-if="status === 'loading'">Cadastrando...</v-toolbar-title>
          <v-toolbar-title v-if="status === 'success'">Cadastro Concluído</v-toolbar-title>
          <v-toolbar-title v-if="status === 'error'">Erro no Cadastro</v-toolbar-title>
        </v-toolbar>

        <v-card-text class="text-center">
          <template v-if="status === 'loading'">
            <v-progress-circular indeterminate :size="75" :width="6"></v-progress-circular>
            <br>
            Aguarde um momento!
          </template>

          <template v-if="status === 'success'">
            <v-icon color="green" size="75">mdi-check-circle</v-icon>
            <br>
            Cadastro realizado com sucesso!
          </template>

          <template v-if="status === 'error'">
            <v-icon color="red" size="75">mdi-close-circle</v-icon>
            <br>
            Ocorreu um erro. Tente novamente.
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import timezone from "dayjs/plugin/timezone"
import { toast } from "vue3-toastify"
dayjs.extend(timezone)

import { fetchEvents, createEvent } from "@/services/api.ts"
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      status: "loading",
      dialogCadastro: false,
      maskTelefone: "(##) #####-####",
      dialogVisible: false,
      contato: {
        nome: "",
        telefone: "",
      },
      evento: {
        startDateTime: "",
        endDateTime: "",
        summary: "",
        description: "",
      },
      isDisabled: true,
      eventos: [],
      item: {
        name: "",
        price: 0,
        time: 0,
      },
      model: null,
      tab: null,
      selectedDay: null,
      selectedTime: "00:00",
      selectedHour: null,
      morningHours: [],
      afternoonHours: [],
      eveningHours: [],
      morning: null,
      afternoon: null,
      evening: null,
    }
  },
  mounted() {

    this.item = JSON.parse(localStorage.getItem("item"))
    if (!this.item) {
      this.$router.push('/')
    } else {

      fetchEvents().then((data) => {
        this.eventos = data
        this.generateTimes()
        this.isLoading = false;
      })
      // Se for domingo, muda para segunda-feira o select da data
      let todayIndex = new Date().getDay();
      console.log('today ' + todayIndex);
      if (todayIndex === 0) {
        todayIndex = 1;
      } else {
        todayIndex = 0;
      }
      this.model = todayIndex;
    }
  },
  computed: {
    formattedDate() {
      const today = new Date()
      const options = { year: "numeric", month: "long" }
      return today.toLocaleDateString("pt-BR", options)
    },

    sevenDays() {
      const days = []
      const today = new Date()
      for (let i = 0; i < 7; i++) {
        const day = new Date(today)
        day.setDate(today.getDate() + i)

        days.push({
          date: day.getDate(),
          fullDate: day,
          dayName: day.toLocaleString("pt-BR", { weekday: "long" }),
          isSunday: day.getDay() === 0,
        })
      }
      return days
    },
    selectedFullDate() {
      this.generateTimes()
      this.selectedTime = '00:00'
      this.morning = null
      this.afternoon = null
      this.evening = null
      const selectedDay = this.sevenDays.find((day) => day.date === this.model)
      const fullDate = new Date()
      fullDate.setDate(fullDate.getDate() + this.model)

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      return fullDate.toLocaleDateString("pt-BR", options)
    },
    selectedFullDateForComparison() {
      const selectedDay = this.sevenDays.find((day) => day.date === this.model)
      const fullDate = new Date()
      fullDate.setDate(fullDate.getDate() + this.model)

      const formattedDate = dayjs(fullDate).format("YYYY-MM-DD")

      return formattedDate
    },
  },
  methods: {
    async finalizar() {
      if (!this.contato.nome) {
        toast.error("Preencha o nome!", {
          autoClose: 3000,
          position: "top-right",
          theme: "colored",
        });
        return;
      }

      if (this.contato.telefone.length < 15) {
        toast.error("Preencha o telefone!", {
          autoClose: 3000,
          position: "top-right",
          theme: "colored",
        });
        return;
      }

      if (!this.evento.startDateTime) {
        toast.error("Preencha o horário de início!", {
          autoClose: 3000,
          position: "top-right",
          theme: "colored",
        });
        return;
      }

      if (!this.evento.endDateTime) {
        toast.error("Preencha o horário de término!", {
          autoClose: 3000,
          position: "top-right",
          theme: "colored",
        });
        return;
      }

      // Abre o modal e mostra o estado de carregamento
      this.dialogVisible = false;

      this.dialogCadastro = true;
      this.status = "loading";


      // Formatação das datas
      this.evento.startDateTime = dayjs(
        this.selectedFullDateForComparison + "T" + this.evento.startDateTime
      ).format("YYYY-MM-DDTHH:mm:ss");

      this.evento.endDateTime = dayjs(
        this.selectedFullDateForComparison + "T" + this.evento.endDateTime
      ).format("YYYY-MM-DDTHH:mm:ss");

      // Definição dos outros campos
      this.evento.summary = this.item.name;
      this.evento.description = `Nome: ${this.contato.nome},
    Telefone: ${this.contato.telefone},
    Serviço: ${this.item.name},
    Valor: R$ ${this.item.price}`;

      try {
        const response = await createEvent(this.evento);
        console.log("Evento criado com sucesso:", response);

        // Atualiza para sucesso no modal
        this.status = "success";

        // Exibe toast de sucesso
        toast.success("Evento criado com sucesso!", {
          autoClose: 3000,
          position: "top-right",
          theme: "colored",
        });

        // Espera 2 segundos antes de fechar o modal e redirecionar
        setTimeout(() => {
          this.dialogCadastro = false;
          this.$router.push("/"); // Navega para a rota desejada
        }, 2000);
      } catch (error) {
        console.error("Erro ao criar evento:", error);

        // Atualiza para erro no modal
        this.status = "error";

        // Exibe toast de erro
        toast.error("Erro ao criar o evento. Tente novamente!", {
          autoClose: 3000,
          position: "top-right",
          theme: "colored",
        });

        // Fecha o modal após 2 segundos
        setTimeout(() => {
          this.dialogCadastro = false;
        }, 2000);
      }
    },
    formatTime(minutes) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
    },
    goBack() {
      localStorage.removeItem("item")
      this.$router.push("/")
    },

    generateTimes() {
      const timePeriods = [
        {
          start: 8,
          end: 12,
          period: "morningHours",
          interval: 15,
          endHour: 11,
          endMinute: 45,
        },
        {
          start: 12,
          end: 18,
          period: "afternoonHours",
          interval: 15,
          endHour: 17,
          endMinute: 0,
        },
        {
          start: 17,
          end: 19,
          period: "eveningHours",
          interval: 15,
          endHour: 19,
          endMinute: 0,
        },
      ];

      const formattedDate = this.selectedFullDateForComparison;
      const now = dayjs(); // Data e hora atual
      const isToday = formattedDate === now.format("YYYY-MM-DD"); // Verifica se é o mesmo dia

      timePeriods.forEach(({ start, end, period, interval, endHour, endMinute }) => {
        const hoursArray = [];

        for (let h = start; h <= endHour; h++) {
          for (let m = 0; m < 60; m += interval) {
            if (h === endHour && m > endMinute) break;

            let hour = h < 10 ? `0${h}` : h;
            let minute = m === 0 ? "00" : m;
            const hourFormatted = `${hour}:${minute}`;

            const isEventBlocked = this.eventos.some((event) => {
              const eventDate = dayjs(new Date(event.start.dateTime)).subtract(this.item.time, "minute");
              const eventEndDate = dayjs(event.end.dateTime);
              const eventDay = eventDate.format("YYYY-MM-DD");

              const eventStartHour = eventDate.hour();
              const eventStartMinute = eventDate.minute();
              const eventEndHour = eventEndDate.hour();
              const eventEndMinute = eventEndDate.minute();

              return (
                eventDay === formattedDate &&
                (eventStartHour < h || (eventStartHour === h && eventStartMinute <= m)) &&
                (eventEndHour > h || (eventEndHour === h && eventEndMinute > m))
              );
            });

            // Bloqueia horários menores que a hora atual se for o mesmo dia
            const isPastTime = isToday && (h < now.hour() || (h === now.hour() && m < now.minute()));

            //teste

            hoursArray.push({ hour: hourFormatted, isDisabled: isEventBlocked || isPastTime });
          }
        }
        this[period] = hoursArray;
      });
    },

    selectHour(hour, period) {
      this[period] = hour

      const duration = this.item.time
      const [startHour, startMinute] = hour.split(":").map(Number)

      const endMinutes = startMinute + duration
      const endHour = startHour + Math.floor(endMinutes / 60)
      const endMinute = endMinutes % 60

      const endHourFormatted = endHour < 10 ? `0${endHour}` : endHour
      const endMinuteFormatted = endMinute === 0 ? "00" : endMinute

      this.selectedTime = `${hour} até ${endHourFormatted}:${endMinuteFormatted}`

      this.evento.startDateTime = hour
      this.evento.endDateTime = endHourFormatted + ":" + endMinuteFormatted
    },
    isSelected(hour, period) {
      return this[period] === hour
    },
  },
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

* {
  font-family: "Poppins", sans-serif;
}

.disabled-day {
  opacity: 0.5;
}

.custom-title {
  font-size: 24px;
  font-weight: bold;
}

.selected-btn {
  background-color: #343f53 !important;
  color: white !important;
  font-weight: 600;
}

.v-tabs-window-item {
  padding: 10px 6px;
}

.button {
  font-size: 14px;
  min-width: 60px;
  font-weight: 400;
}

.scrollable-container {
  display: flex;
  overflow-x: scroll;
  padding: 5px 0;
  scrollbar-width: none;
}

.scrollable-container::-webkit-scrollbar {
  display: none;
}

.scrollable-container .v-btn {
  margin-right: 8px;
}
</style>
