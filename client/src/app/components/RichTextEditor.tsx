"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  LinkIcon,
  Undo,
  Redo,
} from "lucide-react";
import "./RichTextEditor.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language?: "FR" | "EN";
}

interface Article {
  id: number;
  title_fr: string;
  title_en: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "",
  language,
}: RichTextEditorProps) {
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [showArticleDropdown, setShowArticleDropdown] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [customUrl, setCustomUrl] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  // Déterminer la langue automatiquement si pas fournie
  const currentLanguage = language || (placeholder === "English" ? "EN" : "FR");

  // Récupérer les articles existants
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Mettre à jour le contenu de l'éditeur quand la prop value change
  useEffect(() => {
    if (editor && value !== undefined && value !== null) {
      const currentContent = editor.getHTML();
      if (currentContent !== value) {
        editor.commands.setContent(value, false);
      }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const handleLinkClick = () => {
    setShowLinkPopup(true);
    setShowArticleDropdown(false);
    setCustomUrl("");
    setSelectedArticle(null);
  };

  const handleInsertLink = () => {
    if (selectedArticle) {
      // Insérer un lien vers un article
      const article = articles.find((a) => a.id === selectedArticle);
      if (article) {
        const articleUrl = `/articles/${selectedArticle}`;
        const linkLabel = currentLanguage === "EN" 
          ? (article.title_en || article.title_fr)
          : (article.title_fr || article.title_en);
        editor
          .chain()
          .focus()
          .insertContent(
            `<a href="${articleUrl}">${linkLabel}</a>`
          )
          .run();
      }
      resetLinkPopup();
    } else if (customUrl) {
      // Insérer une URL personnalisée
      editor
        .chain()
        .focus()
        .setLink({ href: customUrl })
        .run();
      resetLinkPopup();
    }
  };

  const insertUrlLink = () => {
    if (customUrl) {
      editor
        .chain()
        .focus()
        .setLink({ href: customUrl })
        .run();
      resetLinkPopup();
    }
  };

  const insertArticleLink = () => {
    if (selectedArticle) {
      const article = articles.find((a) => a.id === selectedArticle);
      if (article) {
        const articleUrl = `/articles/${selectedArticle}`;
        const linkLabel = currentLanguage === "EN"
          ? (article.title_en || article.title_fr)
          : (article.title_fr || article.title_en);
        editor
          .chain()
          .focus()
          .insertContent(
            `<a href="${articleUrl}">${linkLabel}</a>`
          )
          .run();
      }
      resetLinkPopup();
    }
  };

  const resetLinkPopup = () => {
    setShowLinkPopup(false);
    setShowArticleDropdown(false);
    setCustomUrl("");
    setSelectedArticle(null);
  };

  const ToolbarButton = ({
    onClick,
    isActive = false,
    icon: Icon,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: React.ComponentType<{ size: number }>;
    title: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-200 transition ${
        isActive ? "bg-gray-300" : "hover:bg-gray-100"
      }`}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="rich-text-editor w-full border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        <div className="flex gap-1 border-r border-gray-300 pr-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={Bold}
            title="Gras (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={Italic}
            title="Italique (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={Strikethrough}
            title="Barré"
          />
        </div>

        <div className="flex gap-1 border-r border-gray-300 pr-1">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            icon={Heading1}
            title="Titre 1"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            icon={Heading2}
            title="Titre 2"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            icon={Heading3}
            title="Titre 3"
          />
        </div>

        <div className="flex gap-1 border-r border-gray-300 pr-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={List}
            title="Liste"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={ListOrdered}
            title="Liste numérotée"
          />
        </div>

        <div className="flex gap-1 border-r border-gray-300 pr-1">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().setTextAlign("left").run()
            }
            isActive={editor.isActive({ textAlign: "left" })}
            icon={AlignLeft}
            title="Aligner à gauche"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().setTextAlign("center").run()
            }
            isActive={editor.isActive({ textAlign: "center" })}
            icon={AlignCenter}
            title="Centrer"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().setTextAlign("right").run()
            }
            isActive={editor.isActive({ textAlign: "right" })}
            icon={AlignRight}
            title="Aligner à droite"
          />
        </div>

        <div className="flex gap-1 border-r border-gray-300 pr-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={Quote}
            title="Citation"
          />
          <ToolbarButton
            onClick={handleLinkClick}
            isActive={editor.isActive("link")}
            icon={LinkIcon}
            title="Insérer un lien"
          />
        </div>

        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={Undo}
            title="Annuler (Ctrl+Z)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={Redo}
            title="Refaire (Ctrl+Y)"
          />
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="bg-white p-4 min-h-64 prose prose-sm max-w-none focus:outline-none"
      />

      {/* Link Popup - Petit popup compact */}
      {showLinkPopup && (
        <div className="fixed z-50 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 min-w-80">
          <div className="space-y-3 flex flex-col p-3">
            {/* Liste déroulante des articles */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Articles
              </label>
              <select
                value={selectedArticle || ""}
                onChange={(e) =>
                  setSelectedArticle(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
              >
                <option value="">-- Choisir un article --</option>
                {articles.map((article) => (
                  <option key={article.id} value={article.id}>
                    {currentLanguage === "EN"
                      ? (article.title_en || article.title_fr)
                      : (article.title_fr || article.title_en)}
                  </option>
                ))}
              </select>
            </div>

            {/* Séparateur */}
            <div className="border-t border-gray-300" />

            {/* Champ URL */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                URL personnalisée
              </label>
              <input
                autoFocus
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (customUrl || selectedArticle)) {
                    handleInsertLink();
                  }
                }}
                placeholder="https://exemple.com"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleInsertLink}
                disabled={!customUrl && !selectedArticle}
                className="flex-1 px-3 py-2 bg-primary text-white text-sm rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insérer
              </button>
              <button
                type="button"
                onClick={resetLinkPopup}
                className="px-3 py-2 bg-gray-300 text-black text-sm rounded hover:opacity-90"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
