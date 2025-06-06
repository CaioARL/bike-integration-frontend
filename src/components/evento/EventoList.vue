<template>
  <div>
    <!-- Drawer de filtros para todas as telas -->
    <q-drawer
      v-model="showMobileFilters"
      side="left"
      overlay
      behavior="mobile"
      :width="320"
      class="q-pa-sm q-shadow-2"
      :breakpoint="0"
      show-if-above
    >
      <div>
        <div class="q-mb-lg flex flex-center rounded-borders">
          <q-btn
            color="primary"
            icon="add"
            label="Adicionar Evento"
            @click="openEventoForm('create')"
            unelevated
            class="full-width"
          />
        </div>
        <q-expansion-item
          class="q-mb-md"
          icon="filter_list"
          label="Filtros"
          expand-separator
          :default-opened="false"
        >
          <q-form
            @submit="onFormSubmit"
            @reset="resetFilters"
            class="q-pa-xs rounded-borders q-shadow-2"
          >
            <q-input v-model="filters.nome" label="Nome" outlined dense />
            <q-input v-model="filters.descricao" label="Descrição" outlined dense />
            <q-input v-model="filters.cidade" label="Cidade" outlined dense />
            <q-input v-model="filters.estado" label="Estado" outlined dense />
            <q-input v-model="filters.data" label="Data" type="datetime-local" outlined dense />
            <q-input
              v-model.number="filters.faixaKm"
              label="Faixa Km"
              type="number"
              outlined
              dense
            />
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
            <q-toggle v-model="filters.gratuito" label="Gratuito" left-label />
            <q-toggle v-model="filters.aprovado" label="Aprovado" left-label class="q-ml-md" />

            <div>
              <q-btn label="Filtrar" type="submit" color="primary" />
              <q-btn label="Limpar" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-expansion-item>
      </div>
    </q-drawer>

    <!-- Botão flutuante para abrir filtros -->
    <q-btn
      class="q-mb-md q-ml-md"
      color="primary"
      icon="filter_list"
      round
      dense
      @click="showMobileFilters = true"
      style="position: fixed; top: 1rem; left: 1rem; z-index: 2000"
    >
      <q-tooltip v-if="!$q.platform.is.mobile"> Menu de eventos </q-tooltip>
    </q-btn>

    <!-- Botão flutuante para forçar atualização -->
    <q-btn
      class="q-mb-md q-ml-md"
      color="secondary"
      icon="refresh"
      round
      dense
      @click="onForceRefresh"
      style="position: fixed; top: 1rem; left: 4.5rem; z-index: 2000"
    >
      <q-tooltip>Forçar atualização</q-tooltip>
    </q-btn>

    <!-- Lista de eventos -->
    <div style="position: relative; min-height: 120px">
      <div class="flex justify-center items-center" v-if="isLoading">
        <q-spinner-hourglass color="primary" size="3em" />
      </div>
      <div v-if="(eventoResponse?.eventos?.length ?? 0) === 0 && !isLoading" class="q-pa-md">
        <q-banner>Nenhum evento encontrado.</q-banner>
      </div>
      <div v-else-if="!isLoading" class="event-list-scroll">
        <q-list class="q-pa-md rounded-borders">
          <q-expansion-item
            v-for="event in paginatedEvents"
            :key="event.id"
            :ref="expansionItemRef(event.id)"
            expand-separator
            :default-opened="false"
            :icon="event.aprovado ? 'check_circle' : 'error'"
            :header-class="event.aprovado ? 'text-positive' : 'text-negative'"
            :icon-right="event.aprovado ? 'expand_more' : 'expand_less'"
            :label="event.nome"
            :caption="`ID: ${event.id} - Data: ${event.data}`"
            class="q-mb-sm rounded-borders shadow-1"
            :model-value="expandedEvents.has(event.id)"
            @update:model-value="
              (val) => {
                if (val) expandedEvents.add(event.id);
                else expandedEvents.delete(event.id);
              }
            "
          >
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-5 order-md-1 order-2">
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
                  <q-expansion-item dense label="Usuário" class="q-mb-sm">
                    <div class="q-ml-md">
                      <div><strong>Nome:</strong> {{ event.usuario.nome }}</div>
                      <div><strong>Email:</strong> {{ event.usuario.email }}</div>
                      <div>
                        <strong>{{ event.usuario.cnpj ? 'CNPJ' : 'CPF' }}:</strong>
                        {{ event.usuario.cnpj || event.usuario.cpf }}
                      </div>
                      <q-expansion-item
                        v-if="event.usuario.endereco"
                        dense
                        label="Endereço"
                        class="q-mb-sm"
                      >
                        <div class="q-ml-md">
                          <div><strong>CEP:</strong> {{ event.usuario.endereco.cep }}</div>
                          <div><strong>Estado:</strong> {{ event.usuario.endereco.estado }}</div>
                          <div><strong>Cidade:</strong> {{ event.usuario.endereco.cidade }}</div>
                          <div><strong>Bairro:</strong> {{ event.usuario.endereco.bairro }}</div>
                          <div><strong>Rua:</strong> {{ event.usuario.endereco.rua }}</div>
                          <div><strong>Número:</strong> {{ event.usuario.endereco.numero }}</div>
                        </div>
                      </q-expansion-item>
                    </div>
                  </q-expansion-item>
                  <div class="text-body1">
                    <strong>Gratuito:</strong> <span>{{ event.gratuito ? 'Sim' : 'Não' }}</span>
                  </div>
                  <div v-if="!event.gratuito" class="text-body1">
                    <strong>Valor:</strong> <span>{{ event.valor }}</span>
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
              </div>
              <div
                v-if="
                  event.endereco.latitude &&
                  event.endereco.longitude &&
                  expandedEvents.has(event.id)
                "
                class="col-12 col-md-7 order-md-2 order-1 flex flex-center"
              >
                <div class="q-pa-xs" style="width: 100%">
                  <custom-map-viewer
                    :latitude="event.endereco.latitude"
                    :longitude="event.endereco.longitude"
                    :nome-evento="event.nome"
                  />
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-list>
      </div>
    </div>

    <!-- Footer com paginação -->
    <q-footer class="q-shadow-1 bg-transparent">
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
// -------------------- IMPORTS --------------------
import type { Evento } from 'src/models/Evento';
import type { NivelHabilidade } from 'src/models/NivelHabilidade';
import type { EventoRequest } from 'src/models/request/EventoRequest';
import type { EventoResponse } from 'src/models/response/EventoResponse';
import type { TipoEvento } from 'src/models/TipoEvento';
import { aprovarEvento, excluirEvento, getEventos } from 'src/services/eventoService';
import { isAuthenticated } from 'src/services/authService';
import { getNiveisHabilidade } from 'src/services/nivelHabilidadeService';
import { getTiposEvento } from 'src/services/tipoEventoService';
import { ref, computed, onMounted, defineEmits, watch, nextTick, onUnmounted } from 'vue';
import EventoForm from './EventoForm.vue';
import * as sessionUtils from 'src/utils/localStorageUtils';
import { connectEventoSocket, disconnectEventoSocket } from 'src/services/eventoSocketService';
import { notifyCustom } from 'src/services/notifyService';

