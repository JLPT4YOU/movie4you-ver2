"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DisclaimerModal from './DisclaimerModal';

export default function GlobalDisclaimerGate() {
  const { isAuthenticated, hasAccess, loading, disclaimerAccepted, acceptDisclaimer, signOut } = useAuth();

  const shouldShow = !loading && isAuthenticated && hasAccess && !disclaimerAccepted;

  return (
    <DisclaimerModal
      open={shouldShow}
      onAccept={acceptDisclaimer}
      onDecline={signOut}
    />
  );
}
