var model;
async function loadModel() {
    model = await tf.loadGraphModel("TFJS/model.json");
}

function predictImage() {

    // Read the image as array
    let image = cv.imread(canvas);

    // Convert to Black and white
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY);

    // Increase contrast by threshold
    cv.threshold(image, image, 150, 255, cv.THRESH_BINARY)

    // Find Contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    // You can try more different parameters
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let cnt = contours.get(0);
    // You can try more different parameters
    let rect = cv.boundingRect(cnt);
    image = image.roi(rect);

    // Resize image
    var height = image.rows;
    var width = image.cols;

    if(height > width) {
        height = 20;
        const scaleFactor = image.rows / height;
        width = Math.round(image.cols/scaleFactor);
    } else {
        width = 20;
        const scaleFactor = image.cols / width;
        height = Math.round(image.rows/scaleFactor);
    }
    let dsize = new cv.Size(width, height);
    // You can try more different parameters
    cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);

    const LEFT = Math.ceil(4 + (20 - width) / 2);
    const RIGHT = Math.floor(4 + (20 - width)/ 2);
    const TOP = Math.ceil(4 + (20 - height) / 2);
    const BOTTOM = Math.floor(4 + (20 - height) / 2);

    // You can try more different parameters
    let s = new cv.Scalar(0, 0, 0, 0);
    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, s);

    // Find center of mass
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    let Moments = cv.moments(cnt, false);
    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m01 / Moments.m00;

    // Shift the object
    const X_SHIFT = Math.round(image.cols/2.0 - cx);
    const Y_SHIFT = Math.round(image.rows/2.0 - cy);

    let newSize = new cv.Size(image.cols, image.rows);
    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    // Normalize the data
    let pixelValues = image.data;
    pixelValues = Float32Array.from(pixelValues)
    pixelValues = pixelValues.map(function(pv) {
        return pv / 255.0;
    })
    
    const tensor = tf.tensor([
        pixelValues
    ])

    res = model.predict(tensor).dataSync();

    // cleanup
    hierarchy.delete(); 
    contours.delete(); 
    M.delete(); 
    image.delete(); 
    cnt.delete(); 
    //res.dispose(); 
    tensor.dispose();

    return res;
}