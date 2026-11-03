"""Five source-based UI design boards; decorative miniature wireframes are schematic."""
from boardkit import Board, C


def page16(ctx, num):
    b = Board(ctx, num, 'UI DESIGN', 'The dashboard, taken apart',
              'dashboard/{page.js,config.js}; dashboardshell/{dashboardshell.js,subcomps/*}',
              'A shared shell surrounds every role-specific workspace • source-based UI schematic')
    # One large, annotated shell, kept deliberately close to the app geometry.
    b.box(28,111,491,321,'#F7FAFF','line',r=12)
    b.box(28,111,121,321,'#EFEDFF',None,r=10)
    b.text('COSMOSIS',42,126,96,18,h=25)
    b.circle(50,177,13,'teal','RM',12)
    b.text('Your account',70,165,68,14,h=38)
    for i, s in enumerate(['Dashboard','Clients','Registry','Scheduled','Onboarding']):
        y=205+i*34
        b.box(38,y,101,29,'teal' if i==0 else '#E7E3FA',None,r=7)
        b.circle(49,y+14,3,'white' if i==0 else 'purple')
        b.text(s,59,y+4,75,11.5,'white' if i==0 else 'muted',h=22)
    b.text('Navigation',41,388,95,15,color='muted',h=24)
    b.box(149,111,370,44,'white',None,r=4)
    b.box(162,122,184,22,'#F5F7FF','line',r=6)
    b.text('Search your workspace…',172,124,164,11.5,color='muted',h=20)
    b.circle(423,133,10,'lavender','☾',12)
    b.circle(454,133,10,'mint','!',12)
    b.circle(490,133,12,'teal','RM',11)
    b.text('Role dashboard',166,172,260,23,color='#59638F',h=35)
    b.text('Shared layout • role-specific records',166,202,300,13,color='muted',h=23)
    for x,fill,txt in [(163,'mint','Clients'),(279,'lavender','In progress'),(395,'blue','Completed')]:
        b.box(x,239,107,61,'white','line',r=8)
        b.circle(x+19,259,8,fill)
        b.text(txt,x+9,278,91,12.5,h=19)
    b.box(163,315,214,98,'white','line',r=8)
    b.text('Charts + activity',174,322,184,14,h=22)
    for i,(h,fill) in enumerate([(26,'teal'),(42,'purple'),(33,'teal'),(50,'purple')]):
        b.box(183+i*39,397-h,20,h,fill,None,r=3)
    b.box(388,315,116,98,'white','line',r=8)
    b.text('Quick actions',399,323,94,14,h=21)
    for i, fill in enumerate(['mint','lavender']):
        b.box(398,352+i*25,96,20,fill,None,r=5)
        b.text('Open workspace',404,353+i*25,87,11,h=18)
    b.pill('262 px sidebar',42,447,145,'lavender')
    b.pill('60 px header',210,447,130,'mint')
    b.pill('Scrollable stage',362,447,148,'blue')
    b.arrow([(536,133),(522,133)],color='purple')
    b.arrow([(536,286),(522,286)],color='purple')
    b.node(546,112,268,65,'DashboardPage','user + activeMenu + role config','yellow',17,14)
    b.arrow([(679,177),(679,189)],color='purple')
    b.node(546,190,268,65,'DashboardShell','sidebar + header + content','lavender',17,14)
    b.arrow([(679,255),(679,267)],color='purple')
    b.node(546,268,268,65,'DashboardMenuSection','background + page boundary','mint',17,14)
    b.arrow([(679,333),(679,345)],color='purple')
    b.node(546,346,268,65,'DashboardPageLoading','readiness + inert content','blue',17,14)
    b.arrow([(679,411),(679,423)],color='purple')
    b.node(546,424,268,65,'Role-specific page','dashboard / table / onboarding','lime',17,14)
    b.note(32,495,477,51,'One layout, four workspaces','',fill='yellow',size=19)
    b.note(548,505,264,42,'API routes enforce permissions','',fill='pink',size=17)
    return b


