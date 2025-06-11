import json
import os

class Queue_manager:
    
    # File paths
    def __init__(self):
        self.QUEUE_FILE = "queue.json"
        self.load_queue()
    
    def load_queue(self):
        if not os.path.exists(self.QUEUE_FILE):
            return []
        with open(self.QUEUE_FILE, "r") as f:
            return json.load(f)
        
    def save_queue(self, queue):
        with open(self.QUEUE_FILE, "w") as f:
            json.dump(queue, f, indent=2)
            
    