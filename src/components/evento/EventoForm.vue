<template>
  <q-card style="min-width: 400px; max-width: 95vw">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        {{ mode === 'create' ? 'Adicionar Evento' : 'Atualizar Evento' }}
      </div>
      <q-form @submit.prevent="onSubmit">
        <q-inner-loading :showing="loading" color="primary" size="50px" />
        <q-input
          v-model="form.nome"
          label="Nome"
          outlined
          dense
          class="gray-form q-mb-sm"
          required
        />
        <q-input
          v-model="form.descricao"
          label="Descrição"
          outlined
          dense
          class="gray-form q-mb-sm"
          required
        />
        <q-input
          v-model="formData"
          label="Data"
          type="datetime-local"
          outlined
          dense
          class="gray-form q-mb-sm"
          required
        />
        <q-input
          v-model.number="form.faixaKm"
          label="Faixa Km"
          type="number"
          outlined
          dense
          class="gray-form q-mb-sm"
          required
        />
        <q-input
          v-model="form.urlSite"
          label="Site (opcional)"
          outlined
          dense
          class="gray-form q-mb-sm"
        />
        <q-toggle
          v-model="form.gratuito"
          label="Gratuito"
          left-label
          class="gray-toggle q-mb-sm q-pa-sm"
        />
        <q-select
          v-model="form.idTipoEvento"
          :options="tiposEventoOptions"
          label="Tipo de Evento"
          option-label="nome"
          option-value="id"
          emit-value
          map-options
          outlined
          dense
          class="gray-form q-mb-sm"
          required
        />
        <q-expansion-item label="Endereço" class="q-mb-sm" expand-separator>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.endereco.cep"
                label="CEP"
                outlined
                dense
                class="gray-form q-mb-sm"
                required
                :loading="enderecoLoading"
                @update:model-value="onCepInput"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.endereco.estado"
                label="Estado"
                outlined
                dense
                class="gray-form q-mb-sm"
                required
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.endereco.cidade"
                label="Cidade"
                outlined
                dense
                class="gray-form q-mb-sm"
                required
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.endereco.bairro"
                label="Bairro"
                outlined
                dense
                class="gray-form q-mb-sm"
                required
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.endereco.rua"
                label="Rua"
                outlined
                dense
                class="gray-form q-mb-sm"
                required
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.endereco.numero"
                label="Número"
                outlined
                dense
                class="gray-form q-mb-sm"
                required
              />
            </div>
          </div>
        </q-expansion-item>
        <div class="row q-mt-md q-gutter-sm justify-end">
          <q-btn flat label="Cancelar" color="primary" @click="$emit('close')" />
          <q-btn
            type="submit"
            :label="mode === 'create' ? 'Adicionar' : 'Atualizar'"
            color="primary"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
// -------------------- IMPORTS --------------------
import { defineEmits, ref, watch, onMounted, computed } from 'vue';
import type { Evento } from 'src/models/Evento';
import type { TipoEvento } from 'src/models/TipoEvento';
import { getTiposEvento } from 'src/services/tipoEventoService';
import { criarEvento, atualizarEvento } from 'src/services/eventoService';
import { notifyCustom } from 'src/services/notifyService';
import type { EventoFormData } from 'src/models/request/EventoFormData';
import { getIdUser } from 'src/services/authService';
import { getEnderecoByCep } from 'src/services/enderecoService';
import { normalizeDateInput, formatDateForInput } from 'src/utils/dateUtils';

// -------------------- CONSTS--------------------
const props = defineProps<{
  mode: 'create' | 'update';
  evento: Evento | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'eventoAtualizado'): void;
}>();

const defaultEndereco = {
  cidade: '',
  estado: '',
  latitude: 0,
  longitude: 0,
  cep: '',
  bairro: '',
  rua: '',
  numero: '',
};

const form = ref<
  Omit<EventoFormData, 'nivelHabilidadeId' | 'tipoEventoId'> & { idTipoEvento: number | null }
>({
  nome: '',
  descricao: '',
  data: '',
  faixaKm: 0,
  urlSite: '',
  gratuito: false,
  idTipoEvento: null,
  endereco: { ...defaultEndereco },
});

const tiposEventoOptions = ref<TipoEvento[]>([]); // Endereço padrão para inicialização do formulário
const loading = ref(false); // Status de loading do campo de endereço (CEP)
const enderecoLoading = ref(false); // boolean para indicar se o CEP está sendo buscado

// -------------------- ONMOUNTED --------------------
onMounted(async () => {
  tiposEventoOptions.value = await getTiposEvento();
  if (props.mode === 'update' && props.evento) {
    setFormFromEvento(props.evento);
  }
});

