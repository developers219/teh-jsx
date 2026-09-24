import { createPortal } from "react-dom";
import { X } from "lucide-react";

const Modal = ({ children, isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] font-mont flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
