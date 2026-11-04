import fs from "node:fs";
import path from "node:path";
import {Pool} from "pg";

export async function createStorage({dbFile,migrationFile,defaults}){
 if(process.env.DATABASE_URL){
  const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_SSL==="false"?false:process.env.NODE_ENV==="production"?{rejectUnauthorized:false}:false,max:10});
  const sql=fs.readFileSync(migrationFile,"utf8");await pool.query(sql);
  for(const[key,data]of Object.entries(defaults))await pool.query("INSERT INTO site_content(content_key,data) VALUES($1,$2::jsonb) ON CONFLICT DO NOTHING",[key,JSON.stringify(data)]);
  await pool.query("DELETE FROM admin_sessions WHERE expires_at <= now()");
  return postgresStorage(pool);
 }
 fs.mkdirSync(path.dirname(dbFile),{recursive:true});if(!fs.existsSync(dbFile))fs.writeFileSync(dbFile,JSON.stringify({users:[],sessions:[],...defaults},null,2));
 return jsonStorage(dbFile,defaults);
}

function postgresStorage(pool){return{
 mode:"postgres",
 async getContent(key){const{rows}=await pool.query("SELECT data FROM site_content WHERE content_key=$1",[key]);return rows[0]?.data},
 async setContent(key,data,userId,ip){const{rows}=await pool.query("INSERT INTO site_content(content_key,data,updated_by) VALUES($1,$2::jsonb,$3) ON CONFLICT(content_key) DO UPDATE SET data=excluded.data,version=site_content.version+1,updated_by=excluded.updated_by,updated_at=now() RETURNING data",[key,JSON.stringify(data),userId]);await pool.query("INSERT INTO admin_audit_log(admin_user_id,action,entity_type,entity_key,ip_address) VALUES($1,'update','site_content',$2,$3)",[userId,key,cleanIp(ip)]);return rows[0].data},
 async userCount(){const{rows}=await pool.query("SELECT count(*)::int AS count FROM admin_users");return rows[0].count},
 async findUserByEmail(email){const{rows}=await pool.query("SELECT id,email,password_hash AS \"passwordHash\",role FROM admin_users WHERE email=$1 AND status='active'",[email]);return rows[0]},
 async createUser({email,passwordHash}){const{rows}=await pool.query("INSERT INTO admin_users(email,password_hash) VALUES($1,$2) RETURNING id,email,role",[email,passwordHash]);return rows[0]},
 async createSession({tokenHash,userId,expiresAt,ip,userAgent}){await pool.query("DELETE FROM admin_sessions WHERE expires_at<=now()");await pool.query("INSERT INTO admin_sessions(token_hash,user_id,expires_at,ip_address,user_agent) VALUES($1,$2,$3,$4,$5)",[tokenHash,userId,expiresAt,cleanIp(ip),userAgent]);await pool.query("UPDATE admin_users SET last_login_at=now() WHERE id=$1",[userId])},
 async findUserBySession(hash){const{rows}=await pool.query("SELECT u.id,u.email,u.role FROM admin_sessions s JOIN admin_users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now() AND u.status='active'",[hash]);return rows[0]},
 async deleteSession(hash){await pool.query("DELETE FROM admin_sessions WHERE token_hash=$1",[hash])},
 async recordMedia(asset){await pool.query("INSERT INTO media_assets(kind,public_url,original_name,mime_type,size_bytes,uploaded_by) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(public_url) DO NOTHING",[asset.kind,asset.publicUrl,asset.originalName,asset.mimeType,asset.sizeBytes,asset.uploadedBy])},
 async close(){await pool.end()}
}}
function cleanIp(ip){if(!ip)return null;return ip.startsWith("::ffff:")?ip.slice(7):ip==="::1"?"127.0.0.1":ip}
function jsonStorage(dbFile,defaults){const read=()=>({...{users:[],sessions:[]},...defaults,...JSON.parse(fs.readFileSync(dbFile,"utf8"))});const write=db=>{const temp=`${dbFile}.tmp`;fs.writeFileSync(temp,JSON.stringify(db,null,2));fs.renameSync(temp,dbFile)};return{
 mode:"json",
 async getContent(key){return read()[key]},
 async setContent(key,data){const db=read();db[key]=data;write(db);return data},
 async userCount(){return read().users.length},
 async findUserByEmail(email){return read().users.find(user=>user.email===email)},
 async createUser({email,passwordHash}){const db=read(),user={id:crypto.randomUUID(),email,passwordHash,role:"super_admin",createdAt:new Date().toISOString()};db.users.push(user);write(db);return user},
 async createSession({tokenHash,userId,expiresAt}){const db=read();db.sessions=db.sessions.filter(session=>new Date(session.expiresAt)>new Date());db.sessions.push({tokenHash,userId,expiresAt});write(db)},
 async findUserBySession(hash){const db=read(),session=db.sessions.find(item=>item.tokenHash===hash&&new Date(item.expiresAt)>new Date());return session&&db.users.find(user=>user.id===session.userId)},
 async deleteSession(hash){const db=read();db.sessions=db.sessions.filter(item=>item.tokenHash!==hash);write(db)},
 async recordMedia(){},async close(){}
}}
