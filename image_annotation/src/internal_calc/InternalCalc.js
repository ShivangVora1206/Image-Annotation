// module.exports;
export function ratioNM(n, m) {
    return m/n;
}
// console.log(ratioNM(3456, 4608));

export function identifyContainLimit(imageWidth, imageHeight, containerWidth, containerHeight) {
    let ratioWidthToHeight = ratioNM(imageWidth, imageHeight);
    let ratioHeightToWidth = ratioNM(imageHeight, imageWidth);
    if(containerWidth * ratioWidthToHeight <= containerHeight) {
        //"height less than canvas"
        return [containerWidth, containerWidth * ratioWidthToHeight];
    }
    else if (containerHeight * ratioHeightToWidth <= containerWidth) {
        //"width less than canvas"
        return [containerHeight * ratioHeightToWidth, containerHeight];
    }
    return [-1, -1]
    
}

export function imageAreaOnCanvas(imageWidth, imageHeight, containerWidth, containerHeight) {
    let [width, height] = identifyContainLimit(imageWidth, imageHeight, containerWidth, containerHeight);
    return width * height;
}

console.log(identifyContainLimit(4608, 3456, 950, 550));
console.log(identifyContainLimit(1920, 1080, 950, 550));