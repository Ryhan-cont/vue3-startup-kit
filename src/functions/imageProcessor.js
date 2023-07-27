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

export const  generateMarker = async (sourceType = 'text', signType = null, data, hash = '') => {
    let value = '';
    let title = '';
    let btmId = '';
    let font = fontSetting();
    let minWidth = 400;

    if (sourceType == 'text') {
        if(signType == "signature") {
            value = {text:data.text, font:font[data.class]};
            title = 'NCC eSigned by';
            btmId = hash.slice(0,20).toUpperCase()+"..."
        }else if(signType == "initial") {
            value = {text:data.text, font:font[data.class]};
            title = 'ES';
            btmId = '';
            minWidth = 85;
        }
        var output = await generateSignImage('text', value, title, btmId, minWidth);
    }else{
        if(signType == 'signature') {
            value = data;
            title = 'NCC eSigned by';
            btmId = hash.slice(0,20).toUpperCase()+"...";
        }else if(signType == 'initial'){
            value = data;
            title = 'ES';
            btmId = '';
            minWidth = 85;
        }
        var output = await generateSignImage('img', value, title, btmId, minWidth);
    }

    return clearExtraCanvasBackground(output, {width:output.width, height:output.height})
}

const generateSignImage = async (type, value, upperText, lowerText, minWidth) => {
    let markWidth = 90;
    let markRadious = 40;
    let markSpacingY = 12;
    let markSpacingX = 5;

    let imgHeight = 130;
    let imgWidth = 80;

    let boxHeight = 200;

    let imgSize;

    //Load canvas
    var canvas = document.createElement("canvas");
    //Get Calcilate size
    if(type == 'img'){
        let calcImgSize =  new Promise((resolve, reject) => {
            if(!value){reject('No image is provided to calculate size')}
            let img = new Image(); 
            img.onload = () => {resolve({width:img.width, height:img.height})};
            img.src = value; 
        });
        imgSize = await calcImgSize;
        imgWidth = (imgSize.width/imgSize.height)*imgHeight;
        if(minWidth > imgWidth){
            canvas.width = minWidth;
        }else{
            canvas.width = imgWidth + 65;
        }
    }else{
        let fontSizeEL = document.createElement('div');
        fontSizeEL.innerText = value.text;
        fontSizeEL.style.fontSize = '1px';
        fontSizeEL.style.fontFamily = value.font.family;
        fontSizeEL.id = 'textSizeCalculator';
        fontSizeEL.style.display = 'inline-block';
        document.body.append(fontSizeEL);

        let calculatedFontSize = fontSizeEL.offsetWidth*value.font.size.replace("px", "");

        if(minWidth > calculatedFontSize){
            canvas.width = minWidth;
        }else{
            canvas.width = calculatedFontSize + 75;
        }
        fontSizeEL.remove()
    }

    //End Get Calcilate size
    canvas.height = boxHeight;
    let ctx = canvas.getContext("2d")

    ctx.lineWidth = 8; 
    ctx.beginPath();
    ctx.moveTo(markWidth,(boxHeight-markSpacingY));
    ctx.arcTo(markSpacingX,(boxHeight-markSpacingY),markSpacingX,markSpacingY,markRadious);
    ctx.arcTo(markSpacingX,markSpacingY,markWidth,markSpacingY,markRadious);
    ctx.lineTo(markWidth, markSpacingY);
    ctx.stroke();
    
    ctx.font = 'bold 28px Roboto, sans-serif';
    ctx.fillText(upperText, (markWidth+5), (markSpacingY+9));
    ctx.font = 'bold 26px Roboto, sans-serif';
    ctx.fillText(lowerText, (markWidth+5), (boxHeight-(markSpacingY-8)));

    let load =  new Promise((resolve, reject) => {
      if(type == 'img'){
        let tempImage = new Image();
        tempImage.src = value;
        tempImage.onload = async  () => {
          ctx.drawImage(tempImage, 0, 0, imgSize.width, imgSize.height, (markSpacingX + 25), (markSpacingY + 23), imgWidth, imgHeight);
          resolve(canvas);
        }
      }else{
        ctx.font = value.font.size+' '+value.font.family;
        ctx.fillText(value.text, (markSpacingY+25), (boxHeight-value.font.adjY));
        resolve(canvas);
      }
    })

    let result = await load;
    return result
}

const fontSetting = () => {
    return {
        'font-great-vibes':{size:'108px',family:'Great Vibes, cursive', adjY:65},
        'font-parisienne':{size:'105px',family:'Parisienne, cursive', adjY:72},
        'font-sacramento':{size:'110px',family:'Sacramento, cursive', adjY:72},
        'font-delafield':{size:'110px',family:'Mrs Saint Delafield, cursive', adjY:70},
        'font-montez':{size:'115px',family:'Montez, cursive', adjY:72},
        'font-satisfy':{size:'110px',family:'Satisfy, cursive', adjY:72},
        'font-ubuntu':{size:'115px',family:'Ubuntu, cursive', adjY:65},
        'font-petit-formal':{size:'105px',family:'Petit Formal Script, cursive', adjY:68},
        'font-grand-hotel':{size:'75px',family:'Meddon, cursive', adjY:73},
        'font-caveat':{size:'135px',family:'Caveat, cursive', adjY:62},
    }
}

export const loadFont = () => {
    let linkArr = [
        {
            name:'font-great-vibe',
            url:'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',            
        },
        {
            name:'font-parisienne',
            url:'https://fonts.googleapis.com/css2?family=Parisienne&display=swap',            
        },
        {
            name:'font-delafield',
            url:'https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap',            
        },
        {
            name:'font-montez',
            url:'https://fonts.googleapis.com/css2?family=Montez&display=swap',            
        },
        {
            name:'font-caveat',
            url:'https://fonts.googleapis.com/css2?family=Caveat&display=swap',            
        },
        {
            name:'font-satisfy',
            url:'https://fonts.googleapis.com/css2?family=Satisfy&display=swap',            
        },
        {
            name:'font-petit',
            url:'https://fonts.googleapis.com/css2?family=Petit+Formal+Script&display=swap',            
        },
        {
            name:'font-meddon',
            url:'https://fonts.googleapis.com/css2?family=Meddon&display=swap',            
        },
        {
            name:'font-ubuntu',
            url:'https://fonts.googleapis.com/css2?family=Ubuntu&display=swap',            
        },
        {
            name:'font-sacramento',
            url:'https://fonts.googleapis.com/css2?family=Sacramento&display=swap',            
        },
    ];
    for(let item of linkArr)
    if(!document.getElementById(item.name)) {
        let link  = document.createElement('link');
        link.id = item.name;
        link.href = item.url;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
}