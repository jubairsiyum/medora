'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Prescription {
  id: string;
  createdAt: string;
  status: string;
  patientName: string;
  fileCount: number;
  pharmacistNotes?: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/prescriptions');
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data.prescriptions || []);
      }
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">My Prescriptions</h1>
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">My Prescriptions</h1>
        <Button asChild className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200">
          <Link href="/prescription">Upload New</Link>
        </Button>
      </div>

      {prescriptions.length === 0 ? (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-50">
              No prescriptions yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Upload your first prescription to get started
            </p>
            <Button asChild className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200">
              <Link href="/prescription">Upload Prescription</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <Card
              key={prescription.id}
              className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-50">
                        {prescription.patientName}
                      </h3>
                      <Badge variant="secondary" className={getStatusColor(prescription.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(prescription.status)}
                          {prescription.status}
                        </span>
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <p>
                        Uploaded on {new Date(prescription.createdAt).toLocaleDateString('en-GB')}
                      </p>
                      <p>{prescription.fileCount} files</p>
                    </div>

                    {prescription.pharmacistNotes && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                        <span className="font-medium">Pharmacist notes:</span>{' '}
                        {prescription.pharmacistNotes}
                      </p>
                    )}
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="border-slate-300 dark:border-slate-700 w-full md:w-auto"
                  >
                    <Link href={`/dashboard/prescriptions/${prescription.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
