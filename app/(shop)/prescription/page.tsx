'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, FileText, Check, AlertCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrescriptionPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [notes, setNotes] = useState('');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error('Please upload at least one prescription');
      return;
    }

    if (!patientName || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('prescriptions', file);
      });
      formData.append('patientName', patientName);
      formData.append('phone', phone);
      formData.append('notes', notes);

      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Prescription uploaded successfully! Our pharmacist will review it shortly.');
        router.push('/dashboard/prescriptions');
      } else {
        toast.error('Failed to upload prescription');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950">
        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-50">
                Upload Prescription
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Upload your prescription and we'll prepare your medicines
              </p>
            </div>

            {/* How It Works */}
            <Card className="mb-8 border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-slate-900 dark:text-slate-50">
                  How It Works
                </h3>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-medium flex-shrink-0">
                      1
                    </span>
                    <p>Upload clear photos of your prescription</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-medium flex-shrink-0">
                      2
                    </span>
                    <p>Our licensed pharmacist will verify your prescription</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-medium flex-shrink-0">
                      3
                    </span>
                    <p>We'll confirm the medicines and delivery details</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-medium flex-shrink-0">
                      4
                    </span>
                    <p>Your medicines will be delivered to your doorstep</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Form */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Patient Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                      Patient Details
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="patientName">Patient Name *</Label>
                        <Input
                          id="patientName"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Enter patient name"
                          required
                          className="mt-1.5 border-slate-300 dark:border-slate-700"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          required
                          className="mt-1.5 border-slate-300 dark:border-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                      Prescription Images
                    </h3>

                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                      <input
                        type="file"
                        id="prescription-upload"
                        className="hidden"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="prescription-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="h-12 w-12 text-slate-400 mb-4" />
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">
                          Click to upload prescription
                        </p>
                        <p className="text-xs text-slate-500">
                          PNG, JPG or PDF (max. 10MB per file)
                        </p>
                      </label>
                    </div>

                    {/* Uploaded Files */}
                    {files.length > 0 && (
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"
                          >
                            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            <span className="flex-1 text-sm text-slate-900 dark:text-slate-50 truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions or requests..."
                      className="mt-1.5 min-h-[100px] border-slate-300 dark:border-slate-700"
                    />
                  </div>

                  {/* Important Notice */}
                  <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
                    <CardContent className="p-4 flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Important Information
                        </p>
                        <ul className="text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                          <li>Ensure prescription is clear and readable</li>
                          <li>Include doctor's name, signature, and date</li>
                          <li>Our pharmacist will call you if clarification is needed</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200"
                    disabled={uploading || files.length === 0}
                  >
                    {uploading ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Submit Prescription
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card className="mt-6 border-slate-200 dark:border-slate-800">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Need help uploading your prescription?
                </p>
                <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-700">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