def page17(ctx, num):
    b=Board(ctx,num,'UI DESIGN','The Cosmosis color & component recipe',
            'globals.css; dashboardshell/styles/{dashboardshell,dashboard-dark}.css; pages/clientStatusShared.js',
            'Exact app swatches + bright presentation notes • handwriting is used for these printed boards')
    colors=[('Brand mint','#21CFB2'),('Dashboard teal','#00C6B0'),('Dashboard purple','#8046FF'),('Heading slate','#59638F'),
            ('Main ink','#090943'),('Muted slate','#737FAE'),('Page mist','#F7FAFF'),('Sidebar lilac','#EFEDFF')]
    for i,(name,hx) in enumerate(colors):
        x=28+i*99
        b.box(x,111,93,62,hx,'line',r=8)
        b.text(name,x+3,181,88,14,align='center',h=41)
        b.text(hx,x+3,219,88,13.5,align='center',h=20)
    b.text('Status color carries meaning',30,256,420,22,h=32)
    statuses=[('Approval pending','amber','#FEF0DC','#C26A0A'),('Under review','violet','#EFEAFD','#6D4FD8'),
              ('Awaiting registry','blue','#E6EFFD','#3A6FD8'),('In progress','green','#E3F8F2','#17B89B'),
              ('Cancelled','red','#FDE8E8','#C63B3B')]
    for i,(label,tone,fill,ink) in enumerate(statuses):
        x=28+i*158
        b.box(x,297,150,38,fill,None,r=19)
        b.text(label,x+7,304,136,15,color=ink,align='center',h=25)
        b.text(fill+' / '+ink,x,344,150,11.5,align='center',h=20)
    # three parallel token workshops
    b.box(28,388,246,159,'white','line')
    b.text('Shape tokens',42,398,216,20,h=30)
    b.box(43,442,77,32,'mint','teal',r=10)
    b.text('Button',50,446,63,15,align='center',h=25)
    b.box(137,439,116,38,'lavender','purple',r=18)
    b.text('Dialog card',144,446,102,15,align='center',h=25)
    b.text('Buttons / inputs: 10 px radius',43,492,216,14,h=24)
    b.text('Modal card: 18 px radius',43,515,216,14,h=24)
    b.note(292,392,245,155,'Font roles','App: Poppins\nHeadings: 32 px\nPrint boards: Patrick Hand',fill='yellow',size=21,body_size=18)
    b.box(556,388,258,159,'#08121F',None)
    b.text('Dark theme accents',572,400,226,20,color='#EEF3FF',h=30)
    for x,fill,label in [(574,'#00D3B4','Teal'),(687,'#A879FF','Purple')]:
        b.box(x,444,95,30,fill,None,r=7)
        b.text(label,x+5,448,85,15,color='#08121F',align='center',h=24)
    b.text('Surface #0C1B29',572,489,226,15,color='#AABBE0',h=24)
    b.text('Text #EEF3FF',572,514,226,15,color='#EEF3FF',h=24)
    return b


def page18(ctx,num):
    b=Board(ctx,num,'UI DESIGN','Reusable pieces: tables & dialogs',
            'pages/{GenericTable.js,pagecomponents/*,modalkit/ModalKit.js,modalkit/modalkit.css}',
            'Exploded component models • data and columns are supplied by each management page')
    b.bracket(28,119,375,339,'Management table')
    b.node(44,139,343,42,'TablePageLayout','',fill='mint',size=19)
    b.arrow([(215,182),(215,198)],color='teal')
    b.box(44,200,343,58,'white','line')
    b.text('ManagementTableToolbar',56,205,320,17,h=26)
    b.pill('Field',55,230,70,'slate',size=12)
    b.pill('Search / filter',135,230,145,'blue',size=12)
    b.pill('+ Add',290,230,85,'mint',size=12)
    b.arrow([(215,259),(215,276)],color='teal')
    b.box(44,278,343,88,'white','line')
    b.text('GenericTableThead + Tbody',56,283,318,17,h=26)
    b.table(55,308,[110,100,110],['Name','Status','Actions'],[['Client','In progress','Info / Edit']],rowh=28,size=11.5)
    b.arrow([(215,367),(215,380)],color='teal')
    b.node(44,382,343,65,'ManagementTablePagination','TanStack row model • 8 rows / page','lavender',17,14)
    b.note(30,484,373,63,'Record source → data + columns','',fill='yellow',size=18)
    b.arrow([(412,325),(439,325)],color='purple')
    b.text('action',410,299,39,12,color='purple',align='center',h=20)
    b.bracket(451,119,363,339,'ModalKit')
    b.box(467,139,331,302,'#F5F6FA','line',r=12)
    b.box(479,150,307,66,'white','line',r=8)
    b.circle(500,174,11,'mint','i',14)
    b.text('ModalShell header',521,157,215,18,h=28)
    b.text('icon + title + badges + Close',521,186,243,13,h=20)
    b.box(479,229,307,141,'white','line',r=8)
    b.text('Scrollable body',493,237,279,18,h=28)
    b.box(493,275,279,39,'mint',None,r=7)
    b.text('ModalSection → DetailRow',503,282,261,16,h=27)
    b.box(493,321,279,35,'lavender',None,r=7)
    b.text('ModalField → input / select',503,326,261,16,h=27)
    b.box(479,382,307,47,'white','line',r=8)
    b.pill('Cancel',584,392,79,'slate',size=13)
    b.pill('Primary',673,392,100,'mint','#17B89B',size=13)
    b.note(451,484,361,63,'View = read • form = edit','',fill='pink',size=21)
    b.text('Backdrop: dim + blur 6 px',468,460,329,14,color='muted',h=23)
    return b


