// it will animate once it makes five frames
var frames=[], framei=0, wframe=0, nframes=100;
var rpix=0, tld=0;
// var sizx=width>>4, sizy=height>>4;
var sizx=width>>2, sizy=height>>2;

// intersections/lighting done with a distance function (df inside pcol). About that: http://iquilezles.org/www/material/nvscene2008/rwwtt.pdf

frameRate(30);
angleMode="r";
background(0);

var pcol=function(x, y, t){
    // t/=3;
    // var sint=Math.sin(t*1.5), cost=Math.cos(t*1.5);
    var sint=0.8, cost=0.6;
    // var px=2*sint, py=0.5, pz=-2*cost;
    // var px=0.4*sint, py=0.4, pz=-0.4*cost;
    var px=1.0*sint - 0.5, py=-0.2, pz=-1.0*cost + 0.5;
    var m=1/Math.sqrt(x*x + y*y + 1), d, l,
        dx=m*x, dy=m*(y*0.8 + 0.6), dz=m*(0.8 - y*0.6);
    var k=dx;
    dx=dx*cost - dz*sint;
    dz=dz*cost + k*sint;
        // dx=m*(x*cost - sint), dy=m*y, dz=m*(cost + x*sint);
    
    var c=[], i, j=1223467, k, n=1*3;
    c=[-0.5, 1.3 - t*0.8, 0.5];
    c=[-0.5, 0.4, 0.5];
    // c=[0, 0.4, 0];
    // c=[0.5, 0.6, -0.5];
    // c=[0.6, 1.3 - t*0.8, -0.6];
    // for(i=0; i<n; i++){
    //     j^=j>>1;
    //     j^=i*i*223456 + 129123;
    //     c[i]=(i + 20)/(n + 20)*Math.sin(t*(n-i+3)*0.375 + j*0.2)*1.1 + [0.1, -0.1, -0.1][i%3];//0.1;//*(i%3===2?0.7:1);
    // }
    
    var sblen=function(h, p){
        for(var i=2, m=0, l=-1e9; i<arguments.length; i++){
            var k=arguments[i];
            if(k>l){l=k;}
            k+=h;
            if(k>0){m+=Math.pow(k, p);}
        }
        // if(m>0){m=Math.pow(m, 1/p) - h;}
        if(m>0){return Math.pow(m, 1/p) - h;}
        return l;//>m ? l : m;
        
        // for(var i=2, m=0, l=-1e9; i<arguments.length; i++){
        //     if((k=arguments[i])>l){l=k;}}
        // return l;
    };
    var ablen=function(h, p){
        for(var i=2, m=0, l=1e9; i<arguments.length; i++){
            var k=arguments[i];
            if(k<l){l=k;}
            k-=h;
            if(k<0){m+=Math.pow(k, p);}
        }
        if(m>0){return h - Math.pow(m, 1/p);}
        return l;
    };
    
    var idx=0, sx, sy, sz;
    // var deep=1;
    // var sx=0, sy=0, sz=0;
    var st=Math.sin(t*6.28);
    var df=function(x, y, z){
        var m=1e3;
        for(var j=0; j<n&&1; j+=3){
            var kx=x - c[j], ky=y - c[j + 1], kz=z - c[j + 2];
            // var kt=kx, rd=2/(y*y + 1), rc=1 - rd, rs=y*rd;
            var kt=kx, rr=st*(1 - y)*0.3, rd=2/(rr*rr + 1), rc=1 - rd, rs=rr*rd;
            kx=kx*rc + kz*rs; kz=kz*rc - kt*rs;
            sx=kx; sy=ky; sz=kz;
            // l=kx*kx + ky*ky + kz*kz;
            // l=kx*kx*kx*kx + ky*ky*ky*ky + kz*kz*kz*kz;
            l=kx*kx*kx*kx*kx*kx*kx*kx + ky*ky*ky*ky*ky*ky*ky*ky + kz*kz*kz*kz*kz*kz*kz*kz;
            // if(l<um*um){
                // if(l<m){m=l; idx=j;}
            // }
            // l=Math.abs(Math.sqrt(l) - 0.4) - 0.03;
            // l=Math.abs(Math.sqrt(Math.sqrt(l)) - 0.45) - 0.03;
            l=Math.abs(Math.sqrt(Math.sqrt(Math.sqrt(l))) - 0.45) - 0.02;
            // l=Math.abs(Math.pow(l, 0.25) - 0.45) - 0.03;
        
            if(l<0.1){// && m>-0.1){
                // var kx=x - c[j], ky=y - c[j + 1], kz=z - c[j + 2];
                // var mm=2/Math.sqrt(kx*kx + ky*ky + kz*kz);
                var mm=2;
                // kx*=mm; ky*=mm; kz*=mm;
                // kx=kx*mm + 100; ky=ky*mm + 100; kz=kz*mm + 100;
                kx=kx*mm + 100.5; ky=ky*mm + 100.5; kz=kz*mm + 100.5;
                kx-=~~kx + 0.5; ky-=~~ky + 0.5; kz-=~~kz + 0.5;
                // mm=(0.45 - Math.sqrt(kx*kx + ky*ky + kz*kz))/mm;
                mm=(0.46 - Math.sqrt(Math.sqrt(kx*kx*kx*kx + ky*ky*ky*ky + kz*kz*kz*kz)))/mm;
                
                // l=sblen(5e-2, 4, l, mm);
                var k=sblen(1.5e-2, 4, l, mm);
                // l=sblen(2e-2, 4, k, 1.5e-2 - Math.sqrt(l*l + mm*mm));
                l=ablen(2e-2, 4, k, Math.sqrt(l*l + mm*mm) - 4e-3);
                
                idx=j;
            }
            if(l<m){m=l; idx=j;}
        }
        
        // var mm=1 - y;//ablen(0.1, 4, 1 - y, 1 - z, x + 1);
        var mm=ablen(0.1, 4, 1 - y, 2 - z, x + 2);
        // mm=sblen(0.05, 4, mm, 0.04 - Math.abs(m - mm)*0.707);
        idx=m<mm?0:-2;
        return m<mm?m:mm;
    };
    
    var negs, lp=0, gn=0, lpd=1e9, gnd=-1e9;
    for(i=d=negs=0; i<200 /*&& negs<5*/ && d<8; i++){
        m=df(px + d*dx, py + d*dy, pz + d*dz);
        if(m<0){
            if(m>gnd){gn=d; gnd=m;}
            // if(!negs){id=idx;}
            negs++;
        }else{
            if(m<lpd){lp=d; lpd=m;}
            // if(m<1e-3 && !negs){m=1e-3;}
        }
        if(negs&&1){
            // d=(lp + gn)*0.5;
            d=lp + lpd*(lp - gn)/(gnd - lpd);
            if(gn - lp<1e-5 && gn - lp>-1e-5){break;}
        }else{d+=m;}
        if(m*m<1e-6){break;}
    }
    var dfv=m;
    px+=dx*d; py+=dy*d; pz+=dz*d;
    dfv=df(px, py, pz);
    var id=idx, tx=sx, ty=sy, tz=sz;
    
    // var dep=deep;
    
    // var sx=0, sy=0, sz=0;
    //id=id/3;
    // m=0;
    var nx=df(px + 1e-6, py, pz) - dfv,
        ny=df(px, py + 1e-6, pz) - dfv,
        nz=df(px, py, pz + 1e-6) - dfv;
    // m=Math.pow(nx*nx + ny*ny + nz*nz, -0.5); nx*=m; ny*=m; nz*=m;
    m=1/Math.sqrt(nx*nx + ny*ny + nz*nz); nx*=m; ny*=m; nz*=m;
    
    var aoc=1;
    for(i=1; i<8; i++){
        var ss=0.005*i*i;
        m=df(px + nx*ss, py + ny*ss, pz + nz*ss) - dfv;
        // aoc+=0.15*(m/ss - 1);
        aoc+=0.15*(m/ss - 1);
    }
    // aoc=0;
    // aoc*=(2 - dy)*0.5;
    
    // if(id>=0){
    //     sx=px - c[id]; sy=py - c[id + 1]; sz=pz - c[id + 2];
    //     // m=1/Math.sqrt(sx*sx + sy*sy + sz*sz); sx*=m; sy*=m; sz*=m;
    // }
    
    // dx=0.6; dy=-0.7; dz=-0.4; 
    var lx=0.4, ly=-0.7, lz=-0.6;
    // dx=1; dy=dz=0;
    // dx=56/97; dy=-56/97; dz=-56/97;
    var sha=1;
    var dp=nx*lx + ny*ly + nz*lz;
    if(dp<0){dp=0;}
    for(i=1; i<10; i++){
        // var ss=0.05*i*i;
        var ss=0.2*i;
        m=df(px + lx*ss, py + ly*ss, pz + lz*ss) - dfv;
        // sha+=0.1*(Math.pow(m/ss, 2) - 1);
        
        m=2*m/ss + 0.5; if(m<0){m=0;} if(m>1){m=1;}
        sha*=m;
        
        // m=(Math.atan(m/ss)/6.2) + 0.5;
        // sha+=Math.atan(m/ss)*10;
    }
    if(dp<0){dp=0;}
    sha*=Math.pow(dp, 0.7);
    
    if(d>8){d=8;}
    m=0;//(1.0 - pow(0.8, d))*0.1;
    m=2*(nx*dx + ny*dy + nz*dz);
    m=(m*nx - dx)*lx + (m*ny - dy)*ly + (m*nz - dz)*lz;
    m*=-1;
    if(m<0){m=0;}
    m=pow(m, 10);
    // m=d/4; m*=m; m*=m;
    if(sha<0){sha=0;}
    if(aoc<0){aoc=0;}
    // aoc=sqrt(aoc)*0.15;
    aoc*=0.3;
    // sha=0;
    // sha*=0.6;
    // sha=0;
    // sha*=1/(px*(py + pz) - py*pz + 1);
    dp=px*lx + py*ly + pz*lz;
    var b=px*px + py*py + pz*pz + dp*dp*(lx*lx + ly*ly + lz*lz - 2);
    b=1/(b*b + 1);
    sha*=b;
    // id=0;
    // if(id<0){sx=px*0.25; sy=py*0.25; sz=pz*0.25;}
    dx=noise(tx, ty, tz); dy=noise(ty, tz, tx); dz=noise(tz, tx, ty);
    var w=noise(tx*13 + dx*29, ty*13 + dy*29, tz*13 + dz*29 + id*12.345);
    // var a=w*3 + id/n*6.2;
    // if(id<0){dep=0;}
    var a=w*3 + /*dep +*/ id/n*6.2 - 1;
    // m=0.5;
    // m*=0.25;
    var clr=[0.75 + 0.25*Math.sin(a),
             0.75 + 0.25*Math.cos(a),
             0.75 - 0.25*Math.sin(a)];
    if(id<0){w=1 - w*w*w; m*=0.5; clr=[0.5, 0.5, 0.5];}
    // w*=w*(3 - 2*w);
    // w*=w*(3 - 2*w);
    // w*=1-dep;
    m*=id<0 ? sha : w*sha;
    // m=0;
    // m*=sha;
    // w=1 - 0.9*w;
    
    // w=1;
    // var q=aoc*0.3 + sha*0.5;
    return [sqrt(clr[0]*(aoc*0.2 + sha*0.8)*w + m*0.8),
            sqrt(clr[1]*(aoc*0.3 + sha*0.7)*w + m*0.7),
            sqrt(clr[2]*(aoc*0.6 + sha*0.4)*w + m*0.4)];
    // m=sha;//*0.5+aoc;
    // m=aoc*2;
    // return [m, m, m];
    // return [sqrt(clr[0]*0.5), sqrt(clr[1]*0.5), sqrt(clr[2]*0.5)];
};

