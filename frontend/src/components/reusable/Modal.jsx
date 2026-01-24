import { createPortal } from "react-dom";
import { useRef, useEffect } from "react";

export default function Modal({ children, open, onClose, className = "" }) {
  // open-prop - controls if the dialog is open or not

  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;
    if (open) {
      modal.showModal();
    } else if (modal.open) {
      modal.close();
    }
    // closing Modal by clicking outside of the Modal:
    function handleClickOutside(e) {
      if (e.target === modal) {
        onClose?.();
      }
    }

    modal.addEventListener("click", handleClickOutside);

    return () => {
      modal.removeEventListener("click", handleClickOutside);
    };
  }, [open, onClose]);

  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`}>
      <button className="modal-close-btn" onClick={onClose}>
        ✕
      </button>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
  // fetches a <div id="modal"> from index.html (we have put this <div> into <body>), and creates Portal on this <div>
}
