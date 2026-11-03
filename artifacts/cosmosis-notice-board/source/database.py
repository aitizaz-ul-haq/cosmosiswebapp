"""Five source-verified database boards for the Cosmosis notice-board pack."""
from boardkit import Board


def schema(b, x, y, w, h, name, rows, fill='mint', size=14):
    b.box(x, y, w, h, 'white', 'line', r=9)
    b.box(x+1, y+1, w-2, 35, fill, None, r=8)
    b.text(name, x+12, y+6, w-24, 19, h=27)
    yy = y+44
    for row in rows:
        b.text(row, x+12, yy, w-24, size, h=23)
        yy += 23


def page6(ctx, num):
    b = Board(ctx, num, 'DATABASE', 'The five-model data map',
              'src/models/{Company,User,ClientProfile,Log,DemoRequest}.js',
              'ObjectId references + embedded data • cardinalities describe the source model')

    # Main tenant/identity chain, with unobstructed labelled links.
    schema(b, 40, 125, 215, 116, 'Company',
           ['_id : ObjectId', 'tenantKey : String • unique', 'name : String • unique'], 'mint', 14)
    schema(b, 330, 125, 225, 116, 'User',
           ['_id : ObjectId', 'companyId → Company', 'role : 4 allowed values'], 'lavender', 14)
    schema(b, 330, 334, 225, 157, 'ClientProfile',
           ['userId → User • unique', 'companyId → Company', 'assignedToUserId → User', 'sharedWithUserIds → User[]', 'onboarding + embedded groups'], 'sky', 14)
    schema(b, 625, 125, 175, 116, 'Log',
           ['userId → User ?', 'companyId → Company ?', 'action : String'], 'yellow', 14)
    schema(b, 625, 334, 175, 134, 'DemoRequest',
           ['email : String', 'company : String', 'status : 3 values', 'No ObjectId references'], 'pink', 14)

    b.arrow([(255, 172), (330, 172)], '1 → many', label_pos=(260, 142, 65), size=13)
    b.arrow([(442, 241), (442, 334)], '1 → 0..1', label_pos=(448, 271, 69), size=14)
    b.arrow([(555, 172), (625, 172)], '1 → many', label_pos=(559, 142, 63), size=13)
    b.arrow([(145, 241), (145, 412), (330, 412)], '1 → many', label_pos=(180, 383, 76), size=14)
    b.arrow([(365, 334), (365, 294), (332, 294), (332, 241)], '', color='purple')
    b.text('Creator / owner /\nshared RMs', 175, 266, 140, 15, h=44, color='purple')
    b.text('Additional User refs\non ClientProfile', 175, 315, 140, 13.5, h=42, color='muted')
    b.note(40, 454, 215, 85, 'Embedded, not separate', 'wealth • risk • uploads • PDF', 'lime', size=16, body_size=14)
    b.pill('Timestamps on all five models', 329, 512, 249, 'mint', size=14)
    b.pill('Refs ≠ database foreign keys', 588, 512, 212, 'yellow', size=13.5)
    b.text('? = optional reference', 623, 252, 178, 13, h=24, color='muted')
    b.text('User.createdBy → User\nCompany.createdBy → User', 622, 280, 177, 14, h=46, color='muted')
    return b


def page7(ctx, num):
    b = Board(ctx, num, 'DATABASE', 'Identity belongs to a tenant',
              'src/models/{Company,User}.js • api/clients/route.js • lib/mongodb.js',
              'One shared MongoDB connection • companyId scopes tenant data in application routes')

    schema(b, 32, 112, 350, 295, 'User : identity + access', [
        'username : String • required • unique',
        'passwordHash : String • required',
        'role : superadmin | supervisor | rm | client',
        'companyId : ObjectId → Company',
        'companyName : String ? • snapshot',
        'fullName / email / phone : String ?',
        'isActive : Boolean = true',
        'createdBy : ObjectId → User ?',
        'createdAt / updatedAt : Date',
    ], 'lavender', 15)
    schema(b, 415, 112, 392, 295, 'Company : tenant + organization', [
        'name : String • required • unique',
        'tenantKey : String • required • unique',
        'status : active | suspended = active',
        'primaryContact : { fullName, email, phone }',
        'address : { line1, line2, city, country, ... }',
        'legalName / registrationNumber / taxId : String ?',
        'website / logoUrl / notes : String ?',
        'createdBy : ObjectId → User • required',
        'createdAt / updatedAt : Date',
    ], 'mint', 15)
    b.arrow([(382, 230), (415, 230)], color='purple')
    b.note(33, 431, 239, 105, 'Tenant rule',
           'Non-superadmin → companyId required\nSuperadmin → companyId = null', 'yellow', size=17, body_size=14.5)
    b.node(300, 441, 139, 72, 'JWT companyId', 'tenant context', 'sky', size=17, body_size=14)
    b.arrow([(439, 477), (474, 477)], color='purple')
    b.node(474, 441, 138, 72, 'Route query', 'companyId filter', 'pink', size=17, body_size=14)
    b.arrow([(612, 477), (648, 477)], color='purple')
    b.node(648, 441, 159, 72, 'Tenant records', 'User / ClientProfile', 'lime', size=17, body_size=14)
    b.text('RM scope adds: assignedToUserId OR sharedWithUserIds', 300, 520, 508, 14, h=26, color='muted')
    return b


