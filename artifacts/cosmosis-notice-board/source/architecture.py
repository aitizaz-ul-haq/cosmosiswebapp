"""Five source-grounded Cosmosis architecture boards."""
from boardkit import Board


def page1(ctx, num):
    b = Board(ctx, num, 'ARCHITECTURE', 'The whole Cosmosis system',
              'src/app/page.js; dashboard/page.js; api/*; lib/mongodb.js; lib/sendCredentialsEmail.js',
              'Four roles • one web application • one tenant-aware MongoDB data model')
    actors = [
        (28, 'Superadmin', 'Companies + platform users', 'pink'),
        (229, 'Supervisor', 'Team + client approvals', 'yellow'),
        (430, 'Relationship Manager', 'Client registry + schedules', 'sky'),
        (631, 'Client', 'Own onboarding + profile', 'lime'),
    ]
    for x, title, body, color in actors:
        b.node(x,110,183,78,title,body,color,size=18,body_size=14)
        b.line([(x+91.5,188),(x+91.5,212)],'muted',1.4)
    b.line([(119.5,212),(722.5,212)],'muted',1.4)
    b.arrow([(421,212),(421,237)],color='purple')
    b.box(169,238,503,130,'lavender','purple',r=13)
    b.text('COSMOSIS  /  Next.js 14 + React 18',184,245,474,18,align='center',h=26)
    b.node(186,279,213,72,'Browser interface','Public site • login • dashboard','white',size=17,body_size=14)
    b.node(442,279,213,72,'Same-origin API','Route handlers + shared helpers','white',size=17,body_size=14)
    b.arrow([(400,316),(442,316)],color='teal')
    b.arrow([(549,352),(549,391),(146,391),(146,422)],color='purple')
    b.arrow([(568,352),(568,406),(421,406),(421,422)],color='teal')
    b.arrow([(696,422),(696,316),(655,316)],color='purple',dashed=True)
    b.node(28,423,235,99,'MongoDB / Mongoose','5 model definitions\nIdentity • clients • audit • demo','mint',size=19,body_size=15)
    b.node(303,423,235,99,'Gmail SMTP','Nodemailer\nCredentials + demo emails','pink',size=19,body_size=15)
    b.node(579,423,235,99,'External scheduler','Bearer-secret dispatch endpoint\nGET clients = backup trigger','yellow',size=19,body_size=14)
    b.text('One codebase; deployment infrastructure and external scheduler configuration are outside this source model.',28,535,786,14,align='center',h=22)
    return b


def page2(ctx, num):
    b = Board(ctx, num, 'ARCHITECTURE', 'How the application is assembled',
              'layout.js; context/UserContext.js; dashboard/page.js; config.js; pages/*; lib/*; models/*',
              'Layered runtime view • feature pages own their fetches • shared UI keeps the dashboard consistent')
    b.box(28,110,786,88,'blue','line')
    b.text('BROWSER',41,120,119,18,color='purple',h=27)
    b.text('React + CSS',41,151,119,15,h=24)
    b.node(177,123,192,62,'UserContext','Session identity + restore','white',size=17,body_size=14)
    b.node(389,123,192,62,'Dashboard router','Role + active menu → page','white',size=17,body_size=14)
    b.node(601,123,199,62,'Shell + shared UI','Sidebar • tables • modals','white',size=17,body_size=14)
    b.arrow([(421,199),(421,231)],'fetch + JSON',label_pos=(452,202,155),color='teal',size=14)
    b.box(28,234,786,94,'lavender','line')
    b.text('API ROUTES',41,245,120,18,color='purple',h=27)
    b.text('Same origin',41,279,120,15,h=23)
    b.node(177,247,192,68,'Identity + admin','Login • users • companies','white',size=17,body_size=14)
    b.node(389,247,192,68,'Client lifecycle','Clients • registry • own profile','white',size=17,body_size=14)
    b.node(601,247,199,68,'Audit + public demo','Log write/read • request demo','white',size=17,body_size=14)
    b.arrow([(421,329),(421,362)],'shared functions',label_pos=(452,333,155),color='teal',size=14)
    b.box(28,365,786,84,'mint','line')
    b.text('HELPERS',41,376,120,18,color='purple',h=27)
    b.text('Server modules',41,409,120,14,h=23)
    for x,w,title,body,color in [
        (177,145,'Auth + scopes','JWT • role • tenant','yellow'),
        (335,145,'Schedule + crypto','UTC • AES-GCM','sky'),
        (493,145,'SMTP templates','Credential email','pink'),
        (651,149,'Audit identity','Actor + company','lime'),
    ]:
        b.node(x,377,w,59,title,body,color,size=16,body_size=14)
    b.arrow([(421,450),(421,482)],'Mongoose queries',label_pos=(452,453,155),color='teal',size=14)
    b.box(28,485,786,59,'slate','line')
    b.text('DATA',41,497,120,18,color='purple',h=28)
    for x,w,label in [(177,98,'Company'),(286,88,'User'),(385,147,'ClientProfile'),(543,88,'Log'),(642,158,'DemoRequest')]:
        b.pill(label,x,501,w,'white',size=15)
    return b


