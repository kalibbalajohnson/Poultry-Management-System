from fastapi import FastAPI

app = FastAPI()

@app.get("/predict")
def read_root():
    return {"message": "This is the prediction endpoint."}
