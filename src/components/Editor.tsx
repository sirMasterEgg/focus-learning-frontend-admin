import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import Quill, { Delta, EmitterSource, Range } from "quill";

interface EditorProps {
  readOnly?: boolean;
  defaultValue?: Delta;
  onTextChange?: (
    delta: Delta,
    oldContent: Delta,
    source: EmitterSource
  ) => void;
  onSelectionChange?: (
    range: Range,
    oldRange: Range,
    source: EmitterSource
  ) => void;
  placeholder?: string;
  onChangeResult?: (html: string) => void;
  defaultHtmlValue?: string;
}

const Editor = forwardRef<Quill | null, EditorProps>(
  (
    {
      readOnly = false,
      defaultValue,
      onTextChange,
      onSelectionChange,
      placeholder,
      onChangeResult,
      defaultHtmlValue,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const quillInstanceRef = useRef<Quill | null>(null);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useImperativeHandle(ref, () => quillInstanceRef.current!, [
      quillInstanceRef.current,
    ]);

    useEffect(() => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.enable(!readOnly);
      }
    }, [readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const editorContainer = container.ownerDocument.createElement("div");
      container.appendChild(editorContainer);

      const quill = new Quill(editorContainer, {
        modules: {
          toolbar: [
            ["bold", "italic", "underline"], // toggled buttons
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ color: [] }],
            [{ align: [] }],
            ["clean"],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ],
        },
        theme: "snow",
        placeholder: placeholder || "Type something...",
      });

      quillInstanceRef.current = quill;

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      if (defaultHtmlValue) {
        quill.clipboard.dangerouslyPasteHTML(defaultHtmlValue);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
        onChangeResult?.(quill.root.innerHTML);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        quillInstanceRef.current = null;
        container.innerHTML = "";
      };
    }, []);

    return <div ref={containerRef} />;
  }
);

Editor.displayName = "Editor";

export default Editor;