def page3(ctx, num):
    b = Board(ctx, num, 'ARCHITECTURE', 'A session from login to protected data',
              'api/login/route.js; api/me/route.js; api/logout/route.js; middleware.js; lib/auth.js; UserContext.js',
              'JWT cookie flow • bcrypt password comparison • middleware and handler checks')
    lanes = [
        (28,170,'Browser','UserContext',113,'sky'),
        (230,170,'Login API','POST /api/login',315,'yellow'),
        (432,170,'User store','MongoDB / Mongoose',517,'mint'),
        (634,180,'Guarded APIs','Middleware + handler',724,'lavender'),
    ]
    for x,w,t,body,cx,fill in lanes:
        b.node(x,110,w,63,t,body,fill,size=18,body_size=14)
        b.line([(cx,174),(cx,518)],'line',1,[4,5])
    b.arrow([(113,204),(315,204)],'1  username + password',label_pos=(127,178,175),size=14,color='purple')
    b.arrow([(315,249),(517,249)],'2  find User + bcrypt',label_pos=(327,223,178),size=14,color='teal')
    b.arrow([(517,288),(315,288)],'Valid + active client?',label_pos=(327,261,178),size=14,color='muted')
    b.arrow([(315,333),(113,333)],'3  signed JWT cookie',label_pos=(126,306,177),size=14,color='purple')
    b.pill('HttpOnly • SameSite=Lax • 1 day • Secure in production',351,314,432,'mint',size=14)
    b.arrow([(113,381),(724,381)],'4  GET /api/me  → restore identity; later requests include cookie',label_pos=(189,354,470),size=14,color='purple')
    b.box(557,393,240,48,'yellow',None,r=5)
    b.text('5  Verify JWT + allowed path\nThen check role / tenant / ownership',568,397,220,14,align='center',h=40)
    b.arrow([(724,466),(517,466)],'6  query permitted data',label_pos=(529,442,183),size=14,color='teal')
    b.arrow([(724,510),(113,510)],'7  safe JSON  →  UserContext / feature page',label_pos=(244,483,350),size=14,color='purple')
    b.pill('Logout: expire cookie → clear context → fresh /login document',118,520,606,'pink',size=14)
    return b