// -------------------- CONSTANTES E VARIÁVEIS --------------------
const defaultFilters = {
  pagina: 1, // página atual da paginação
  nome: null, // filtro por nome
  descricao: null, // filtro por descrição
  data: null as string | null, // filtro por data
  cidade: null, // filtro por cidade
  estado: null, // filtro por estado
  faixaKm: null, // filtro por faixa de km
  tipoEventoId: null as number | null, // filtro por tipo de evento
  nivelHabilidadeId: null as number | null, // filtro por nível de habilidade
  gratuito: null, // filtro por gratuidade
  aprovado: null, // filtro por aprovação
};
const filters = ref({ ...defaultFilters }); // filtros ativos

const eventoResponse = ref<EventoResponse>(); // response da chamada ao serviço de listagem de eventos
const tiposEventoOptions = ref<TipoEvento[]>([]); // opções de tipos de evento
const niveisHabilidadeOptions = ref<NivelHabilidade[]>([]); // opções de níveis de habilidade
const currentPage = ref(1); // página atual
const rowsPerPage = 50; // quantidade de linhas por página
const showConfirmDelete = ref(false); // exibe diálogo de confirmação de exclusão
const deleteProgress = ref(0); // progresso da barra de exclusão
let deleteTimer: ReturnType<typeof setInterval> | null = null; // timer para exclusão
const DELETE_DURATION = 5000; // duração da barra de exclusão (ms)
const eventToDelete = ref<Evento | null>(null); // evento a ser excluído
const showEventoForm = ref(false); // exibe formulário de evento
const eventoFormMode = ref<'create' | 'update'>('create'); // modo do formulário de evento
const eventoToEdit = ref<Evento | null>(null); // evento em edição
const showMobileFilters = ref(false); // exibe drawer de filtros no mobile
const isLoading = ref(false); // status de carregamento
const expandedEvents = ref<Set<number>>(new Set()); // eventos expandidos
const expansionRefs = ref<Record<number, HTMLElement | null>>({}); // refs dos expansion items
const emit = defineEmits<{ (e: 'unauthenticated'): void }>(); // emit para eventos do componente
const STORAGE_KEY = 'eventoListState'; // chave de storage para filtros e paginação
const EXPANDED_KEY = 'eventoListExpanded'; // chave de storage para eventos expandidos

