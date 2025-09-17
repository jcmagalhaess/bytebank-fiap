"use client";

import { Button } from "../ui/button";

interface PdfViewerModalProps {
  isOpen: boolean;
  pdfUrl: string;
  fileName: string;
  onClose: () => void;
  onDelete: () => void;
  onDownload: () => void;
}

export function PdfViewerModal({
  isOpen,
  pdfUrl,
  fileName,
  onClose,
  onDelete,
  onDownload
}: PdfViewerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {fileName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* PDF Preview */}
        <div className="flex-1 p-6">
          <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="PDF Preview"
            />
          </div>
        </div>

        {/* Footer com botões */}
        <div className="flex items-center justify-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={onDownload}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </Button>
            <Button
              variant="danger"
              onClick={onDelete}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
