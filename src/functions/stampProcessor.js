import {clearExtraCanvasBackground} from './imageProcessor'

export const circleStamp = async (fullName) => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");


    let load =  new Promise((resolve, reject) => {
          let tempImage = new Image();
          tempImage.src = canvas.toDataURL();
          tempImage.onload = async  () => {
            resolve(canvas.toDataURL());
          }
    })
    return await load;
}

export const squireStamp = async (fullName) => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = 302;
    canvas.height = 302;

    ctx.strokeStyle = "#D23934";
    ctx.beginPath();
    ctx.lineWidth = 4;
    drawBox(ctx, 1, 1, 300, 300, 20)
    ctx.stroke();

    ctx.strokeStyle = "#D23934";
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    drawBox(ctx, 15, 15, 270, 270, 0)
    ctx.stroke();

    let dataUrl = textIntoLines.generate(ctx, capitalizeWords(fullName), 280, 250);


    let stamp = new Promise((resolve, reject) => {
        const img = new Image();
        img.src = dataUrl;
        
        img.addEventListener('load', function() {
          const dimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight
          };

          let adjHeight = 220;
          let adjWidth = (dimensions.width/dimensions.height)*adjHeight;
          
          if(adjWidth > adjHeight){
            adjWidth = adjHeight;
            adjHeight = (dimensions.height/dimensions.width)*adjWidth;
          }

          ctx.drawImage(img, (canvas.width-adjWidth)/2, (canvas.height-adjHeight)/2, adjWidth, adjHeight);
          let placedTextImage = canvas.toDataURL();

          resolve(placedTextImage);
        });
        
        img.addEventListener('error', function() {
          reject(new Error('Failed to load image'));
        });
    });

    let finalImg = await stamp

    return await finalImg;
}
 


//HELPER Function

const drawBox = (ctx, startX, startY, width, height, radius) => {
    let halfX = startX + (width/2);
    let halfY = startY + (height/2);
    let completeX = startX + width;
    let completeY = startY + height;

    ctx.moveTo(startX, halfY);
    ctx.arcTo(startX, completeY,  halfX, completeY, radius);
    ctx.lineTo(halfX, completeY);
    ctx.arcTo(completeX, completeY, completeX, halfY, radius);
    ctx.lineTo(completeX, halfY);
    ctx.arcTo(completeX, startY, halfX, startY, radius);
    ctx.lineTo(halfX, startY);
    ctx.arcTo(startX, startY, startX, halfY, radius);
    ctx.lineTo(startX, halfY);
}

const capitalizeWords = (str) => {
    if(typeof str != 'string'){return}
    return str.replace(/\b\w/g, function(match) {
      return match.toUpperCase();
    });
}

const textIntoLines = {
    fontSize: 150,

    generate: function(ctx, text, maxWidth, maxHeight){
        let lines = [];
        let currentLine = text[0];

        ctx.font = this.fontSize+"px Arial";
        for(let i = 1; i < text.length; i++) {
            let char = text[i];
            let width = ctx.measureText(currentLine + '' + char).width;

            if(width <= maxWidth){
                currentLine += '' + char;
            }else{
                lines.push(currentLine);
                currentLine = char;
            }
        }

        lines.push(currentLine);

        if(maxHeight < (this.fontSize)*lines.length){
            this.fontSize--
            return this.generate(ctx, text, maxWidth, maxHeight);
        }else if(maxHeight - this.fontSize*lines.length > 50){
            maxWidth = maxWidth - 20
            this.fontSize = this.fontSize + 20;
            return this.generate(ctx, text, maxWidth, maxHeight);
        }

        let lineArr = [];
        let extra = text.length % lines.length;
        let partSize = (text.length-extra) / lines.length;
        let adj = 0;
        let end = partSize;
        let start = 0;
        for(let i = 0; lines.length > i; i++){
            end = end + adj;
           
            if(extra !== 0){end++}

            if(text[end-1] == ' '){end = end -1; adj = 1}
            else if(text[end-2] == ' '){end = end -2; adj = 2}
            else if(text[end+1] == ' '){end = end +1; adj = -1}
            else if(text[end+2] == ' '){end = end +2; adj = -2}
            else{adj = 0}

            if(lines.length == (i+1)){
                lineArr.push(text.substring(start));
            }else{
                lineArr.push(text.substring(start, end));
            }
            
            start=end;
            end = end + partSize;
            if(extra !== 0){extra--}
        }


        let canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        let fontCtx = canvas.getContext("2d");
        let lineGap = this.fontSize
        for(let item of lineArr){
            fontCtx.fillStyle = "#D23934";
            fontCtx.font = this.fontSize+"px Arial";
            fontCtx.fillText(item.replace(/\s/g, ""), 20, lineGap);   
            lineGap = lineGap + this.fontSize
        }
        let dataUrl = clearExtraCanvasBackground(canvas, {width:600 ,height:600})

        return dataUrl;             
    }
  }
