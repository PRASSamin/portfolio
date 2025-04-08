import MDEditor, { commands, MDEditorProps } from "@uiw/react-md-editor";
import { upload } from "@/utils/uploadToCloudinary"; // Your upload function
import { useRef, useState } from "react";
import { Image as ImageIcon, Loader } from "lucide-react";

const MarkdownEditor: React.FC<
  MDEditorProps & { onChange: (value: string) => void }
> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Function to trigger the file input
  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle file selection and upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsUploading(true);
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await upload({
        file,
        folder: "pras/portfolio/projects",
      });

      onChange(`${value} ![](${imageUrl})`);
      setIsUploading(false);
    }
  };

  const cmds = [
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
    commands.title,
    commands.divider,
    commands.link,
    commands.quote,
    commands.code,
    commands.codeBlock,
    commands.comment,
    {
      name: "image",
      keyCommand: "image",
      buttonProps: { "aria-label": "Insert Image" },
      icon: isUploading ? (
        <Loader size={13} className="animate-spin" />
      ) : (
        <ImageIcon size={13} />
      ),
      execute: () => handleImageUploadClick(),
    },
    commands.table,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
  ];

  return (
    <div className="relative h-full [&_.w-md-editor-bar]:hidden">
      <MDEditor
        className="h-full"
        value={value}
        onChange={(value) => onChange(value || "")}
        preview="edit"
        data-color-mode="dark"
        height={"100%"}
        commands={cmds}
        extraCommands={[]}
        draggable={false}
        toolbarBottom={true}
        textareaProps={{
          className: "[&_.w-md-editor-text]:!min-h-full h-full",
        }}
      />

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default MarkdownEditor;
