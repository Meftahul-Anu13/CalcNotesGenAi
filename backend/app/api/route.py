import json
from fastapi import APIRouter
import base64
from io import BytesIO
from PIL import Image
from app.api.utils import analyze_image,query_wolframalpha, query_wolframalpha_async
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
    
    print('response in route: ', responses)
    print(len(data))
    
    if  len(data)> 1 :
        response = json.loads(responses)
        query = response[0]['expr']
        print(query) 
        wolfram_result =  await query_wolframalpha_async(query)
        print('WolframAlpha result:', wolfram_result)
        return {"message": "Image processed", "data": [{"expr": query, "result": wolfram_result}], "status": "success"}
    else:
        print("data" ,data)
        return {"message": "Image processed", "data":data , "status": "success"}