import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import { FC } from "react";

export interface IPlanCreatorDialogProps extends DialogProps {
  title?: string;
  actionButtonProps?: ButtonProps;
  actionButtonLabel?: string;
  closeButtonLabel?: string;
  closeButtonProps?: ButtonProps;
  onCloseClick: () => void;
  onActionClick?: () => void;
}

const PlanCreatorDialog: FC<IPlanCreatorDialogProps> = ({
  title,
  maxWidth = "xs",
  closeButtonLabel = "Cancel",
  actionButtonLabel = "Ok",
  children,
  actionButtonProps,
  closeButtonProps,
  onCloseClick,
  onActionClick,
  ...props
}) => {
  return (
    <Dialog {...props} maxWidth="xs">
      {title ? <DialogTitle>{title}</DialogTitle> : null}
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button color="error" onClick={onCloseClick} {...closeButtonProps}>
          {closeButtonLabel}
        </Button>
        {onActionClick ? (
          <Button onClick={onActionClick} {...actionButtonProps}>
            {actionButtonLabel}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

export default PlanCreatorDialog;
