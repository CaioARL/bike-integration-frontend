<template>
  <div class="q-mt-md">
    <q-form @submit.prevent="onFilter" class="q-pa-md rounded-borders shadow-2">
      <div class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-input v-model="filters.nome" label="Nome do Evento" outlined dense />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-input v-model="filters.descricao" label="Descrição" outlined dense />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-input v-model="filters.cidade" label="Cidade" outlined dense />
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-input v-model="filters.estado" label="Estado" outlined dense />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-input v-model="filters.data" label="Data" outlined dense type="date" />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-select
              v-model="filters.tipoEventoId"
              :options="tiposEventoOptions"
              label="Tipo de Evento"
              option-label="nome"
              option-value="id"
              emit-value
              map-options
              outlined
              dense
            />
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-select
              v-model="filters.nivelHabilidadeId"
              :options="niveisHabilidadeOptions"
              label="Nível de Habilidade"
              option-label="nome"
              option-value="id"
              emit-value
              map-options
              outlined
              dense
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-input
              v-model.number="filters.faixaKm"
              label="Faixa Km"
              type="number"
              outlined
              dense
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 flex items-center">
            <q-toggle v-model="filters.gratuito" label="Gratuito" left-label class="q-mr-md" />
            <q-toggle v-model="filters.aprovado" label="Aprovado" left-label />
          </div>
        </div>
        <div class="row">
          <div class="col-12 flex flex-center">
            <q-btn
              class="q-mr-sm"
              type="button"
              label="Limpar filtros"
              color="secondary"
              icon="refresh"
              @click="resetFilters"
            />
            <q-btn type="submit" label="Filtrar" color="primary" icon="search" />
          </div>
        </div>
      </div>
    </q-form>
    <div class="q-mt-md">
      <div v-if="(eventoResponse?.eventos?.length ?? 0) === 0" class="q-pa-md">
        <q-banner>Nenhum evento encontrado.</q-banner>
      </div>
      <q-list
        v-else
        class="q-pa-sm rounded-borders hide-scrollbar"
        style="max-height: 60vh; overflow-y: auto"
      >
        <q-expansion-item
          v-for="event in paginatedEvents"
          :key="event.id"
          expand-separator
          :default-opened="false"
          :icon="event.aprovado ? 'check_circle' : 'error'"
          :header-class="event.aprovado ? 'text-positive' : 'text-negative'"
          :icon-right="event.aprovado ? 'expand_more' : 'expand_less'"
          :label="event.nome"
          :caption="`ID: ${event.id} - Data: ${event.data}`"
          class="q-mb-sm rounded-borders shadow-1"
        >
          <div
            class="q-pa-sm evento-bg-details"
            :style="event.s3Url ? `background-image: url('${event.s3Url}');` : ''"
          >
            <div v-if="event.s3Url" class="evento-bg-overlay"></div>
            <div class="evento-bg-flex">
              <div class="evento-bg-content">
                <div><strong>Nome:</strong> {{ event.nome }}</div>
                <div><strong>Descrição:</strong> {{ event.descricao }}</div>
                <div><strong>Cidade:</strong> {{ event.endereco.cidade }}</div>
                <div><strong>Estado:</strong> {{ event.endereco.estado }}</div>
                <div><strong>Gratuito:</strong> {{ event.gratuito ? 'Sim' : 'Não' }}</div>
                <div><strong>Faixa Km:</strong> {{ event.faixaKm }}</div>
                <div><strong>Tipo de Evento:</strong> {{ event.tipoEvento?.nome }}</div>
                <div><strong>Aprovado:</strong> {{ event.aprovado ? 'Sim' : 'Não' }}</div>
                <div v-if="event.urlSite">
                  <strong>Site:</strong>
                  <a :href="event.urlSite" target="_blank">{{ event.urlSite }}</a>
                </div>
                <div class="q-mt-md flex q-gutter-sm">
                  <q-btn
                    v-if="!event.aprovado"
                    color="positive"
                    icon="check"
                    label="Aprovar"
                    dense
                    @click="aprovar(event)"
                  />
                  <q-btn
                    v-if="!event.aprovado"
                    color="negative"
                    icon="delete"
                    label="Excluir"
                    dense
                    @click="askExcluir(event)"
                  />
                  <q-btn
                    v-if="event.aprovado"
                    color="warning"
                    icon="close"
                    label="Recusar"
                    dense
                    @click="recusar(event)"
                  />
                </div>
              </div>
              <div
                v-if="event.endereco.latitude && event.endereco.longitude"
                class="evento-mini-map"
                style="position: relative; z-index: 3"
              >
                <iframe
                  :src="`https://www.openstreetmap.org/export/embed.html?bbox=${event.endereco.longitude - 0.0015},${event.endereco.latitude - 0.001},${event.endereco.longitude + 0.0015},${event.endereco.latitude + 0.001}&layer=mapnik&marker=${event.endereco.latitude},${event.endereco.longitude}`"
                  style="border: 1px solid #ccc; position: relative; z-index: 4"
                  width="100%"
                  height="220"
                  allowfullscreen
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </q-expansion-item>
      </q-list>
    </div>
    <q-footer class="bg-transparent q-pt-sm q-pb-sm">
      <div class="row justify-center">
        <div class="col-auto">
          <q-pagination
            v-model="currentPage"
            :max="totalPages"
            @update:model-value="handlePageChange"
            color="primary"
            boundary-numbers
            :rows-per-page-options="[50]"
          />
        </div>
      </div>
    </q-footer>
    <q-dialog v-model="showConfirmDelete">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="md" class="q-mr-md" />
          <span>Tem certeza que deseja excluir este evento?</span>
        </q-card-section>
        <q-card-section>
          <q-linear-progress :value="deleteProgress" color="negative" instant-feedback />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="cancelDelete" />
          <q-btn flat label="Confirmar" color="negative" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import type { Evento } from 'src/models/Evento';
