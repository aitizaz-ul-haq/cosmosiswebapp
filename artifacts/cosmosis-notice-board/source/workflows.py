"""Core application workflows, checked against the source tree."""
from boardkit import Board, C

def page11(ctx,num):
    b=Board(ctx,num,'CORE WORKFLOWS','The client record lifecycle',
            'api/clients/route.js • api/clients/registry/route.js • lib/dispatchScheduledOnboardings.js')
    b.node(28,121,148,76,'Create client','RM action\nInactive User','yellow',18,14)
    b.node(211,121,166,76,'approval_pending','Await supervisor','peach',18,15)
    b.node(432,121,166,76,'under_review','Supervisor review','lavender',18,15)
    b.arrow([(176,158),(211,158)])
    b.arrow([(377,158),(432,158)],'review',label_pos=(378,127,52))
    b.node(211,279,166,79,'register','Approved; await RM\napprovedAt + approver','blue',19,14)
    b.arrow([(294,197),(294,279)],'approve',label_pos=(299,229,78))
    b.arrow([(515,197),(515,235),(378,235),(378,301)],'approve',label_pos=(389,211,78))
    b.node(440,279,161,79,'ongoing','Registered + active\nregisteredAt recorded','mint',20,14)
    b.arrow([(377,318),(440,318)],'now',label_pos=(382,292,51))
    b.node(211,435,166,78,'scheduled','UTC due date stored\nUser remains inactive','blue',19,14)
    b.arrow([(294,358),(294,435)],'schedule',label_pos=(302,384,83))
    b.arrow([(377,474),(520,474),(520,358)],'due + email',label_pos=(397,448,102))
    b.node(660,260,153,71,'on_hold','Engaged status','peach',19,14)
    b.node(660,380,153,71,'cancelled','Engaged status','pink',19,14)
    b.arrow([(601,296),(660,296)])
    b.arrow([(660,316),(620,316),(620,339),(601,339)])
    b.arrow([(601,340),(638,340),(638,415),(660,415)])
    b.arrow([(660,438),(620,438),(620,354),(601,354)],dashed=True)
    b.note(631,119,182,102,'Who acts?','RM: create + register\nSupervisor: approve/review','sky',18,14)
    b.note(28,247,150,133,'Two status fields','Record lifecycle ≠\nform completion.\nSee database board 09.','yellow',17,14)
    b.note(631,480,182,67,'Register now','Email may fail after activation.','yellow',16,12.8)
    b.text('Shown: RM-created path. Supervisor direct creation can start in an engaged state.',28,533,565,13,color='muted',h=22)
    return b

def page12(ctx,num):
    b=Board(ctx,num,'CORE WORKFLOWS','Schedule → dispatch → activate',
            'scheduling/timeUtils.js • lib/{parseSchedule,credentialCrypto,dispatchScheduledOnboardings}.js')
    b.node(28,120,173,103,'1 · Choose local time','Country + city\nLocal date + time\nIANA time zone','yellow',19,15)
    b.node(232,120,173,103,'2 · Validate UTC','Convert to UTC instant\nReject invalid/DST gap\nRequire future schedule','sky',19,14.5)
    b.node(436,120,173,103,'3 · Store safely','User: bcrypt hash\nProfile: AES-GCM copy\nstatus = scheduled','lavender',19,14.5)
    b.node(640,120,173,103,'4 · Hold login','User.isActive = false\nUntil dispatch succeeds','pink',19,15)
    for x in [201,405,609]: b.arrow([(x,171),(x+31,171)])
    b.node(28,300,173,102,'Dispatch trigger','External cron: secret\nOR clients-list GET\nNo internal timer','peach',18,14.5)
    b.node(232,300,173,102,'Atomic due claim','scheduled + due ≤ now\nfindOneAndUpdate\n→ ongoing','blue',18,14.5)
    b.node(436,300,173,102,'Decrypt + send','Temporary password\nGmail SMTP email\nLogin link + RM contact','lavender',18,14.5)
    b.node(640,300,173,102,'Success','Activate User\nClear encrypted copy\nClear schedule fields','mint',19,14.5)
    for x in [201,405,609]: b.arrow([(x,352),(x+31,352)])
    b.arrow([(726,223),(726,260),(115,260),(115,300)],'wait until due',label_pos=(382,246,119))
    b.node(436,463,173,79,'Failure → retry','Restore scheduled\nRetry on next invocation','pink',18,13.5)
    b.arrow([(521,402),(521,463)],'on error',color='red',label_pos=(526,423,76))
    b.arrow([(436,500),(390,500),(390,413),(318,413),(318,402)],color='red',dashed=True)
    b.note(28,455,316,87,'Integration boundary','External cron setup is not verified.\nAtomic claim is not an exactly-once delivery guarantee.','yellow',17,14)
    b.pill('UTC stored · local time displayed',640,451,173,'sky',size=12.5)
    b.pill('Temporary secret: select:false',640,490,173,'lavender',size=12.5)
    return b

