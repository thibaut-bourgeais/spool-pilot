import json
import os

class Log_manager:
    def __init__(self):
        # TODO Make the log file be the date (so one log per day)
        # TODO Also make the server automatically change file when day is over
        self.LOG_FILE = "print_log.json"
            
    def append_log(self, entry):
        logs = []
        if os.path.exists(self.LOG_FILE):
            with open(self.LOG_FILE, "r") as f:
                logs = json.load(f)
        logs.append(entry)
        with open(self.LOG_FILE, "w") as f:
            json.dump(logs, f, indent=2)
            
        
            
        
    
    