// -------------------- CONSTS (MÉTODOS) --------------------
// Preenche o formulário a partir de um evento existente
const setFormFromEvento = (evento: Evento) => {
  const normalizedData = normalizeDateInput(evento.data ?? '');
  form.value = {
    nome: evento.nome,
    descricao: evento.descricao,
    data: normalizedData,
    faixaKm: evento.faixaKm,
    urlSite: evento.urlSite || '',
    gratuito: evento.gratuito,
    idTipoEvento: evento.tipoEvento?.id || null,
    endereco: {
      cidade: evento.endereco.cidade,
      estado: evento.endereco.estado,
      latitude: evento.endereco.latitude || 0,
      longitude: evento.endereco.longitude || 0,
      cep: evento.endereco.cep || '',
      bairro: evento.endereco.bairro || '',
      rua: evento.endereco.rua || '',
      numero: evento.endereco.numero?.toString() || '',
    },
  };
};

// Reseta o formulário para o estado inicial
const resetForm = () => {
  form.value = {
    nome: '',
    descricao: '',
    data: '',
    faixaKm: 0,
    urlSite: '',
    gratuito: false,
    idTipoEvento: null,
    endereco: { ...defaultEndereco },
  };
};

// Obtém o id do usuário logado (ou do evento, se for update)
const getIdUserInternal = () => {
  const idUsuario = getIdUser();
  if (props.mode === 'update' && props.evento) {
    return props.evento.usuario?.id || idUsuario;
  }
  return idUsuario;
};

// Submete o formulário para criar ou atualizar evento
const onSubmit = () => {
  if (!form.value.nome || !form.value.descricao || !form.value.data || !form.value.idTipoEvento) {
    notifyCustom('Por favor, preencha todos os campos obrigatórios.', 'warning', 'warning');
    return;
  }
  const idUsuario = getIdUserInternal();
  if (!idUsuario) {
    notifyCustom('Usuário não autenticado.', 'negative', 'error');
    return;
  }
  loading.value = true;
  const payload = { ...form.value, idUsuario };
  const finish = () => {
    loading.value = false;
  };
  if (props.mode === 'create') {
    criarEvento(payload)
      .then(() => {
        notifyCustom('Evento criado com sucesso!', 'success', 'check_circle');
        resetForm();
        emit('eventoAtualizado');
        emit('close');
      })
      .catch((error) => {
        notifyCustom(`Erro ao criar evento: ${error.message}`, 'negative', 'error');
      })
      .finally(finish);
  } else if (props.mode === 'update' && props.evento) {
    atualizarEvento(props.evento.id, payload)
      .then(() => {
        notifyCustom('Evento atualizado com sucesso!', 'success', 'check_circle');
        emit('eventoAtualizado');
        emit('close');
      })
      .catch((error) => {
        notifyCustom(`Erro ao atualizar evento: ${error.message}`, 'negative', 'error');
      })
      .finally(finish);
  }
};

// Busca endereço pelo CEP e preenche campos relacionados
const onCepInput = (val: string | number | null) => {
  const cep = typeof val === 'string' ? val : (val?.toString() ?? '');
  if (!cep || cep.length < 8) return;
  enderecoLoading.value = true;
  getEnderecoByCep(cep.replace(/\D/g, ''))
    .then((endereco) => {
      form.value.endereco.cidade = endereco.city || '';
      form.value.endereco.estado = endereco.state || '';
      form.value.endereco.bairro = endereco.neighborhood || '';
      form.value.endereco.rua = endereco.street || '';
    })
    .catch(() => {
      notifyCustom('CEP não encontrado ou erro ao buscar endereço.', 'warning', 'warning');
    })
    .finally(() => {
      enderecoLoading.value = false;
    });
};

// -------------------- WATCHS --------------------
watch(
  () => props.evento,
  (val) => {
    if (props.mode === 'update' && val) setFormFromEvento(val);
    if (props.mode === 'create') resetForm();
  },
);

// -------------------- COMPUTEDS --------------------
// Computed para manipular o campo de data do formulário
const formData = computed({
  get() {
    return formatDateForInput(form.value.data);
  },
  set(val: string) {
    form.value.data = normalizeDateInput(val);
  },
});
</script>

<style scoped>
.body--dark .gray-form,
.body--dark .gray-toggle {
  --gray-form-bg: #3f3f3f;
  background-color: var(--gray-form-bg);
  border-radius: 6px;
}
.body--light .gray-form,
.body--light .gray-toggle,
.body--light .gray-toggle {
  --gray-form-bg: #d8d8d8;
  background-color: var(--gray-form-bg);
  border-radius: 6px;
}
</style>
