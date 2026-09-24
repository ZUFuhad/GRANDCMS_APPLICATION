-- Grand CMS seed — run: wrangler d1 execute grand-cms-db --remote --file=./prisma/seed.sql
INSERT OR IGNORE INTO "User" (id,name,email,passwordHash,role,status,createdAt,updatedAt)
VALUES ('clseedadmin00000000000001','Grand Admin','admin@grandcms.local','pbkdf2$100000$ZEl8In6MRXFMEYXKYJsp/w==$wh8oZz2kH7/eOWlxdd7V9szqRDtf9tVlmDAeiHeHWKU=','ADMIN','ACTIVE',strftime('%Y-%m-%d %H:%M:%S','now'),strftime('%Y-%m-%d %H:%M:%S','now'));
INSERT OR IGNORE INTO "CompanySettings" (id,companyName,tagline,defaultCurrency,defaultTaxRate,defaultCommissionRate,updatedAt)
VALUES ('default','Grand CMS','we value what you have to say !','BDT',0,10,strftime('%Y-%m-%d %H:%M:%S','now'));
