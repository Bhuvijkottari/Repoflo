// Script to manually enable a recruiter email
// Run with: node enable_recruiter.js <email> <level>

const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account-key.json'); // You'll need to download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://project-x-57b50.firebaseio.com'
});

const db = admin.firestore();

async function enableRecruiter(email, level = 1) {
  try {
    const recruiterRef = db.collection('recruiters').doc(email);
    
    await recruiterRef.set({
      email: email,
      level: parseInt(level),
      usageCount: 0,
      lastUsed: new Date().toISOString(),
      status: 'approved',
      approvedBy: 'admin',
      approvedAt: new Date().toISOString()
    });
    
    console.log(`✅ Recruiter ${email} enabled with level ${level}`);
  } catch (error) {
    console.error('❌ Error enabling recruiter:', error);
  }
}

// Usage: node enable_recruiter.js recruiter@company.com 2
const email = process.argv[2];
const level = process.argv[3] || 1;

if (!email) {
  console.log('Usage: node enable_recruiter.js <email> [level]');
  process.exit(1);
}

enableRecruiter(email, level);
