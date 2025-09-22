import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Check if user is authenticated
    // For now, directly navigate to login
    router.replace('/auth/login');
  }, []);

  return null;
}