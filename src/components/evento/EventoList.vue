<template>
  <div>
    <q-splitter v-model="splitterMain" vertical :limits="[15, 85]" style="height: 100%">
      <template #before>
        <!-- Filtros -->
        <div
          class="q-pa-sm q-shadow-2"
          style="position: sticky; top: 0; z-index: 100; background: inherit"
        >
          <q-expansion-item
            v-model="showSearch"
            dense
            class="rounded-borders shadow-1"
            :label="showSearch ? 'Ocultar pesquisa' : 'Exibir pesquisa'"
            :icon="showSearch ? 'expand_less' : 'expand_more'"
          >
            <template #header>
              <div class="row items-center q-gutter-xs q-pa-sm">
                <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar Evento"
                  @click.stop="openEventoForm('create')"
                  dense
                />
              </div>
            </template>
            <q-form @submit.prevent="onFilter" class="q-pa-xs rounded-borders q-shadow-2">
              <div class="row q-col-gutter-xs">
                <div class="col-12 q-mb-xs">
                  <q-input v-model="filters.nome" label="Nome" outlined dense />
                </div>
                <div class="col-12 q-mb-xs">
                  <q-input v-model="filters.descricao" label="Descrição" outlined dense />
                </div>
                <div class="col-12 q-mb-xs">
                  <q-input v-model="filters.cidade" label="Cidade" outlined dense />
                </div>
                <div class="col-12 q-mb-xs">
                  <q-input v-model="filters.estado" label="Estado" outlined dense />
                </div>
                <div class="col-12 q-mb-xs">
                  <q-input
                    v-model="filters.data"
                    label="Data"
                    outlined
                    dense
                    type="datetime-local"
                    @update:model-value="(val) => (filters.data = normalizeDateInput(val) || null)"
                  />
                </div>
                <div class="col-12 q-mb-xs">
                  <q-input
                    v-model.number="filters.faixaKm"
                    label="Faixa Km"
                    type="number"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 q-mb-xs">
                  <q-select
                    v-model="filters.tipoEventoId"
                    :options="tiposEventoOptions"
                    label="Tipo"
                    option-label="nome"
                    option-value="id"
                    emit-value
                    map-options
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 q-mb-xs">
                  <q-select
                    v-model="filters.nivelHabilidadeId"
                    :options="niveisHabilidadeOptions"
                    label="Nível"
                    option-label="nome"
                    option-value="id"
                    emit-value
                    map-options
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 flex items-center q-mb-xs">
                  <q-toggle v-model="filters.gratuito" label="Gratuito" left-label dense />
                  <q-toggle
                    v-model="filters.aprovado"
                    label="Aprovado"
                    left-label
                    class="q-ml-md"
                    dense
                  />
                </div>
                <div class="col-12 flex flex-end q-gutter-xs q-mt-xs">
                  <q-btn
                    class="q-mr-xs"
                    type="button"
                    label="Limpar"
                    color="secondary"
                    icon="refresh"
                    @click="resetFilters"
                    dense
                  />
                  <q-btn type="submit" label="Filtrar" color="primary" icon="search" dense />
                </div>
              </div>
            </q-form>
          </q-expansion-item>
        </div>
      </template>
      <template #after>
        <!-- Listagem de eventos -->
        <div>
          <div v-if="(eventoResponse?.eventos?.length ?? 0) === 0" class="q-pa-md">
            <q-banner>Nenhum evento encontrado.</q-banner>
          </div>
          <div v-else class="event-list-scroll">
            <q-list class="q-pa-md rounded-borders">
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
                <q-splitter v-model="splitterSizes" :limits="[30, 70]">
                  <template #before>
                    <div class="relative z-2 q-pa-md q-pr-md column q-gutter-y-sm">
                      <div class="text-body1">
                        <strong>Nome:</strong> <span>{{ event.nome }}</span>
                      </div>
                      <div class="text-body1">
                        <strong>Descrição:</strong> <span>{{ event.descricao }}</span>
                      </div>
                      <q-expansion-item dense label="Endereço" class="q-mb-sm">
                        <div class="q-ml-md">
                          <div><strong>CEP:</strong> {{ event.endereco.cep }}</div>
                          <div><strong>Estado:</strong> {{ event.endereco.estado }}</div>
                          <div><strong>Cidade:</strong> {{ event.endereco.cidade }}</div>
                          <div><strong>Bairro:</strong> {{ event.endereco.bairro }}</div>
                          <div><strong>Rua:</strong> {{ event.endereco.rua }}</div>
                          <div><strong>Número:</strong> {{ event.endereco.numero }}</div>
                          <div><strong>Latitude:</strong> {{ event.endereco.latitude }}</div>
                          <div><strong>Longitude:</strong> {{ event.endereco.longitude }}</div>
                        </div>
                      </q-expansion-item>
                      <div class="text-body1">
                        <strong>Gratuito:</strong> <span>{{ event.gratuito ? 'Sim' : 'Não' }}</span>
                      </div>
                      <div class="text-body1">
                        <strong>Faixa Km:</strong> <span>{{ event.faixaKm }}</span>
                      </div>
                      <div class="text-body1">
                        <strong>Tipo de Evento:</strong> <span>{{ event.tipoEvento?.nome }}</span>
                      </div>
                      <div class="text-body1">
                        <strong>Aprovado:</strong> <span>{{ event.aprovado ? 'Sim' : 'Não' }}</span>
                      </div>
                      <div v-if="event.urlSite" class="text-body1">
                        <strong>Site:</strong>
                        <a :href="event.urlSite" target="_blank" class="text-primary underline">{{
                          event.urlSite
                        }}</a>
                      </div>
                      <div class="q-mt-md flex q-gutter-sm">
                        <q-btn
                          color="info"
                          icon="edit"
                          label="Atualizar"
                          dense
                          @click="openEventoForm('update', event)"
                        />
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
                  </template>
                  <template #after>
                    <div v-if="event.endereco.latitude && event.endereco.longitude">
                      <iframe
                        :src="`https://www.openstreetmap.org/export/embed.html?bbox=${event.endereco.longitude - 0.0015},${event.endereco.latitude - 0.001},${event.endereco.longitude + 0.0015},${event.endereco.latitude + 0.001}&layer=mapnik&marker=${event.endereco.latitude},${event.endereco.longitude}`"
                        style="width: 100%; height: 40vh"
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </template>
                </q-splitter>
              </q-expansion-item>
            </q-list>
          </div>
        </div>
      </template>
    </q-splitter>

    <!-- Footer com paginação -->
    <q-footer class="q-shadow-1">
      <div class="row justify-center items-center">
        <div class="col-auto">
          <span class="q-mr-lg text-caption" v-if="eventoResponse?.totalRegistros !== undefined">
            Total: {{ eventoResponse.totalRegistros }} eventos
          </span>
        </div>
        <div class="col-auto">
          <span
            class="q-mr-lg text-caption"
            v-if="eventoResponse?.eventos && eventoResponse.eventos.length > 0"
          >
            Exibindo {{ eventoResponse.eventos.length }} nesta página
          </span>
        </div>
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

    <!-- Diálogos -->
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
    <q-dialog v-model="showEventoForm">
      <EventoForm
        :mode="eventoFormMode"
        :evento="eventoToEdit"
        @close="closeEventoForm"
        @eventoAtualizado="onEventoAtualizado"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import type { Evento } from 'src/models/Evento';
