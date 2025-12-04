import { createPortal } from "react-dom";
import { useRef, useEffect } from "react";

export default function Modal({ children, open, className = '' }) {
  // open-prop - controls if the dialog is open or not

  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    }
  }, [open]);

  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`}>{children}</dialog>,
    document.getElementById("modal")
  );
  // fetches a <div id="modal"> from index.html (we have put this <div> into <body>), and creates Portal on this <div>
}
