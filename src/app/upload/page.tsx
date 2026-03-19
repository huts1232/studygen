'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const processFile = async (file: File, fileId: string) => {
    try {
      // Update status to processing
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'processing', progress: 50 }
            : f
        )
      );

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`${Date.now()}-${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Update progress
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: 75 }
            : f
        )
      );

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      // Save document metadata to database
      const { data: documentData, error: dbError } = await supabase
        .from('documents')
        .insert({
          title: file.name.replace(/\.[^/.]+$/, ''),
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type,
          user_id: user.id,
          status: 'processing'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Simulate content extraction (replace with actual PDF processing)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update document status to completed
      await supabase
        .from('documents')
        .update({ status: 'completed' })
        .eq('id', documentData.id);

      // Update file status to completed
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'completed', progress: 100 }
            : f
        )
      );

      // Redirect to document page after a short delay
      setTimeout(() => {
        router.push(`/documents/${documentData.id}`);
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Upload failed'
              }
            : f
        )
      );
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading' as const,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Process each file
    newFiles.forEach(fileData => {
      processFile(fileData.file, fileData.id);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing content...';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Failed';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Documents</h1>
          <p className="mt-2 text-lg text-gray-600">
            Upload your PDFs to generate personalized study materials
          </p>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-xl font-medium text-gray-700 mb-2">
            {isDragActive ? 'Drop your PDFs here' : 'Drag & drop PDFs here'}
          </p>
          <p className="text-gray-500 mb-4">
            or <span className="text-blue-600 font-medium">browse files</span>
          </p>
          <p className="text-sm text-gray-400">
            Supports PDF files up to 10MB each
          </p>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Uploaded Files
            </h2>
            <div className="space-y-3">
              {uploadedFiles.map((fileData) => (
                <div
                  key={fileData.id}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <File className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {fileData.file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(fileData.status)}
                        <span className="text-sm font-medium text-gray-700">
                          {getStatusText(fileData.status)}
                        </span>
                      </div>
                      
                      {fileData.status === 'error' ? (
                        <button
                          onClick={() => removeFile(fileData.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(fileData.status === 'uploading' || fileData.status === 'processing') && (
                    <div className="mt-3">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileData.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {fileData.status === 'error' && fileData.error && (
                    <div className="mt-3 text-sm text-red-600">
                      {fileData.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Tips for better results:
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Upload clear, text-based PDFs for optimal content extraction</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Academic papers, textbooks, and lecture notes work best</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Scanned documents may have reduced accuracy</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Processing time varies based on document length and complexity</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}