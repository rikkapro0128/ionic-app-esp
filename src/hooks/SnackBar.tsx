import { useSnackbar as useCtx, OptionsObject } from 'notistack';
import { SnackBar } from '../components/Snackbar';

export interface PropsSnack {
  title?: string,
  message: string,
  persist?: boolean,
  options?: OptionsObject,
}

export const useSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useCtx();

  const activeSnack = ({ title = 'Thông báo', message, persist = false, options }: PropsSnack) => {
    return enqueueSnackbar(message, {
      persist,
      anchorOrigin: { horizontal: 'center', vertical: 'top' },
      content: (key, message) => (
        <SnackBar onClose={() => closeSnackbar(key)} title={title} id={key as string} message={message as string} />
      ),
      ...options,
    })
  }

  return [
    activeSnack,
    (key: string) => {
      closeSnackbar(key);
    }
  ]
}