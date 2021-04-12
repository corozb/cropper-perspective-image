import { useState, useRef, useCallback } from 'react'
import { Upload } from 'antd'
import Cropper from 'react-perspective-cropper'

const { Dragger } = Upload

const App = () => {
  const [cropState, setCropState] = useState()
  const [imageCropped, setImageCropped] = useState()
  const [image1, setImage1] = useState()
  const [image2, setImage2] = useState()
  const cropperRef = useRef()
  const canvasRef = useRef()

  console.log(image1)

  const onDragStop = useCallback((s) => setCropState(s), [])
  const onChange = useCallback((s) => setCropState(s), [])

  const saveImage = async () => {
    try {
      console.log(cropperRef.current.done)
      const res = await cropperRef.current.done({
        preview: true,
        filterCvParams: {
          thMeanCorrection: 9,
          thMode: window.cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        },
      })
      return res
    } catch (e) {
      console.log('error', e)
    }
  }

  const takePictureAgain = () => cropperRef.current.backToCrop()
  const onImgSelection = (e) => {
    if (e.fileList && e.fileList.length > 0) {
      const fileList = e.fileList[0].originFileObj
      setImageCropped(fileList)
    }
  }

  const draggerProps = {
    name: 'file',
    multiple: false,
    onChange: onImgSelection,
  }

  const resetImage = () => {
    setImageCropped(undefined)
    setCropState()
  }

  const getImage = (setter) => {
    const canvas = canvasRef.current.children[0].children[0]
    const dataURI = canvas.toDataURL()
    setter(dataURI)
    resetImage()
  }

  return (
    <>
      <h1>Cropper</h1>
      <div>
        <div className='container' ref={canvasRef}>
          <Cropper
            openCvPath='./opencv/opencv.js'
            ref={cropperRef}
            image={imageCropped}
            onChange={onChange}
            onDragStop={onDragStop}
            maxWidth={window.innerWidth - 30}
          />
        </div>
        {cropState?.loading && <h1>Loading...</h1>}
        {!imageCropped && (
          <Dragger {...draggerProps}>
            <p>+</p>
          </Dragger>
        )}
        {cropState && (
          <>
            <button onClick={saveImage}>Guardar</button>
            <button onClick={takePictureAgain}>Editar</button>
            <button onClick={resetImage}>Tomar foto de nuevo</button>
            <button onClick={() => getImage(setImage1)}>Imagen</button>
            <button onClick={() => getImage(setImage2)}>Imagen</button>
          </>
        )}
        {image1 && <img src={image1} alt='imagen' />}
        {image2 && <img src={image2} alt='imagen' />}
      </div>
    </>
  )
}

export default App