def page19(ctx,num):
    b=Board(ctx,num,'UI DESIGN','Onboarding: interaction & focus model',
            'pages/{OnboardingPage.js,onboarding/{OnboardingTimeline,PhaseDetails,PhaseModal}.js,onboarding/onboarding.css}',
            'How a client enters, explores and leaves a form • individual account UI')
    b.node(28,111,220,68,'Phase button (1–6)','expand / collapse details','lavender',18,15)
    b.arrow([(248,142),(292,142)],color='purple')
    b.node(293,111,247,68,'PhaseDetails','Start + subsection buttons','mint',18,15)
    b.arrow([(540,142),(583,142)],color='teal')
    b.node(584,111,230,68,'PhaseModal','portal → document.body','blue',18,15)
    b.arrow([(699,179),(699,212)],color='purple')
    # Layers make portal purpose apparent without text paragraphs.
    b.bracket(28,219,442,228,'Dashboard content stage')
    b.box(43,240,409,190,'#F7FAFF','line',r=7)
    b.text('OnboardingTimeline',56,248,380,18,h=28)
    for i, fill in enumerate(['teal','teal','purple','purple','purple','purple']):
        x=78+i*64
        if i<5:b.line([(x+15,302),(x+49,302)],fill,2,[4,3] if i>=1 else None)
        b.circle(x,302,15,'mint' if i<2 else 'lavender',str(i+1),16)
    b.box(57,340,381,69,'white','line')
    b.text('PhaseDetails → subsection',68,347,359,17,h=26)
    for i in range(3):
        b.box(69+i*120,378,109,20,'lavender',None,r=4)
        b.text('Open section',74+i*120,379,100,11.5,align='center',h=18)
    b.arrow([(467,335),(504,335)],color='purple')
    b.box(508,217,306,231,'white','purple',r=12)
    b.box(520,229,282,43,'lavender',None,r=7)
    b.text('Phase header + Close',532,237,258,18,h=28)
    b.box(520,283,282,97,'#F7FAFF','line',r=7)
    b.text('Requested section heading',532,292,258,17,h=27)
    b.text('scroll to heading\nfocus heading • body scrolls',532,326,258,15,h=49)
    b.box(520,391,282,43,'mint',None,r=7)
    b.text('Close          Next phase →',532,399,258,17,h=28)
    b.arrow([(531,450),(531,468),(238,468),(238,450)],color='teal')
    b.text('Close restores the initiating button’s focus',271,470,512,15,color='teal',h=24)
    b.note(28,495,383,52,'Subsection action → heading focus','',fill='yellow',size=18)
    b.note(430,495,382,52,'Next changes the open phase','',fill='pink',size=20)
    return b


def mini_shell(b,x,y,w,h,dark=False):
    bg='#08121F' if dark else '#F7FAFF'
    sidebar='#101D30' if dark else '#EFEDFF'
    surface='#0C1B29' if dark else '#FFFFFF'
    line='#24384E' if dark else '#DDE3F1'
    text='#EEF3FF' if dark else '#59638F'
    teal='#00D3B4' if dark else '#00C6B0'
    purple='#A879FF' if dark else '#8046FF'
    b.box(x,y,w,h,bg,line,r=9)
    b.box(x,y,70,h,sidebar,None,r=8)
    b.text('C',x+23,y+9,27,24,color=teal,align='center',h=33)
    for i in range(4):b.box(x+10,y+57+i*27,50,17,teal if i==0 else surface,None,r=4)
    b.box(x+70,y,w-70,30,surface,None,r=5)
    b.box(x+83,y+8,120,14,bg,line,r=4)
    b.circle(x+w-22,y+15,7,teal)
    b.text('Workspace',x+85,y+43,w-100,20,color=text,h=31)
    for i in range(2):
        b.box(x+85+i*119,y+83,108,62,surface,line,r=7)
        b.circle(x+103+i*119,y+101,7,teal if i==0 else purple)
        b.line([(x+99+i*119,y+124),(x+168+i*119,y+124)],text,2)
    b.box(x+85,y+157,w-101,h-172,surface,line,r=7)


def page20(ctx,num):
    b=Board(ctx,num,'UI DESIGN','One interface, many viewing conditions',
            'dashboardshell/{useDashboardTheme.js,styles/dashboard-dark*.css,styles/dashboardshell.css}; pages/styles/managementtable.css',
            'Theme changes colors • responsive rules reflow space • source-based miniature wireframes')
    mini_shell(b,28,112,375,225,False)
    mini_shell(b,439,112,375,225,True)
    b.pill('Light: default',45,345,166,'mint')
    b.pill('Dark: remembered',457,345,176,'lavender')
    # Preference flow deliberately separate from the rendering branches.
    b.node(28,392,159,68,'Theme button','toggle light / dark','yellow',19,15)
    b.arrow([(187,423),(216,423)],color='purple')
    b.node(217,392,180,68,'useDashboardTheme','state + storage event','lavender',18,15)
    b.arrow([(397,423),(427,423)],color='purple')
    b.node(428,392,183,68,'localStorage','save + restore choice','mint',19,15)
    b.arrow([(307,460),(307,471),(727,471),(727,460)],color='teal')
    b.node(640,392,174,68,'HTML attribute','data-dashboard-theme','blue',18,14)
    b.box(28,480,786,67,'white','line')
    b.text('Responsive rules',42,490,171,21,h=32)
    b.text('262 px → 80 px\nsidebar collapse',222,489,175,16,h=49)
    b.text('≤760 px\nslide-out navigation',421,489,175,16,h=49)
    b.text('≤1100 px\nlabelled table records',620,489,176,16,h=49)
    return b


PAGES=[page16,page17,page18,page19,page20]
