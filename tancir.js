angleMode='radiandys';
// var ox=8, oy=8, scl=0.04;
var scl=0.012, ox=width/2*scl, oy=height/2*scl;
// var t0=0, t1=TWO_PI, tstep=(t1 - t0)/1000; 
var t0=-PI, t1=PI, tstep=(t1 - t0)/1000; 

var f=function(x){return [sin(x) + 3/4*sin(x*4),
                          cos(x) - 3/4*cos(x*4)];};
var df=function(x){return [cos(x) + 3*cos(4*x),
                          -sin(x) + 3*sin(4*x)];};
var ddf=function(x){return [-sin(x) - 12*sin(4*x),
                            -cos(x) + 12*cos(4*x)];};

// var f=function(x){return [x, sin(x)];};
// var df=function(x){return [1, cos(x)];};
// var ddf=function(x){return [0, -sin(x)];};

// var f=function(x){return [2*cos(x), sin(x)];};
// var df=function(x){return [-2*sin(x), cos(x)];};
// var ddf=function(x){return [-2*cos(x), -sin(x)];};

// var f=function(x){return [2*cos(x), sin(2*x)];};
// var df=function(x){return [-2*sin(x), 2*cos(2*x)];};
// var ddf=function(x){return [-2*cos(x), -4*sin(2*x)];};

// var f=function(x){return [cos(x)*(sin(2*x) + 2),
//                           sin(x)*(sin(2*x) + 2)];};
// var df=function(x){return [-sin(x)*(sin(2*x) + 2) + 2*cos(x)*cos(2*x),
//                             cos(x)*(sin(2*x) + 2) + 2*sin(x)*cos(2*x)];};
// var ddf=function(x){
//     return [-4*sin(x)*cos(2*x) - cos(x)*(5*sin(2*x) + 2),
//              4*cos(x)*cos(2*x) - sin(x)*(5*sin(2*x) + 2)];};

// var f=function(x){return [x, x*x/4];};
// var df=function(x){return [1, x/2];};
// var ddf=function(x){return [0, 1/2];};


// var f=function(x){return [cos(x)*(sin(x*3) + 3),
//                           sin(x)*(sin(x*3) + 3)];};
// var df=function(x){return [-sin(x)*(sin(x*3) + 3) + cos(x)*3*cos(3*x),
//                             cos(x)*(sin(x*3) + 3) + sin(x)*3*cos(3*x)];};
// var ddf=function(x){return [
//     -cos(x)*(sin(x*3) + 3) - 6*sin(x)*cos(3*x) - cos(x)*9*sin(3*x),
//     -sin(x)*(sin(x*3) + 3) + 6*cos(x)*cos(3*x) - sin(x)*9*sin(3*x)];};

var g=function(x){
    var v=f(x), dv=df(x), ddv=ddf(x),
    // k=(dv[0]*ddv[1] - dv[1]*ddv[0])/(ddv[0]*ddv[0] + ddv[1]*ddv[1]);
    // return [v[0] - dv[1]*k, v[1] + dv[0]*k];
        k=(dv[0]*dv[0] + dv[1]*dv[1])/(dv[0]*ddv[1] - dv[1]*ddv[0]);
    return [v[0] - dv[1]*k, v[1] + dv[0]*k];
};

var newt=function(arg, p){
    var v=f(arg), dv=df(arg), ddv=ddf(arg),
        d=[v[0] - p[0], v[1] - p[1]];
    return arg - (dv[0]*d[0] + dv[1]*d[1])/(ddv[0]*d[0] + ddv[1]*d[1] + dv[0]*dv[0] + dv[1]*dv[1]);
};

var graph=function(fun, t0, t1, tstep){
    beginShape();
    for(var t=t0 - tstep; t<t1; t+=tstep){
        var v=fun(t);
        vertex((v[0] + ox)/scl, (v[1] + oy)/scl);
    }
    endShape();
}, gimg=0, dif=[];

var lyne=function(){
    beginShape();
    for(var i=0; i<arguments.length; i+=2){
        vertex(arguments[i], arguments[i + 1]);}
    endShape();
};

