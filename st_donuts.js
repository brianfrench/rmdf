var ren=function(p,x,y,w,h,n){
    var cos=this.cos, sin=this.sin, sqrt=this.sqrt, abs=this.abs, log=this.log, pow=this.pow, floor=this.floor;
    var dot=function(a, b){
        for(var i=0, m=0; i<a.length; i++){m+=a[i]*b[i];}
        return m;};
    var add=function(a, b){
        for(var i=0, c=[]; i<a.length; i++){c[i]=a[i] + b[i];}
        return c;};
    var mul=function(a, m){
        for(var i=0, c=[]; i<a.length; i++){c[i]=a[i]*m;}
        return c;};
    var spine=function(x){
        var i=floor(x)|0; x-=i; x=(i&1)*(1 - 2*x) + x;
        return x*x*(3 - 2*x);};
    var smoot=function(x,a,b){
        if(x<a){return a;}
        if(x>b){return b;}
        var m=(x-a)/(b-a);
        return m*m*(3 - 2*m)*(b - a) + a;};
    var smin=function(x,y,m){
        var a=(y - x)*m;
        if(a<-1){return y;}
        if(a>1){return x;}
        return (0.25*a*(3 - a*a) + 0.5)*(x - y) + y;};
    
    var f=function(vv){
        var m0=1e3, m1=1e3;
        var mf;
        // var v=vv.slice();
        var v=[];
        for(var i=0; i<3; i++){
            var a=vv[i];
            v[i]=(a - floor(a*0.25)*4 - 2);
            // v[i]+=spine(v[(i+1)%3])*0.000001;
        }v[1]=vv[1];
        
        // m0=sqrt(dot(v,v))-1;
        // var v2=[v[0],v[1]];
        // m0=sqrt(dot(v2,v2))-0.5;
        
        var x=v[0], y=-v[1], z=v[2];
        var mm=x*x + z*z;
        var m=1 - pow(mm, -0.5);
        // x*=m; y*=m;
        // m0=abs(sqrt((x*x + y*y)*m*m + z*z) - 0.5)-0.1;
        // m0=sqrt((x*x + y*y)*m*m + z*z) - 0.5;
        m0=sqrt(mm*m*m + y*y) - 0.2;
        
        // return smin(y,m0,2);
        // y+=0.35;
        y=y+0.35-x*0.1+z*0.1;
        // var p=
        return y<m0?y:m0;
        // return smin(m0,m1,20);
    };
    
    var g=function(v){
        var m=f(v), d=1e-7;
        return [(f([v[0]+d, v[1], v[2]]) - m)/d,
                (f([v[0], v[1]+d, v[2]]) - m)/d,
                (f([v[0], v[1], v[2]+d]) - m)/d];
    };
    // var df=function(v){
    //     var gr=g(v);
    //     // var m=;
    //     return f(v)/sqrt(dot(gr, gr));
    // };
    var pixcol=function(x, y){
        var o=[2.5, -2, 10.5],
        // var o=[-1.95, -1.7, -2.4],
        // var o=[-0.2, 0.4, -3.05],
            v=[(x*2 - w)/h, (y*2 - h)/h, 1], out=1;
        // var t=v[1]; v[1]=v[1]*0.8 + v[2]*0.6; v[2]=v[2]*0.8 - t*0.6;
        var t=v[1]; v[1]=v[1]*0.8 + v[2]*0.6; v[2]=v[2]*0.8 - t*0.6;
        var t=v[0]; v[0]=v[0]*0.8 + v[2]*0.6; v[2]=v[2]*0.8 - t*0.6;
        v=mul(v,1/sqrt(dot(v,v)));
        var maxd=30;
        for(var d=0, i=0; i<40 && d<maxd; i++){
            // var m=df(add(o, mul(v, d)));
            // m=df(add(o, mul(v, d)));
            var m=f(add(o, mul(v, d)));
            if(m<1e-3*d){out=0;break;}
            // var maxs=12.3;
            // if(m>maxs){m=maxs;}
            d+=m;
        }
        // if(out){return 180;}
        o=add(o, mul(v, d));
        var gr=g(o);
        var r2r=1/sqrt(dot(gr,gr)), aoc=1;
        for(var i=2; i<10; i++){
            // var m=df(add(o, mul(gr, i*r2r*0.06)))*2 + i*0.2;
            var m=f(add(o, mul(gr, i*r2r*0.05))) + i*(1 - 0.05);
            // m*=m;m*=m;m*=m;
            // if(m>1){m=1;}
            // m=(m/i - 0.9)*10;
            m=5*(m/i - 1) + 1;
            m=m>1?1:m<0?0:m;
            aoc*=m;
            // aoc=m*(1 + (2/i)*(aoc - 1));
        }
        // aoc=(aoc + 1)*0.5;
        // aoc=pow(aoc,3.1);
        // return dot(gr, [0.6, 0.6, -0.6])/sqrt(dot(gr,gr))*255;
        var lv=[0.3, -0.3, 0.4];
        lv=mul(lv,1/sqrt(dot(lv,lv)));
        // var lv=[0, -1, 0];
        // out=1;
        for(var sd=0, i=1; i<10; i++){
            var j=i*0.15;
            var m=f(add(o, mul(lv, j)));
            // if(m<0){m=0;break;}
            // if(m<0.01){m=0.01;}
            // if(m>0.7){m=0.7;}
            // sd+=m*pow(0.75, i*i/400);
            // sd+=m*(1 - j);//*i/100;
            sd+=m/j;
        }
        // if(sd
        // if(sd>1){sd=1;}
        if(sd<0){sd=0;}
        // sd=sd>1
        var m=sd*0.09*dot(gr,lv);
        // m*=0.25;
        m=m>1?1:m<0?0:m;
        // var m=dot(gr, lv)*r2r*0.3;
        // if(m<0){m=0;}//m*m*0.15;}
        
        // m=0.1;
        // m+=d*0.1;
        // var q=aoc*aoc;
        // m*=q*0.5 + 0.5;
        // m=0;
        
        // m*=aoc;
        // m*=0.2*(aoc - 1) + 1;
        if(d>maxd){d=maxd;}
        m+=aoc*0.1;
        var fa=d/maxd;
        // fa*=dot(v,lv)
        if(fa>1){fa=1;}
        m+=pow(fa,2);
        return pow(m, 0.4545)*256;
        // return d*25;
    };
    
    for(var i=0; i<n; i++, x++){
        if(x>=w){x=0; y++; if(y>=h){return;}}
        var l=x + y*w << 2;
        p[l]=p[l+1]=p[l+2]=pixcol(x, y);
    }
};
// println(log(log(100))+" "+1/(log(2*log(100))-log(log(100))));
var lren=ren;
var pn=0, ppu=1;
mouseClicked=function(){pn=0; ppu=1;};

draw= function() {
    if(lren!==ren){pn=0; ppu=1; lren=ren;}
    if(pn>=width*height){return;}
    
    if(!loadPixels){return;}
    if(!this.imageData||!this.imageData.data){
        background(0xff993377);loadPixels();}
    if(!this.imageData||!this.imageData.data){return;}
    var p=this.imageData.data;
    
    var ms=millis();// && ((i-1&7)||millis()-ms<20)
    var x=pn%width, y=pn/width|0;
    ren(p,x,y,width,height,ppu);
    pn+=ppu;

    ms=millis()-ms;
    var tgt=50;
    var m=tgt/ms; m=m>2?2:m<0.5?0.5:m;
    ppu=ppu*m + 1|0;
    // if(ms<tgt){ppu=(ppu+1)*1.5|0;}else{ppu=ppu*0.75|0;}
    
    updatePixels();
    if(pn<width*height){
        var y=pn/width|0;
        for(var i=0; i<2; i++){
            fill(i*255);
            triangle(2-i,y-5-i, 2-i,y+5-i, 12-i,y-i);
            text(ppu,20-i,20-i);}
    }
};
// noStroke();
stroke(0);
frameRate(16);
