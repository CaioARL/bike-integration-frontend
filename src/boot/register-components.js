import EventoForm from 'src/components/evento/EventoForm.vue';
import EventoList from 'src/components/evento/EventoList.vue';
import HomeBanner from 'src/components/home/HomeBanner.vue';
import HomeBar from 'src/components/home/HomeBar.vue';
import HomeContainer from 'src/components/home/HomeContainer.vue';
import HomeContent from 'src/components/home/HomeContent.vue';
import LoginForm from 'src/components/login/LoginForm.vue';
import CustomMapViewer from 'src/components/viewers/CustomMapViewer.vue';

export default ({ app }) => {
  // Register components globally
  app.component('custom-evento-form', EventoForm);
  app.component('custom-evento-list', EventoList);
  app.component('custom-home-container', HomeContainer);
  app.component('custom-home-bar', HomeBar);
  app.component('custom-home-banner', HomeBanner);
  app.component('custom-home-content', HomeContent);
  app.component('custom-login-form', LoginForm);

  // Viewers
  app.component('custom-map-viewer', CustomMapViewer);
};
