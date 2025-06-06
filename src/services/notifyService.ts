import { Dark, Notify } from 'quasar';

export function notifyCustom(
  message: string,
  color: string = 'negative',
  icon: string = 'warning',
  timeout: number = 5000,
) {
  const textColor = Dark.isActive ? 'white' : 'black';

  Notify.create({
    message,
    color: color === 'success' ? 'positive' : color,
    icon,
    position: 'top',
    progress: true,
    timeout: timeout,
    textColor,
    actions: [{ icon: 'close', color: 'white', round: true, handler: () => {} }],
  });
}
