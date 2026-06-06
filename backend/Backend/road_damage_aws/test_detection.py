import asyncio
import io
from PIL import Image
import numpy as np
from fastapi import UploadFile
from services.ai_service import analyze_image_with_ai, analyze_frame_with_ai, model

# Create a valid in-memory dummy image for testing
def create_dummy_image():
    # 640x480 RGB image, white color
    img = Image.new("RGB", (640, 480), color="white")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf

async def main():
    print("YOLO Model loaded successfully:", model is not None)
    if model:
        print("Model classes names:", model.names)

    # Test 1: Image analysis with simulated UploadFile
    print("\n--- Test 1: Image Analysis ---")
    img_buf = create_dummy_image()
    from starlette.datastructures import Headers
    headers = Headers({"content-type": "image/jpeg"})
    upload_file = UploadFile(filename="test.jpg", file=img_buf, headers=headers)
    
    res = await analyze_image_with_ai(upload_file)
    print("Image Analysis Result:")
    import pprint
    pprint.pprint(res)
    
    # Test 2: Frame analysis with numpy array frame (OpenCV format)
    print("\n--- Test 2: Frame Analysis (Numpy Array) ---")
    fake_frame = np.zeros((480, 640, 3), dtype=np.uint8)
    frame_res = analyze_frame_with_ai(fake_frame)
    print("Frame Analysis Result:")
    pprint.pprint(frame_res)

    print("\nDetection tests completed!")

if __name__ == "__main__":
    asyncio.run(main())
