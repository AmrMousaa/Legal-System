import { Toast, ToastTitle, ToastBody, useToastController } from '@fluentui/react-components';
import { TOASTER_ID } from '../toast';

export function useAppToast() {
  const { dispatchToast } = useToastController(TOASTER_ID);

  function success(title: string, body?: string) {
    dispatchToast(
      <Toast>
        <ToastTitle>{title}</ToastTitle>
        {body && <ToastBody>{body}</ToastBody>}
      </Toast>,
      { intent: 'success', timeout: 3500 }
    );
  }

  function error(title: string, body?: string) {
    dispatchToast(
      <Toast>
        <ToastTitle>{title}</ToastTitle>
        {body && <ToastBody>{body}</ToastBody>}
      </Toast>,
      { intent: 'error', timeout: 5000 }
    );
  }

  return { success, error };
}
