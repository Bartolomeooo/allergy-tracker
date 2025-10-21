import {useState} from 'react';

export function useToast(defaultSev: 'success' | 'error' = 'success') {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [sev, setSev] = useState<'success' | 'error'>(defaultSev);

  const show = (message: string, severity: 'success' | 'error' = 'success') => {
    setMsg(message);
    setSev(severity);
    setOpen(true);
  };

  const hide = () => setOpen(false);

  return {open, msg, sev, show, hide};
}
