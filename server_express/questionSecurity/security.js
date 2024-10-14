import crypto from 'crypto';

// Encryption function
export function encryptData(plaintext) {
  const encryptionKey = crypto.randomBytes(32);
  const initializationVector = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, initializationVector);
  let encrypted = cipher.update(JSON.stringify(plaintext), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encryptedData: encrypted,
    encryptionKey: encryptionKey.toString('hex'),
    initializationVector: initializationVector.toString('hex')
  };
}

// Decryption function
export function decryptData(encryptedData, encryptionKey, initializationVector) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(initializationVector, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

// Usage example
const plaintext = { questions: [ { id: 1, type: 'Paragraph', title: '23', question: 'jkjj', options: [], correctAnswer: '', marks: 2, image: [] }, { id: 2, type: 'Paragraph', title: '23', question: 'kkl', options: [], correctAnswer: '', marks: 4, image: [] } ], userId: '6642337b5ee89d5906f8c99d', userEmail: 'vinaychakri143@gmail.com', departments: [ 'Classics', 'Linguistics', 'Philosophy' ], rubrics: [] };

const { encryptedData, encryptionKey, initializationVector } = encryptData(plaintext);
const all =  { encryptedData, encryptionKey, initializationVector }
// Transmit or store the encryptedData, encryptionKey, and initializationVector
const decryptedObject = decryptData( '2cb92191cc9b50a05e01428e975005bdaafd0f851a0187820c04e12c4294307a94ffb321bb090dc50271f866cf44dc77769d05c6bbbcbd0ec5bc1d58ada35048534e46c3244f63f1905a87536f0c0b4fd3c32ffdd4afa4bcbe96a82dbf4bb3aa2b826481886151ab662b99e3723c4bbb5aa2dddd66b5a5005134999695b441e293dbedd492646ed0073558a604a66edd459180147034ff756d815bb237ae393b251d5e725cc7e10801a42d9cee8548689c9429f75d15abe5cae0a016fcde8278b14bef064e258e8fcd558eee4fc0ad6ac24587e66d78d4b15fb17b6332665da75047a634d07df64162a16d60c8e90593f29fa1b388e35d3dee5bf36b3b625c3a4855f3e8d66ae5a925d7a0d4cf213343d53d2569a8fb440e3d0a2dda44e6c7a25d800092641ee96d675319e0062829bff01d81e1ce55ea88bb590fce5fd46f7c4800b11b671676cf437d5de5d6c63e4a2ffbee5281f85465cdefe46b80109db277a4bba51a6151ede95bf51a6a5241c6152d8723425624a95ad73c82c7669d0c', 'feb22b861365bbc8918b6910ba240c26c6ef2638ee3b6e1db4dca4de3abcc39b', '8656f7b05b52d922eb56012d7bad6f66');
console.log(decryptedObject);