import type { NivelHabilidade } from 'src/models/NivelHabilidade';
import type { EventoRequest } from 'src/models/request/EventoRequest';
import type { EventoResponse } from 'src/models/response/EventoResponse';
import type { TipoEvento } from 'src/models/TipoEvento';
import { aprovarEvento, excluirEvento, getEventos } from 'src/services/eventoService';
import { getNiveisHabilidade } from 'src/services/nivelHabilidadeService';
import { getTiposEvento } from 'src/services/tipoEventoService';
import { computed, onMounted, ref } from 'vue';

const defaultFilters = {
  pagina: 1,
  nome: null,
  descricao: null,
  data: null,
  cidade: null,
  estado: null,
  faixaKm: null,
  tipoEventoId: null as number | null,
  nivelHabilidadeId: null as number | null,
  gratuito: null,
  aprovado: null,
};

const filters = ref({ ...defaultFilters });

const eventoResponse = ref<EventoResponse>();
const tiposEventoOptions = ref<TipoEvento[]>([]);
const niveisHabilidadeOptions = ref<NivelHabilidade[]>([]);
const currentPage = ref(1);
const rowsPerPage = 50;

const fetchTiposEvento = async () => {
  try {
    tiposEventoOptions.value = await getTiposEvento();
  } catch (error) {
    console.error('Error fetching tipos de evento:', error);
  }
};

const fetchNiveisHabilidade = async () => {
  try {
    niveisHabilidadeOptions.value = await getNiveisHabilidade();
  } catch (error) {
    console.error('Error fetching niveis de habilidade:', error);
  }
};

const fetchEventos = async (request: EventoRequest) => {
  try {
    eventoResponse.value = await getEventos(request);
  } catch (error) {
    console.error('Error fetching eventos:', error);
  }
};

const aprovar = async (event: Evento) => {
  try {
    await aprovarEvento(event.id, true);
    await onFilter();
  } catch (error) {
    console.error('Erro ao aprovar evento:', error);
  }
};

const recusar = async (event: Evento) => {
  try {
    await aprovarEvento(event.id, false);
    await onFilter();
  } catch (error) {
    console.error('Erro ao recusar evento:', error);
  }
};

