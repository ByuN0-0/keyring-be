import crypto from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';

const password = process.argv[2];

if (!password) {
  console.log('사용법: node hash-password.js <password>');
  process.exit(1);
}

const id = uuidv4();
// 16진수 랜덤 salt 생성
const salt = crypto.randomBytes(8).toString('hex');
// 비밀번호 + salt 해싱
const hash = crypto.createHash('sha256').update(password + salt).digest('hex');

console.log('--- 생성된 사용자 정보 (Salt 적용됨) ---');
console.log(`ID (UUID): ${id}`);
console.log(`Salt: ${salt}`);
console.log(`Password Hash: ${hash}`);
console.log('---------------------------------------');
console.log(`SQL 예시:
INSERT INTO users (id, name, email, password_hash, salt) 
VALUES ('${id}', '이름', '이메일', '${hash}', '${salt}');
`);
