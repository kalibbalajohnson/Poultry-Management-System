# Use an Alpine-based Python image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements.txt to install dependencies
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port that the app runs on
EXPOSE 8000

# Default command to run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]