mouseClicked=function(){
    gimg=0;
};

draw=function(){
    // scl=pow(0.98, mouseY);
    var mx=mouseX*scl - ox, my=mouseY*scl - oy;
    
    for(var i=0, t=[f, df, ddf, scl, ox, oy]; i<t.length; i++){
        if(t[i]!==dif[i]){dif=t; gimg=0;}}
    
    if(!gimg){
        background(0); noFill();
        stroke(50); strokeWeight(3);
        graph(f, t0, t1, tstep);
        stroke(110); strokeWeight(1);
        endShape();
        // stroke(0); strokeWeight(1);
        stroke(242, 128, 227); strokeWeight(1.3);
        graph(g, t0, t1, tstep);
        gimg=get(0,0, width,height);
    }
    image(gimg, 0,0);
    
    var t=t0 + 1e-4*millis()%(t1 - t0);//%TWO_PI;
    // t=t0 + (t1 - t0)*mouseX/width;
    var v=f(t);
    stroke(255); strokeWeight(1);
    ellipse((v[0] + ox)/scl, (v[1] + oy)/scl, 5, 5);
    
    var dv=df(t);
    stroke(255, 0, 0);
    lyne((v[0] + ox)/scl, (v[1] + oy)/scl,
         (v[0] + dv[0] + ox)/scl, (v[1] + dv[1] + oy)/scl);
    
    var ddv=ddf(t);
    stroke(247, 181, 67);
    lyne((v[0] + ox)/scl, (v[1] + oy)/scl,
         (v[0] + ddv[0] + ox)/scl, (v[1] + ddv[1] + oy)/scl);
    
    // var r=(dv[0]*dv[0] + dv[1]*dv[1])/(dv[1]*ddv[0] - dv[0]*ddv[1]);
    // var cx=v[0] + dv[1]*r, cy=v[1] - dv[0]*r;
    // beginShape();
    // vertex((v[0] + ox)/scl, (v[1] + oy)/scl, 5, 5);
    // vertex((cx + ox)/scl, (cy + oy)/scl, 5, 5);
    // endShape();
    // var s=abs(sqrt(dv[0]*dv[0] + dv[1]*dv[1])*r);
    
    stroke(110, 230, 146);
    // var b=0.5*(ddv[0]*ddv[0] + ddv[1]*ddv[1])/(dv[0]*ddv[1] - dv[1]*ddv[0]);
    // graph(function(x){return [v[0] + x*(dv[0] - b*x*dv[1]),
    //                           v[1] + x*(dv[1] + b*x*dv[0])];}, -2, 2, 0.02);
    
    
    
    stroke(255);
    var gv=g(t), cx=gv[0], cy=gv[1];
    var s=sqrt((v[0] - gv[0])*(v[0] - gv[0]) +
               (v[1] - gv[1])*(v[1] - gv[1]));
    ellipse((cx + ox)/scl, (cy + oy)/scl, 2*s/scl, 2*s/scl);
    ellipse((cx + ox)/scl, (cy + oy)/scl, 5, 5);
    
    // beginShape();
    var av, adv;
    stroke(0, 128, 255, 60);
    for(var i=0; i<7; i++){
        av=f(t);
        adv=df(t);
        var m=sqrt(((av[0] - mx)*(av[0] - mx) + (av[1] - my)*(av[1] - my))/(adv[0]*adv[0] + adv[1]*adv[1]));
        // ellipse((av[0] + ox)/scl, (av[1] + oy)/scl, 5, 5);
        // vertex((av[0] + ox)/scl, (av[1] + oy)/scl);
        lyne((av[0] - adv[1]*m + ox)/scl, (av[1] + adv[0]*m + oy)/scl,
             (av[0] + adv[1]*m + ox)/scl, (av[1] - adv[0]*m + oy)/scl);
        t=newt(t, [mx, my]);
    }
    // endShape();
    stroke(0, 128, 255);
    ellipse((av[0] + ox)/scl, (av[1] + oy)/scl, 9, 9);
};
