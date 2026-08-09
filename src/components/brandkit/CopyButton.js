'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyButton({ text, label = 'Copy text' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard non disponibile (permessi/contesto): nessun feedback
    }
  };

  return (
    <button
      onClick={handleCopy}
      className='btn-pop btn-pop-secondary inline-flex items-center !px-4 !py-1.5 text-sm'
    >
      {copied ? (
        <>
          <Check className='mr-2 h-4 w-4' /> Copied!
        </>
      ) : (
        <>
          <Copy className='mr-2 h-4 w-4' /> {label}
        </>
      )}
    </button>
  );
}
