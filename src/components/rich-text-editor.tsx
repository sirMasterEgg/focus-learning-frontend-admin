import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useEffect } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) => {
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        ["bold", "italic", "underline"], // toggled buttons

        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

        [{ color: [] }], // dropdown with defaults from theme
        [{ align: [] }],

        ["clean"], // remove formatting button

        [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ],
    },
    placeholder,
  });

  useEffect(() => {
    if (quill && value !== quill.root.innerHTML) {
      // Use dangerouslyPasteHTML so the cursor does not jump unexpectedly.
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }, [quill, value]);

  useEffect(() => {
    if (quill) {
      const handleTextChange = () => {
        const html = quill.root.innerHTML;
        const text = quill.getText();

        if (!text || text === "\n") {
          onChange("");
        } else {
          onChange(html);
        }
      };

      quill.on("text-change", handleTextChange);

      return () => {
        quill.off("text-change", handleTextChange);
      };
    }
  }, [quill]);

  return (
    <>
      <div className="w-full min-h-10">
        <div ref={quillRef}></div>
      </div>
    </>
  );
};

export default RichTextEditor;
