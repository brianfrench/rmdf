var df=function(x, y){
    var c=[ [100, 100, 50],
            [250, 120, 110],
            [250, 360, 20],
            [50, 340, 10],
            [200, 220, -80],
            [220, 220, 50]], m0=1e6;
    for(var i=0; i<c.length; i++){
        var cx=x - c[i][0], cy=y - c[i][1], r=c[i][2];
        // var m=this.sqrt(cx*cx + cy*cy) - c[i][2];
        var m=this.sqrt(cx*cx + cy*cy);
        if(r>0){
            m=m - r;
            if(m<m0){m0=m;}
        }else{
            m=-r -m;
            if(m>m0){m0=m;}
        }
        // m*=(i&1)?1:-1;
    }
    return m0;//this.sqrt((x - 200)*(x - 200) + (y - 120)*(y - 120)) - 80;
};

var ren=function(s, w, n, p){
    var x=s%w, y=s/w|0, l=x + y*w << 2;
    for(var i=0; i<n; i++, l+=4){
        var d=df(x, y)/10, j=round(d), m=d - j;
        m=pow(4*(0.25 - m*m), 30);//*((j&3)?1:2);
        // m=j&1;
        p[l]=p[l+1]=p[l+2]=((d>0?1:0.8) - m*(j===0?1:0.1))*256;
        x++; if(x>=w){x=0; y++;}
    }
};

var pdone=0, ppu=1, nrd=1, ldf;
var vwr={x:100, y:300, vx:0.6, vy:-0.8};

mouseClicked=function(){if(mouseX+mouseY<100){pdone=ppu=0;}};
mouseMoved=function(){
    var x=mouseX - vwr.x, y=mouseY - vwr.y, m=pow(x*x + y*y, -0.5);
    vwr.vx=x*m;
    vwr.vy=y*m;
    nrd=1;};
mouseDragged=function(){
    vwr.x+=mouseX - pmouseX;
    vwr.y+=mouseY - pmouseY;
    nrd=1;};

draw= function() {
    if(!loadPixels){return;}
    if(!this.imageData||!this.imageData.data||0){
        background(0xff996699); loadPixels();}
    if(!this.imageData||!this.imageData.data){return;}
    
    if(ldf!==df){ldf=df; pdone=ppu=0;}
    
    if(pdone < width*height){
        var ms=millis();
        if(pdone + ppu > width*height){
            ppu=width*height - pdone;}
        ren(pdone, width, ppu, this.imageData.data);
        pdone+=ppu;
        ms=millis() - ms;
        ppu=(ppu + 1)*constrain(50/ms, 0.5, 4)|0;
        nrd=1;
    }
    
    if(!nrd){return;}
    
    updatePixels();
    noFill();noStroke();
    var x=vwr.x, y=vwr.y;
    for(var i=0; i<15; i++){
        var r=df(x, y);
        if(r>1e3 || r<1e-1){break;}
        fill(0x18773333);
        ellipse(x, y, 2*r, 2*r);
        fill(0x44000000);
        ellipse(x, y, 3, 3);
        x+=vwr.vx*r;
        y+=vwr.vy*r;
    }
    strokeWeight(1.2);
    stroke(0x44000000);
    
    beginShape();
    vertex(vwr.x, vwr.y);
    vertex(x, y);
    endShape();
    
    beginShape();
    for(var i=0; i<3; i++){
        vertex( vwr.x + vwr.vx*(i&1)*20 + vwr.vy*(i-1)*5,
                vwr.y + vwr.vy*(i&1)*20 - vwr.vx*(i-1)*5);
    }
    endShape(CLOSE);
    nrd=0;
};

frameRate(25);