def _tenant(b,x,y,w,label,fill):
    b.box(x,y,w,191,fill,'purple',r=12,dash=[6,4])
    b.text(label,x+12,y+7,w-24,17,color='purple',h=25)
    b.node(x+15,y+39,w-30,39,'Supervisor',fill='white',size=16)
    b.node(x+15,y+101,108,35,'Primary RM',fill='sky',size=15)
    b.node(x+w-123,y+101,108,35,'Shared RM',fill='pink',size=15)
    b.node(x+65,y+151,w-130,32,'Client',fill='lime',size=15)
    b.arrow([(x+w/2,y+78),(x+w/2,y+89),(x+69,y+89),(x+69,y+101)],color='muted')
    b.arrow([(x+w/2,y+89),(x+w-69,y+89),(x+w-69,y+101)],color='muted')
    b.arrow([(x+69,y+136),(x+69,y+143),(x+w*.41,y+143),(x+w*.41,y+151)],color='teal')
    b.arrow([(x+w-69,y+136),(x+w-69,y+143),(x+w*.59,y+143),(x+w*.59,y+151)],color='purple',dashed=True)


def page4(ctx, num):
    b = Board(ctx, num, 'ARCHITECTURE', 'Who can act, and inside which boundary?',
              'models/User.js; api/users; api/companies; api/clients; clients/registry; clients/me; api/logs',
              'Core workflow access model • shared database • companyId and actor relationships define scope')
    b.note(28,111,164,190,'Superadmin','Platform scope\n\nCompany + user\nadministration\n\nAudit reader','yellow',size=20,body_size=16)
    _tenant(b,226,111,270,'Company A / tenant', 'mint')
    _tenant(b,544,111,270,'Company B / tenant', 'lavender')
    b.arrow([(194,180),(225,180)],color='purple')
    b.text('Solid = primary assignment     Dashed = shared RM relationship     Tenant checks live in API handlers',28,311,786,14,align='center',h=24)
    b.table(28,345,[132,248,406],['Actor','Data scope','Core actions / surfaces'],[
        ['Superadmin','Platform / all companies','Companies · supervisors · users · audit logs'],
        ['Supervisor','Own company','RMs · clients · approve / review · assign / share'],
        ['RM','Assigned + shared clients','Register · schedule · status; delete primary only'],
        ['Client','Own profile','Read onboarding · profile; form save is pending'],
    ],rowh=39,size=14,header_fill='sky',fills=[None,'#F4FCF8',None,'#FAF6FF'])
    return b


def page5(ctx, num):
    b = Board(ctx, num, 'ARCHITECTURE', 'From routes to helpers to documents',
              'src/app/api/**/route.js; lib/auth.js; parseSchedule.js; credentialCrypto.js; enrichLog.js; models/*',
              'Dependency map • each route combines its guards, business helpers and Mongoose models')
    b.pill('API route groups',28,106,247,'purple','white',size=16)
    b.pill('Shared helpers / integrations',322,106,213,'teal','ink',size=15)
    b.pill('Mongoose documents',601,106,213,'purple','white',size=16)
    rows = [
        (147,81,'Identity + administration','/api/login · /api/me\n/api/users · /api/companies',
         'Auth + scope guards','middleware + verifyToken',
         'User + Company','Identity • tenancy • contacts','sky'),
        (256,103,'Client lifecycle','/api/clients\n/registry · /scheduled · /me',
         'Lifecycle helpers','parseSchedule · AES-GCM\ndispatch · credentials SMTP',
         'ClientProfile + User','Workflow • schedule\nForm-data schema','mint'),
        (387,66,'Audit trail','/api/log · /batch · /api/logs',
         'Actor enrichment','resolveLogIdentity',
         'Log','Actor • action • metadata','pink'),
        (482,64,'Public demo requests','/api/requestdemo · demo-requests',
         'SMTP mailer','Nodemailer / Gmail',
         'DemoRequest','Public enquiry + status','yellow'),
    ]
    for y,h,lt,lb,mt,mb,rt,rb,fill in rows:
        b.node(28,y,247,h,lt,lb,fill,size=18,body_size=14)
        b.node(322,y,213,h,mt,mb,'white',size=17,body_size=14)
        b.node(601,y,213,h,rt,rb,fill,size=18,body_size=14)
        b.arrow([(276,y+h/2),(321,y+h/2)],color='purple')
        b.arrow([(536,y+h/2),(600,y+h/2)],color='teal')
    return b


PAGES = [page1, page2, page3, page4, page5]
