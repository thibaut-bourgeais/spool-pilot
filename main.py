from fastapi import FastAPI, Request, Form, UploadFile, File
from fastapi.responses import HTMLResponse, RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
import zipfile

from queue_manager import Queue_manager
from log_manager import Log_manager


# Define file managers
queue_manager = Queue_manager()
log_manager = Log_manager()

# Web interface
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static") # Indicate css, js, images files
templates = Jinja2Templates(directory="templates")
# Routes for the web interface
@app.get("/", response_class=HTMLResponse)
def dashboard(request: Request):
    
    queue = queue_manager.load_queue()
    return templates.TemplateResponse("dashboard.html", {"request": request, "queue": queue})


@app.post("/add_print")
def add_print(
    user: str = Form(...),
    printer: str = Form(...),
    filename: str = Form(...),
    duration_min: int = Form(...),
    filament: str = Form(...),
    priority: bool = Form(False)
):
    """
    Add a print job to the queue.

    The job is added to the start of the queue if the `priority` parameter is `True`.
    Otherwise, the job is added to the end of the queue.

    After adding the job, the queue is saved and a log entry is written.

    The user is redirected back to the dashboard after adding the print job.
    """
    queue = queue_manager.load_queue()
    new_job = {
        "user": user,
        "printer": printer,
        "filename": filename,
        "duration_min": duration_min,
        "filament": filament,
        "priority": priority,
        "submitted_at": datetime.now().isoformat()
    }
    if priority:
        queue.insert(0, new_job)
    else:
        queue.append(new_job)
    queue_manager.save_queue(queue)
    log_manager.append_log({"event": "added", **new_job})
    return RedirectResponse(url="/", status_code=303)

@app.post("/update_order")
def update_order(new_order: List[str]):
    
    queue = queue_manager.load_queue()
    new_queue = [next(job for job in queue if job["filename"] == fn) for fn in new_order]
    queue_manager.save_queue(new_queue)
    return {"ok": True}

@app.post("/files/")
async def create_file(file):
    return {"file_size": len(file)}


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}

@app.get("/available_files")
def list_3mf():
    files = [f for f in os.listdir("print_files/") if f.endswith(".3mf")]
    return {"files": files}

@app.get("/thumbnail/{filename}")
def get_thumbnail(filename: str):
    with zipfile.ZipFile(f"print_files/{filename}") as zf:
        zf.extract("thumbnail.png", path="/tmp/thumbs")
    return FileResponse("/tmp/thumbs/thumbnail.png")