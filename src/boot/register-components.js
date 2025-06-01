import EventoForm from 'src/components/evento/EventoForm.vue';
import EventoList from 'src/components/evento/EventoList.vue';
import HomeBanner from 'src/components/home/HomeBanner.vue';
import HomeBar from 'src/components/home/HomeBar.vue';
import LoginForm from 'src/components/login/LoginForm.vue';

export default ({ app }) => {
  // Register components globally
  app.component('custom-evento-form', EventoForm);
  app.component('custom-evento-list', EventoList);
  app.component('custom-home-banner', HomeBanner);
  app.component('custom-home-bar', HomeBar);
  app.component('custom-login-form', LoginForm);
};
