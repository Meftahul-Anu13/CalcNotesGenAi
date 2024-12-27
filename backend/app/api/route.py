from fastapi import APIRouter
import base64
from io import BytesIO
from PIL import Image
from app.api.utils import analyze_image
from pydantic import BaseModel
from typing import Dict

router = APIRouter()
class ImageData(BaseModel):
    image: str
    dict_of_vars: Dict[str, str]

@router.post('')
async def run(data: ImageData):
    image_data = base64.b64decode(data.image.split(",")[1]) 
    image_bytes = BytesIO(image_data)
    image = Image.open(image_bytes)
    responses = analyze_image(image, dict_of_vars=data.dict_of_vars)
    data = []
    for response in responses:
        data.append(response)
    print('response in route: ', response)
    return {"message": "Image processed", "data": data, "status": "success"}