// -------------------- ONMOUNTED --------------------
onMounted(() => {
  doMount();
  connectEventoSocket(handleSocketMessage);
});

onUnmounted(() => {
  disconnectEventoSocket();
});

// -------------------- MÉTODOS --------------------

const doMount = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    void (async () => {
      await Promise.all([
        restoreStateInternal(),
        verifyLogin(),
        fetchTiposEvento(),
        fetchNiveisHabilidade(),
      ]);
    })();
  }, 0);
};

const handleSocketMessage = (msg: string) => {
  try {
    const data = JSON.parse(msg);
    if (data.count && data.count > (eventoResponse.value?.totalRegistros ?? 0)) {
      console.log('Novos eventos encontrados:', data.count);
      notifyCustom(
        'Foram encontrados novos eventos, por favor atualize a lista.',
        'warning',
        'sync_problem',
        10000,
      );
    }
  } catch (error) {
    console.error('Erro ao processar mensagem do socket:', error);
  }
};

const getLastExpandedEventOnCurrentPage = (): number | undefined => {
  const currentIds = paginatedEvents.value.map((e) => e.id);
  // Filtra os eventos expandidos que estão na página atual
  const expandedOnPage = Array.from(expandedEvents.value).filter((id) => currentIds.includes(id));
  return expandedOnPage.at(-1);
};

const expansionItemRef = (eventId: number) => (el: Element | { $el?: Element } | null) => {
  if (el && typeof el === 'object' && '$el' in el && el.$el instanceof HTMLElement) {
    expansionRefs.value[eventId] = el.$el;
  } else if (el instanceof HTMLElement) {
    expansionRefs.value[eventId] = el;
  } else {
    expansionRefs.value[eventId] = null;
  }
};

const scrollToExpandedEvent = async (eventId: number) => {
  await nextTick();
  if (expansionRefs.value[eventId]) {
    expansionRefs.value[eventId].scrollIntoView({ behavior: 'auto', block: 'center' });
  }
};

const saveState = () => {
  const state = {
    filters: filters.value,
    currentPage: currentPage.value,
    eventoResponse: eventoResponse.value,
  };
  sessionUtils.set(STORAGE_KEY, JSON.stringify(state));
  sessionUtils.set(EXPANDED_KEY, JSON.stringify(Array.from(expandedEvents.value)));
};

const restoreStateInternal = async () => {
  const restored = restoreState();
  if (restored) {
    const expandedId = getLastExpandedEventOnCurrentPage();
    if (typeof expandedId === 'number') {
      await nextTick();
      await scrollToExpandedEvent(expandedId);
    }
  } else {
    await onFilter();
  }
};

const restoreState = () => {
  const raw = sessionUtils.get(STORAGE_KEY);
  const expandedRaw = sessionUtils.get(EXPANDED_KEY);
  if (raw) {
    try {
      const state = JSON.parse(raw);
      if (state.filters) Object.assign(filters.value, state.filters);
      if (state.currentPage) currentPage.value = state.currentPage;
      if (state.eventoResponse) eventoResponse.value = state.eventoResponse;
      if (expandedRaw) {
        const expandedArr = JSON.parse(expandedRaw);
        expandedEvents.value = new Set(expandedArr);
      }
      return true;
    } catch {
      console.error('Erro ao restaurar estado:', raw);
      sessionUtils.remove(STORAGE_KEY);
      sessionUtils.remove(EXPANDED_KEY);
      return false;
    }
  }
  return false;
};

