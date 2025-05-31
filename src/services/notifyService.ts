import { Notify } from 'quasar';

export function notifyCustom(
  message: string,
  color: string = 'negative',
  icon: string = 'warning',
) {
  Notify.create({
    message,
    color,
    icon,
    position: 'top',
    timeout: 2500,
  });
}