var mii=0, mouseOver=function(){mii=1;}, mouseOut=function(){mii=0;};

draw= function() {
    // var frames=[];
    if(!loadPixels){return;}
    if(!this.imageData || !this.imageData.data){
        background(0); loadPixels(); return;}
    var p=this.imageData.data;
    
    var ms=millis(), mms=25, npd=0;
    // var uw=width*scl|0, uh=height*scl|0;
    // var uw=sizx, uh=sizy|0;
    while(wframe>=0 && sizx<=width && millis() < ms + mms){
        if(wframe>=nframes){
            wframe=rpix=0;
            sizx<<=1; sizy<<=1;
            if(sizx>width){wframe=-1; break;}}
        if(!rpix && wframe<frames.length && frames[wframe].width && !tld){
            // background(0);
            image(frames[wframe], 0, 0);
            loadPixels();
            p=this.imageData.data;
            for(var y=frames[wframe].height - 1; y>=0; y--){
                for(var x=frames[wframe].width - 1; x>=0; x--){
                    var l=x + y*width << 3;
                    for(var i=0; i<16; i+=4){
                        p[l + width*(i>>1&4) + (i&4)  ]=p[l>>1];
                        p[l + width*(i>>1&4) + (i&4)|1]=p[l>>1|1];
                        p[l + width*(i>>1&4) + (i&4)|2]=p[l>>1|2];}}}
            tld=1;
            continue;
        }
        var x=rpix%sizx, y=rpix/sizy|0, l=x + y*width << 2;
        if(tld && !((x|y)&1)){rpix++; continue;}
        var c=pcol(2*x/sizx - 1, 2*y/sizy - 1, wframe/nframes);
        p[l  ]=c[0]*256;
        p[l|1]=c[1]*256;
        p[l|2]=c[2]*256;
        rpix++; npd++;
        if(rpix > sizx*sizy){
            updatePixels();
            var img=get(0, 0, sizx, sizy);
            frames[wframe++]=img;
            rpix=tld=0; break;}
    }
    
    // updatePixels();
    // framei%=frames.length;
    var uf=mii ? ~~(mouseX/width*nframes) : framei;
    if(frames.length > 5 && frames[uf] && frames[uf].width && uf-wframe){
        image(frames[uf], 0, 0, width, height);
    }else{
        updatePixels();
        if(sizx - width|sizy - height){
            var img=get(0, 0, sizx, sizy);
            image(img, 0, 0, width, height);}
    }
    var s=nframes+"/"+wframe+"/"+uf+"\n"+
        ~~(100*rpix/sizx/sizy)+"%\n"+~~(npd/mms)+" kp/s";
    fill(0); text(s, 4, 14);
    fill(255); text(s, 3, 13);
    framei=mii?uf:framei+1; if(framei>=frames.length){framei=0;}
    if(mii){
        noStroke(); fill(255, 0, 0);
        var x=wframe/nframes*width;
        rect(0, height, x, -2);
        fill(0, 255, 0);
        rect(x, height, rpix/sizx/sizy/nframes*width, -2);
        fill(255);
        rect(uf/nframes*width, height - 3, width/nframes, 1);
    }
};
