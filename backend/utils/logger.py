import logging
import os
from config.settings import settings

os.makedirs(settings.LOG_DIR, exist_ok=True)
log_file_path = os.path.join(settings.LOG_DIR, "app.log")

def setup_logger(name: str = "signbridge_ai") -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        c_handler = logging.StreamHandler()
        f_handler = logging.FileHandler(log_file_path, encoding="utf-8")

        c_handler.setLevel(logging.INFO)
        f_handler.setLevel(logging.INFO)

        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        c_handler.setFormatter(formatter)
        f_handler.setFormatter(formatter)

        logger.addHandler(c_handler)
        logger.addHandler(f_handler)

    return logger

logger = setup_logger()
