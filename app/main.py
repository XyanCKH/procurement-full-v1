from fastapi import FastAPI

app = FastAPI(title="Full-Stack Procurement System")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
