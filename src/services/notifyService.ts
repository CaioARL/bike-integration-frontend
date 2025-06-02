import { Notify } from 'quasar';

export function notifyCustom(
  message: string,
  color: string = 'negative',
  icon: string = 'warning',
) {
  Notify.create({
    message,
    color: color === 'success' ? 'positive' : color, // Corrige cor de sucesso
    icon,
    position: 'top',
    timeout: 2500,
    actions: [{ icon: 'close', color: 'white', round: true, handler: () => {} }],
  });
}