def page8(ctx, num):
    b = Board(ctx, num, 'DATABASE', 'ClientProfile is an embedded aggregate',
              'src/models/ClientProfile.js • api/clients/me/route.js • pages/OnboardingPage.js',
              'One profile per client user • nested objects carry the account-opening data')

    b.bracket(32, 122, 550, 325, 'ClientProfile', 'purple')
    b.node(48, 148, 249, 85, 'Ownership + workflow',
           'userId • companyId • assignedToUserId\nstatus • onboardingType • onboarding', 'lavender', size=17, body_size=14)
    b.node(314, 148, 249, 85, 'accountHolders',
           'isJoint : Boolean\nholder1 / holder2 : Person', 'mint', size=17, body_size=14)
    b.node(48, 247, 249, 85, 'sourceOfWealth',
           '5 categories × holder1 / holder2 / joint\nEach value : Money', 'yellow', size=17, body_size=14)
    b.node(314, 247, 249, 85, 'financialProfile',
           'netWorth : Money • employmentStatus\nproposedInvestment • restrictions', 'sky', size=17, body_size=14)
    b.node(48, 346, 249, 85, 'riskProfile',
           'questionnaire : 6 answers\ncalculatedScore / calculatedProfile', 'pink', size=17, body_size=14)
    b.node(314, 346, 249, 85, 'documents + pdf',
           'uploads : Upload[] • upload flags\npdfUrl : String • lastGeneratedAt : Date', 'lime', size=17, body_size=13.5)

    schema(b, 607, 119, 200, 111, 'Person', [
        'name / contact : String',
        'dateOfBirth : Date ?',
        'address + declarations',
    ], 'mint', 14)
    schema(b, 607, 247, 200, 88, 'Money', [
        'amount : Number = 0',
        'currency : String = GBP',
    ], 'yellow', 14)
    schema(b, 607, 351, 200, 111, 'Upload', [
        'label : String',
        'url : String',
        'uploadedAt : Date',
    ], 'sky', 14)
    b.arrow([(563, 186), (607, 186)], color='teal')
    b.arrow([(297, 286), (305, 286), (305, 336), (592, 336), (592, 289), (607, 289)], color='purple', dashed=True)
    b.arrow([(563, 391), (607, 391)], color='teal')

    b.pill('Also embedded: investmentServices • externalAdvisers', 34, 465, 548, 'lavender', size=15)
    b.note(34, 510, 548, 38, 'Schema capacity → phase forms still need a save API', '', 'yellow', size=16)
    b.text('Embedded schemas use _id: false\nUpload stores a URL, not a file blob', 606, 484, 205, 14, h=53, color='muted')
    return b