import type { NivelHabilidade } from 'src/models/NivelHabilidade';
import type { EventoRequest } from 'src/models/request/EventoRequest';
import type { EventoResponse } from 'src/models/response/EventoResponse';
import type { TipoEvento } from 'src/models/TipoEvento';
import { aprovarEvento, excluirEvento, getEventos } from 'src/services/eventoService';
import { isAuthenticated } from 'src/services/authService';
import { getNiveisHabilidade } from 'src/services/nivelHabilidadeService';
import { getTiposEvento } from 'src/services/tipoEventoService';
import { ref, computed, onMounted, defineEmits } from 'vue';
import EventoForm from './EventoForm.vue';

// Filtros padrão para pesquisa de eventos
const defaultFilters = {
  pagina: 1,
  nome: null,
  descricao: null,
  data: null as string | null,
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
const showConfirmDelete = ref(false);
const deleteProgress = ref(0);
let deleteTimer: ReturnType<typeof setInterval> | null = null;
const DELETE_DURATION = 5000; // 5 segundos
const eventToDelete = ref<Evento | null>(null);
const showEventoForm = ref(false);
const eventoFormMode = ref<'create' | 'update'>('create');
const eventoToEdit = ref<Evento | null>(null);
const splitterSizes = ref(60);
const showSearch = ref(true);
const splitterMain = ref(15);

const emit = defineEmits<{ (e: 'unauthenticated'): void }>();

onMounted(async () => {
  await verifyLogin();
  await fetchTiposEvento();
  await fetchNiveisHabilidade();
  await onFilter();
});

// Verifica autenticação do usuário
const verifyLogin = async () => {
  if (!(await isAuthenticated())) emit('unauthenticated');
};

// Busca opções de tipos de evento
const fetchTiposEvento = async () => {
  try {
    tiposEventoOptions.value = await getTiposEvento();
  } catch (error) {
    console.error('Erro ao buscar tipos de evento:', error);
  }
};

// Busca opções de níveis de habilidade
const fetchNiveisHabilidade = async () => {
  try {
    niveisHabilidadeOptions.value = await getNiveisHabilidade();
  } catch (error) {
    console.error('Erro ao buscar níveis de habilidade:', error);
  }
};

// Busca eventos conforme filtros
const fetchEventos = async (request: EventoRequest) => {
  await verifyLogin();
  try {
    eventoResponse.value = await getEventos(request);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
  }
};

// Aprova ou recusa evento
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

// Exibe diálogo de confirmação para exclusão
const askExcluir = (event: Evento) => {
  eventToDelete.value = event;
  showConfirmDelete.value = true;
  deleteProgress.value = 0;
  let elapsed = 0;
  const interval = 100;
  deleteTimer = setInterval(() => {
    elapsed += interval;
    deleteProgress.value = elapsed / DELETE_DURATION;
    if (elapsed >= DELETE_DURATION) cancelDelete();
  }, interval);
};

// Cancela exclusão
const cancelDelete = () => {
  showConfirmDelete.value = false;
  deleteProgress.value = 0;
  eventToDelete.value = null;
  if (deleteTimer) {
    clearInterval(deleteTimer);
    deleteTimer = null;
  }
};

// Confirma exclusão
const confirmDelete = async () => {
  if (eventToDelete.value) await excluir(eventToDelete.value);
  cancelDelete();
};

// Exclui evento
const excluir = async (event: Evento) => {
  try {
    await excluirEvento(event.id);
    await onFilter();
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
  }
};

// Abre formulário de evento (criação/edição)
const openEventoForm = (mode: 'create' | 'update', evento: Evento | null = null) => {
  eventoFormMode.value = mode;
  eventoToEdit.value = evento;
  showEventoForm.value = true;
};
const closeEventoForm = () => {
  showEventoForm.value = false;
  eventoToEdit.value = null;
};
const onEventoAtualizado = async () => {
  await onFilter();
  closeEventoForm();
};

// Filtros e paginação
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
const paginatedEvents = computed<Evento[]>(() => eventoResponse.value?.eventos ?? []);

// Normaliza data para input datetime-local
const normalizeDateInput = (val: string | number | null): string => {
  if (val === null) return '';
  const date = new Date(val);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
};
</script>

<style scoped>
body.body--dark .q-footer {
  background: #232323 !important;
  color: #eee;
  border: 2px solid #353535;
}
body.body--dark .q-expansion-item {
  background: #232323 !important;
}
body.body--dark .q-form,
body.body--dark .q-banner {
  background: #232323 !important;
  color: #eee;
}

body.body--light .q-footer {
  background: #e0e1e6 !important;
  color: #000000;
  border: 2px solid #ffffff;
}
body.body--light .q-expansion-item {
  background: #e0e1e6 !important;
}
body.body--light .q-form,
body.body--light .q-banner {
  background: #e0e1e6 !important;
  color: #000000;
}

.event-list-scroll {
  height: calc(100vh - 100px);
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overscroll-behavior: contain;
}
.event-list-scroll::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
  display: none !important;
}
.event-list-scroll {
  scrollbar-color: transparent transparent;
}
</style>
