from fastapi import FastAPI

from core.routers import user

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "hello world!"}


app.include_router(user.router)
