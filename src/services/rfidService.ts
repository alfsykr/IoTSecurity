import { database } from '../firebase/config';
import { ref, set, get, push, serverTimestamp } from 'firebase/database';

export interface RFIDUser {
  fullName: string;
  idNumber: string;
  role: string;
  uid: string;
  registeredAt: string;
  status: 'Active' | 'Inactive';
}

export interface RFIDAccessLog {
  timestamp: number;
  uid: string;
  waktu_readable: string;
  fullName?: string;
  role?: string;
  idNumber?: string;
}

// Generate a random RFID UID (simulating RFID card scan)
export const generateRFIDUID = (): string => {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Register RFID user data
export const registerRFIDUser = async (userData: Omit<RFIDUser, 'uid' | 'registeredAt'>): Promise<string> => {
  try {
    const uid = generateRFIDUID();
    const registeredAt = new Date().toISOString().split('T')[0];
    
    const rfidUser: RFIDUser = {
      ...userData,
      uid,
      registeredAt,
    };

    // Store user data in Firebase under akses/rfid_users/{uid}
    const userRef = ref(database, `akses/rfid_users/${uid}`);
    await set(userRef, rfidUser);

    return uid;
  } catch (error) {
    console.error('Error registering RFID user:', error);
    throw error;
  }
};

// Simulate RFID tap and log access
export const simulateRFIDTap = async (uid: string): Promise<void> => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const waktu_readable = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '/').replace(',', '');

    // Get user data
    const userRef = ref(database, `akses/rfid_users/${uid}`);
    const userSnapshot = await get(userRef);
    
    let accessLog: RFIDAccessLog = {
      timestamp,
      uid,
      waktu_readable
    };

    // If user exists, add their details to the access log
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val() as RFIDUser;
      accessLog = {
        ...accessLog,
        fullName: userData.fullName,
        role: userData.role,
        idNumber: userData.idNumber
      };
    }

    // Log access to Firebase under akses/rfid/{timestamp}
    const accessRef = ref(database, `akses/rfid/${timestamp}`);
    await set(accessRef, accessLog);

  } catch (error) {
    console.error('Error logging RFID access:', error);
    throw error;
  }
};

// Get all registered RFID users
export const getRFIDUsers = async (): Promise<RFIDUser[]> => {
  try {
    const usersRef = ref(database, 'akses/rfid_users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const usersData = snapshot.val();
      return Object.values(usersData) as RFIDUser[];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting RFID users:', error);
    throw error;
  }
};

// Get access logs
export const getAccessLogs = async (): Promise<RFIDAccessLog[]> => {
  try {
    const logsRef = ref(database, 'akses/rfid');
    const snapshot = await get(logsRef);
    
    if (snapshot.exists()) {
      const logsData = snapshot.val();
      return Object.values(logsData) as RFIDAccessLog[];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting access logs:', error);
    throw error;
  }
};