FROM python:3.10-slim

WORKDIR /app

# Copy requirements file and install dependencies
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Copy the rest of the application
COPY . /app

# Use 0.0.0.0 to listen on all interfaces
# Use port 8000 by default
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
