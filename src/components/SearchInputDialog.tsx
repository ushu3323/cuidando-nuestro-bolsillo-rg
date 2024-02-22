import { Close as CloseIcon } from "@mui/icons-material";
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Slide,
  TextField,
  Toolbar,
} from "@mui/material";
import { type TransitionProps } from "@mui/material/transitions";
import {
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  forwardRef,
  useEffect,
  useRef,
  type ChangeEvent,
} from "react";

const SlideTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface SearchInputDialogProps {
  open: boolean;
  onClose?: () => void;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

export default function SearchInputDialog({
  open,
  onClose,
  value,
  onChange,
  onSubmit,
}: SearchInputDialogProps) {
  const inputRef = useRef<HTMLInputElement>();

  const handleClose = () => onClose?.();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
    >
      <AppBar sx={{ position: "relative" }} color="transparent">
        <Toolbar>
          <IconButton color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <form onSubmit={handleSubmit} className="mx-2 flex flex-1">
            <TextField
              inputRef={inputRef}
              autoFocus={open}
              fullWidth
              variant="standard"
              type="text"
              sx={{ margin: 2 }}
              value={value}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChange?.(event)
              }
            />
            <Button type="submit" color="inherit" onClick={handleClose}>
              Buscar
            </Button>
          </form>
        </Toolbar>
      </AppBar>
    </Dialog>
  );
}
