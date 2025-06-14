<template>
  <div class="home-content-bg">
    <!-- HERO/CONNECTIONS -->
    <section :class="['q-py-xl', 'q-mt-md', isDark ? 'bg-purple-dark' : 'bg-purple-light']">
      <div class="row items-center justify-center" style="max-width: 1200px; margin: 0 auto">
        <div class="col-12 col-md-6 q-pa-md">
          <h1 class="text-h4 text-bold q-mb-md">
            Conexões que transformam realidades por meio da mobilidade urbana.
          </h1>
          <div class="q-mb-md text-subtitle1">
            Expanda as possibilidades do seu futuro com a gente.
          </div>
          <div class="q-mb-md">
            Somos o Bike Integration, a plataforma que conecta ciclistas, empresas e eventos para
            promover a mobilidade urbana e o uso consciente das ciclovias.
          </div>
          <q-btn color="primary" label="Saiba mais" icon="arrow_forward" />
        </div>
        <div class="col-12 col-md-6 flex flex-center q-pa-md">
          <q-img :src="appMockup1" style="max-width: 320px; border-radius: 18px" />
        </div>
      </div>
    </section>

    <!-- AQUI VOCÊ ENCONTRA / BENEFÍCIOS -->
    <section :class="['q-py-xl', isDark ? 'bg-yellow-dark' : 'bg-yellow-light']">
      <div class="row items-center justify-center" style="max-width: 1200px; margin: 0 auto">
        <div class="col-12 col-md-5 q-pa-md">
          <h2 class="text-h5 text-bold q-mb-md">AQUI VOCÊ<br />ENCONTRA:</h2>
          <q-img :src="cyclistImg" style="max-width: 180px" class="q-mb-md" />
        </div>
        <div class="col-12 col-md-7 q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6" v-for="(benefit, idx) in benefits" :key="idx">
              <q-card flat bordered class="q-pa-md flex items-center">
                <q-icon :name="benefit.icon" size="32px" color="primary" class="q-mr-md" />
                <div>
                  <div class="text-bold">{{ benefit.title }}</div>
                  <div class="text-caption">{{ benefit.desc }}</div>
                </div>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- IMPACTO -->
    <section :class="['q-py-xl', isDark ? 'bg-blue-dark' : 'bg-blue-light']">
      <div class="row items-center justify-center" style="max-width: 1200px; margin: 0 auto">
        <div class="col-12 col-md-4 q-pa-md">
          <div class="text-h6 text-bold">NOSSO IMPACTO NA MOBILIDADE</div>
        </div>
        <div class="col-12 col-md-8 q-pa-md">
          <div class="row q-col-gutter-lg">
            <div class="col-6 col-sm-3" v-for="(impact, idx) in impacts" :key="idx">
              <div class="text-h4 text-primary text-bold">{{ impact.value }}</div>
              <div class="text-caption">{{ impact.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section :class="['q-py-xl', isDark ? 'bg-purple-darker' : 'bg-purple-lighter']">
      <div class="row items-center justify-center" style="max-width: 1200px; margin: 0 auto">
        <div class="col-12 col-md-6 q-pa-md">
          <h2 class="text-h5 text-bold q-mb-md">Junte-se à nossa comunidade!</h2>
          <div class="q-mb-md">Faça parte do movimento que transforma a mobilidade urbana.</div>
          <q-btn color="primary" label="Quero participar" icon="group_add" />
        </div>
        <div class="col-12 col-md-6 flex flex-center q-pa-md">
          <q-img :src="appMockup2" style="max-width: 220px; border-radius: 18px" />
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer :class="[isDark ? 'footer-dark' : 'footer-light']">
      <div class="row items-start justify-between q-px-lg q-mx-auto" style="max-width: 1200px">
        <div class="col-12 col-md-6 q-mb-md">
          <div class="row">
            <div class="col-12 col-sm-4">
              <div class="text-bold q-mb-xs">INSTITUCIONAL</div>
              <div><q-btn flat dense no-caps class="q-px-none" label="Home" /></div>
              <div><q-btn flat dense no-caps class="q-px-none" label="Sobre nós" /></div>
              <div><q-btn flat dense no-caps class="q-px-none" label="Blog" /></div>
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-bold q-mb-xs">EDUCACIONAL</div>
              <div><q-btn flat dense no-caps class="q-px-none" label="Academia Bike" /></div>
              <div><q-btn flat dense no-caps class="q-px-none" label="Eventos" /></div>
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-bold q-mb-xs">SOLUÇÕES</div>
              <div><q-btn flat dense no-caps class="q-px-none" label="Parceiros" /></div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3 q-mb-md">
          <div class="q-mb-sm">
            Somos o Bike Integration, uma plataforma que conecta ciclistas, empresas e eventos para
            promover a mobilidade urbana e o uso consciente das ciclovias.
          </div>
          <div>
            <q-btn flat dense round icon="mdi-instagram" class="q-mr-sm" />
            <q-btn flat dense round icon="mdi-facebook" class="q-mr-sm" />
            <q-btn flat dense round icon="mdi-youtube" />
          </div>
        </div>
      </div>
      <div
        class="row items-center justify-between q-mt-lg q-px-lg q-mx-auto"
        style="max-width: 1200px"
      >
        <div class="col-auto text-caption">© 2025 BiCity. Todos os direitos reservados</div>
        <q-btn
          v-if="showScrollTop"
          round
          :style="{ backgroundColor: '#C3FF00', color: '#000' }"
          class="scroll-top-btn"
          icon="keyboard_arrow_up"
          @click="scrollToTop"
          style="
            position: fixed;
            right: 32px;
            bottom: 32px;
            z-index: 100;
            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
          "
        />
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import cyclistImg from 'src/assets/bicity-logo.svg';
import appMockup1 from 'src/assets/lost-svgrepo-com.svg';
import appMockup2 from 'src/assets/fall-down-the-stairs-falling-down-svgrepo-com.svg';
import { ref, onMounted, onUnmounted } from 'vue';
import { useTheme } from 'src/composables/useTheme';

const { isDark } = useTheme();

const benefits = [
  {
    icon: 'mdi-bicycle',
    title: 'Eventos exclusivos',
    desc: 'Participe dos melhores eventos de ciclismo.',
  },
  {
    icon: 'mdi-star',
    title: 'Avaliações de ciclovias',
    desc: 'Veja e compartilhe avaliações reais.',
  },
  { icon: 'mdi-domain', title: 'Para empresas', desc: 'Divulgue seus eventos esportivos.' },
  {
    icon: 'mdi-map-marker',
    title: 'Mapa de ciclovias',
    desc: 'Acompanhe a situação das ciclovias.',
  },
  {
    icon: 'mdi-account-group',
    title: 'Comunidade ativa',
    desc: 'Conecte-se com outros ciclistas.',
  },
  {
    icon: 'mdi-shield-check',
    title: 'Segurança',
    desc: 'Dicas e informações para pedalar seguro.',
  },
];

const impacts = [
  { value: '+100', label: 'Eventos cadastrados' },
  { value: '+1000', label: 'Usuários ativos' },
  { value: '+70', label: 'Ciclovias avaliadas' },
  { value: '+10', label: 'Empresas parceiras' },
];

const showScrollTop = ref(false);

function handleScroll() {
  const scrollY = window.scrollY || window.pageYOffset;
  const halfPage = document.documentElement.scrollHeight / 2;
  showScrollTop.value = scrollY > halfPage;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const scrollToTop = () => {
  const duration = 1200; // duração em ms (mais lento)
  const start = window.scrollY || window.pageYOffset;
  const startTime = performance.now();

  function animateScroll(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    window.scrollTo(0, start * (1 - ease));
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }
  requestAnimationFrame(animateScroll);
};
</script>

<style scoped>
.home-content-bg {
  min-height: 100vh;
}

.bg-purple-light {
  background: #f3e8ff;
}
.bg-purple-dark {
  background: #232946;
}
.bg-purple-lighter {
  background: #e9d5ff;
}
.bg-purple-darker {
  background: #1c1b2f;
}
.bg-yellow-light {
  background: #fef9c3;
}
.bg-yellow-dark {
  background: #3a3a1a;
}
.bg-blue-light {
  background: #e0f2fe;
}
.bg-blue-dark {
  background: #1e293b;
}
footer {
  background: v-bind('isDark ? "#181818" : "#fff"');
  color: v-bind('isDark ? "#e0e0e0" : "#222"');
}
.footer-light {
  background: #fff;
  color: #222;
}
.footer-dark {
  background: #181818;
  color: #e0e0e0;
}
</style>