const verifyLogin = async () => {
  if (!(await isAuthenticated())) emit('unauthenticated');
};

const fetchTiposEvento = async () => {
  try {
    tiposEventoOptions.value = await getTiposEvento();
  } catch (error) {
    console.error('Erro ao buscar tipos de evento:', error);
  }
};

const fetchNiveisHabilidade = async () => {
  try {
    niveisHabilidadeOptions.value = await getNiveisHabilidade();
  } catch (error) {
    console.error('Erro ao buscar níveis de habilidade:', error);
  }
};

const fetchEventos = async (request: EventoRequest) => {
  await verifyLogin();
  isLoading.value = true;
  try {
    eventoResponse.value = await getEventos(request);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
  } finally {
    isLoading.value = false;
  }
};

const onForceRefresh = async () => {
  await onFilter();
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

const cancelDelete = () => {
  showConfirmDelete.value = false;
  deleteProgress.value = 0;
  eventToDelete.value = null;
  if (deleteTimer) {
    clearInterval(deleteTimer);
    deleteTimer = null;
  }
};

const confirmDelete = async () => {
  if (eventToDelete.value) await excluir(eventToDelete.value);
  cancelDelete();
};

const excluir = async (event: Evento) => {
  try {
    await excluirEvento(event.id);
    expandedEvents.value.delete(event.id); // Remove da lista de expandidos
    await onFilter();
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
  }
};

const openEventoForm = (mode: 'create' | 'update', evento: Evento | null = null) => {
  eventoFormMode.value = mode;
  eventoToEdit.value = evento;
  showEventoForm.value = true;
};

const closeEventoForm = () => {
  showEventoForm.value = false;
  eventoToEdit.value = null;
};

const onEventoAtualizado = async (event?: Evento) => {
  const expandId = event?.id;
  await onFilter(expandId);
  closeEventoForm();
};

const buildEventoRequest = (): EventoRequest => {
  return {
    ...filters.value,
    tipoEvento: filters.value.tipoEventoId ?? null,
    nivelHabilidade: filters.value.nivelHabilidadeId ?? null,
  };
};

const onFormSubmit = async () => {
  filters.value.pagina = 1;
  currentPage.value = 1;
  await onFilter();
};

const onFilter = async (expandId?: number) => {
  await fetchEventos(buildEventoRequest());
  if (expandId) {
    expandedEvents.value = new Set([expandId]);
  }
};

const resetFilters = () => {
  Object.assign(filters.value, defaultFilters);
  currentPage.value = 1;
};

const handlePageChange = async (page: number) => {
  filters.value.pagina = page;
  currentPage.value = page;
  await fetchEventos(buildEventoRequest());
};

// -------------------- WATCHS --------------------
watch([filters, currentPage, eventoResponse, expandedEvents], saveState, { deep: true });
watch([eventoResponse, expandedEvents], async ([response]) => {
  const expandedId = getLastExpandedEventOnCurrentPage();
  if (typeof expandedId === 'number' && response?.eventos?.some((e) => e.id === expandedId)) {
    await nextTick();
    await scrollToExpandedEvent(expandedId);
  }
});

// -------------------- COMPUTEDS --------------------
const totalPages = computed(() =>
  Math.ceil((eventoResponse.value?.totalRegistros ?? 0) / rowsPerPage),
);

const paginatedEvents = computed<Evento[]>(() => eventoResponse.value?.eventos ?? []); // eventos paginados
</script>

<style scoped>
body.body--dark .q-footer {
  border: 1px solid transparent;
  color: #ffffff;
}
body.body--dark .q-expansion-item {
  background: #232323 !important;
}
body.body--dark .q-form,
body.body--dark .q-banner {
  background: #232323 !important;
  color: #ffffff;
}

body.body--light .q-footer {
  border: 1px solid transparent;
  color: #000000;
}
body.body--light .q-expansion-item {
  background: #e0e1e6 !important;
}
body.body--light .q-form,
body.body--light .q-banner {
  background: #e0e1e6 !important;
  color: #000000;
}

/* Removendo scrollbar */
.event-list-scroll {
  height: calc(100dvh - 6.1rem);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
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
