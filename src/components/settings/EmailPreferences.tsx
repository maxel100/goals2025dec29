import React from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { useEmailPreferences } from '../../hooks/useEmailPreferences';

export function EmailPreferences() {
  const { emailEnabled, isLoading, error, updateEmailPreference, sendTestEmail } = useEmailPreferences();
  const [isSending, setIsSending] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleTestEmail = async () => {
    setIsSending(true);
    try {
      const success = await sendTestEmail();
      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {showSuccess && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Test email sent successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Weekly Focus Updates</h4>
            <p className="text-sm text-gray-600">
              Receive your weekly focus and progress updates every Sunday
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => updateEmailPreference(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <button
          onClick={handleTestEmail}
          disabled={isSending || !emailEnabled}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          Send Test Email
        </button>
        {!emailEnabled && (
          <p className="mt-2 text-sm text-gray-500">
            Enable weekly emails to send a test email
          </p>
        )}
      </div>
    </div>
  );
}