class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(this.ctx);
                break;
            case 1:
                this.drawSlide1(this.ctx);
                break;
            case 2:
                this.drawSlide2(this.ctx);
                break;
            case 3:
                this.drawSlide3(this.ctx);
                break;
        }
    }

    // ctx:          canvas context
    drawSlide0(ctx) {
        this.drawRectangle({x:100,y:100},{x:175,y:150}, [255,0,0,255],ctx)
    }

    // ctx:          canvas context
    drawSlide1(ctx) {
        this.drawCircle({x: 300, y: 300}, 30, [0,255,255,255],ctx);
    }

    // ctx:          canvas context
    drawSlide2(ctx) {
        this.drawBezierCurve({x: 300, y: 300},
            {x: 300, y: 400},
            {x: 400, y: 400},
            {x: 400, y: 350},
            [0,0,255,255], ctx);     
    }

    // ctx:          canvas context
    drawSlide3(ctx) {
        this.drawN(40, {x: 350, y: 250}, [255,0,0,255], ctx)
        this.drawA(40, {x: 400, y: 250}, [255,0,0,255], ctx)
        this.drawT(40, {x: 450, y: 250}, [255,0,0,255], ctx)
        this.drawH(40, {x: 500, y: 250}, [255,0,0,255], ctx)
        this.drawA(40, {x: 550, y: 250}, [255,0,0,255], ctx)
        this.drawN(40, {x: 600, y: 250}, [255,0,0,255], ctx)

    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawRectangle(left_bottom, right_top, color, ctx) {
        this.drawLine(left_bottom, {x: left_bottom['x'],y: right_top['y']},color,ctx)
        this.drawLine(left_bottom, {x: right_top['x'],y: left_bottom['y']},color,ctx)
        this.drawLine(right_top, {x: right_top['x'],y: left_bottom['y']},color,ctx)
        this.drawLine(right_top, {x: left_bottom['x'],y: right_top['y']},color,ctx)
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawCircle(center, radius, color, ctx) {
        var degreePer = 360 / this.num_curve_sections;
        let lastPt = {x: center['x'] + radius,y: center['y']};
        for(let i = 1; i <= this.num_curve_sections; i++) {
            
            let x = center['x'] + (radius * Math.cos(i * degreePer * (Math.PI / 180)));
            let y = center['y'] + (radius * Math.sin(i * degreePer * (Math.PI / 180)));
           
            let newPt = {x: x, y: y};
            this.drawLine(newPt,lastPt,color,ctx);
            lastPt = newPt;
            if(this.show_points && radius > 5) {
                this.drawCircle(lastPt, 4, color, ctx);
            }
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawBezierCurve(pt0, pt1, pt2, pt3, color, ctx) {
        let lastPt = pt0
        for(let i = 0; i <= this.num_curve_sections; i++) {
            let t = i / this.num_curve_sections;
            let x = (1-t)**3 * pt0['x'] + 3 * (1 - t)**2 * t * pt1['x'] + 3 * ( 1 - t) * t**2 *pt2['x'] + t**3 * pt3['x'];
            let y = (1-t)**3 * pt0['y'] + 3 * (1 - t)**2 * t * pt1['y'] + 3 * ( 1 - t) * t**2 *pt2['y'] + t**3 * pt3['y'];
            let newPt = {x: x, y: y};
            this.drawLine(lastPt, newPt, color, ctx);
            lastPt = newPt;
            if(this.show_points) {
                this.drawCircle(lastPt, 5, color, ctx);
            }
        }

        if(this.show_points) {
            color = [255,0,0,255];
            this.drawLine(pt0,pt1,color,ctx);
            this.drawLine(pt1,pt2,color,ctx);
            this.drawLine(pt2,pt3,color,ctx);

        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawLine(pt0, pt1, color, ctx)
    {
        ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3]/255.0) + ')';
        ctx.beginPath();
        ctx.moveTo(pt0.x, pt0.y);
        ctx.lineTo(pt1.x, pt1.y);
        ctx.stroke();
    }

    drawN(size,center,color,ctx)
    {
        let pt0 = {x: center['x'] - size / 2, y: center['y'] - size / 2};
        let pt1 = {x: pt0['x'], y: pt0['y'] + size};
        let pt2 = {x: pt0['x'] + size, y: pt0['y']}; 
        let pt3 = {x: pt2['x'], y: pt1['y']};
        this.drawLine(pt0, pt1,color, ctx);
        this.drawLine(pt1, pt2,color, ctx);
        this.drawLine(pt2, pt3, color, ctx);


    }
    drawA(size, center,color,ctx)
    {
        //lowercase for circle
        this.drawCircle(center, size / 2, color, ctx);
        let top_right = {x: center['x'] + size / 2, y: center['y'] + size / 2};
        let bottom_right = {x: center['x'] + size / 2, y: center['y'] - size / 2};
        this.drawLine(top_right, bottom_right, color, ctx);
    }
    drawT(size, center,color,ctx)
    {
        let pt0 = {x: center['x'], y: center['y'] - size/2}; 
        let pt1 = {x: center['x'], y: center['y'] + size/2}; 
        let pt2 = {x: center['x'] - size/2, y: center['y'] + size/2}; 
        let pt3 = {x: center['x'] + size/2, y: center['y'] + size/2}; 
        this.drawLine(pt0, pt1, color, ctx)
        this.drawLine(pt2, pt3, color, ctx)

    }
    drawH(size, center,color,ctx)
    {
        //lowercase for curve.
        let pt0 = {x: center['x'] - size/2, y: center['y'] - size/2}; 
        let pt1 = {x: center['x'] - size/2, y: center['y'] + size/2}; 

        this.drawLine(pt0, pt1, color, ctx);

        let pt2 = {x: center['x'] - size / 2, y: center['y']};
        let pt3 = {x: center['x'] + size / 2, y: center['y'] + size / 2};
        let pt4 = {x: center['x'] + size / 2, y: center['y'] - size / 2};
        this.drawBezierCurve(pt0, pt1, pt3, pt4, color, ctx);
    }
};
