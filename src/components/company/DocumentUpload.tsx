'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X, FileCheck } from 'lucide-react';

interface DocumentUploadProps {
  companyId: string;
  existingDocuments: {
    id: string;
    type: string;
    fileName: string;
    status: string;
    uploadedAt: string;
  }[];
}

const documentTypes = [
  { value: 'LICENSE', label: 'Business License' },
  { value: 'ID_CARD', label: 'ID Card / Passport' },
  { value: 'COMMERCIAL_REGISTER', label: 'Commercial Register' },
  { value: 'TAX_CERTIFICATE', label: 'Tax Certificate' },
  { value: 'OTHER', label: 'Other Document' },
];

export function DocumentUpload({ companyId, existingDocuments }: DocumentUploadProps) {
  const router = useRouter();
  const t = useTranslations('company.documents');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState(existingDocuments);
  const [selectedType, setSelectedType] = useState('LICENSE');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', selectedType);

      const response = await fetch(`/api/companies/${companyId}/documents`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || t('errors.upload') });
        return;
      }

      setDocuments((prev) => [data.data.document, ...prev]);
      setMessage({ type: 'success', text: t('success.uploaded') });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: t('errors.upload') });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      const response = await fetch(`/api/companies/${companyId}/documents?documentId=${documentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || t('errors.delete') });
        return;
      }

      setDocuments((prev) => prev.filter((d) => d.id !== documentId));
      setMessage({ type: 'success', text: t('success.deleted') });
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ type: 'error', text: t('errors.delete') });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            {t('status.approved')}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <X className="w-3 h-3" />
            {t('status.rejected')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Loader2 className="w-3 h-3 animate-spin" />
            {t('status.pending')}
          </span>
        );
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    return documentTypes.find((d) => d.value === type)?.label || type;
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('uploadTitle')}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('documentType')}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
                <p className="text-gray-600">{t('uploading')}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium">{t('dropzone.title')}</p>
                <p className="text-sm text-gray-500 mt-1">{t('dropzone.subtitle')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Documents List */}
      {documents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('uploadedDocuments')}</h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{getDocumentTypeLabel(doc.type)}</p>
                    <p className="text-sm text-gray-500">{doc.fileName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(doc.status)}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={t('delete')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-800 font-medium">{t('info.title')}</p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• {t('info.point1')}</li>
              <li>• {t('info.point2')}</li>
              <li>• {t('info.point3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
