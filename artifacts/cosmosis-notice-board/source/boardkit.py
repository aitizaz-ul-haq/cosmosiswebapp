"""Vector drawing tools for the Cosmosis A4 notice-board pack."""
from pathlib import Path
import math, ctypes, json
import cairo
import gi
gi.require_version('Pango', '1.0')
gi.require_version('PangoCairo', '1.0')
from gi.repository import Pango, PangoCairo

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent
W, H = 841.8898, 595.2756  # ISO A4 landscape, PDF points
C = dict(ink='#263653', muted='#65718B', teal='#00C6B0', brand='#21CFB2',
         purple='#8046FF', mint='#E3F8F2', lavender='#EFEAFD', blue='#E6EFFD',
         sky='#BFE9FF', yellow='#FFF18B', pink='#FFC8E3', lime='#D7F59C',
         peach='#FFD5A3', red='#C63B3B', white='#FFFFFF', paper='#FFFEF9',
         line='#B9C5D6', slate='#ECEFF7', dark='#08121F')
fc = ctypes.CDLL('libfontconfig.so.1')
fc.FcConfigGetCurrent.restype = ctypes.c_void_p
fc.FcConfigAppFontAddFile.argtypes = [ctypes.c_void_p, ctypes.c_char_p]
assert fc.FcConfigAppFontAddFile(fc.FcConfigGetCurrent(), str(ROOT/'fonts/PatrickHand-Regular.ttf').encode())

def col(c):
    c = C.get(c, c).lstrip('#')
    return tuple(int(c[i:i+2],16)/255 for i in (0,2,4))

