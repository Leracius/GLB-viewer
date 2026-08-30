import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { UploadCloud, FileBox, AlertCircle } from "lucide-react";

export interface DropZoneHandle {
  openFilePicker: () => void;
}

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  children?: React.ReactNode;
  hasModel: boolean;
}

export const DropZone = forwardRef<DropZoneHandle, DropZoneProps>(
  ({ onFileSelected, children, hasModel }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragCounterRef = useRef(0);

    useImperativeHandle(ref, () => ({
      openFilePicker: () => {
        fileInputRef.current?.click();
      },
    }));

    const validateAndProcessFile = (file: File) => {
      setErrorMsg(null);
      const name = file.name.toLowerCase();
      if (name.endsWith(".glb") || name.endsWith(".gltf")) {
        onFileSelected(file);
      } else {
        setErrorMsg("Por favor selecciona un archivo 3D válido (.glb o .gltf)");
        setTimeout(() => setErrorMsg(null), 4000);
      }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        validateAndProcessFile(files[0]);
      }
      e.target.value = "";
    };

    useEffect(() => {
      const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current++;
        if (
          e.dataTransfer &&
          e.dataTransfer.items &&
          e.dataTransfer.items.length > 0
        ) {
          setIsDragging(true);
        }
      };

      const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current--;
        if (dragCounterRef.current === 0) {
          setIsDragging(false);
        }
      };

      const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounterRef.current = 0;

        if (
          e.dataTransfer &&
          e.dataTransfer.files &&
          e.dataTransfer.files.length > 0
        ) {
          validateAndProcessFile(e.dataTransfer.files[0]);
        }
      };

      window.addEventListener("dragenter", handleDragEnter);
      window.addEventListener("dragleave", handleDragLeave);
      window.addEventListener("dragover", handleDragOver);
      window.addEventListener("drop", handleDrop);

      return () => {
        window.removeEventListener("dragenter", handleDragEnter);
        window.removeEventListener("dragleave", handleDragLeave);
        window.removeEventListener("dragover", handleDragOver);
        window.removeEventListener("drop", handleDrop);
      };
    }, []);

    return (
      <div className="relative w-full h-full overflow-hidden">
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {errorMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/90 text-white shadow-xl backdrop-blur-md text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {children}

        {isDragging && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md border-4 border-dashed border-sky-400/80 m-4 rounded-3xl pointer-events-none transition-all">
            <div className="flex flex-col items-center gap-3 text-center text-slate-100 p-6">
              <div className="p-4 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
                <UploadCloud className="w-12 h-12 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold tracking-wide">
                Suelta tu archivo .GLB / .GLTF
              </h3>
              <p className="text-sm text-slate-400 max-w-sm">
                El modelo se cargará automáticamente y la cámara se ajustará a
                su tamaño.
              </p>
            </div>
          </div>
        )}

        {!hasModel && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-slate-950/60">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer flex flex-col items-center gap-4 max-w-md w-full p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-sky-500/70 bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-xl transition-all duration-300 text-center shadow-2xl"
            >
              <div className="p-4 rounded-2xl bg-slate-800 group-hover:bg-sky-500/20 text-slate-400 group-hover:text-sky-400 transition-colors border border-slate-700 group-hover:border-sky-500/40">
                <FileBox className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-200 group-hover:text-white">
                  Cargar modelo 3D
                </h3>
                <p className="text-xs text-slate-400">
                  Arrastra y suelta tu archivo{" "}
                  <span className="text-sky-400 font-mono font-medium">
                    .glb
                  </span>{" "}
                  o{" "}
                  <span className="text-sky-400 font-mono font-medium">
                    .gltf
                  </span>{" "}
                  aquí, o haz clic para explorar.
                </p>
              </div>
              <button className="mt-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-all shadow-md">
                Seleccionar archivo
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

DropZone.displayName = "DropZone";
