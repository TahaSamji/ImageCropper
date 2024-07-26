import ReactCrop from 'react-image-crop';
import { useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';

function App() {
  const [crop, setCrop] = useState({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });

  const [completedCrop, setCompletedCrop] = useState(null);
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [showingimage,setShowingImage] = useState(false);

  

  const handleComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const downloadImage = () => {
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
  };

  const handleChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setShowingImage(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
  };

  const ShowCrop = function () {
    if (!completedCrop || !canvasRef.current || !imgRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    img.onload = () => {
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      const pixelRatio = window.devicePixelRatio;

      canvas.width = crop.width * scaleX * pixelRatio;
      canvas.height = crop.height * scaleY * pixelRatio;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        img,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      const dataURL = canvas.toDataURL('image/png');
      setCompletedCrop(dataURL);
      setShowingImage(false);
    };

    img.src = image;
  };

  return (
    <div className="App" style={{marginLeft: 5}}>
      <h1>Image Cropper</h1>
      <h2> Choose Image to Crop :</h2>
      <input type="file" onChange={handleChange} style={{ marginBottom: 10 }} />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ marginRight: 20 }}>
          {showingimage && <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={handleComplete}
          >
           <img ref={imgRef} src={image} alt="Source" />
          </ReactCrop>}
        </div>
        <div style={{ marginLeft: 5 }}>
          <canvas ref={canvasRef}  />
        </div>
      </div>
      {image && <button onClick={downloadImage}>Download Image</button>}
      {(image || completedCrop )&&<button style={{ marginLeft: 5 }} onClick={ShowCrop}>Crop</button>}
    </div>
  );
}

export default App;