class Board:
    def __init__(self, ctx, num, section, title, sources, subtitle=''):
        self.c, self.num, self.section, self.title = ctx, num, section, title
        self.warnings = []
        self.texts = []
        self.fill('paper'); ctx.paint()
        self.fill('#E9EAF0')
        for x in range(30,825,22):
            for y in range(88,553,22):
                ctx.arc(x,y,.52,0,2*math.pi); ctx.fill()
        self.box(27,23,33,33,'teal',stroke=None,r=9)
        self.text('C',31,21,26,33,align='center',color='white')
        self.text('COSMOSIS',71,20,210,13,color='muted')
        self.text(title,70,36,690,27,h=43)
        self.text(f'{section} / {num:02d}',644,20,171,12,align='right',color='muted')
        if subtitle: self.text(subtitle,29,75,785,13,color='muted',h=24)
        self.line([(28,559),(814,559)],'line',.7)
        self.text('SOURCE MODEL • 03 NOV 2026',29,566,185,7.5,font='DejaVu Sans',color='muted')
        self.text(sources,215,566,548,7.1,font='DejaVu Sans',color='muted',h=12)
        self.text(f'{num:02d} / 20',770,565,44,9,align='right',color='muted')

    def fill(self,c): self.c.set_source_rgb(*col(c))
    def line(self,pts,color='ink',width=1.4,dash=None):
        c=self.c; c.save(); c.new_path(); self.fill(color); c.set_line_width(width)
        c.set_line_join(cairo.LINE_JOIN_ROUND); c.set_line_cap(cairo.LINE_CAP_ROUND)
        if dash: c.set_dash(dash)
        c.move_to(*pts[0])
        for p in pts[1:]: c.line_to(*p)
        c.stroke(); c.restore()

    def box(self,x,y,w,h,fill='white',stroke='line',r=9,dash=None):
        c=self.c; c.save(); c.new_path()
        c.move_to(x+r,y); c.line_to(x+w-r,y); c.arc(x+w-r,y+r,r,-math.pi/2,0)
        c.line_to(x+w,y+h-r); c.arc(x+w-r,y+h-r,r,0,math.pi/2)
        c.line_to(x+r,y+h); c.arc(x+r,y+h-r,r,math.pi/2,math.pi)
        c.line_to(x,y+r); c.arc(x+r,y+r,r,math.pi,math.pi*1.5); c.close_path()
        if fill: self.fill(fill); c.fill_preserve()
        if stroke:
            self.fill(stroke); c.set_line_width(1.05)
            if dash: c.set_dash(dash)
            c.stroke()
        else: c.new_path()
        c.restore()

    def text(self,s,x,y,w,size=15,color='ink',align='left',h=None,font='Patrick Hand',minsize=None):
        c=self.c; c.save()
        layout=PangoCairo.create_layout(c)
        layout.set_width(round(w*Pango.SCALE)); layout.set_wrap(Pango.WrapMode.WORD_CHAR)
        layout.set_alignment({'left':Pango.Alignment.LEFT,'center':Pango.Alignment.CENTER,'right':Pango.Alignment.RIGHT}[align])
        layout.set_spacing(round(size*.08*Pango.SCALE))
        layout.set_text(str(s),-1)
        while True:
            desc=Pango.FontDescription(); desc.set_family(font); desc.set_absolute_size(size*Pango.SCALE)
            layout.set_font_description(desc)
            _,logical=layout.get_extents(); height=logical.height/Pango.SCALE
            if h is None or height<=h+.3 or minsize is None or size<=minsize: break
            size-=.25
        if h is not None and height>h+.5:
            self.warnings.append(dict(page=self.num,text=str(s)[:100],height=round(height,1),allowed=h))
        if x<20 or x+w>W-20 or y<15 or y+height>H-8:
            self.warnings.append(dict(page=self.num,bounds=str(s)[:80],x=x,y=y,w=w,height=height))
        self.texts.append(dict(page=self.num,text=str(s),x=x,y=y,w=w,h=height,size=size))
        self.fill(color); c.move_to(x,y); PangoCairo.show_layout(c,layout); c.new_path(); c.restore()
        return height

    def node(self,x,y,w,h,title,body='',fill='white',size=17,body_size=14,stroke='line'):
        self.box(x,y,w,h,fill,stroke)
        th=self.text(title,x+12,y+5,w-24,size,h=(h-10 if not body else min(55,h*.5)))
        if body: self.text(body,x+12,y+9+th,w-24,body_size,h=h-12-th)

    def note(self,x,y,w,h,title,body='',fill='yellow',size=17,body_size=14):
        self.box(x+2,y+3,w,h,'#DDE1DE',None,r=1)
        self.box(x,y,w,h,fill,None,r=1)
        self.box(x+w*.34,y-4,w*.32,9,'#EEE9D7',None,r=1)
        self.text(title,x+12,y+10,w-24,size,h=28)
        if body:self.text(body,x+12,y+39,w-24,body_size,h=h-45)

    def arrow(self,pts,label='',color='ink',dashed=False,label_pos=None,size=13):
        self.line(pts,color,1.5,[5,4] if dashed else None)
        a,b=pts[-2:]; angle=math.atan2(b[1]-a[1],b[0]-a[0]); end=pts[-1]
        self.line([(end[0]-7*math.cos(angle-.45),end[1]-7*math.sin(angle-.45)),end,
                   (end[0]-7*math.cos(angle+.45),end[1]-7*math.sin(angle+.45))],color,1.5)
        if label and label_pos:
            x,y,w=label_pos
            self.box(x-3,y,w+6,size*1.6,'paper',None,r=2)
            self.text(label,x,y,w,size,color=color,align='center')

    def pill(self,s,x,y,w,color='mint',text_color='ink',size=13):
        self.box(x,y,w,26,color,None,r=13)
        self.text(s,x+5,y+2,w-10,size,color=text_color,align='center',h=23)

    def table(self,x,y,widths,headers,rows,rowh=32,size=13,header_fill='lavender',fills=None):
        self.box(x,y,sum(widths),rowh*(len(rows)+1),'white','line',r=6)
        xx=x
        for i,(w,s) in enumerate(zip(widths,headers)):
            self.box(xx+.5,y+.5,w-1,rowh-1,header_fill,None,r=1)
            self.text(s,xx+8,y+5,w-16,size+1,h=rowh-7)
            xx+=w
        yy=y+rowh
        for ri,row in enumerate(rows):
            if fills and fills[ri]:self.box(x+1,yy,sum(widths)-2,rowh,fills[ri],None,r=0)
            xx=x
            for w,s in zip(widths,row):
                self.text(s,xx+8,yy+5,w-16,size,h=rowh-7)
                xx+=w
            self.line([(x,yy),(x+sum(widths),yy)],'line',.55)
            yy+=rowh
        xx=x
        for w in widths[:-1]:
            xx+=w; self.line([(xx,y),(xx,yy)],'line',.55)

    def circle(self,x,y,r,fill='mint',label='',size=16):
        c=self.c;c.save();c.new_path();self.fill(fill);c.arc(x,y,r,0,2*math.pi);c.fill();c.restore()
        if label:self.text(label,x-r,y-r*.78,r*2,size,align='center',h=r*1.8)

    def bracket(self,x,y,w,h,label,color='purple'):
        self.box(x,y,w,h,None,color,dash=[6,5],r=12)
        self.pill(label,x+12,y-13,min(w-24,len(label)*7+26),'lavender',color)

def render(pages, destination):
    surf=cairo.PDFSurface(str(destination),W,H)
    surf.set_metadata(cairo.PDF_METADATA_TITLE,'Cosmosis • Architecture & Design Notice Boards')
    surf.set_metadata(cairo.PDF_METADATA_AUTHOR,'Cosmosis source-code documentation')
    surf.set_metadata(cairo.PDF_METADATA_SUBJECT,f'{len(pages)} A4 landscape diagram boards • 3 November 2026')
    ctx=cairo.Context(surf); all_warnings=[]; all_text=[]
    for index,(num,fn) in enumerate(pages,1):
        surf.set_page_label(f'{num:02d}')
        b=fn(ctx,num)
        surf.add_outline(cairo.PDF_OUTLINE_ROOT,f'{num:02d} · {b.title}',f'page={index}',0)
        all_warnings.extend(b.warnings); all_text.extend(b.texts); ctx.show_page()
    surf.finish()
    return all_warnings,all_text
