export const textToImage = (text, fontClass, ) => {
    let font = fontSetting();

    let canvas = document.createElement("canvas");

    canvas.width = 2500;
    canvas.height = 150;

    let ctx = canvas.getContext("2d");
    ctx.font = '100px'+' '+font[fontClass].family;
    ctx.fillText(text, 10, 90);

    return clearExtraCanvasBackground(canvas, {width:2500, height:150});
}

export const base64ToCanvas = async (image64) => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    return new Promise((resolve, reject) => {
        try{
            var image = new Image();
            image.onload =  () =>  {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                setTimeout(()=>{canvas.remove()},0)
                resolve({
                    canvas, ctx, width:image.width, height:image.height
                })
            }
            image.src = image64
        }catch(err){
            reject(err)
        }
    })
}

export const clearExtraCanvasBackground = (canvas, canvasSize) => { 
    let ctx = canvas.getContext("2d");
    let imgBinary = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);
    
    let x,y
    let position = {
        top: null,
        left: null,
        x: null,
        y: null
    }

    for (let i = 0; i < imgBinary.data.length; i += 4) {
        if(imgBinary.data[i + 3] !== 0){
            x = (i / 4) % canvasSize.width;
            y = ~~((i / 4) / canvasSize.width);

            if (position.top === null || y < position.top) {
                position.top = y
            }
            if (position.left === null || x < position.left) {
                position.left = x
            }
            if (position.y === null || y > position.y) {
                position.y = y
            }
            if (position.x === null || x > position.x) {
                position.x = x
            }
        }
    }
    position.y = position.y + 2
    let resizedCanvas = document.createElement("canvas");
    let resizedContext = resizedCanvas.getContext("2d");

    let width = position.x-position.left;
    let height = position.y-position.top;

    let canvasWidth = position.x-position.left;
    let canvasHeight = position.y-position.top;

    let halfExtraHeight = 0

    let minHeight = 0;
    if(height < minHeight){
        let extraHeight = minHeight - height;
        halfExtraHeight = extraHeight/2;

        canvasHeight = canvasHeight + extraHeight;
    }

    resizedCanvas.width = canvasWidth;
    resizedCanvas.height = canvasHeight;

    resizedContext.drawImage(canvas, position.left, position.top, width, height, 0, halfExtraHeight, width, height);
    resizedCanvas.remove()
    return resizedCanvas.toDataURL()
    
}