def page13(ctx,num):
    b=Board(ctx,num,'CORE WORKFLOWS','The individual onboarding journey',
            'pages/clientStatusShared.js • pages/OnboardingPage.js • onboarding/phases/*.js')
    b.node(28,111,786,61,'0 · Prerequisites',
           'Charges & Regulatory Information   +   Terms & Conditions   →   scroll-gated reader; no stored read flag','sky',19,14)
    cards=[
        ('1 · Personal details','Account holders · NCI\nNon-US declaration\nServices · advisers · news', 'mint'),
        ('2 · Source of wealth','Employment · inheritance/gift\nBusiness/property sale\nOther wealth','yellow'),
        ('3 · Financial profile','Portfolio · employment\nAssets · liabilities · net worth\nIncome · spend · dependents\nKnowledge & experience','lavender'),
        ('4 · Risk profile','Risk questionnaire\nInvestment strategy\nNon-standard investments','lavender'),
        ('5 · Signature','Signature form UI\nNo dedicated signature field\nin the current schema','pink'),
        ('6 · Documentation','Documentation checklist\nUpload URL metadata exists\nUpload pipeline pending','mint'),
    ]
    for i,(title,body,fill) in enumerate(cards):
        x=28+(i%3)*270; y=199+(i//3)*157
        b.node(x,y,246,130,title,body,fill,20,15)
        b.circle(x+224,y+10,13,'white',str(i+1),14)
    b.arrow([(274,263),(298,263)])
    b.arrow([(544,263),(568,263)])
    b.arrow([(691,329),(691,343),(151,343),(151,356)],color='purple')
    b.arrow([(274,421),(298,421)])
    b.arrow([(544,421),(568,421)])
    b.pill('Current UI: open → fill → Next / Close',28,508,300,'sky',size=14)
    b.pill('Form saving + submitting still pending',345,508,303,'pink',size=14)
    b.text('Individual only\nOther types: coming soon',664,506,150,13,h=39,color='muted')
    return b

def page14(ctx,num):
    b=Board(ctx,num,'CORE WORKFLOWS','Audit clicks and client activity',
            'ActionLogger.js • lib/{logger,enrichLog,logUIAction}.js • api/log* • pages/dashboard/data.js')
    b.bracket(28,118,786,191,'A · Persisted UI interaction log')
    b.node(45,151,160,99,'Meaningful click','ActionLogger\nReadable action title\nPath + UI context','yellow',18,14.5)
    b.node(247,151,160,99,'Browser buffer','Flush at 10 events\nOR 5 seconds\nUnload beacon','sky',18,14.5)
    b.node(449,151,160,99,'Server enrichment','/api/log/batch\nActor + tenant from User\n/api/log: single event','lavender',18,14)
    b.node(651,151,145,99,'Log model','Stored audit entry\nSuperadmin reader\n/api/logs filters','mint',18,14)
    for a,z in [(205,247),(407,449),(609,651)]: b.arrow([(a,202),(z,202)])
    b.text('Explicit UI actions can also go directly to /api/log.',45,271,470,14,h=23,color='muted')
    b.pill('UI audit ≠ complete backend transaction audit',500,268,296,'pink',size=12.6)
    b.bracket(28,350,786,192,'B · Derived activity feed')
    b.node(45,383,202,102,'Scoped /api/clients','createdAt\nonboarding.submittedAt\nonboarding.approvedAt','blue',18,14.5)
    b.node(299,383,202,102,'Build dated activities','Creation / submission / approval\nSort from record timestamps\nNo event collection','lavender',18,14)
    b.node(553,383,243,102,'RM notifications + dashboard','Dated activity cards\nDerived again from client records\nNo persisted unread counter','mint',18,14.5)
    b.arrow([(247,434),(299,434)])
    b.arrow([(501,434),(553,434)])
    b.text('Separate paths: interaction logs describe clicks; activity cards describe client-record milestones.',45,506,751,14,h=23,color='muted')
    return b

def page15(ctx,num):
    b=Board(ctx,num,'CORE WORKFLOWS','Where each screen gets its evidence',
            'role dashboard pages • dashboard/data.js • submissions/dummySubmissions.js • ReportsPage.js')
    b.table(28,116,[188,247,220,131],['Screen / feature','Input','Visual result','Current state'],[
        ['RM / Supervisor','/api/clients + /api/users','Counts · pipeline · team','Connected'],
        ['Superadmin','Companies · users · clients · logs','Totals · companies · audit','Connected'],
        ['Client dashboard','GET /api/clients/me','Own saved state + uploads','Connected'],
        ['RM notifications','Client milestone timestamps','Dated activity cards','Derived'],
        ['Profile completion','Ten personal fields counted','Estimated percentage','Derived'],
        ['Submissions','buildDummySubmissions()','Sample phase fields + dates','Sample UI'],
        ['Phase forms','Form inputs in the browser','Next / Close navigation','Save pending'],
        ['Reports / health','No reporting / monitoring API','Empty rows / unavailable','Placeholder'],
    ],rowh=38,size=14,fills=['mint','mint','mint','blue','blue','yellow','pink','slate'])
    b.node(28,491,250,61,'Stored record → derived view','Charts summarize existing API records.','mint',18,13.5)
    b.node(296,491,250,61,'Future write path','Form fields exist; saving is not wired.','pink',18,13.5)
    b.node(564,491,250,61,'Current-state source snapshot','Deployment and live data not inspected.','sky',18,13.5)
    return b

PAGES=[page11,page12,page13,page14,page15]