def page9(ctx, num):
    b = Board(ctx, num, 'DATABASE', 'Two status machines, different meanings',
              'models/ClientProfile.js • api/clients/{route,registry/route}.js • lib/dispatchScheduledOnboardings.js',
              'Record activation is implemented • form submission states are schema capacity')

    b.pill('ClientProfile.status • operational lifecycle', 33, 111, 352, 'lavender', size=14.5)
    b.node(33, 161, 155, 65, 'approval_pending', 'RM creates • User inactive', 'yellow', size=17, body_size=13)
    b.node(251, 161, 144, 65, 'under_review', 'Supervisor reviews', 'pink', size=17, body_size=13.5)
    b.node(458, 161, 140, 65, 'register', 'Approved by supervisor', 'mint', size=18, body_size=13)
    b.node(666, 161, 141, 65, 'ongoing', 'Register now • active', 'lime', size=18, body_size=13.5)
    b.arrow([(188, 193), (251, 193)], 'review', label_pos=(191, 167, 56), size=13)
    b.arrow([(395, 193), (458, 193)], 'approve', label_pos=(397, 167, 59), size=13)
    b.arrow([(598, 193), (666, 193)], 'now', label_pos=(605, 167, 50), size=13)
    b.arrow([(188, 208), (213, 208), (213, 247), (437, 247), (437, 208), (458, 208)], color='purple', dashed=True)
    b.text('approval may skip review', 239, 245, 190, 13, h=24, color='muted')

    b.node(458, 281, 140, 65, 'scheduled', 'User remains inactive', 'sky', size=18, body_size=13)
    b.arrow([(528, 226), (528, 281)], 'later', label_pos=(532, 239, 49), size=13)
    b.arrow([(598, 313), (736, 313), (736, 226)], 'due → email → active', label_pos=(624, 277, 173), size=13.5)
    b.text('ongoing ↔ on_hold / cancelled', 569, 365, 239, 15, h=28, color='purple')
    b.table(33, 287, [181, 191], ['Schedule field', 'Type / behavior'], [
        ['scheduledRegistrationAt', 'Date • due timestamp'],
        ['scheduledTimeZone', 'String • IANA zone'],
        ['scheduledCredentialsEnc', 'String • AES-GCM'],
    ], rowh=28, size=12.5, header_fill='sky')
    b.pill('Success clears secret; failure returns to scheduled', 33, 407, 388, 'yellow', size=13.5)

    b.bracket(33, 468, 774, 74, 'onboarding.status • separate form lifecycle', 'purple')
    for x,w,t,fill in [(47,129,'not_started','slate'),(191,129,'in_progress','slate'),(335,129,'submitted','slate'),(479,129,'approved','mint'),(623,168,'rejected + reason','pink')]:
        b.pill(t,x,496,w,fill,size=15)
    b.text('Enum values only • phase forms currently have no persistence endpoint', 34, 440, 773, 14, h=25, color='muted')
    return b


def page10(ctx, num):
    b = Board(ctx, num, 'DATABASE', 'Events, leads & the query index map',
              'models/{Log,DemoRequest,User,Company,ClientProfile}.js • api/{logs,requestdemo}/route.js',
              'Declared schema indexes • live database indexes and retention were not inspected')

    schema(b, 33, 113, 239, 244, 'Log : activity event', [
        'action : String • required',
        'userId → User ? • role = guest',
        'companyId → Company ?',
        'name / username : String ?',
        'companyName : String ?',
        'actionTitle : String ?',
        'metadata : Object = {}',
        'ip / userAgent : String ?',
    ], 'yellow', 14)
    schema(b, 296, 113, 239, 244, 'DemoRequest : lead', [
        'firstname / lastname : String',
        'email / phone : String',
        'message : String',
        'company : String ?',
        'role : supervisor | rm | client | other',
        'status : pending / approved / rejected',
        'subscriptionStatus : 4 values',
        'No User / Company reference',
    ], 'pink', 13.5)
    b.box(558, 113, 249, 335, 'white', 'line')
    b.box(559, 114, 247, 35, 'lavender', None, r=8)
    b.text('Indexes → access patterns', 570, 119, 225, 19, h=28)
    items = [
        ('User', 'username UNIQUE\ncompanyId + role + companyName'),
        ('Company', 'name UNIQUE • tenantKey UNIQUE'),
        ('ClientProfile', 'userId UNIQUE\ncompanyId + assignedToUserId\ncompanyId + onboarding.status\ncompanyId + createdByUserId'),
        ('Log', 'createdAt ↓\ncompanyName + createdAt ↓\nusername + createdAt ↓'),
    ]
    yy=156
    for title,body in items:
        b.text(title,571,yy,221,16,color='purple',h=23)
        hh=b.text(body,571,yy+22,221,13.5,h=78)
        yy += hh + 24

    b.node(33, 388, 239, 65, 'POST /api/log + /batch', 'Identity enriched on write', 'mint', size=17, body_size=14)
    b.arrow([(152, 388), (152, 357)], color='teal')
    b.node(296, 388, 239, 65, 'POST /api/requestdemo', 'Public intake → pending lead', 'sky', size=17, body_size=14)
    b.arrow([(415, 388), (415, 357)], color='teal')
    b.pill('Only superadmin reads logs', 33, 474, 239, 'lime', size=14)
    b.pill('No custom lead index declared', 296, 474, 239, 'yellow', size=13.5)
    b.note(558, 465, 249, 83, 'Integrity lives in routes',
           'Tenant + RM checks • no FK cascade\nUser + profile writes are separate', 'yellow', size=16, body_size=13.5)
    b.text('Every model: _id + createdAt + updatedAt', 34, 518, 501, 15, h=27, color='muted')
    return b


PAGES = [page6, page7, page8, page9, page10]
