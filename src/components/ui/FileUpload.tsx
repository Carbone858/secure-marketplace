'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

interface FileUploadProps {
    onUploadComplete: (url: string) => void;
    onRemove?: (url: string) => void;
    accept?: string;
    maxSize?: number; // in MB
    label?: string;
    helperText?: string;
    existingFiles?: string[];
}

export function FileUpload({
    onUploadComplete,
    onRemove,
    accept = 'image/*,application/pdf',
    maxSize = 5,
    label,
    helperText,
    existingFiles = []
}: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [files, setFiles] = useState<string[]>(existingFiles);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validation
        if (selectedFile.size > maxSize * 1024 * 1024) {
            toast.error(`File is too large. Max size is ${maxSize}MB`);
            return;
        }

        setIsUploading(true);
        let fileToUpload = selectedFile;

        // Compress images before upload
        if (selectedFile.type.startsWith('image/')) {
             try {
                 const options = {
                     maxSizeMB: 0.3, // Target 300KB
                     maxWidthOrHeight: 1920,
                     useWebWorker: true,
                     fileType: 'image/webp'
                 };
                 fileToUpload = await imageCompression(selectedFile as File, options);
                 // Preserve original extension if browser-image-compression renames to 'image'
                 const newName = selectedFile.name.replace(/\.[^/.]+$/, ".webp");
                 fileToUpload = new File([fileToUpload], newName, { type: 'image/webp' });
             } catch (error) {
                 console.error('Error compressing image:', error);
                 // Fallback to original file on failure
             }
        }

        const formData = new FormData();
        formData.append('file', fileToUpload);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Upload failed');

            const url = result.data.url;
            setFiles(prev => [...prev, url]);
            onUploadComplete(url);
            toast.success('File uploaded successfully');
        } catch (err: any) {
            toast.error('Upload failed', { description: err.message });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = (url: string) => {
        setFiles(prev => prev.filter(f => f !== url));
        if (onRemove) onRemove(url);
    };

    const isPdf = (url: string) => url.toLowerCase().endsWith('.pdf');

    return (
        <div className="space-y-4">
            {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}

            <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`
                    relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
                    flex flex-col items-center justify-center gap-2
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
                    border-muted-foreground/25
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={accept}
                    className="hidden"
                />

                {isUploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                ) : (
                    <Upload className="w-8 h-8 text-muted-foreground/50" />
                )}

                <div className="text-center">
                    <p className="text-sm font-medium">
                        {isUploading ? 'Uploading...' : 'Click or drag to upload'}
                    </p>
                    {helperText && <p className="text-xs text-muted-foreground mt-1">{helperText}</p>}
                </div>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 border rounded-lg group relative">
                            {isPdf(file) ? (
                                <FileText className="w-8 h-8 text-destructive/80" />
                            ) : (
                                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center overflow-hidden">
                                    <img src={file} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.split('/').pop()}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemove(file)}
                                className="p-1 hover:bg-destructive/10 rounded-full text-destructive"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
