require('dotenv').config();
const crypto=require('crypto');
const path=require('path');
const fs=require('fs');
const Database=require('better-sqlite3');
const db=new Database(path.join(__dirname,'..','database','kemosat.db'));
const schema=fs.readFileSync(path.join(__dirname,'..','database','schema.sql'),'utf8');db.exec(schema);
const email=process.env.ADMIN_EMAIL||'admin@example.com';const password=process.env.ADMIN_PASSWORD;
if(!password||password.length<12){console.error('Set ADMIN_PASSWORD to at least 12 characters before running seed-admin.');process.exit(1)}
const salt=crypto.randomBytes(16).toString('hex');const hash=crypto.scryptSync(password,salt,64).toString('hex')+':'+salt;
const exists=db.prepare('SELECT id FROM admins WHERE email=?').get(email);if(exists) db.prepare('UPDATE admins SET password_hash=? WHERE id=?').run(hash,exists.id); else db.prepare('INSERT INTO admins(email,password_hash) VALUES(?,?)').run(email,hash);
console.log('Admin credentials initialized for',email);
