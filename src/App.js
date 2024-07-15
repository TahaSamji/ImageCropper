import ReactCrop from 'react-image-crop'
import { useEffect, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css'

function App() {
  const [crop, setCrop] = useState({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50
  })
  const [completedCrop, setCompletedCrop] = useState(null);
  const [image, setImage] = useState();
  const canvasRef = useRef(null);



  useEffect(() => {
    console.log(crop)
  }, [crop]);

  const handleComplete = function () {

  }

  function downloadImage() {
    if (!completedCrop || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'CroppedImage.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function handleChange(e) {

    setImage(URL.createObjectURL(e.target.files[0]))

  }
  const ShowCrop = function () {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const img = new Image(500, 500);
    img.src = image;
    const pixelRatio = window.devicePixelRatio;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    img.onload = () => {
      ctx.drawImage(
        img,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height);
    };
    const dataURL = canvas.toDataURL('image/png');
    setCompletedCrop(dataURL);
  }



  return (

    <div className="App" style={{ marginLeft: 5 }}>
      <h1>Image Cropper</h1>
      Choose Image to Crop :
      <input type='file' onChange={handleChange} style={{ marginBottom: 10 }} ></input>
      <div style={{ display: 'flex', flexDirection: 'row' }}>

        <div style={{ marginRight: 20 }}>

          <ReactCrop onComplete={handleComplete} crop={crop} onChange={c => setCrop(c)} >
            {image && <img src={image} style={{ height: "500px", width: '500px' }} />}
          </ReactCrop>
        </div>

        <div style={{ marginLeft: '5' }}>
          <canvas ref={canvasRef} height={'100%'} width={'100%'} ></canvas>

        </div>

      </div>
      {image && <button onClick={downloadImage}>Download Image</button>}
      {image && <button style={{ marginLeft: 5 }} onClick={ShowCrop}>Crop</button>}
    </div>

  );
}

export default App;
