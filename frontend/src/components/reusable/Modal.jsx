import { createPortal } from "react-dom";
import { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

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
      <div className="button-close-div modal-close-btn" onClick={onClose}><NavLink
          to="/"
         
        >
          ✕
        </NavLink>
        
      </div>
      <div>{children}</div>
    </dialog>,
    document.getElementById("modal"),
  );
  // fetches a <div id="modal"> from index.html (we have put this <div> into <body>), and creates Portal on this <div>
}
