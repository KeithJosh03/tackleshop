'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Link } from '@tiptap/extension-link';

import { FieldError } from './FieldError';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    Link as LinkIcon,
    Heading2,
} from 'lucide-react';

export interface CollapsibleTextareaProps {
    label: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    value: string | null;
    placeholder: string;
    onChange: (value: string) => void;
    required?: boolean;
    error?: string;
}

export default function CollapsibleTextarea({
    label,
    icon,
    isOpen,
    onToggle,
    value,
    placeholder,
    onChange,
    required,
    error,
}: CollapsibleTextareaProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            Link.configure({ openOnClick: false }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            // Return empty string if editor contains only an empty paragraph
            onChange(html === '<p></p>' ? '' : html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[120px] px-4 py-3 text-sm text-[#d9e3f4]',
            },
        },
    });

    // Keep editor synchronized with external state resets
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="bg-[#16202c] border border-[#212b37] rounded-lg overflow-hidden focus-within:border-[#ffb77c]/50 focus-within:ring-1 focus-within:ring-[#ffb77c]/50 transition-all">
            {/* Header Accordion Button */}
            <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-150 hover:bg-[#212b37]"
                style={{ background: isOpen ? '#212b37' : 'transparent' }}
                onClick={onToggle}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-sm font-bold text-[#d9e3f4] tracking-tight">
                        {label}
                        {required && <span className="text-[#ffb4ab] ml-1">*</span>}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {value?.length ? (
                        <span className="text-xs text-[#a6a7a6]">{value.length} chars</span>
                    ) : null}
                    <svg
                        className={`w-4 h-4 text-[#a6a7a6] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="border-t border-[#212b37]">
                    {/* Active Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 border-b border-[#212b37] bg-[#121c28] p-1.5 px-3">
                        {/* Bold */}
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-[#ffb77c] text-black' : 'hover:bg-[#2c3542] text-[#a6a7a6] hover:text-[#d9e3f4]'}`}
                            title="Bold"
                        >
                            <Bold className="w-4 h-4" />
                        </button>

                        {/* Italic */}
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-[#ffb77c] text-black' : 'hover:bg-[#2c3542] text-[#a6a7a6] hover:text-[#d9e3f4]'}`}
                            title="Italic"
                        >
                            <Italic className="w-4 h-4" />
                        </button>

                        {/* Underline */}
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'bg-[#ffb77c] text-black' : 'hover:bg-[#2c3542] text-[#a6a7a6] hover:text-[#d9e3f4]'}`}
                            title="Underline"
                        >
                            <UnderlineIcon className="w-4 h-4" />
                        </button>

                        {/* Heading 2 */}
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#ffb77c] text-black' : 'hover:bg-[#2c3542] text-[#a6a7a6] hover:text-[#d9e3f4]'}`}
                            title="Heading"
                        >
                            <Heading2 className="w-4 h-4" />
                        </button>

                        {/* Bullet List */}
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-[#ffb77c] text-black' : 'hover:bg-[#2c3542] text-[#a6a7a6] hover:text-[#d9e3f4]'}`}
                            title="Bullet List"
                        >
                            <List className="w-4 h-4" />
                        </button>

                        {/* Link */}
                        <button
                            type="button"
                            onClick={setLink}
                            className={`p-1.5 rounded transition-colors ${editor.isActive('link') ? 'bg-[#ffb77c] text-black' : 'hover:bg-[#2c3542] text-[#a6a7a6] hover:text-[#d9e3f4]'}`}
                            title="Link"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </button>

                        <div className="h-4 w-[1px] bg-[#212b37] mx-1" />

                        {/* Color Options */}
                        <div className="flex items-center gap-1">
                            {/* White Text */}
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().setColor('#ffffff').run()}
                                className={`p-1.5 rounded transition-colors flex items-center justify-center ${editor.isActive('textStyle', { color: '#ffffff' })
                                    ? 'bg-white/20 ring-1 ring-white'
                                    : 'hover:bg-[#2c3542]'
                                    }`}
                                title="White Text"
                            >
                                <span className="w-3.5 h-3.5 rounded-full bg-white border border-gray-400" />
                            </button>

                            {/* Grey Text */}
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().setColor('#9ca3af').run()}
                                className={`p-1.5 rounded transition-colors flex items-center justify-center ${editor.isActive('textStyle', { color: '#9ca3af' })
                                    ? 'bg-gray-500/20 ring-1 ring-gray-400'
                                    : 'hover:bg-[#2c3542]'
                                    }`}
                                title="Grey Text"
                            >
                                <span className="w-3.5 h-3.5 rounded-full bg-gray-400" />
                            </button>

                            {/* Red Text */}
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().setColor('#ef4444').run()}
                                className={`p-1.5 rounded transition-colors flex items-center justify-center ${editor.isActive('textStyle', { color: '#ef4444' })
                                    ? 'bg-red-500/20 ring-1 ring-red-400'
                                    : 'hover:bg-[#2c3542]'
                                    }`}
                                title="Red Text"
                            >
                                <span className="w-3.5 h-3.5 rounded-full bg-red-500" />
                            </button>

                            {/* Reset Color */}
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().unsetColor().run()}
                                className="p-1.5 text-xs text-[#a6a7a6] hover:text-[#d9e3f4] hover:bg-[#2c3542] rounded px-2 transition-colors ml-1"
                                title="Reset Color"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Rich Text Editor Content Area */}
                    <EditorContent editor={editor} placeholder={placeholder} />
                </div>
            )}
            {error && (
                <div className="px-4 pb-2">
                    <FieldError msg={error} />
                </div>
            )}
        </div>
    );
}