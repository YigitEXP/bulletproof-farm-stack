from fastapi import FastAPI   
import os
from motor.motor_asyncio import AsyncIOMotorClient

mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")

app = FastAPI()

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(mongo_url)
    app.mongodb = app.mongodb_client["sec_db"]

@app.get('/')
def Hello():
    return {"message":"Backend is working!",
            "status":"active"}

@app.get("/db-test")
async def db_test():
    try:
        server_status = await app.mongodb_client.admin.command('ping')
        return {"message": "Database connection successful!", "server_status": server_status}
    except Exception as e:
        return {"message": "Database connection failed!", "error": str(e)}

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()