const showConfirmDelete = ref(false);
const deleteProgress = ref(0);
let deleteTimer: ReturnType<typeof setInterval> | null = null;
const DELETE_DURATION = 5000; // 5 segundos
const eventToDelete = ref<Evento | null>(null);

function askExcluir(event: Evento) {
  eventToDelete.value = event;
  showConfirmDelete.value = true;
  deleteProgress.value = 0;
  let elapsed = 0;
  const interval = 100;
  deleteTimer = setInterval(() => {
    elapsed += interval;
    deleteProgress.value = elapsed / DELETE_DURATION;
    if (elapsed >= DELETE_DURATION) {
      cancelDelete();
    }
  }, interval);
}

function cancelDelete() {
  showConfirmDelete.value = false;
  deleteProgress.value = 0;
  eventToDelete.value = null;
  if (deleteTimer) {
    clearInterval(deleteTimer);
    deleteTimer = null;
  }
}

async function confirmDelete() {
  if (eventToDelete.value) {
    await excluir(eventToDelete.value);
  }
  cancelDelete();
}

const excluir = async (event: Evento) => {
  try {
    await excluirEvento(event.id);
    await onFilter();
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
  }
};

const onFilter = async () => {
  filters.value.pagina = 1;
  currentPage.value = 1;
  const eventoRequest: EventoRequest = {
    ...filters.value,
    tipoEvento: filters.value.tipoEventoId,
    nivelHabilidade: filters.value.nivelHabilidadeId,
  };
  await fetchEventos(eventoRequest);
};

const resetFilters = () => {
  Object.assign(filters.value, defaultFilters);
  currentPage.value = 1;
};

const handlePageChange = async (page: number) => {
  filters.value.pagina = page;
  currentPage.value = page;
  const eventoRequest: EventoRequest = {
    ...filters.value,
    tipoEvento: filters.value.tipoEventoId,
    nivelHabilidade: filters.value.nivelHabilidadeId,
  };
  await fetchEventos(eventoRequest);
};

const totalPages = computed(() =>
  Math.ceil((eventoResponse.value?.totalRegistros ?? 0) / rowsPerPage),
);

const paginatedEvents = computed<Evento[]>(() => {
  return eventoResponse.value?.eventos ?? [];
});

export default {
  name: 'EventoList',
  setup() {
    onMounted(async () => {
      await fetchTiposEvento();
      await fetchNiveisHabilidade();
      await onFilter();
    });
    return {
      filters,
      tiposEventoOptions,
      niveisHabilidadeOptions,
      onFilter,
      eventoResponse,
      currentPage,
      totalPages,
      paginatedEvents,
      handlePageChange,
      aprovar,
      recusar,
      excluir,
      resetFilters,
      showConfirmDelete,
      deleteProgress,
      askExcluir,
      cancelDelete,
      confirmDelete,
    };
  },
};
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.evento-bg-details {
  position: relative;
  min-height: 220px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: stretch;
}

/* Flex container for content and map */
.evento-bg-flex {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 16px;
}

/* Content takes remaining space */
.evento-bg-content {
  position: relative;
  z-index: 2;
  flex: 1 1 0;
}

/* Map aligned right, fixed width */
.evento-mini-map {
  width: 320px;
  min-width: 220px;
  max-width: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  background: #fff;
  align-self: flex-start;
  margin-left: auto;
}

/* Overlay adaptável ao modo dark/light */
.body--dark .evento-bg-overlay {
  background: rgba(0, 0, 0, 0.55);
}
.body--light .evento-bg-overlay {
  background: rgba(255, 255, 255, 0.35);
}
.evento-bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none; /* Permite clicar nos elementos abaixo do overlay */
}

/* Texto adaptável ao modo dark/light */
.body--dark .evento-bg-content {
  color: #fff;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.7);
}
.body--light .evento-bg-content {
  color: #222;
  text-shadow: 0 1px 6px rgba(255, 255, 255, 0.5);
}
</style>
