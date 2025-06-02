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
        <q-toggle v-model="form.gratuito" label="Gratuito" left-label class="gray-toggle q-mb-sm" />
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
        <q-expansion-item label="Endereço" class="q-mb-sm gray-form" expand-separator>
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
import { defineEmits, ref, watch, onMounted, computed } from 'vue';
import type { Evento } from 'src/models/Evento';
import type { TipoEvento } from 'src/models/TipoEvento';
import { getTiposEvento } from 'src/services/tipoEventoService';
import { criarEvento, atualizarEvento } from 'src/services/eventoService';
import { notifyCustom } from 'src/services/notifyService';
import type { EventoFormData } from 'src/models/request/EventoFormData';
import { getIdUser } from 'src/services/authService';
import { getEnderecoByCep } from 'src/services/enderecoService';

const props = defineProps<{
  mode: 'create' | 'update';
  evento: Evento | null;
}>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'eventoAtualizado'): void;
}>();

const tiposEventoOptions = ref<TipoEvento[]>([]);

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
const loading = ref(false);
const enderecoLoading = ref(false);

onMounted(async () => {
  tiposEventoOptions.value = await getTiposEvento();
  if (props.mode === 'update' && props.evento) {
    setFormFromEvento(props.evento);
  }
});

// Função utilitária para normalizar datas (aceita vários formatos e retorna ISO completo)
function normalizeDateInput(val: string | number | null): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'number') val = String(val);
  if (typeof val !== 'string') return '';
  // yyyy-MM-ddTHH:mm:ss.SSS
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/.test(val)) return val;
  // yyyy-MM-ddTHH:mm
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) return val + ':00.000';
  // yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val + 'T00:00:00.000';
  // dd/MM/yyyy ou dd/MM/yyyyTHH:mm
  const brDateTime = val.match(/^(\d{2})\/(\d{2})\/(\d{4})(T(\d{2}):(\d{2}))?/);
  if (brDateTime) {
    const [, day, month, year, , hour = '00', min = '00'] = brDateTime;
    return `${year}-${month}-${day}T${hour}:${min}:00.000`;
  }
  // yyyy-MM-dd HH:mm:ss
  if (val.includes(' ')) {
    const [date, time] = val.split(' ');
    return `${date}T${time || '00:00:00'}.000`;
  }
  return val;
}

// Sempre retorna yyyy-MM-ddTHH:mm para o input
const formData = computed({
  get() {
    const d = form.value.data;
    if (!d) return '';
    // yyyy-MM-ddTHH:mm:ss.SSS ou yyyy-MM-ddTHH:mm:ss
    const iso = d.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/);
    if (iso) return `${iso[1]}T${iso[2]}:${iso[3]}`;
    // dd/MM/yyyyTHH:mm
    const br = d.match(/^(\d{2})\/(\d{2})\/(\d{4})T(\d{2}):(\d{2})/);
    if (br) return `${br[3]}-${br[2]}-${br[1]}T${br[4]}:${br[5]}`;
    // dd/MM/yyyy
    const br2 = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (br2) return `${br2[3]}-${br2[2]}-${br2[1]}T00:00`;
    // yyyy-MM-dd
    const iso2 = d.match(/^(\d{4}-\d{2}-\d{2})$/);
    if (iso2) return `${iso2[1]}T00:00`;
    return d;
  },
  set(val: string) {
    form.value.data = normalizeDateInput(val);
  },
});

watch(
  () => props.evento,
  (val) => {
    if (props.mode === 'update' && val) setFormFromEvento(val);
    if (props.mode === 'create') resetForm();
  },
);

function setFormFromEvento(evento: Evento) {
  form.value = {
    nome: evento.nome,
    descricao: evento.descricao,
    data: normalizeDateInput(evento.data ?? ''),
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
}
function resetForm() {
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
}

function onSubmit() {
  if (!form.value.nome || !form.value.descricao || !form.value.data || !form.value.idTipoEvento) {
    notifyCustom('Por favor, preencha todos os campos obrigatórios.', 'warning', 'warning');
    return;
  }
  const idUsuario = getIdUser();
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
}

// Corrigido para aceitar string | number | null
function onCepInput(val: string | number | null) {
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
}
</script>

<style scoped>
.gray-form {
  background-color: var(--gray-form-bg);
  border-radius: 6px;
}
.gray-toggle {
  background-color: var(--gray-form-bg);
  border-radius: 6px;
  padding: 2px 8px;
}
:root {
  --gray-form-bg: #f2f2f4;
}
.body--dark .gray-form,
.body--dark .gray-toggle {
  --gray-form-bg: #23232b;
}
.body--light .gray-form,
.body--light .gray-toggle {
  --gray-form-bg: #f2f2f4;
}
</style>
