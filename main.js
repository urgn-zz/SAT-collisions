var canvas = document.getElementById("scene"),
    ctx = canvas.getContext("2d"),
    w = window.innerWidth,
    h = window.innerHeight,
    isDown = false,
    list = {
        triangle: new Shape([[30,0],[60,60],[0,60]], 50, 50),
        rhombus: new Shape([[50, 0], [100,50], [50, 100], [0, 50]], 200, 50)
    },
    render = function() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,w,h);
        for (var shape in list) {
            if (list.hasOwnProperty(shape)) {
                list[shape].draw(ctx);
            }
        }
        requestAnimationFrame(render);
    };

canvas.addEventListener("mousedown", function(e) {
    isDown = true;
    checkFigures({x: e.clientX, y: e.clientY});
});

canvas.addEventListener("mouseup", function() {
    isDown = false;
    for (var figure in list) {
        list[figure].moving = false;
    }
});

canvas.addEventListener("mousemove", function(e) {
    var fig;
    if (isDown) {
        for (var figure in list) {
            fig = list[figure];
            if (fig.moving) {
                fig.move(e.clientX - fig.delta.x, e.clientY - fig.delta.y);
                if (list.triangle.checkCollision(list.rhombus)) {
                    list.triangle.stroke = 'red';
                    list.rhombus.stroke = 'red';
                } else {
                    list.triangle.stroke = 'black';
                    list.rhombus.stroke = 'black';
                }

            }
        }
    }
});

function checkFigures (mp) {
    for (var fig in list) {
        if (isPointInPoly(list[fig].points, {x: mp.x - list[fig].x, y: mp.y - list[fig].y})) {
            list[fig].moving = true;
            list[fig].delta = {
                x: mp.x - list[fig].x,
                y: mp.y - list[fig].y
            };
        }
    }
}

function isPointInPoly(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}

canvas.width = w;
canvas.height = h;

requestAnimationFrame(render);